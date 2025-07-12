import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FilePickerComponent } from "../components/files-picker/files-picker.component";

/**
 * 
 */
@Injectable({
    providedIn: 'root'
})
export class FilesPickerService {

    /**
     * 
     * @param dialog 
     */
    constructor(private dialog: MatDialog) {

    }

    /**
     * 
     * @param multiple 
     * @returns 
     */
    public showFilePicker(multiple: boolean) {

        const dialogRef = this.dialog.open(FilePickerComponent, {
            width: '60%',
            data: {
                multiple: multiple
            }
        });
        return dialogRef.afterClosed();
    }
}
