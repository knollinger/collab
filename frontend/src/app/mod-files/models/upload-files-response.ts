import { INode } from './inode';

export interface IUploadFilesResponse {
    newINodes?: INode[],
    duplicateFiles?: string[];
}

export class UploadFilesResponse {

    /** 
     * 
     */
    constructor(
        public readonly newINodes: INode[],
        public readonly duplicateFiles: string[]) {
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IUploadFilesResponse): UploadFilesResponse {

        let duplicateFiles = json.duplicateFiles || new Array<string>();
        
        let newINodes: INode[] = new Array<INode>();
        if (json.newINodes) {
            newINodes = json.newINodes.map(inode => {
                return INode.fromJSON(inode);
            });
        }
        return new UploadFilesResponse(newINodes, duplicateFiles);
    }
}