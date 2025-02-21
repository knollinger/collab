export interface ISearchResultItem {
    get type(): string;
}

export interface IINodeSearchResultItem {
    name: string,
    uuid: string,
    parent: string
}

export class INodeSearchResultItem implements ISearchResultItem {

    constructor(
        public readonly name: string,
        public readonly uuid: string,
        public readonly parent: string) {
    }

    public static fromJSON(json: IINodeSearchResultItem): INodeSearchResultItem {
        return new INodeSearchResultItem(json.name, json.uuid, json.parent);
    }

    get type(): string {
        return 'inode';
    }
}

/**
 * 
 */
export interface ISearchResult {
    inodes: IINodeSearchResultItem[]
}

/**
 * 
 */
export class SearchResult {

    constructor(
        public readonly inodes: INodeSearchResultItem[]) {
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: ISearchResult): SearchResult {

        const inodes = json.inodes.map(inode => {
            return INodeSearchResultItem.fromJSON(inode);
        });
        return new SearchResult(inodes);
    }

    public static empty(): SearchResult {

        const inodes = new Array<INodeSearchResultItem>();
        return new SearchResult(inodes);

    }
}