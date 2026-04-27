export type DragDirection = 'n' | 's' | 'w' | 'e' | 'nw' | 'sw' | 'ne' | 'se' | 'any';
export interface OnMouseDownCallback {
    (evt: MouseEvent, direction: DragDirection): void;
}

export class DragAnchor {


    protected static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    private static ANCHOR_WIDTH: number = 8;

    private _anchor: SVGRectElement;

    /**
     * 
     * @param direction 
     * @param onMouseDown 
     */
    constructor(private direction: DragDirection, onMouseDown: OnMouseDownCallback) {

        this._anchor = document.createElementNS(DragAnchor.SVG_NAMESPACE, 'rect') as SVGRectElement;
        this._anchor.setAttribute('stroke-width', '2');
        this._anchor.setAttribute('stroke', 'cornflowerblue');
        this._anchor.setAttribute('fill', 'lightblue');
        this._anchor.setAttribute('width', DragAnchor.ANCHOR_WIDTH.toString());
        this._anchor.setAttribute('height', DragAnchor.ANCHOR_WIDTH.toString());
        this._anchor.setAttribute('cursor', this.cursor);

        this._anchor.addEventListener('mousedown', (evt: MouseEvent) => {
            onMouseDown(evt, direction);
        });
    }

    /**
     * 
     * @param x 
     * @param y 
     */
    public setPosition(x: number, y: number) {

        this._anchor.setAttribute('x', (x - DragAnchor.ANCHOR_WIDTH / 2).toString());
        this._anchor.setAttribute('y', (y - DragAnchor.ANCHOR_WIDTH / 2).toString());
    }

    /**
     * 
     */
    public get svgElement(): SVGGraphicsElement {
        return this._anchor;
    }

    /**
     * 
     */
    private get cursor(): string {

        let cursor = '';
        switch (this.direction) {
            case 'any':
                cursor = 'move';
                break;

            default:
                cursor = `${this.direction}-resize`;
                break;
        }
        return cursor;
    }
}