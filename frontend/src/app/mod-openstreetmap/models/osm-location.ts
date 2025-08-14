/**
 * 
 */
export interface IOSMLocation {
    osm_id: number,
    osm_type: string,
    name: string,
    display_name: string,
    lat: string,
    lon: string
}

/**
 * 
 */
export class OSMLocation {

    /**
     * 
     * @param osmId 
     * @param name 
     * @param display_name 
     * @param lat 
     * @param lon 
     */
    constructor(
        public readonly osmId: string,
        public readonly name: string,
        public readonly displayName: string,
        public readonly lat: number,
        public readonly lon: number) {

    }

    /**
     * 
     * @returns 
     */
    public static empty(): OSMLocation {
        return new OSMLocation('', '', '', 0, 0);
    }

    /**
     * 
     * @returns 
     */
    public isEmpty(): boolean {
        return this.osmId === '';
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IOSMLocation) {

        const id: string = `${json.osm_type.charAt(0)}${json.osm_id}`.toUpperCase();
        return new OSMLocation(id, json.name, json.display_name, Number.parseFloat(json.lat), Number.parseFloat(json.lon));
    }

    /**
     * 
     * @returns 
     */
    public toString(): string {
        return this.displayName;
    }
}

/**
 * 
 */
export interface IOSMAdress {
    country?: string,
    country_code?: string
    state?: string,
    county?: string,
    city?: string,
    city_district?: string,
    suburb?: string,
    postcode?: string,
    road?: string,
    house_number?: string,
    building?: string,
    commercial?: string,
    leisure?: string;
}

export interface IOSMSearchResult {
    osm_type: string,
    osm_id: number,
    name: string,
    display_name: string,
    lat: string,
    lon: string,
    category?: string,
    type?: string,
    place_rank?: number,
    importance?: number,
    addresstype?: string,
    address?: IOSMAdress
}

export class OSMAddressBuilder {


}