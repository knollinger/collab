import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Group } from '../../../mod-userdata/mod-userdata.module';
import { GroupService } from '../../services/group.service';
import { CommonDialogsService, TitlebarService } from '../../../mod-commons/mod-commons.module';

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
  styleUrls: ['./group-edit.component.css'],
  standalone: false
})
export class GroupEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  currentGroup: Group = Group.empty();
  allGroups: Group[] = new Array<Group>();
  nonPrimaryGroups: Group[] = new Array<Group>();
  possibleMembers: Group[] = new Array<Group>();
  currentMembers: Group[] = new Array<Group>();

  /**
   * 
   * @param groupSvc 
   * @param userSvc 
   */
  constructor(
    private titleBarSvc: TitlebarService,
    private groupSvc: GroupService,
    private mboxSvc: CommonDialogsService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titleBarSvc.subTitle = 'Gruppen-Verwaltung';
    this.onReloadGroups();
  }

  /**
   * 
   */
  onReloadGroups() {

    this.groupSvc.listGroups(true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(groups => {

        this.allGroups = groups;
        this.nonPrimaryGroups = this.filterRecursively(groups);
        this.possibleMembers = new Array<Group>();
        this.currentMembers = new Array<Group>();
        this.currentGroup = Group.empty();
      })
  }

  /**
   * 
   * @param groups 
   * @returns 
   */
  private filterRecursively(groups: Group[]): Group[] {

    const newGroups = groups.map(group => group.clone());
    for (let group of newGroups) {
      group.members = this.filterRecursively(group.members);
    }
    return newGroups.filter(group => !group.primary);
  }

  /**
   * 
   */
  onCreateGroup() {

    this.mboxSvc.showInputBox('Eine neue Gruppe anlegen', 'Gruppen-Name')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(name => {

        if (name) {

          this.groupSvc.createGroup(name, false)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(newGroup => {

              // TODO: in ausgewählte Gruppe verschieben?
              this.onReloadGroups();
            })
        }
      });

  }

  /**
   * 
   * @param group 
   */
  onGroupSelection(selected: Group) {


    this.possibleMembers = this.allGroups.filter(group => { return group.uuid !== selected.uuid })
    this.currentMembers = this.getMembersOf(selected);
    this.currentGroup = selected;
  }

  get selectedGroup(): Group {

    return this.currentGroup;
  }

  get isGroupSelected(): boolean {
    return !this.currentGroup.isEmpty();
  }

  /**
   * 
   * @param group 
   * @returns 
   */
  private getMembersOf(group: Group): Group[] {

    let result: Group[] = new Array<Group>();
    for (let i = 0; i < this.allGroups.length; ++i) {
      if (this.allGroups[i].uuid === group.uuid) {
        result = this.allGroups[i].members;
        break;
      }
    }
    return result;
  }

  onMemberChange(members: Group[]) {

    this.currentMembers = members;
  }

  onDeleteGroup() {

    this.mboxSvc.showQueryBox('Bist Du sicher?', `Möchtest DU wirklich die Gruppe '${this.currentGroup.name}' löschen?`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rsp => {
        if (rsp) {
          this.groupSvc.deleteGroup(this.currentGroup.uuid)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(_ => {
              this.onReloadGroups();
            });
        }
      });
  }
  onSubmit() {

    this.groupSvc.saveGroupMembers(this.currentGroup, this.currentMembers)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {

        this.mboxSvc.showSnackbar(`Gruppen-Mitglieder für '${this.currentGroup.name}' gespeichert.`);
      });
  }
}
