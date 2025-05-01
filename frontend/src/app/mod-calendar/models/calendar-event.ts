import { DayPilot } from "@daypilot/daypilot-lite-angular";

export interface ICalendarEvent {

    uuid: string,
    owner: string,
    title: string,
    start: Date,
    end: Date,
    desc: string,
    fullDay: boolean
}

export class CalendarEvent {

    /**
     * 
     * @param uuid 
     * @param owner 
     * @param title 
     * @param start 
     * @param end 
     * @param desc
     */
    constructor(
        public readonly uuid: string,
        public readonly owner: string,
        public readonly title: string,
        public readonly start: Date,
        public readonly end: Date,
        public readonly desc: string,
        public readonly fullDay: boolean = false) {

    }

    /**
     * 
     * @returns 
     */
    public static empty(): CalendarEvent {
        return new CalendarEvent('', '', '', new Date(), new Date(), '');
    }

    /**
     * 
     * @returns 
     */
    public isEmpty(): boolean {
        return !this.uuid;
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: ICalendarEvent): CalendarEvent {
        return new CalendarEvent(json.uuid, json.owner, json.title, json.start, json.end, json.desc, json.fullDay);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ICalendarEvent {
        return {
            uuid: this.uuid,
            owner: this.owner,
            title: this.title,
            start: this.start,
            end: this.end,
            desc: this.desc,
            fullDay: this.fullDay
        }
    }

    /**
     * 
     * @param evt 
     * @returns 
     */
    public static fromDayPilotEvent(evt: DayPilot.Event): CalendarEvent {

        return new CalendarEvent(evt.id().toString(), '', evt.text(), evt.start().toDate(), evt.end().toDate(), '', false);
    }

    /**
     * 
     * @returns 
     */
    public toDayPilotEvent(): DayPilot.EventData {

        const data: DayPilot.EventData = {
            start: new DayPilot.Date(this.start, true),
            end: new DayPilot.Date(this.end, true),
            id: this.uuid,
            text: this.title
        }
        return data;
    }
}
