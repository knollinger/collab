import { INode } from './inode';

export interface IUploadFilesResponse {
    newINodes?: INode[],
    duplicateFiles?: INode[];
}

export class UploadFilesResponse {

    /** 
     * 
     */
    constructor(
        public readonly newINodes: INode[],
        public readonly duplicateFiles: INode[]) {
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IUploadFilesResponse): UploadFilesResponse {

        let newINodes: INode[] = new Array<INode>();
        if (json.newINodes) {
            newINodes = json.newINodes.map(inode => {
                return INode.fromJSON(inode);
            });
        }

        let dupINodes: INode[] = new Array<INode>();
        if (json.duplicateFiles) {
            dupINodes = json.duplicateFiles.map(inode => {
                return INode.fromJSON(inode);
            });
        }
        return new UploadFilesResponse(newINodes, dupINodes);
    }
}