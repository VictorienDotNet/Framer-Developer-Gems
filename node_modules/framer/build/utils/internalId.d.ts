/** @internal */
export declare class InternalID {
    id: string;
    private _link;
    private _urllink;
    constructor(id: string);
    add(str: string): InternalID;
    toString(): string;
    get link(): string;
    get urlLink(): string;
    static forKey(key: string): InternalID;
}
//# sourceMappingURL=internalId.d.ts.map