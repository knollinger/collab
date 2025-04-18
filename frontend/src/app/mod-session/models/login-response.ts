
export interface ILoginResponse {
    token: string,
    expires: Date
}

export class LoginResponse {

    /**
     * 
     * @param token 
     * @param expires 
     */
    constructor(
        public readonly token: string,
        public readonly expires: Date) {
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: ILoginResponse): LoginResponse {
        return new LoginResponse(json.token, json.expires);
    }

    public static empty(): LoginResponse {
        return new LoginResponse('', new Date(0));
    }

    public isEmpty(): boolean {
        return this.token === '';
    }
}