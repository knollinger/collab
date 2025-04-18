/**
 * 
 */
export interface ISaveHashtagsReq {
    refId: string,
    type: string,
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
        public readonly type: string,
        public readonly tags: string[]) {

    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ISaveHashtagsReq {
        return {
            refId: this.refId,
            type: this.type,
            tags: this.tags
        }
    }
}