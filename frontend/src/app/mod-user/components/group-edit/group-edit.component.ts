import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Group } from '../../../mod-userdata/mod-userdata.module';
import { GroupService } from '../../services/group.service';

/**
 * Die Editor-Komponente für Gruppen-Zugehörigkeiten.
 * 
 * Die Komponente zerfällt in zwei wesentliche Teile. 
 * Auf der linken Seite wird eine **GroupTreeComponent**
 * angezeigt. In dieser werden alle PrimärGruppen ausgefiltert.
 * Sie dient also "nur" der Navigation zwischen den SecondaryGroups
 * und stellt deren Beziehungen untereinander dar.
 * 
 * Auf der rechten Seite wird eine SelectionList aller Gruppen
 * angezeigt. Bei Auswahl einer Gruppe im Tree werden die aktuell
 * in dieser Gruppe vorhandenen Member in der SelectionList 
 * ausgewählt.
 * 
 * Durch Änderung in der SelectionList können somit Gruppen-
 * Zugehörigkeiten gelöscht oder neu erstellt werden. 
 * 
 * Dummerweise könnten dadurch rekursive Gruppen-Zugehörigkeiten
 * entstehen. Das muss noch verhindert werden :-()
 */
@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  groupTree: Group[] = new Array<Group>();
  allGroups: Group[] = new Array<Group>();
  currentMembers: Group[] = new Array<Group>();

  /**
   * 
   * @param groupSvc 
   * @param userSvc 
   */
  constructor(
    private groupSvc: GroupService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.loadGroups();
  }

  private loadGroups() {

    // lese Rekursiv dem Baum aller Gruppen
    this.groupSvc.listGroups(true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(groups => {

        this.allGroups = groups;

        const deepCopies = groups.map(group => {
          return group.clone();
        })
        this.groupTree = this.filterRecursivly(deepCopies);

        this.currentMembers = new Array<Group>();
      })
  }

  /**
   * 
   */
  onCreateGroup() {

  }

  onReloadGroups() {
    this.loadGroups();
  }

  onGroupSelection(group: Group) {

    this.currentMembers = this.getMembersOf(group);
  }

  /**
   * 
   * @param groups 
   * @returns 
   */
  private filterRecursivly(groups: Group[]): Group[] {

    const filtered = groups.filter(group => !group.primary);
    filtered.forEach(group => {

      group.members = this.filterRecursivly(group.members);
    })
    return filtered;
  }

  /**
   * 
   * @param group 
   * @returns 
   */
  private getMembersOf(group: Group): Group[] {

    // console.log
    let result: Group[] = new Array<Group>();
    for (let i = 0; i < this.allGroups.length; ++i) {
      if (this.allGroups[i].uuid === group.uuid) {
        result = this.allGroups[i].members;
        console.log(`Group ${group.uuid} found: ${result}`);
        break;
      }
    }
    return result;
  }
}
