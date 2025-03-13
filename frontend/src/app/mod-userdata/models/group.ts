export interface IGroup {
    uuid: string,
    name: string,
    primary: boolean,
    members: IGroup[]
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
        public readonly primary: boolean,
        public members: Group[]) { // TODO: muss wieder readonly werden

    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IGroup): Group {

        const members = json.members.map(member => {
            return Group.fromJSON(member);
        })
        return new Group(json.uuid, json.name, json.primary, members);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): IGroup {
        return {
            uuid: this.uuid,
            name: this.name,
            primary: this.primary,
            members: this.members // TODO: Rekursiv eintauchen!
        }
    }

    /**
     * 
     * @returns 
     */
    public static empty(): Group {
        return new Group('', '', false, new Array<Group>());
    }

    /**
     * 
     * @returns 
     */
    public isEmpty(): boolean {
        return !this.uuid;
    }

    public toString(): string {
        return `{uuid: ${this.uuid}, name: ${this.name}}`; // TODO: rekursiv abtauchen
    }

    /**
     * 
     */
    public get hasMembers(): boolean {
        return this.members && this.members.length > 0;
    }

    /**
     * Erzeuge eine DeepCopy inclusive aller Member
     * 
     * @returns 
     */
    public clone(): Group {

        const clonedMembers = this.members.map(member => {
            return member.clone();
        })
        return new Group(this.uuid, this.name, this.primary, clonedMembers);        
    }
}