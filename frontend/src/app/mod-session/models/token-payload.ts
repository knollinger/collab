import { IGroup, IUser } from "../../mod-userdata/mod-userdata.module";

export interface ITokenPayload {
    user: IUser,
    groups: IGroup[];
}