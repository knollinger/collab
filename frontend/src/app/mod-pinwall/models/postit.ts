export interface IPostIt {
    uuid: string,
    owner: string,
    type: string,
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
        public uuid: string,
        public owner: string,
        public type: string,
        public title: string,
        public content: string) {

    }

    /**
     * 
     * @returns 
     */
    public static empty(): PostIt {
        return new PostIt('', '', '', '', '');
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
        return new PostIt(json.uuid, json.owner, json.type, json.title, json.content);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): IPostIt {
        return {
            uuid: this.uuid,
            owner: this.owner,
            type: this.type,
            title: this.title,
            content: this.content
        }
    }
}