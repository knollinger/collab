import { DayPilot } from "@daypilot/daypilot-lite-angular";
import { RRuleSet, rrulestr } from "rrule";
import { BehaviorSubject } from "rxjs";

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

    public readonly uuid: BehaviorSubject<string>;
    public readonly owner: BehaviorSubject<string>;
    public title: BehaviorSubject<string>;
    public start: BehaviorSubject<Date>;
    public end: BehaviorSubject<Date>;
    public desc: BehaviorSubject<string>;
    public fullDay: BehaviorSubject<boolean>;
    public rruleset: BehaviorSubject<RRuleSet | null>;

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
        uuid: string,
        owner: string,
        title: string,
        start: Date,
        end: Date,
        desc: string,
        fullDay: boolean,
        rruleset: RRuleSet | null) {

        this.uuid = new BehaviorSubject<string>(uuid);
        this.owner = new BehaviorSubject<string>(owner);
        this.title = new BehaviorSubject<string>(title);
        this.start = new BehaviorSubject<Date>(start);
        this.end = new BehaviorSubject<Date>(end);
        this.desc = new BehaviorSubject<string>(desc);
        this.fullDay = new BehaviorSubject<boolean>(fullDay);
        this.rruleset = new BehaviorSubject<RRuleSet | null>(rruleset);
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
        return !this.uuid.value;
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: ICalendarEvent): CalendarEvent {

        let ruleset: RRuleSet | null = null;
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

        const start = this.start.value.getTime();
        const duration = this.end.value.getTime() - start;
        return {
            uuid: this.uuid.value,
            owner: this.owner.value,
            title: this.title.value,
            start: start,
            duration: duration,
            desc: this.desc.value,
            fullDay: this.fullDay.value,
            rruleset: this.rruleset.value ? this.rruleset.value.toString() : ''
        }
    }

    setUuid(val: string) {
        this.uuid.next(val);
    }

    setOwner(val: string) {
        this.owner.next(val);
    }

    setTitle(val: string) {
        this.title.next(val);
    }
    
    setStart(val: Date) {
        this.start.next(val);
    }
    
    setEnd(val: Date) {
        this.end.next(val);
    }
    
    setDesc(val: string) {
        this.desc.next(val);
    }
    
    setFullDay(val: boolean) {
        this.fullDay.next(val);
    }
    
    setRruleset(val: RRuleSet | null) {
        this.rruleset.next(val);
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
            start: new DayPilot.Date(this.start.value, true),
            end: new DayPilot.Date(this.end.value, true),
            id: this.uuid.value,
            text: this.title.value
        }
        return data;
    }
}
