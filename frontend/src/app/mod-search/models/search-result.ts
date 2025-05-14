export interface ISearchResultItem {
    get type(): string;
}

export interface IINodeSearchResultItem {
    name: string,
    uuid: string,
    parent: string
}

export class INodeSearchResultItem implements ISearchResultItem {

    constructor(
        public readonly name: string,
        public readonly uuid: string,
        public readonly parent: string) {
    }

    public static fromJSON(json: IINodeSearchResultItem): INodeSearchResultItem {
        return new INodeSearchResultItem(json.name, json.uuid, json.parent);
    }

    get type(): string {
        return 'inode';
    }
}


export interface IUserSearchResultItem {
    accountName: string,
    lastName: string,
    surName: string,
    email: string,
    uuid: string
}

export class UserSearchResultItem {

    constructor(
        public readonly accountName: string,
        public readonly lastName: string,
        public readonly surName: string,
        public readonly email: string,
        public readonly uuid: string) {

    }
    public static fromJSON(json: IUserSearchResultItem): UserSearchResultItem {
        return new UserSearchResultItem(json.accountName, json.lastName, json.surName, json.email, json.uuid);
    }

    get type(): string {
        return 'user';
    }

    get fullName(): string {
        return `${this.surName} ${this.lastName}`;
    }
}

export interface IGroupSearchResultItem {
    name: string,
    uuid: string
}

export class GroupSearchResultItem {

    constructor(
        public readonly name: string,
        public readonly uuid: string) {

    }
    public static fromJSON(json: IGroupSearchResultItem): GroupSearchResultItem {
        return new GroupSearchResultItem(json.name, json.uuid);
    }

    get type(): string {
        return 'group';
    }
}


/**
 * 
 */
export interface ISearchResult {
    inodes: IINodeSearchResultItem[],
    users: IUserSearchResultItem[],
    groups: IGroupSearchResultItem[],
}

/**
 * 
 */
export class SearchResult {

    constructor(
        public readonly inodes: INodeSearchResultItem[],
        public readonly users: UserSearchResultItem[],
        public readonly groups: GroupSearchResultItem[]) {
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: ISearchResult): SearchResult {

        const inodes = json.inodes.map(inode => {
            return INodeSearchResultItem.fromJSON(inode);
        });

        const users = json.users.map(user => {
            return UserSearchResultItem.fromJSON(user);
        });

        const groups = json.groups.map(group => {
            return GroupSearchResultItem.fromJSON(group);
        });
        return new SearchResult(inodes, users, groups);
    }

    public static empty(): SearchResult {

        return new SearchResult([], [], []);
    }
}
