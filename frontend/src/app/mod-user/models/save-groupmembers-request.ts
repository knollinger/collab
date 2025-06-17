import { IGroup } from "../../mod-userdata/mod-userdata.module";

/**
 * 
 */
export interface ISaveGroupMembersRequest {
    parent: IGroup,
    members: IGroup[]
}

/**
 * 
 */
export class SaveGroupMembersRequest {

    /**
     * 
     * @param parent 
     * @param members 
     */
    constructor(private parent: IGroup,
        private members: IGroup[]) {
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ISaveGroupMembersRequest {
        return {
            parent: this.parent,
            members: this.members
        }
    }
}