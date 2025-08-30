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
    public static fromJSON(json: IBucketListItem, parent: BucketListItem): BucketListItem {

        const result = new BucketListItem(json.done, json.title, parent, []); 
        const childs = !json.childs ? new Array<BucketListItem>() : json.childs!.map(child => {
            return BucketListItem.fromJSON(child, result);
        });
        result.childs = childs;
        return result;
    }

    public toJSON(): IBucketListItem {
        return {
            done: this.done,
            title: this.title,
            childs: this.childs.map(child => {return child.toJSON()})
        }
    }
}
