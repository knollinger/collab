import { IUser, User } from "../../mod-userdata/mod-userdata.module";

/**
 * 
 */
export interface ICalendarEventPerson {
    user: IUser,
    required: boolean
} 

/**
 * 
 */
export class CalendarEventPerson {

    constructor(
        public readonly user: User,
        public readonly required: boolean) {

    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: ICalendarEventPerson) {

        const user = User.fromJSON(json.user);
        return new CalendarEventPerson(user, json.required);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ICalendarEventPerson {
        return {
            user: this.user.toJSON(),
            required: this.required
        }
    }
}
