import { Injectable } from '@angular/core';
import { INode } from "../../mod-files-data/mod-files-data.module";

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  public static readonly OP_NOOP: number = 0;
  public static readonly OP_COPY: number = 1;
  public static readonly OP_MOVE: number = 2;
  public static readonly OP_LINK: number = 3;

  private _inodes: INode[] = new Array<INode>();
  private _op: number = ClipboardService.OP_NOOP;

  /**
   * 
   */
  public clear() {
    this._inodes = new Array<INode>();
    this._op = ClipboardService.OP_NOOP;
  }

  /**
   * 
   * @param src 
   */
  public cut(src: INode | INode[]) {

    this._inodes = (src instanceof INode) ? Array.of(src) : src;
    this._op = ClipboardService.OP_MOVE;
    console.log('cut inodes: ' + this._inodes);
  }

  /**
   * 
   * @param src 
   */
  public copy(src: INode | INode[]) {
    this._inodes = (src instanceof INode) ? Array.of(src) : src;
    this._op = ClipboardService.OP_COPY;
    console.log('copy inodes: ' + this._inodes);
  }

  /**
   * 
   * @param src 
   */
  public link(src: INode | INode[]) {
    this._inodes = (src instanceof INode) ? Array.of(src) : src;
    this._op = ClipboardService.OP_LINK;
    console.log('copy inodes: ' + this._inodes);
  }

  /**
   * 
   * @param target 
   */
  public paste(target: INode) {

  }

  /**
   * 
   */
  public get isEmpty(): boolean {
    return this._inodes.length === 0;
  }

  /**
   * 
   */
  public get operation(): number {
    return this._op;
  }

  /**
   * 
   */
  public get inodes(): INode[] {
    return this._inodes;
  }
}
