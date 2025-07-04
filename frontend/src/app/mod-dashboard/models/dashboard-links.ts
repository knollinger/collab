export interface IDashboardFileLink {
    uuid: string,
    name: string,
    mimeType: string
}

export class DashboardFileLink {

    constructor(//
        public readonly uuid: string, //
        public readonly name: string, //
        public readonly type: string) {
    }

    public static fromJSON(json: IDashboardFileLink): DashboardFileLink {
        return new DashboardFileLink(json.uuid, json.name, json.mimeType);
    }

    public get link(): string {

        const path = this.type.startsWith('inode/directory') ? '/files/main' : '/viewer/show';
        return `${path}/${this.uuid}`;
    }
}

export interface IDashboardCalendarLink {
    uuid: string,
    title: string
}

export class DashboardCalendarLink {

    constructor(//
        public readonly uuid: string,
        public readonly title: string) {
    }

    public static fromJSON(json: IDashboardCalendarLink): DashboardCalendarLink {
        return new DashboardCalendarLink(json.uuid, json.title);
    }
}

export interface IDashboardResult {
    inodes: IDashboardFileLink[],
    calendar: IDashboardCalendarLink[]
}

export class DashboardResult {

    constructor(
        public readonly inodes: DashboardFileLink[],
        public readonly calendar: DashboardCalendarLink[]) {

    }

    public static fromJSON(json: IDashboardResult): DashboardResult {

        return new DashboardResult(
            json.inodes ? json.inodes.map(node => DashboardFileLink.fromJSON(node)) : [],
            json.calendar ? json.calendar.map(entry => DashboardCalendarLink.fromJSON(entry)) : []
        );
    }

    public static empty(): DashboardResult {
        return new DashboardResult([], []);
    }
}
