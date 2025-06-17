import { IGroup } from "../../mod-userdata/mod-userdata.module";

/**
 * 
 */
export interface ICreateGroupRequest {
    name: string,
    isPrimary: boolean
}

/**
 * 
 */
export class CreateGroupRequest {

    /**
     * 
     * @param name 
     * @param isPrimary 
     */
    constructor(private name: string,
        private isPrimary: boolean) {
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ICreateGroupRequest {
        return {
            name: this.name,
            isPrimary: this.isPrimary
        }
    }
}