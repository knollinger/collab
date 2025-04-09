/**
 * 
 */
export interface ISaveHashtagsReq {
    refId: string,
    tags: string[]
}

/**
 * 
 */
export class SaveHashtagsReq {

    /**
     * 
     * @param refId 
     * @param tags 
     */
    constructor(
        public readonly refId: string,
        public readonly tags: string[]) {

    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ISaveHashtagsReq {
        return {
            refId: this.refId,
            tags: this.tags
        }
    }
}