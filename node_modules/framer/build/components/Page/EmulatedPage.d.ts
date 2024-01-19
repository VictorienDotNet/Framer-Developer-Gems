import type { PageProps } from "./types.js";
import React from "react";
/**
 * The Page component allows you to create horizontally or vertically swipeable areas. It can be
 * imported from the Framer Library and used in code components. Add children to create pages to
 * swipe between. These children will be stretched to the size of the page component by default,
 * but can also be set to auto to maintain their original size.
 *
 * @remarks
 * ```jsx
 * import React from "react"
 * import { Frame, Page } from "framer"
 * export class Page extends React.Component {
 *   render() {
 *     return (
 *       <Page>
 *         <Frame />
 *       </Page>
 *     )
 *   }
 * }
 * ```
 * @public
 */
export declare const Page: React.ForwardRefExoticComponent<Partial<PageProps> & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=EmulatedPage.d.ts.map