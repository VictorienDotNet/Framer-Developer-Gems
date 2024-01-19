// used to generate id's and links to ids, they are stable per key, but only on runtime
const keys = new Map();
/** @internal */
export class InternalID {
    id;
    _link = null;
    _urllink = null;
    constructor(id) {
        this.id = id;
    }
    add(str) {
        return InternalID.forKey(this.id + str);
    }
    toString() {
        return this.id;
    }
    get link() {
        const res = this._link;
        if (res)
            return res;
        return (this._link = "#" + this.id);
    }
    get urlLink() {
        const res = this._urllink;
        if (res)
            return res;
        return (this._urllink = "url(#" + this.id + ")");
    }
    static forKey(key) {
        let res = keys.get(key);
        if (res)
            return res;
        res = new InternalID("a" + (1000 + keys.size) + "z");
        keys.set(key, res);
        return res;
    }
}
//# sourceMappingURL=internalId.js.map