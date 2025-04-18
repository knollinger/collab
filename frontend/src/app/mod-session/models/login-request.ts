export interface ILoginRequest {
    email: string,
    password: string,
    keepLoggedIn: boolean,
    newPwd?: string,
}

export class LoginRequest {

    constructor(
        private email: string,
        private password: string,
        private keepLoggedIn: boolean,
        private newPwd?: string) {
    }

    public toJSON(): ILoginRequest {
        return {
            email: this.email,
            password: this.password,
            keepLoggedIn: this.keepLoggedIn,
            newPwd: this.newPwd
        }
    }
}