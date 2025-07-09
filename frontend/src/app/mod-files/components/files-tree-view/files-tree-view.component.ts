import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, map, merge, Observable } from 'rxjs';

import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../services/inode.service';


/**
 * Eine Baumdastellung des File-Systems.
 * 
 * Wir verwenden hier einen mat-tree und müssen uns um den ganzen Käse rund
 * um diesen kümmern.
 */
@Component({
  selector: 'app-files-tree-view',
  templateUrl: './files-tree-view.component.html',
  styleUrls: ['./files-tree-view.component.css'],
  standalone: false
})
export class FilesTreeViewComponent implements OnInit {

  treeControl: FlatTreeControl<FlatINodeTreeNode>;
  dataSource: INodeTreeDataSource;

  @Output()
  select: EventEmitter<INode> = new EventEmitter<INode>()

  /**
   * 
   * @param inodeSvc 
   */
  constructor(private inodeSvc: INodeService) {

    this.treeControl = new FlatTreeControl<FlatINodeTreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new INodeTreeDataSource(this.treeControl, inodeSvc);
  }

  private getLevel(node: FlatINodeTreeNode): number {
    return node.level;
  }

  private isExpandable(node: FlatINodeTreeNode): boolean {
    return node.inode.isDirectory();
  }

  hasChild(idx: number, _nodeData: FlatINodeTreeNode) {
    return _nodeData.inode.isDirectory();
  };

  /**
   * 
   */
  ngOnInit() {

  }

  /**
   * bei einem Click auf eine Node wird die damit assozierte INode als select-Event emittiert
   * 
   * @param evt 
   */
  onClick(evt: FlatINodeTreeNode) {
    this.select.emit(evt.inode);
  }
}

/**
 * Die Darstellung einer INOde als BaumNode. Neben der eigentlichen Node braucht es 
 * noch ein IndentionLevel
 */
class FlatINodeTreeNode {

  constructor(
    public readonly inode: INode,
    public readonly level: number) {
  }
}

/** 
 * Die DataSource für den Tree.
 * 
 * 
 */
class INodeTreeDataSource implements DataSource<FlatINodeTreeNode> {

  private destroyRef = inject(DestroyRef);

  dataChange = new BehaviorSubject<FlatINodeTreeNode[]>([]);

  /**
   * 
   * @param _treeControl 
   * @param inodeSvc 
   */
  constructor(
    private treeControl: FlatTreeControl<FlatINodeTreeNode>,
    private inodeSvc: INodeService) {

    this.loadNodes(INode.root(), 0, 0);
  }

  /**
   * Getter für die Nodes
   */
  get nodes(): FlatINodeTreeNode[] {
    return this.dataChange.value;
  }

  /**
   * Setter für die Nodes
   */
  set nodes(value: FlatINodeTreeNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  /**
   * 
   * @param collectionViewer 
   */
  connect(collectionViewer: CollectionViewer): Observable<readonly FlatINodeTreeNode[]> {

    this.treeControl.expansionModel.changed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(change => {

        const selectionChange = change as SelectionChange<FlatINodeTreeNode>;

        if (selectionChange.added && selectionChange.added.length) {
          this.expandNode(change.added[0]);
        }

        if (selectionChange.removed && change.removed.length) {
          this.collapseNode(change.removed[0]);
        }
      });
    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.nodes));
  }

  /**
   * 
   * @param collectionViewer 
   */
  disconnect(collectionViewer: CollectionViewer): void {

  }

  /**
   * Expandiere eine Node. Dazu werden einfach alle Ihre direkten 
   * Kinder geladen und mit einen um 1 erhöhten Level direkt nach
   * dieser Node eingefügt.
   * 
   * @param node 
   */
  private expandNode(node: FlatINodeTreeNode) {

    const idx = this.findNode(node.inode);
    this.loadNodes(node.inode, idx, node.level + 1);
  }

  /**
   * Falte eine FlatINodeTreeNode zusammen.
   * 
   * Dazu werden einfach ab dieser Node alle Nodes entfernt, deren 
   * level größer des Levels der aktuellen Node ist
   *   
   * @param node 
   */
  private collapseNode(node: FlatINodeTreeNode) {

    const idx = this.findNode(node.inode);
    const endIdx = this.findNextSibling(idx);
    this.nodes.splice(idx + 1, endIdx - idx - 1);
    this.dataChange.next(this.nodes);

  }

  /**
   * Lade alle Childs der angegebenen Node und füge sie mit dem 
   * angegebenen Level direkt hinter der der angegebenen Position ein.
   * 
   * @param parent 
   * @param index 
   * @param level 
   */
  private loadNodes(parent: INode, index: number, level: number) {

    this.inodeSvc.getAllChilds(parent.uuid, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(nodes => {

        const currNodes = this.nodes;
        const newNodes = nodes.map(node => {
          return new FlatINodeTreeNode(node, level);
        });

        currNodes.splice(index + 1, 0, ...newNodes);
        this.dataChange.next(currNodes);

      });
  }

  /**
   * Liefere den Index einer INode im TreeNodeArray
   * 
   * @param inode 
   * @returns 
   */
  private findNode(inode: INode): number {

    let idx = 0;

    for (let idx = 0; idx < this.nodes.length; ++idx) {
      if (this.nodes[idx].inode.uuid === inode.uuid) {
        return idx;
      }
    }
    return 0;
  }

  /**
   * Finde den nächsten Sibling, also die Node mit dem selben Level
   * welche der angegebenen Node folgt.
   * 
   * @param startIdx 
   * @returns 
   */
  private findNextSibling(startIdx: number): number {

    const startLevel = this.nodes[startIdx].level;
    for (let idx = startIdx + 1; idx < this.nodes.length; idx++) {
      if (this.nodes[idx].level <= startLevel) {
        return idx;
      }
    }
    return this.nodes.length;
  }

}

