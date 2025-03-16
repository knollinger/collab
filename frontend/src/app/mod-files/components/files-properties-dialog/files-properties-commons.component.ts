import { Component, Input, OnInit } from "@angular/core";
import { INode } from "../../models/inode";

/**
 * 
 */
@Component({
    selector: 'app-files-properties-commons',
    templateUrl: './files-properties-commons.component.html',
    styleUrls: ['./files-properties-commons.component.css']
})
export class FilesPropertiesCommonsComponent implements OnInit {

    @Input()
    inode: INode = INode.empty();

    /**
     * 
     * @param data 
     */
    constructor() {
    }

    /**
     * 
     */
    ngOnInit(): void {
    }
}

