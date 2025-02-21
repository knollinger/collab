/**
 * 
 */
export interface ISearchRequest {
    search: string[]
}

/**
 * 
 */
export class SearchRequest {

    /**
     * 
     * @param search 
     */
    constructor(private search: string) {

    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ISearchRequest {

        return {
            search: this.search.split(' ')
        }
    }
}