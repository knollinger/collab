export class EventRenderer {

    private static deletePadding = 4;
    private static deleteHeight = 24;
    private static deleteWidth = 24;

    public static getDeleteAreaHeight(): number {
        return EventRenderer.deleteHeight;
    }

    public static getDeleteAreaWidth(): number {
        return EventRenderer.deleteWidth + EventRenderer.deletePadding;
    }

    public static getDeleteAreaMargin(): number {
        return EventRenderer.deletePadding;
    }

    public static renderDeleteArea(): string {
        return `<mat-icon 
            class="material-symbols-outlined"
            style="background-color: white;">
            delete
        </mat-icon>`;
    }
}