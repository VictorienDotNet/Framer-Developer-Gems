import React, { useCallback, useContext, useMemo, useRef } from "react";
import { assert } from "../../utils/assert.js";
/**
 * @internal
 */
export const LayoutIdContext = React.createContext({
    getLayoutId: args => null,
    persistLayoutIdCache: () => { },
    top: false,
    enabled: true,
});
// FIXME: This pattern currently not supported by rules-of-hooks, see
// https://github.com/facebook/react/pull/18341#issuecomment-749659456
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * @internal
 */
export function LayoutIdProvider({ children }) {
    const context = useContext(LayoutIdContext);
    // Since Code Components on the canvas can use Navigation, we need to ensure
    // that only the root LayoutIdContext is generating layoutIds so that the
    // cache is shared across all screens.
    if (context.top)
        return React.createElement(React.Fragment, null, children);
    const cache = useRef({
        // When we provide a layoutId for a node based on it's first
        // duplicatedFrom id, we save it's layoutId mapped to it's actual id.
        // Future screen's nodes will check this cache first, to see if they've
        // previously been assigned a layoutId, or if any of there other
        // duplicatedFrom ids matched a node that was previously assigned a
        // layoutId.
        byId: {},
        byName: {},
        // When we navigate from screens that were duplicated from a future
        // screen, to that future screen, we want to do a reverse lookup on the
        // last duplicatedFrom id, rather than the id. We need to keep them
        // separate so they don't overlap.
        byLastId: {},
        byPossibleId: {},
        byLastName: {},
        byLayoutId: {},
        // When we don't have a cached layoutId for all duplicatedFrom ids, we
        // need to increment and save it so that we don't create clashing
        // layoutIds. We also need to reset name counts between screens, so we
        // record those separately.
        count: {
            byId: {},
            byName: {},
        },
    });
    const screen = useRef({
        byId: {},
        byName: {},
        byLastId: {},
        byPossibleId: {},
        byLastName: {},
        byLayoutId: {},
    });
    // Keep track of which layoutIds have been used on the current screen so
    // that we avoid reassigning them, and instead, use other methods to
    // generate a unique id.
    const usedIds = useRef(new Set()).current;
    // This function is quite abstract so I've done my best to annotate why
    // checks are happening. A lot of the complexity comes from handling named
    // and unnamed layers differently.
    const getLayoutId = useCallback(({ id, name, duplicatedFrom }) => {
        // Code components that use Frame's should not receive a layout id
        // from our context. However this will be bypassed if end-users add an
        // id to their Frame in code.
        if (!id)
            return null;
        const cacheKey = name ? "byName" : "byId";
        // If we've previously recorded an layout id for this node, reuse it
        // and return early.
        const previousId = cache.current[cacheKey][id];
        if (previousId)
            return previousId;
        // If the node is an original node (hasn't been duplicated from another
        // node), we use it's name or id, unless it's name or id was already
        // used on this screen, or used by a node that wasn't last duplicated
        // from this node on the previous screen (suggesting another node on
        // this screen will need to use this id in a future call).
        const nodeIdentifier = name || id;
        if (!duplicatedFrom &&
            !usedIds.has(nodeIdentifier) &&
            (!cache.current.byLayoutId[nodeIdentifier] || cache.current.byLayoutId[nodeIdentifier] === nodeIdentifier)) {
            if (cache.current.count[cacheKey][nodeIdentifier] === undefined) {
                cache.current.count[cacheKey][nodeIdentifier] = 0;
                cache.current.byLayoutId[nodeIdentifier] = nodeIdentifier;
                screen.current[cacheKey][id] = nodeIdentifier;
            }
            usedIds.add(nodeIdentifier);
            return nodeIdentifier;
        }
        // If a node is duplicated, check if an layout id was assigned to it
        // on the last screen. Use that layout id if it's not already been
        // used on this screen. This ensures that nodes duplicated from a
        // specific layer on one screen, preserve their connection even if they
        // are in a different hierarchical order on the current screen. This is
        // not relevant for design components since their layers are always in
        // the same order. We also check for matches against `byLastId`, but
        // only use them after we explicitly check `id`.
        let possibleMatch = undefined;
        if (duplicatedFrom?.length) {
            for (let index = duplicatedFrom.length - 1; index >= 0; index--) {
                const duplicatedId = duplicatedFrom[index];
                assert(!!duplicatedId, `duplicatedId must be defined`);
                const match = cache.current[cacheKey][duplicatedId];
                const byLastIdMatch = cache.current.byLastId[duplicatedId];
                // In the event that no match is found for the duplicatedFrom id
                // in the `byId` or `byName` cache, it's possible we will need
                // to loop through the duplicatedFrom ids again, to check if
                // there is a match against the `byLastId` cache. Rather than
                // performing that loop again, we can save the first successful
                // match here, and use it when it's the correct option later.
                // This is safe because we will only use this match if there is
                // no match against `byId` or `byName`, meaning we will always
                // have looped through all of the duplicatedFrom ids.
                if (byLastIdMatch && !possibleMatch) {
                    const matchedLayoutId = cache.current.byLayoutId[byLastIdMatch];
                    const shouldUseNamedLastIdMatch = !matchedLayoutId || matchedLayoutId === name;
                    if (byLastIdMatch && !usedIds.has(byLastIdMatch) && (name ? shouldUseNamedLastIdMatch : true)) {
                        possibleMatch = [byLastIdMatch, duplicatedId];
                    }
                }
                // If the match from the previous screen is a name match, ensure it is was assigned to the exact same name.
                const previousLayoutId = cache.current.byLayoutId[match];
                const shouldUseNamedMatch = !previousLayoutId || previousLayoutId === name;
                if (match && !usedIds.has(match) && (name ? shouldUseNamedMatch : true)) {
                    screen.current[cacheKey][id] = match;
                    screen.current.byLastId[duplicatedId] = match;
                    usedIds.add(match);
                    return match;
                }
            }
        }
        // In cases where we're starting on a screen that uses frames duplicated
        // from a future screen, when we arrive on the future screen, we need to
        // make sure we preserve that connection. This handles direct
        // relationships. For example starting on a frame that was duplicated
        // directly from the previous frame, and transitioning to that previous
        // frame.
        const last = cache.current.byLastId[id];
        if (last && !usedIds.has(last)) {
            usedIds.add(last);
            screen.current.byId[id] = last;
            return last;
        }
        // If we set a possible match by checking duplicatedFrom ids against
        // `byLastId`, and we weren't able to find a match against the `byId` or
        // `byName`, or by directly looking up the node's id against `byLastId`,
        // use a possible match if it was set.
        if (possibleMatch) {
            const [match, duplicatedId] = possibleMatch;
            screen.current[cacheKey][id] = match;
            screen.current.byLastId[duplicatedId] = match;
            usedIds.add(match);
            return match;
        }
        // In cases where we're starting on a screen that uses frames duplicated
        // from a future screen, when we arrive on the future screen, we need to
        // make sure we preserve that connection. This handles indirect
        // relationships. For example starting on the last frame duplicated many
        // times from an initial frame, and transitioning directly to that
        // initial frame.
        const possible = cache.current.byPossibleId[id];
        if (possible && !usedIds.has(possible)) {
            usedIds.add(possible);
            screen.current.byId[id] = possible;
            return possible;
        }
        const rootDuplicatedId = duplicatedFrom?.[0];
        // If a node hasn't been assigned a layout id on a previous screen,
        // or if that layout id has already been used, or if this is the
        // first screen, generate a unique layout id by incrementing a
        // counter for that name or duplicatedId.
        const identifier = name || rootDuplicatedId || id;
        const value = cache.current.count[cacheKey][identifier] + 1 || 0;
        const { layoutId, value: nextValue } = nextLayoutId(identifier, value, usedIds);
        cache.current.count[cacheKey][identifier] = nextValue;
        screen.current[cacheKey][id] = layoutId;
        if (duplicatedFrom?.length) {
            // TODO: Should name use it's own map?
            if (!name) {
                const lastId = duplicatedFrom[duplicatedFrom.length - 1];
                if (lastId) {
                    screen.current.byLastId[lastId] = layoutId;
                }
                if (duplicatedFrom.length > 1) {
                    // Skipping the most recent duplicatedFrom, and only setting
                    // it if there isn't already one set. This isn't a perfect
                    // heuristic since it allows layout hierarchy to influence
                    // matches, since we have to assign on a
                    // first-come-first-serve basis.
                    for (let index = 0; index < duplicatedFrom.length - 1; index++) {
                        const possibleId = duplicatedFrom[index];
                        if (possibleId === undefined)
                            continue;
                        if (!screen.current.byPossibleId[possibleId]) {
                            screen.current.byPossibleId[possibleId] = layoutId;
                        }
                    }
                }
            }
        }
        screen.current.byLayoutId[layoutId] = nodeIdentifier;
        usedIds.add(layoutId);
        return layoutId;
    }, []);
    const persistLayoutIdCache = useCallback(() => {
        cache.current = {
            byId: {
                ...cache.current.byId,
                ...screen.current.byId,
            },
            byLastId: {
                ...cache.current.byLastId,
                ...screen.current.byLastId,
            },
            byPossibleId: {
                ...cache.current.byPossibleId,
                ...screen.current.byPossibleId,
            },
            byName: {
                ...cache.current.byName,
                ...screen.current.byName,
            },
            byLastName: { ...cache.current.byLastName, ...screen.current.byLastName },
            byLayoutId: { ...cache.current.byLayoutId, ...screen.current.byLayoutId },
            // Unlike the count.byId, we need to reset the count.byName because
            // named layers might not have duplicatedFrom ids (e.g. imported
            // from Figma). When we can use duplicatedFrom ids to check if an id
            // was assigned on a previous screen, we don't increment the count,
            // which means that the count only increments for new items, and
            // only increments on a new screen if the node is new. Since named
            // layers need to always match in some way between screens, we reset
            // the count so that the second named layer on a second screen is
            // always name-1 if it doesn't have any duplicatedFrom ids.
            count: {
                ...cache.current.count,
                byName: {},
            },
        };
        screen.current = {
            byId: {},
            byName: {},
            byLastId: {},
            byPossibleId: {},
            byLastName: {},
            byLayoutId: {},
        };
        usedIds.clear();
    }, []);
    // Bind the context value to a ref so that it doesn't change between
    // renders, which cases all subscribed descendants to update.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const contextValue = useRef({
        getLayoutId,
        persistLayoutIdCache,
        top: true,
        enabled: true,
    }).current;
    return React.createElement(LayoutIdContext.Provider, { value: contextValue }, children);
}
// FIXME (See top of function)
/* eslint-enable react-hooks/rules-of-hooks */
function nextLayoutId(identifier, initialValue, usedIds) {
    let value = initialValue;
    // We expect 0 to be falsy here so that generated ids match with
    // original ids.
    let layoutId = value ? `${identifier}-${value}` : identifier;
    while (usedIds.has(layoutId)) {
        value++;
        layoutId = `${identifier}-${value}`;
    }
    return { layoutId, value };
}
/**
 * Enable or disable the automatic generation of layout ids for canvas layers.
 * By default layout ids are generated for all layers created on the Framer
 * canvas. However, layout ids are not generated for any layer that is a
 * descendant of a code component. Sometimes you will want to enable layout id
 * generation for descendants of your code components when they use children,
 * slots, or import design components, and you want those layers to animate with
 * magic motion transitions.
 *
 * You can enable that behavior by wrapping your code component like this
 * ```typescript
 * <AutomaticLayoutIds enabled>
 *  <YourComponent/>
 * </AutomaticLayoutIds>
 * ```
 * @public
 */
export function AutomaticLayoutIds({ enabled = true, ...props }) {
    const context = useContext(LayoutIdContext);
    const contextValue = useMemo(() => {
        return {
            ...context,
            enabled,
        };
    }, [enabled]);
    return React.createElement(LayoutIdContext.Provider, { ...props, value: contextValue });
}
//# sourceMappingURL=LayoutIdContext.js.map