import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
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

  @Input()
  set groups(groups: Group[]) {
    this.dataSource.data = groups;
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

  public getAvatarUrl(node: FlatTreeNode): string {
    
    let result: string = '';

    if (node.group.primary) {
      result = this.avatarSvc.getAvatarUrl(node.group.uuid);
    }
    return result;
  }

  public isPrimary(node: FlatTreeNode): boolean {
    return node.group.primary;
  }

  public isSelected(node: FlatTreeNode): boolean {

    if(this.current) {
      return node == this.current;
    }
    return false;
  }
}
