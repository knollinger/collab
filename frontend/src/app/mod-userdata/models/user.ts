export interface IUser {
    userId: string,
    accountName: string,
    email: string,
    surname: string,
    lastname: string
}

export class User {

    public static readonly EMPTY_USER_ID = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

    constructor(
        public readonly userId: string,
        public readonly accountName: string,
        public readonly email: string,
        public readonly surname: string,
        public readonly lastname: string) {

    }

    public static empty(): User {
        return new User(User.EMPTY_USER_ID, '', '', '', '');
    }

    public static fromJSON(json: IUser): User {
        return new User(json.userId, json.accountName, json.email, json.surname, json.lastname);
    }

    public toJSON(): IUser {
        return {
            userId: this.userId,
            accountName: this.accountName,
            email: this.email,
            surname: this.surname,
            lastname: this.lastname
        }
    }

    public isEmpty(): boolean {
        return this.userId === User.EMPTY_USER_ID;
    }
}