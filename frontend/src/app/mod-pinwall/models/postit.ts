export interface IPostIt {
    uuid: string,
    owner: string,
    title: string,
    content: string
}

export class PostIt {

    /**
     * 
     * @param uuid 
     * @param title 
     * @param content 
     */
    constructor(
        public readonly uuid: string,
        public readonly owner: string,
        public readonly title: string,
        public readonly content: string) {

    }

    /**
     * 
     * @returns 
     */
    public static empty(): PostIt {
        return new PostIt('', '', '', '');
    }

    /**
     * 
     * @returns 
     */
    public isEmpty(): boolean {
        return this.uuid === '';
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IPostIt): PostIt {
        return new PostIt(json.uuid, json.owner, json.title, json.content);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): IPostIt {
        return {
            uuid: this.uuid,
            owner: this.owner,
            title: this.title,
            content: this.content
        }
    }
}