export interface ILoginRequest {
    email: string,
    password: string,
    rememberMe: boolean
    newPwd?: string,
}

export class LoginRequest {

    constructor(
        private email: string,
        private password: string,
        private rememberMe: boolean,
        private newPwd?: string) {
    }

    public toJSON(): ILoginRequest {
        return {
            email: this.email,
            password: this.password,
            newPwd: this.newPwd,
            rememberMe: this.rememberMe
        }
    }
}