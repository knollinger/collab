export interface IBucketListItem {
    done: boolean,
    title: string,
    childs?: IBucketListItem[]
}

/**
 * 
 */
export class BucketListItem {

    /**
     * 
     * @param done 
     * @param title 
     * @param childs 
     */
    constructor(
        public done: boolean,
        public title: string,
        public parent: BucketListItem | null,
        public childs: BucketListItem[],
        public selected: boolean = false) {

    }

    /**
     * 
     * @returns 
     */
    public static empty(): BucketListItem {
        return new BucketListItem(false, '', null, []);
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IBucketListItem, parent: BucketListItem | null): BucketListItem {

        const result = new BucketListItem(json.done, json.title, parent, []);
        const childs = !json.childs ? new Array<BucketListItem>() : json.childs!.map(child => {
            return BucketListItem.fromJSON(child, result);
        });
        result.childs = childs;
        return result;
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): IBucketListItem {
        return {
            done: this.done,
            title: this.title,
            childs: this.childs.map(child => { return child.toJSON() })
        }
    }

    /**
     * 
     * @param rawJSON 
     * @returns parsed das rawJSON und liefert ein rootElement. Dies ist ggf leer
     */
    public static parseRawJSON(rawJSON: string): BucketListItem {

        const result: BucketListItem = BucketListItem.empty();
        if (rawJSON) {

            const rawChilds: IBucketListItem[] = JSON.parse(rawJSON);
            result.childs = rawChilds.map(rawChild => {
                return BucketListItem.fromJSON(rawChild, result);
            })
        }
        return result;
    }
}
