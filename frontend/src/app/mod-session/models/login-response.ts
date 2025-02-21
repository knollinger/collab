
export interface ILoginResponse {
    token: string,
    expires: Date
}

export class LoginResponse {

    constructor(
        public readonly token: string,
        public readonly expires: Date) {
    }

    public static fromJSON(json: ILoginResponse): LoginResponse {
        return new LoginResponse(json.token, json.expires);
    }
}