import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AvatarService, Group } from '../../../mod-userdata/mod-userdata.module';

interface FlatTreeNode {
  level: number;
  expandable: boolean,
  name: string,
  group: Group;
}

@Component({
  selector: 'app-group-tree',
  templateUrl: './group-tree.component.html',
  styleUrls: ['./group-tree.component.css'],
  standalone: false
})
export class GroupTreeComponent {

  private _transformer = (group: Group, level: number) => {

    return {
      expandable: group.hasMembers,
      name: group.name,
      level: level,
      group: group
    };
  };

  treeControl = new FlatTreeControl<FlatTreeNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.members
  );

  hasChild = (_: number, node: FlatTreeNode) => node.expandable;

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  /**
   * 
   */
  @Input()
  set groups(group: Group | Group[]) {
    this.dataSource.data = Array.isArray(group) ? group : [group];
    this.treeControl.expandAll();
  }

  @Output()
  selection: EventEmitter<Group> = new EventEmitter<Group>();

  current: FlatTreeNode | undefined = undefined;

  /**
   * 
   * @param avatarSvc 
   */
  constructor(private avatarSvc: AvatarService) {

  }

  /**
   * 
   * @param group 
   */
  onNodeSelect(node: FlatTreeNode) {
    this.selection.emit(node.group);
    this.current = node;
  }

  /**
   * 
   * @param node 
   * @returns 
   */
  public getAvatarUrl(node: FlatTreeNode): string {

    return node.group.primary ? this.avatarSvc.getAvatarUrl(node.group.uuid) : '';
  }

  /**
   * 
   * @param node 
   * @returns 
   */
  public isSelected(node: FlatTreeNode): boolean {

    return (this.current) ? node == this.current : false;
  }
}