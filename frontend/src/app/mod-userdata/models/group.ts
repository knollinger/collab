export interface IGroup {
    uuid: string,
    name: string,
    primary: boolean
}

/**
 * 
 */
export class Group {

    /**
     * 
     * @param uuid 
     * @param name 
     * @param primary 
     */
    constructor(
        public readonly uuid: string,
        public readonly name: string,
        public primary: boolean) {

    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IGroup): Group {
        return new Group(json.uuid, json.name, json.primary);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): IGroup {
        return {
            uuid: this.uuid,
            name: this.name,
            primary: this.primary
        }
    }

    /**
     * 
     * @returns 
     */
    public static empty(): Group {
        return new Group('', '', false);
    }

    /**
     * 
     * @returns 
     */
    public isEmpty(): boolean {
        return !this.uuid;
    }
}