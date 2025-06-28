import { DayPilot } from "@daypilot/daypilot-lite-angular";
import { RRuleSet, rrulestr } from "rrule";

/**
 * Die JSON-Beschreibung eines CalendarEvents
 */
export interface ICalendarEvent {

    /**
     * die eindeutige ID des Events
     */
    uuid: string,

    /**
     * Die Referenz auf den Benutzer
     */
    owner: string,

    /**
     * Kurz-Beschreibung des Events
     */
    title: string,

    /**
     * Timestamps werden prinzipell als UTC-Basierte "millies-since-epoch"
     * übertragen.
     */
    start: number,

    /**
     * Die Dauer eines Events wird als Millies geliefert
     */
    duration: number,

    /**
     * Freitext zur ausfühlichen Beschreibung des Events. Da das ganze
     * via einem Richtext-Editor (Quill?) bearbeitet wird, wird es wohl
     * HTML oder MD sein.
     */
    desc: string,

    /**
     * Ganztägiges Event?
     */
    fullDay: boolean,

    /**
     * Gegebenenfalls existiert ein RecurrenceRuleSet
     */
    rruleset?: string
}

/**
 * Im Gegansatz zum Transport-Format **ICalendarEvent** werden hier alle
 * Timestamps aufgelöst.
 * 
 * Aus dem Backend werden immer Timestamps als "millies-since-epoch" geliefert,
 * welche als UTC zu interpretieren sind. Die Factory/Transformer-Methoden dieser
 * Klasse konvertieren entsprechen von/nach LocaleTime.
 */
export class CalendarEvent {

    /**
     * 
     * @param uuid 
     * @param owner 
     * @param title 
     * @param start 
     * @param end 
     * @param desc 
     * @param fullDay 
     */
    constructor(
        public readonly uuid: string,
        public readonly owner: string,
        public title: string,
        public start: Date,
        public end: Date,
        public desc: string,
        public fullDay: boolean,
        public rruleset: RRuleSet | null) {
    }

    /**
     * 
     * @returns 
     */
    public static empty(): CalendarEvent {
        return new CalendarEvent('', '', '', new Date(), new Date(), '', false, null);
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

        let ruleset: RRuleSet | null  = null;
        if (json.rruleset) {

            const parsed = rrulestr(json.rruleset);

            if (parsed instanceof RRuleSet) {
                ruleset = parsed;
            }
            else {
                ruleset = new RRuleSet();
                ruleset.rrule(parsed);
            }
        }
        const start = new Date(json.start); // wird als UTC angeliefert!
        const end = new Date(json.start + json.duration);
        return new CalendarEvent(json.uuid, json.owner, json.title, start, end, json.desc, json.fullDay, ruleset);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ICalendarEvent {

        const start = this.start.getTime();
        const duration = this.end.getTime() - start;
        return {
            uuid: this.uuid,
            owner: this.owner,
            title: this.title,
            start: start,
            duration: duration,
            desc: this.desc,
            fullDay: this.fullDay,
            rruleset: this.rruleset ? this.rruleset.toString() : ''
        }
    }

    /**
     * 
     * @param evt 
     * @returns 
     */
    public static fromDayPilotEvent(evt: DayPilot.Event): CalendarEvent {

        const start = evt.start().toDate();
        const end = evt.end().toDate();
        return new CalendarEvent(evt.id().toString(), '', evt.text(), start, end, '', false, null);
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
