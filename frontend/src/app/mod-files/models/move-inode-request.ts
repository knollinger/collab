import { IINode, INode } from "./inode";

export interface IMoveINodeRequest {

    source: IINode[],
    target: IINode
}

export class MoveINodeRequest {

    /**
     * 
     * @param source 
     * @param target 
     */
    constructor(
        private source: INode[],
        private target: INode) {
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): IMoveINodeRequest {

        const inodes: IINode[] = new Array<IINode>();
        this.source.forEach(inode => {
            inodes.push(inode.toJSON());
        });

        return {
            source: inodes,
            target: this.target.toJSON()
        }
    }
}
