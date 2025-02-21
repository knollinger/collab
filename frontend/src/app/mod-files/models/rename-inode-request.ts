export interface IRenameINodeRequest {
    uuid: string,
    name: string
}

export class RenameINodeRequest {

    constructor(
        private uuid: string,
        private name: string) {

    }

    /**
     * 
     * @returns 
     */
    public toJSON(): IRenameINodeRequest {
        return {
            uuid: this.uuid,
            name: this.name
        }
    }
}