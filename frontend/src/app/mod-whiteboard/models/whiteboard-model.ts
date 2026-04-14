import { AbstractLine } from '../drawables/lines/abstract-line';
import { DirectLine } from '../drawables/lines/direct-line';
import { AbstractShape, IShapeJSON } from '../drawables/shapes/abstractshape';
import { EllipsisShape } from '../drawables/shapes/ellipsis-shape';
import { RectShape } from '../drawables/shapes/rect-shape';
import { RombusShape } from '../drawables/shapes/rombus-shape';
import { EZOrderMode } from './ezorder-mode';

export interface IWhiteboardJSON {

    shapes: IShapeJSON[]
}

/**
 * Beschreibt ein Whiteboard-Dokument und alle Operationen auf diesem.
 * 
 * Die Operationen auf dem Dokument werden auf dem im ctor übergebenen
 * SVGSVG-Element reflektiert. 
 * 
 * Das SVGDokument wird folgendermassen präpariert:
 * 
 * * Ein <style> Element, welches CSS-Styles beinhaltet. Dieses kommt aus dem HTML-Template
 * * Ein <defs>-Element, welches als Target für href-referenzierte Resourcen dient
 * * Ein <g id="shapes-group"> Element, welches alle Shapes aufnimmt
 * * Ein <g id="lines-group"> Element, welches alle Linien und Connectoren aufnimmt
 */
export class WhiteboardModel {

    public static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    private static DEFAULT_SHAPE_SIZE: number = 100;

    private _defsElem: SVGDefsElement;
    private _shapesGroup: SVGGElement;
    private _linesGroup: SVGGElement;
    private _gridLines: SVGRectElement;


    private _shapes: AbstractShape[] = new Array<AbstractShape>();
    private _selectedShapes: Set<AbstractShape> = new Set<AbstractShape>();

    /**
     * 
     * @param svgRoot 
     */
    constructor(private _svgRoot: SVGSVGElement) {

        this._defsElem = this.svgRoot.getElementsByTagName('defs').item(0) as SVGDefsElement;

        this._gridLines = this.svgRoot.getElementById('gridLines') as SVGRectElement;

        this._shapesGroup = document.createElementNS(WhiteboardModel.SVG_NAMESPACE, 'g') as SVGGElement;
        this._shapesGroup.setAttribute('id', 'shapes-group');
        this.svgRoot.appendChild(this._shapesGroup);

        this._linesGroup = document.createElementNS(WhiteboardModel.SVG_NAMESPACE, 'g') as SVGGElement;
        this._linesGroup.setAttribute('id', 'lines-group');
        this.svgRoot.appendChild(this._linesGroup);
    }

    /**
     * Erzeugt ein leeres Dokument, welches keine Bindung an ein bestehendes
     * SVG-Dokument beinhaltet.
     * 
     * @returns 
     */
    public static empty(): WhiteboardModel {
        return new WhiteboardModel(document.createElementNS(WhiteboardModel.SVG_NAMESPACE, 'svg') as SVGSVGElement);
    }

    /**
     * 
     */
    public get defsElem(): SVGDefsElement {
        return this._defsElem;
    }

    public get svgRoot(): SVGSVGElement {
        return this._svgRoot;
    }

    /**
     * 
     */
    public get shapesGroup(): SVGGElement {
        return this._shapesGroup;
    }

    /**
     * 
     */
    public get linesGroup(): SVGGElement {
        return this._linesGroup;
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All JSON                                                              */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/
    public toJSON(): IWhiteboardJSON {
        
        return {
            shapes: this._shapes.map(shape => shape.toJSON())
        }
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about grid                                                        */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     */
    set showGridLines(val: boolean) {
        if (!val) {
            this._gridLines.setAttribute('class', 'hidden')
        }
        else {
            this._gridLines.removeAttribute('class')
        }
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about document dimensions                                         */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     */
    public get width(): number {

        return Number.parseInt(this.svgRoot.getAttribute('width') || '0');
    }

    /**
     * 
     */
    public get height(): number {

        return Number.parseInt(this.svgRoot.getAttribute('height') || '0');
    }

    /**
     * Berechne die aktuellen Dimensionen den Images und setze diese als
     * width/height-Attribute in das SVG-Dokument.
     */
    public normalizeImageDimensions() {

        let minX: number = 0;
        let maxX: number = 0;
        let minY: number = 0;
        let maxY: number = 0;

        this._shapes.forEach(shape => {

            minX = Math.min(minX, shape.posX);
            maxX = Math.max(maxX, shape.width + shape.posX);
            minY = Math.min(minY, shape.posY);
            maxY = Math.max(maxY, shape.height + shape.posY);
        })

        if (minX < 0 || minY < 0) {

            const deltaX = (minX < 0) ? -minX : 0;
            const deltaY = (minY < 0) ? -minY : 0;
            this._shapes.forEach(shape => {
                shape.translateBy(deltaX, deltaY);
            });
        }

        const width = maxX - minX;
        const height = maxY - minY;

        this.svgRoot.setAttribute('height', height.toString())
        this.svgRoot.setAttribute('width', width.toString())
    }

    /**
     * Liefere das Rectangle, welches alle Objekte den SVGs umrahmt.
     * 
     * @returns 
     */
    public get enclosingImageRect(): DOMRect {

        let minX: number = Number.MAX_VALUE;
        let minY: number = Number.MAX_VALUE;
        let maxX: number = 0;
        let maxY: number = 0;

        this._shapes.forEach(shape => {

            minX = Math.min(minX, shape.posX);
            maxX = Math.max(maxX, shape.width + shape.posX);
            minY = Math.min(minY, shape.posY);
            maxY = Math.max(maxY, shape.height + shape.posY);
        })

        minX = Math.abs(minX);
        minY = Math.abs(minY);

        const width = maxX - minX;
        const height = maxY - minY;
        return DOMRect.fromRect(

            {
                height: height,
                width: width,
                x: minX,
                y: minY
            });
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about shape creation                                              */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    public get nrOfShapes(): number {
        return this._shapes.length;
    }

    /**
     * 
     * @param type 
     * @returns 
     */
    public createShape(type: string) {

        let shape: AbstractShape;

        switch (type) {
            case 'rect':
                shape = new RectShape(type, this);
                break;

            case 'ellipse':
                shape = new EllipsisShape(type, this);
                break;

            case 'rombus':
                shape = new RombusShape(type, this);
                break;

            default:
                throw new Error(`unknown shape type '${type}`);
                break;
        }

        shape.width = shape.height = WhiteboardModel.DEFAULT_SHAPE_SIZE;
        shape.svgElem.addEventListener('click', evt => {
            if (!evt.ctrlKey) {
                this.deselectAll();
            }
            this.selectShape(shape);
        })
        this._shapes.push(shape);
        this.deselectAll();
        this.selectShape(shape);
        return shape;
    }

    /**
     * 
     * @param type 
     */
    public createLine(type: string) {

        let line: AbstractLine;

        switch (type) {
            case 'direct':
                line = new DirectLine(this.svgRoot, this._linesGroup);
                break;

            default:
                throw new Error(`unknown line type '${type}`);
                break;
        }

        line.resizeLine(20, 20, 100, 100);
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about shape deletion                                              */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     * @param toDelete 
     */
    public deleteShape(shape: AbstractShape) {

        this.deselectShape(shape);

        const idx = this._shapes.indexOf(shape);
        if (idx !== -1) {
            this._shapes.splice(idx, 1);
            shape.delete();
        }
    }

    /**
     * 
     */
    public deleteSelectedShapes() {

        console.log('deleteSelectedShapes');
        this._shapes = this._shapes.filter(shape => {

            const result = this._selectedShapes.has(shape);
            if (result) {
                shape.delete();
            }
            return !result;
        })
        this.deselectAll();
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about shape selection                                             */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    public get nrOfSelectedShapes(): number {
        return this._selectedShapes.size ;
    }
    /**
     * 
     * @param shape 
     */
    public selectShape(shape: AbstractShape) {

        if (this._shapes.indexOf(shape) !== -1) {
            shape.showSelectionFrame(true);
            this._selectedShapes.add(shape);
        }
    }

    /**
     * 
     * @param shape 
     */
    public deselectShape(shape: AbstractShape) {

        if (this._shapes.indexOf(shape) !== -1) {
            shape.showSelectionFrame(false);
            this._selectedShapes.delete(shape);
        }
    }

    /**
     * 
     */
    public selectAll() {

        this._shapes.forEach(shape => {
            shape.showSelectionFrame(true);
            this._selectedShapes.add(shape);
        })
    }

    /**
     * 
     */
    public deselectAll() {

        this._selectedShapes.forEach(shape => {
            shape.showSelectionFrame(false);
        })
        this._selectedShapes.clear();
    }

    /**
     * 
     * @returns 
     */
    public hasSelection(): boolean {
        return this._selectedShapes.size > 0;
    }

    /**
     * 
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     */
    public selectByFrame(x: number, y: number, width: number, height: number) {

        this._shapes.forEach((shape) => {

            if (shape.isInRect(x, y, width, height)) {
                this.selectShape(shape);
            }
            else {
                this.deselectShape(shape);
            }
        });
    }

    /**
     * 
     */
    public get selectedShapes(): Set<AbstractShape> {
        return this._selectedShapes;
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about shape movements                                             */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     * @param deltaX 
     * @param deltaY 
     */
    public moveSelectedShapes(deltaX: number, deltaY: number) {

        this._selectedShapes.forEach(shape => {
            shape.translateBy(deltaX, deltaY);
        })
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about shape resize ops                                            */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     * @param deltaX 
     * @param deltaY 
     */
    public resizeSelectedShapes(mode: string, deltaX: number, deltaY: number) {

        this._selectedShapes.forEach(shape => {

            switch (mode) {
                case 'n':
                    shape.translateBy(0, deltaY);
                    shape.resizeBy(0, -deltaY);
                    break;

                case 'ne':
                    shape.translateBy(0, deltaY);
                    shape.resizeBy(deltaX, -deltaY);
                    break;

                case 'e':
                    shape.resizeBy(deltaX, 0);
                    break;

                case 'se':
                    shape.resizeBy(deltaX, deltaY);
                    break;

                case 's':
                    shape.resizeBy(0, deltaY);
                    break;

                case 'sw':
                    shape.translateBy(deltaX, 0);
                    shape.resizeBy(-deltaX, deltaY);
                    break;

                case 'w':
                    shape.translateBy(deltaX, 0);
                    shape.resizeBy(-deltaX, 0);
                    break;

                case 'nw':
                    shape.translateBy(deltaX, deltaY);
                    shape.resizeBy(-deltaX, -deltaY);
                    break;
            }
        })
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about zordering                                                   */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     * @param zorder 
     */
    public changeSelectedShapesZOrder(zorder: EZOrderMode) {

        this._selectedShapes.forEach(shape => {
            switch (zorder) {
                case EZOrderMode.background:
                    shape.changeZOrderBackground();
                    break;

                case EZOrderMode.back:
                    shape.changeZOrderBack();
                    break;

                case EZOrderMode.fore:
                    shape.changeZOrderFore();
                    break;

                case EZOrderMode.foreground:
                    shape.changeZOrderForeground();
                    break;
            }

        })
    }
}
