import { IINode, INode } from "../../mod-files-data/mod-files-data.module";
import { IUser, User } from "../../mod-userdata/mod-userdata.module";
import { CalendarEventCore, ICalendarEventCore } from "./calendar-event-core";

/**
 * 
 */
export interface ICalendarEventFull {
    core: ICalendarEventCore,
    reqPersons: IUser[],
    optPersons: IUser[],
    hashTags: string[],
    attachments: IINode[]
}

/**
 * 
 */
export class CalendarEventFull {

    /**
     * 
     * @param core 
     * @param persons 
     * @param hashTags 
     * @param attachments 
     */
    constructor(
        public core: CalendarEventCore,
        public reqPersons: User[],
        public optPersons: User[],
        public hashTags: string[],
        public attachments: INode[]) {
    }

    /**
     * 
     * @returns 
     */
    public static empty(): CalendarEventFull {
        return new CalendarEventFull(
            CalendarEventCore.empty(),
            new Array<User>(),
            new Array<User>(),
            new Array<string>(),
            new Array<INode>()
        );
    }

    /**
     * 
     * @returns 
     */
    public isEmpty(): boolean {
        return this.core.isEmpty();
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: ICalendarEventFull): CalendarEventFull {

        return new CalendarEventFull(
            CalendarEventCore.fromJSON(json.core),
            json.reqPersons.map(person => User.fromJSON(person)),
            json.optPersons.map(person => User.fromJSON(person)),
            json.hashTags,
            json.attachments.map(attachment => INode.fromJSON(attachment))
        );
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ICalendarEventFull {

        return {
            core: this.core.toJSON(),
            reqPersons: this.reqPersons.map(person => person.toJSON()),
            optPersons: this.optPersons.map(person => person.toJSON()),
            hashTags: this.hashTags,
            attachments: this.attachments.map(attachment => attachment.toJSON())
        }
    }
}