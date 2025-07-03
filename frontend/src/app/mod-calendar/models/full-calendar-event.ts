import { ICalendarEvent, CalendarEvent } from './calendar-event';
import { IINode, INode } from "../../mod-files-data/mod-files-data.module";
import { IUser, User } from '../../mod-userdata/mod-userdata.module';

export interface IFullCalendarEvent {
    event: ICalendarEvent,
    requiredUsers: IUser[],
    optionalUsers: IUser[],
    hashTags: string[],
    attachments: IINode[]
}

export class FullCalendarEvent {

    /**
     * 
     * @param event 
     * @param hashTags 
     * @param attachments 
     */
    constructor(//
        public readonly event: CalendarEvent, //
        public readonly requiredUsers: User[], //
        public readonly optionalUsers: User[], //        
        public readonly hashTags: string[], //
        public readonly attachments: INode[]) {
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IFullCalendarEvent): FullCalendarEvent {

        return new FullCalendarEvent(//
            CalendarEvent.fromJSON(json.event), //
            json.requiredUsers ? json.requiredUsers.map(user => User.fromJSON(user)) : [],
            json.optionalUsers ? json.optionalUsers.map(user => User.fromJSON(user)) : [],
            json.hashTags, //
            json.attachments.map(node => INode.fromJSON(node)));
    }

    /**
     * 
     * @returns 
     */
    public static empty(): FullCalendarEvent {
        return new FullCalendarEvent(CalendarEvent.empty(), [], [], [], []);
    }
}