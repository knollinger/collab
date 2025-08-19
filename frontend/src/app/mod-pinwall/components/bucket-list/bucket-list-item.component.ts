import { Component, Input } from "@angular/core";
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

    /**
     * 
     * @param event 
     */
    adjustFieldHeight(event: KeyboardEvent) {

        const elem = event.target as HTMLTextAreaElement;
        elem.style.height = "1px";
        elem.style.height = `${elem.scrollHeight}px`;
    }
}
