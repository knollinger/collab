import { INode } from "../../../mod-files-data/mod-files-data.module";

export interface IThumbNail {

    set inode(inode: INode);
    get inode(): INode;
}