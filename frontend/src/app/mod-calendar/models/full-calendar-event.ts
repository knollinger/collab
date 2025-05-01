import { ICalendarEvent, CalendarEvent } from './calendar-event';
import { IINode, INode } from '../../mod-files/mod-files.module';

export interface IFullCalendarEvent {
    event: ICalendarEvent,
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
        public readonly hashTags: string[], //
        public readonly attachments: INode[]) {
    }

    public static fromJSON(json: IFullCalendarEvent): FullCalendarEvent {

        return new FullCalendarEvent(CalendarEvent.fromJSON(json.event), //
            json.hashTags, //
            json.attachments.map(node => {
                return INode.fromJSON(node)
            }));
    }

    public static empty(): FullCalendarEvent {
        return new FullCalendarEvent(CalendarEvent.empty(), [], []);
    }
}