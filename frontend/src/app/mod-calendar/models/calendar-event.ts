import { DayPilot } from "@daypilot/daypilot-lite-angular";

export interface ICalendarEvent {

    uuid: string,
    owner: string,
    text: string,
    start: Date,
    end: Date
}

export class CalendarEvent {

    /**
     * 
     * @param uuid 
     * @param owner 
     * @param text 
     * @param start 
     * @param end 
     */
    constructor(
        public readonly uuid: string,
        public readonly owner: string,
        public readonly text: string,
        public readonly start: Date,
        public readonly end: Date) {

    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: ICalendarEvent): CalendarEvent {
        return new CalendarEvent(json.uuid, json.owner, json.text, json.start, json.end);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ICalendarEvent {
        return {
            uuid: this.uuid,
            owner: this.owner,
            text: this.text,
            start: this.start,
            end: this.end
        }
    }

    /**
     * 
     * @param evt 
     * @returns 
     */
    public static fromDayPilotEvent(evt: DayPilot.Event): CalendarEvent {

        return new CalendarEvent(evt.id().toString(), '', evt.text(), evt.start().toDate(), evt.end().toDate());
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
            text: this.text
        }
        return data;
    }
}
