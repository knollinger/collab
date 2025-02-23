export interface ILoginRequest {
    email: string,
    password: string,
    newPwd?: string,
}

export class LoginRequest {

    constructor(
        private email: string,
        private password: string,
        private newPwd?: string) {
    }

    public toJSON(): ILoginRequest {
        return {
            email: this.email,
            password: this.password,
            newPwd: this.newPwd
        }
    }
}