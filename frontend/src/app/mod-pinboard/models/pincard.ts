export interface IPinCard {
    uuid: string,
    boardId: string,
    title: string,
    owner: string
}

export class PinCard {

    constructor(
        public readonly uuid: string,
        public readonly boardId: string,
        public readonly title: string,
        public readonly owner: string) {

    }

    public static fromJSON(json: IPinCard): PinCard {
        return new PinCard(json.uuid, json.boardId, json.title, json.owner);
    }

    public toJSON(): IPinCard {
        return {
            uuid: this.uuid,
            boardId: this.boardId,
            title: this.title,
            owner: this.owner
        }
    }

    public static empty(): PinCard {
        return new PinCard('', '', '', '');
    }

    public isEmpty(): boolean {
        return !this.uuid;
    }
}
