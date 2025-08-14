import { RRuleSet, rrulestr } from "rrule";
import { BehaviorSubject } from "rxjs";

/**
 * Die JSON-Beschreibung eines CalendarEvents
 */
export interface ICalendarEventCore {

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
     * Timestamps werden prinzipell als UTC-Basierte "millies-since-epoch"
     * übertragen.
     */
    end: number,

    /**
     * Freitext zur ausfühlichen Beschreibung des Events. Da das ganze
     * via einem Richtext-Editor (Quill?) bearbeitet wird, wird es wohl
     * HTML oder MD sein.
     */
    desc: string,

    /**
     * Art des events
     */
    category: string,

    /**
     * Ganztägiges Event?
     */
    fullDay: boolean,

    /**
     * Gegebenenfalls existiert ein RecurrenceRuleSet
     */
    rruleset?: string,

    /**
     * Ggf existiert eine Openstreatmap-LocationId
     */
    osmLocId?: string
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
export class CalendarEventCore {

    public readonly uuidChange: BehaviorSubject<string>;
    public readonly ownerChange: BehaviorSubject<string>;
    public readonly titleChange: BehaviorSubject<string>;
    public readonly startChange: BehaviorSubject<Date>;
    public readonly endChange: BehaviorSubject<Date>;
    public readonly descChange: BehaviorSubject<string>;
    public readonly categoryChange: BehaviorSubject<string>;
    public readonly fullDayChange: BehaviorSubject<boolean>;
    public readonly rrulesetChange: BehaviorSubject<RRuleSet | null>;
    public readonly privateChange: BehaviorSubject<boolean>;
    public readonly osmLocIdChange: BehaviorSubject<string | null>;

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
        category: string,
        fullDay: boolean,
        rruleset: RRuleSet | null,
        osmLocId: string | null) {

        this.uuidChange = new BehaviorSubject<string>(uuid);
        this.ownerChange = new BehaviorSubject<string>(owner);
        this.titleChange = new BehaviorSubject<string>(title);
        this.startChange = new BehaviorSubject<Date>(start);
        this.endChange = new BehaviorSubject<Date>(end);
        this.descChange = new BehaviorSubject<string>(desc);
        this.fullDayChange = new BehaviorSubject<boolean>(fullDay);
        this.categoryChange = new BehaviorSubject<string>(category);
        this.rrulesetChange = new BehaviorSubject<RRuleSet | null>(rruleset);
        this.privateChange = new BehaviorSubject<boolean>(false);
        this.osmLocIdChange = new BehaviorSubject<string | null>(osmLocId);
    }

    /**
     * 
     * @returns 
     */
    public static empty(): CalendarEventCore {
        return new CalendarEventCore('', '', '', new Date(), new Date(), '', '', false, null, null);
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
    public static fromJSON(json: ICalendarEventCore): CalendarEventCore {

        let ruleset: RRuleSet | null = null;
        if (json.rruleset) {
            ruleset = rrulestr(json.rruleset, { forceset: true }) as RRuleSet;
        }

        const locId = json.osmLocId ? json.osmLocId : null;
        const start = new Date(json.start); // wird als UTC angeliefert!
        const end = new Date(json.end); // dito
        return new CalendarEventCore(json.uuid, json.owner, json.title, start, end, json.desc, json.category, json.fullDay, ruleset, locId);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ICalendarEventCore {

        return {
            uuid: this.uuid,
            owner: this.owner,
            title: this.title,
            start: new Date(this.start).getTime(),
            end: new Date(this.end).getTime(),
            desc: this.desc,
            category: this.category,
            fullDay: this.fullDay,
            rruleset: this.rruleSet ? this.rruleSet.toString() : '',
            osmLocId: this.osmLocId ? this.osmLocId :  ''
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
        if (this.titleChange.value !== val) {
            this.titleChange.next(val);
        }
    }

    get title(): string {
        return this.titleChange.value;
    }

    set start(val: Date) {
        const newDate = new Date(val);
        if (this.startChange.value.getTime() !== newDate.getTime()) {
            this.startChange.next(newDate);
        }
    }

    get start(): Date {
        return this.startChange.value;
    }

    set end(val: Date) {
        const newDate = new Date(val);
        if (this.endChange.value.getTime() !== newDate.getTime()) {
            this.endChange.next(newDate);
        }
    }

    get end(): Date {
        return this.endChange.value;
    }

    set desc(val: string) {
        if (this.descChange.value !== val) {
            this.descChange.next(val);
        }
    }

    get desc(): string {
        return this.descChange.value;
    }

    set category(val: string) {
        if (this.categoryChange.value !== val) {
            this.categoryChange.next(val);
        }
    }

    get category(): string {
        return this.categoryChange.value;
    }

    set fullDay(val: boolean) {
        if (this.fullDayChange.value !== val) {
            this.fullDayChange.next(val);
        }
    }

    get fullDay(): boolean {
        return this.fullDayChange.value;
    }

    set private(val: boolean) {
        if (this.privateChange.value !== val) {
            this.privateChange.next(val);
        }
    }

    get private(): boolean {
        return this.privateChange.value;
    }

    set rruleSet(val: RRuleSet | null) {
        if (this.rrulesetChange.value !== val) {
            this.rrulesetChange.next(val);
        }
    }

    get rruleSet(): RRuleSet | null {
        return this.rrulesetChange.value;
    }

    get isRecurring(): boolean {
        return this.rruleSet !== null;
    }

    set osmLocId(val: string | null) {

        if (this.osmLocIdChange.value !== val) {
            this.osmLocIdChange.next(val);
        }
    }

    get osmLocId(): string | null {
        return this.osmLocIdChange.value;
    }


    /**
     * Transformiere das CalendarEvent in eine Form, welche vom Fullcalendar
     * verarbeitet werden kann.
     * 
     * Die groupId wird auf die UUID gesetzt. Dadurch werden alle Instanzen
     * einer RecurringSerie beim DnD gemeinsam verschoben/resized.
     * 
     * Der Versuch, die groupID nur bei recurring zu setzen geht leider in die 
     * Hose, wenn das Property existiert (und sei es undefined) so zieht es 
     * einfach. Da gabs unschöne Effekte, das unabhängige sigle-Events zusammen
     * verschome/resized werdem, weil sie die selbe groupId haben (halt undefined).
     * 
     * @returns 
     */
    public toFullcalendarEvent(categoryDescs: Map<string, string>): any {

        return {
            id: this.uuid,
            groupId: this.uuid,
            allDay: this.fullDay,
            start: this.start,
            end: this.end,
            title: this.title,
            color: categoryDescs.get(this.category)
        };
    }
}
