/**
 * 
 */
export interface IPinBoard {
    uuid: string,
    name: string,
    owner: string
}

/**
 * 
 */
export class PinBoard {

    /**
     * 
     * @param uuid 
     * @param name 
     * @param owner 
     */
    constructor(
        public readonly uuid: string,
        public readonly name: string,
        public readonly owner: string) {
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IPinBoard): PinBoard {
        return new PinBoard(json.uuid, json.name, json.owner);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): IPinBoard {
        return {
            uuid: this.uuid,
            name: this.name,
            owner: this.owner
        }
    }

    /**
     * 
     * @returns 
     */
    public static empty(): PinBoard {
        return new PinBoard('', '', '');
    }

    /**
     * 
     * @returns 
     */
    public isEmpty(): boolean {
        return !this.uuid;
    }
}
