import { Component, EventEmitter, Input, Output } from "@angular/core";
import { BucketListItem } from "../../models/bucket-list-item";

@Component({
    selector: 'app-bucket-list-item',
    templateUrl: './bucket-list-item.component.html',
    styleUrls: ['./bucket-list-item.component.css'],
    standalone: false
})
export class BucketListItemComponent {

    @Input()
    item: BucketListItem = BucketListItem.empty();

    @Input()
    readonly: boolean = false;

    @Output()
    select: EventEmitter<BucketListItem> = new EventEmitter<BucketListItem>();

    showToolbox: boolean = false;

    /**
     * 
     * @param checked 
     */
    onStateChange(checked: boolean) {

        this.item.done = checked;
        if (checked) {
            this.markAllChildsDone(this.item);
        }
        this.checkAllSiblingsDone(this.item);
    }

    get someComplete(): boolean {

        const completed = this.item.childs.filter(child => {
            return child.done;
        });
        return completed.length > 0 && completed.length < this.item.childs.length;
    }

    onToggleToolbox() {
        this.showToolbox = !this.showToolbox;
    }

    onHideToolbox() {
        this.showToolbox = false;
    }

    onTextChange(evt: Event) {

        const edit = evt.target as HTMLDivElement;
        if (edit) {
            console.log(edit.textContent);

        }
    }

    /**
     * 
     * @param parent 
     */
    private markAllChildsDone(parent: BucketListItem) {

        parent.childs.forEach(item => {
            item.done = true;
            this.markAllChildsDone(item);
        })
    }

    /**
     * 
     * @param item 
     */
    private checkAllSiblingsDone(item: BucketListItem) {

        const parent = item.parent;
        if (parent) {

            let nrDone: number = 0;
            parent.childs.forEach(sibling => {
                if (sibling.done) {
                    nrDone++;
                }
            })

            parent.done = (nrDone === parent.childs.length);
            if (parent.done) {
                this.checkAllSiblingsDone(parent);
            }
        }
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* all about moveUp                                                      */
    /*                                                                       */
    /* Ein Item kann nach oben verschoben werden, wenn es in der Child-      */
    /* Hierarchie des Parent nicht ganz oben steht                           */
    /*                                                                       */
    /* Alle Childs des Items verden mit verschoben                           */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     * @returns 
     */
    canMoveUp(): boolean {

        const idx = this.findInParent(this.item);
        return idx > 0;
    }

    /**
     * 
     */
    onMoveUp() {

        const idx = this.findInParent(this.item);
        if (idx > 0) {

            const tmp = this.item.parent!.childs[idx - 1];
            this.item.parent!.childs[idx - 1] = this.item;
            this.item.parent!.childs[idx] = tmp;
        }
        this.showToolbox = false;
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* MoveLeft bedeutet folgendes:                                          */
    /*                                                                       */
    /* TODO                                                                  */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     * @returns 
     */
    canMoveLeft(): boolean {

        return (this.item.parent !== null) && (this.item.parent.parent !== null);
    }

    /**
     * 
     */
    onMoveLeft() {

        alert('not yet implemented');
        this.showToolbox = false;
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* MoveRight bedeutet folgendes:                                         */
    /*                                                                       */
    /* * Füge das Element als letztes Child in sein prevSibling ein          */
    /* * entferne das Element aus seinem aktuellen Parent                    */
    /* * setze den neuen Parent                                              */
    /*                                                                       */
    /* Das kann natürlich nur funktionieren, wenn es ein prevSibling gibt.   */
    /* Dies ist der Fall, wenn findInParent einen Wert > 0 liefert.          */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     * @returns 
     */
    canMoveRight(): boolean {

        return this.findInParent(this.item) > 0;
    }

    /**
     * 
     */
    onMoveRight() {

        const idx = this.findInParent(this.item);
        if (idx > 0) {

            const tmp = this.item.parent!.childs.splice(idx, 1)[0];
            const prevSibling = this.item.parent!.childs[idx - 1];
            prevSibling.childs.push(tmp);
            tmp.parent = prevSibling;
        }
        this.showToolbox = false;
    }

    canMoveDown(): boolean {

        let result = false;
        const idx = this.findInParent(this.item);
        result = idx >= 0 && idx < this.item.parent!.childs.length - 1;
        return result;
    }

    onMoveDown() {

        const idx = this.findInParent(this.item);

        if (idx >= 0 && idx < this.item.parent!.childs.length - 1) {

            const tmp = this.item.parent!.childs[idx];
            this.item.parent!.childs[idx] = this.item.parent!.childs[idx + 1];
            this.item.parent!.childs[idx + 1] = tmp;
        }
        this.showToolbox = false;
    }

    /**
     * Lösche ein Item
     */
    onDelete() {

        const idx = this.findInParent(this.item);
        if (idx >= 0) {
            this.item.parent?.childs.splice(idx, 1);
        }
        this.showToolbox = false;
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

    onSelect(item: BucketListItem) {
        this.select.emit(item);
    }
}
