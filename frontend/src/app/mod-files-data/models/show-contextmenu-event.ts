import { INode } from './inode';

export interface IShowContextMenuEvent {
    inode: INode,
    elem: HTMLElement | null
}