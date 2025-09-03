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
        this.select.emit(this.item);
    }

    get someComplete(): boolean {

        const completed = this.item.childs.filter(child => {
            return child.done;
        });
        return completed.length > 0 && completed.length < this.item.childs.length;
    }

    onTextChange(evt: Event) {

        const edit = evt.target as HTMLDivElement;
        if (edit) {
            this.item.title = edit.textContent || '';
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

    onSelect(item: BucketListItem) {
        this.select.emit(item);
    }

    get selected(): boolean {
        return this.item.selected;
    }
}
