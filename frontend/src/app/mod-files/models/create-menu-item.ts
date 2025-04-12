
/**
 * 
 */
export interface ICreateMenuItemDesc {

    name: string,
    ext: string,
    contentType: string
}

/**
 * 
 */
export class CreateMenuItemDesc {

    /**
     * 
     * @param name 
     * @param ext 
     * @param contentType 
     */
    constructor(
        public readonly name: string,
        public readonly ext: string,
        public readonly contentType: string) {

    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: ICreateMenuItemDesc): CreateMenuItemDesc {
        return new CreateMenuItemDesc(json.name, json.ext, json.contentType);
    }
}

export interface ICreateMenuItemGroup {
    name: string,
    items: ICreateMenuItemDesc[]
}

export class CreateMenuItemGroup {

    /**
     * 
     * @param name 
     * @param items 
     */
    constructor(
        public readonly name: string,
        public readonly items: CreateMenuItemDesc[]) {
    }

    public static empty(): CreateMenuItemGroup {
        return new CreateMenuItemGroup('', []);
    }
    
    public static fromJSON(json: ICreateMenuItemGroup): CreateMenuItemGroup {

        const items = json.items.map(item => {
            return CreateMenuItemDesc.fromJSON(item);
        })
        return new CreateMenuItemGroup(json.name, items);
    }
}