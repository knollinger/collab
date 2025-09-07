import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { PinwallService } from '../../services/pinwall.service';
import { PostIt } from '../../models/postit';
import { BucketListComponent } from '../bucket-list/bucket-list.component';
import { BucketListItem, IBucketListItem } from '../../models/bucket-list-item';


@Component({
  selector: 'app-postit-list-editor',
  templateUrl: './postit-list-editor.component.html',
  styleUrls: ['./postit-list-editor.component.css']
})
export class PostitListEditorComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  postIt: PostIt = PostIt.empty();

  @ViewChild(BucketListComponent)
  bucketList!: BucketListComponent;

  rootItem: BucketListItem = BucketListItem.empty();
  private currItem: BucketListItem | null = null;

  public canMoveUp: boolean = false;
  public canMoveDown: boolean = false;
  public canMoveLeft: boolean = false;
  public canMoveRight: boolean = false;


  /**
   * 
   * @param route 
   * @param titlebarSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private pinwallSvc: PinwallService,
    private titlebarSvc: TitlebarService) {
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.titlebarSvc.subTitle = 'neuer PostIt';

    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params['uuid'] || '';
        if (uuid) {
          this.loadEntry(uuid);
        }
        else {
          this.rootItem.childs.push(new BucketListItem(false, 'Neuer Eintrag', this.rootItem, [], false));
          this.postIt.type = 'BUCKET_LIST';
        }
      })
  }

  /**
   * 
   * @param uuid 
   */
  loadEntry(uuid: any) {

    this.pinwallSvc.get(uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(postIt => {

        this.postIt = postIt;
        this.titlebarSvc.subTitle = postIt.title;

        this.rootItem = BucketListItem.parseRawJSON(postIt.content);
      })
  }

  /**
   * 
   */
  onAddBucket() {

    const parent = this.currItem ? this.currItem : this.rootItem;
    const child = new BucketListItem(false, '', parent, [], false);
    parent.childs.push(child);
  }

  /**
   * 
   * @returns 
   */
  get showDeleteBtn(): boolean {
    return this.currItem !== null;
  }

  /**
   * Lösche ein Element (und alle seine Kinder)
   */
  onDeleteBucket() {

    if (this.currItem) {
      const idx = this.findInParent(this.currItem);
      if (idx >= 0) {
        this.currItem.parent!.childs.splice(idx, 1);
      }
    }
  }

  onSave() {

    const items: IBucketListItem[] = this.rootItem.childs.map(item => {
      return item.toJSON();
    });

    const toSave = new PostIt(
      this.postIt.uuid,
      this.postIt.owner,
      this.postIt.type,
      this.postIt.title,
      JSON.stringify(items));

    const subscr = this.postIt.isEmpty() ? this.pinwallSvc.create(toSave) : this.pinwallSvc.save(toSave);
    subscr.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rsp => {
        console.dir(rsp);
      });
  }

  /**
   * Ein Item wurde ausgewählt
   * 
   * @param item 
   */
  onSelectItem(item: BucketListItem) {
    this.currItem = item;
    this.checkPossibleMovements();
  }

  private checkPossibleMovements() {

    this.canMoveUp = this.checkCanMoveUp();
    this.canMoveRight = this.checkCanMoveRight();
    this.canMoveLeft = this.checkCanMoveLeft();
    this.canMoveDown = this.checkCanMoveDown();
  }

  /**
   * Ein Element kann nach oben verschoben werden, wenn es nicht das
   * erste Kind seines Parents ist
   * 
   * @returns 
   */
  private checkCanMoveUp(): boolean {

    // return (this.currItem !== null) &&
    //   (this.findInParent(this.currItem) > 0);
    return this.currItem !== null; // TODO: noch nicht komplett
  }

  /**
   * 
   */
  onMoveItemUp() {

    if (this.canMoveUp) {

      const currItem = this.currItem!;
      const parent = currItem.parent!;
      let idx = this.findInParent(this.currItem);

      if (idx > 0) {
        // mit dem prevItem swappen
        const tmp = parent.childs[idx - 1];
        parent.childs[idx - 1] = currItem;
        parent.childs[idx] = tmp;
      }
      else {

        if (parent.parent != null) {

          parent.childs.splice(idx, 1); // aus dem aktuellen parent ausschneiden
          idx = this.findInParent(parent); // die Position des aktuellen parents in dessen parent finden
          parent.parent?.childs.splice(idx, 0, currItem); // und das currItem davor einfügen
          currItem.parent = parent.parent; // parent umsetzen
        }
      }
      this.checkPossibleMovements();
    }
  }

  /**
   * Ein Element kann nach unten verschoben werden, wenn es nicht das 
   * letzte Kind seines Parents ist
   * 
   * @returns 
   */
  private checkCanMoveDown(): boolean {

    return (this.currItem !== null) &&
      this.findInParent(this.currItem) < this.currItem.parent!.childs.length - 1;
  }

  /**
   * 
   */
  onMoveItemDown() {

    if (this.canMoveDown) {

      const currItem = this.currItem!;
      const parent = currItem.parent!;
      const idx = this.findInParent(currItem);

      const tmp = parent.childs[idx];
      parent.childs[idx] = parent.childs[idx + 1];
      parent.childs[idx + 1] = tmp;
      this.checkPossibleMovements();

    }
  }

  /**
   * Ein Element kann nach links verschoben werden, wenn es einen Parent hat und
   * dieser Parent nicht die RootNode ist.
   */
  private checkCanMoveLeft(): boolean {

    return (this.currItem !== null) &&
      (this.currItem.parent !== null) &&
      (this.currItem.parent.parent !== null);
  }

  onMoveItemLeft() {

    if (this.canMoveLeft) {

      const currItem = this.currItem!;
      let idx = this.findInParent(currItem);
      currItem.parent!.childs.splice(idx, 1);

      idx = this.findInParent(currItem.parent!);
      const newParent = currItem.parent!.parent!;
      newParent.childs.splice(idx + 1, 0, currItem);
      currItem.parent = newParent;

      this.checkPossibleMovements();
    }
  }

  /**
   * Ein Element kann nach rechts verschoben werden, wenn es wenigstens ein 
   * vorhergehendes Geschwister-Element hat.
   */
  private checkCanMoveRight(): boolean {

    return (this.currItem !== null) && (this.findInParent(this.currItem) > 0);
  }

  onMoveItemRight() {

    if (this.canMoveRight) {

      const currItem = this.currItem!;
      const idx = this.findInParent(currItem);
      currItem.parent!.childs.splice(idx, 1);
      const newParent = currItem.parent!.childs[idx - 1];
      newParent.childs.push(currItem);
      currItem.parent = newParent;
      this.checkPossibleMovements();
    }
  }

  /** 
    * Finde das Element in der ChildListe seines Parents
    * 
    *  @returns -1, wenn das Element keinen Parent hat 
    *            oder nicht in der ChildListe des angegebenen Parents steht.
    */
  private findInParent(item: BucketListItem | null): number {

    let result = -1;

    if (item && item.parent) {

      result = item.parent.childs.indexOf(item);
    }

    return result;
  }
}
