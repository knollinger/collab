export interface ICalendarEventCategory {
    category: string,
    color: string,
    desc: string
}

/**
 * 
 */
export class CalendarEventCategory {

    /**
     * 
     * @param category 
     * @param color 
     */
    constructor(
        public readonly category: string,
        public readonly color: string,
        public readonly desc: string) {

    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: ICalendarEventCategory): CalendarEventCategory {
        return new CalendarEventCategory(json.category, json.color, json.desc);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ICalendarEventCategory {
        return {
            category: this.category,
            color: this.color,
            desc: this.desc
        }
    }
}