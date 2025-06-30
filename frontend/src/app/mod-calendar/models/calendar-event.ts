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
 * 
 * Alle Properties dieser Klasse liegen als Subjects vor. Dadurch kann an den 
 * einzelnen Props auch ein subscribe erfolgen. Das ist nötig, da im Event-Editor
 * verschiedene Tabs existieren, Änderungen in einem Tab können Auswirkungen auf 
 * einen anderen Tab haben.
 * 
 */
export class CalendarEvent {

    public readonly uuidChange: BehaviorSubject<string>;
    public readonly ownerChange: BehaviorSubject<string>;
    public readonly titleChange: BehaviorSubject<string>;
    public readonly startChange: BehaviorSubject<Date>;
    public readonly endChange: BehaviorSubject<Date>;
    public readonly descChange: BehaviorSubject<string>;
    public readonly fullDayChange: BehaviorSubject<boolean>;
    public readonly rrulesetChange: BehaviorSubject<RRuleSet | null>;
    public readonly privateChange: BehaviorSubject<boolean>;

    /**
     * 
     * @param uuid 
     * @param owner 
     * @param title 
     * @param start 
     * @param end 
     * @param desc 
     * @param fullDay 
     * @param rruleset
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

        this.uuidChange = new BehaviorSubject<string>(uuid);
        this.ownerChange = new BehaviorSubject<string>(owner);
        this.titleChange = new BehaviorSubject<string>(title);
        this.startChange = new BehaviorSubject<Date>(start);
        this.endChange = new BehaviorSubject<Date>(end);
        this.descChange = new BehaviorSubject<string>(desc);
        this.fullDayChange = new BehaviorSubject<boolean>(fullDay);
        this.rrulesetChange = new BehaviorSubject<RRuleSet | null>(rruleset);
        this.privateChange = new BehaviorSubject<boolean>(false);
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

        const start = new Date(this.start).getTime();
        const duration = new Date(this.end).getTime() - start;
        return {
            uuid: this.uuid,
            owner: this.owner,
            title: this.title,
            start: start,
            duration: duration,
            desc: this.desc,
            fullDay: this.fullDay,
            rruleset: this.rruleSet ? this.rruleSet.toString() : ''
        }
    }

    set uuid(val: string) {
        if (this.uuidChange.value !== val) {
            this.uuidChange.next(val);
        }
    }

    get uuid(): string {
        return this.uuidChange.value;
    }

    set owner(val: string) {
        if (this.ownerChange.value !== val) {
            this.ownerChange.next(val);
        }
    }

    get owner(): string {
        return this.ownerChange.value;
    }


    set title(val: string) {
        if(this.titleChange.value !== val) {
            this.titleChange.next(val);
        }
    }

    get title(): string {
        return this.titleChange.value;
    }

    set start(val: Date) {
        const newDate = new Date(val);
        if(this.startChange.value.getTime() !== newDate.getTime()) {
            this.startChange.next(newDate);
        }
    }

    get start(): Date {
        return this.startChange.value;
    }

    set end(val: Date) {
        const newDate = new Date(val);
        if(this.endChange.value.getTime() !== newDate.getTime()) {
            this.endChange.next(newDate);
        }
    }

    get end(): Date {
        return this.endChange.value;
    }

    set desc(val: string) {
        if(this.descChange.value !== val) {
            this.descChange.next(val);
        }
    }

    get desc(): string {
        return this.descChange.value;
    }

    set fullDay(val: boolean) {
        if(this.fullDayChange.value !== val) {
            this.fullDayChange.next(val);
        }
    }

    get fullDay(): boolean {
        return this.fullDayChange.value;
    }

    set private(val: boolean) {
        if(this.privateChange.value !== val) {
            this.privateChange.next(val);
        }
    }

    get private(): boolean {
        return this.privateChange.value;
    }

    set rruleSet(val: RRuleSet | null) {
        if(this.rrulesetChange.value !== val) {
            this.rrulesetChange.next(val);
        }
    }

    get rruleSet(): RRuleSet | null {
        return this.rrulesetChange.value;
    }

    get isRecurring(): boolean {
        return this.rruleSet !== null;
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
