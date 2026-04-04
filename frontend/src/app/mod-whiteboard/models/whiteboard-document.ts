import { AbstractLine } from '../drawables/lines/abstract-line';
import { DirectLine } from '../drawables/lines/direct-line';
import { AbstractShape } from '../drawables/shapes/abstractshape';
import { EllipsisShape } from '../drawables/shapes/ellipsis-shape';
import { RectShape } from '../drawables/shapes/rect-shape';
import { RombusShape } from '../drawables/shapes/rombus-shape';
import { EZOrderMode } from './ezorder-mode';

/**
 * Das Interface, um Operationen auf Shapes ausführen zu können.
 */
export interface ShapeVisitor {
    invoke(document: WhiteboardDocument, shape: AbstractShape): void;
}

/**
 * Beschreibt ein Whiteboard-Dokument und alle Operationen auf diesem.
 * 
 * Die Operationen auf dem Dokument werden auf dem im ctor übergebenen
 * SVGSVG-Element reflektiert. 
 * 
 * Das SVGDokument wird folgendermassen präpariert:
 * * Ein <style> Element, welches CSS-Styles beinhaltet. Dieses kommt aus dem HTML-Template
 * * Ein <defs>-Element, welches als Target für href-referenzierte Resourcen dient
 * * Ein <g id="shapes-group"> Element, welches alle Shapes aufnimmt
 * * Ein <g id="lines-group"> Element, welches alle Linien und Connectoren aufnimmt
 */
export class WhiteboardDocument {

    private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
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

        this._shapesGroup = document.createElementNS(WhiteboardDocument.SVG_NAMESPACE, 'g') as SVGGElement;
        this._shapesGroup.setAttribute('id', 'shapes-group');
        this.svgRoot.appendChild(this._shapesGroup);

        this._linesGroup = document.createElementNS(WhiteboardDocument.SVG_NAMESPACE, 'g') as SVGGElement;
        this._linesGroup.setAttribute('id', 'lines-group');
        this.svgRoot.appendChild(this._linesGroup);
    }

    /**
     * Erzeugt ein leeres Dokument, welches keine Bindung an ein bestehendes
     * SVG-Dokument beinhaltet.
     * 
     * @returns 
     */
    public static empty(): WhiteboardDocument {
        return new WhiteboardDocument(document.createElementNS(WhiteboardDocument.SVG_NAMESPACE, 'svg') as SVGSVGElement);
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
    /* All about grid                                                        */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     */
    get gridSize(): number {

        return Number.parseInt(this._gridLines.getAttribute('width') || '30');
    }

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
     * 
     * 
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

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about shape creation                                              */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     * @param type 
     * @returns 
     */
    public createShape(type: string) {

        let shape: AbstractShape;

        switch (type) {
            case 'rect':
                shape = new RectShape(this);
                break;

            case 'ellipse':
                shape = new EllipsisShape(this);
                break;

            case 'rombus':
                shape = new RombusShape(this);
                break;

            default:
                throw new Error(`unknown shape type '${type}`);
                break;
        }

        shape.width = shape.height = WhiteboardDocument.DEFAULT_SHAPE_SIZE;
        shape.svgElem.addEventListener('click', evt => {
            if (!evt.ctrlKey) {
                this._selectedShapes.clear();
            }
            this._selectedShapes.add(shape);
        })
        this._shapes.push(shape);
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
    public deleteShape(toDelete: AbstractShape) {

        const idx = this._shapes.indexOf(toDelete);
        if (idx !== -1) {
            this._shapes.splice(idx, 1);
            toDelete.delete();
        }
        this._selectedShapes.delete(toDelete);
    }

    /**
     * 
     */
    public deleteSelectedShapes() {

        this._shapes = this._shapes.filter(shape => {

            const result = this._selectedShapes.has(shape);
            if (result) {
                shape.delete();
            }
            return result;
        })
        this._selectedShapes.clear();
    }

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about shape selection                                             */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * 
     * @param shape 
     */
    public selectShape(shape: AbstractShape) {

        if (this._shapes.indexOf(shape) !== -1) {
            shape.setSelected(true);
            this._selectedShapes.add(shape);
        }
    }

    /**
     * 
     * @param shape 
     */
    public deselectShape(shape: AbstractShape) {

        if (this._shapes.indexOf(shape) !== -1) {
            shape.setSelected(false);
            this._selectedShapes.delete(shape);
        }
    }

    /**
     * 
     */
    public selectAll() {

        this._shapes.forEach(shape => {
            shape.setSelected(true);
            this._selectedShapes.add(shape);
        })
    }

    /**
     * 
     */
    public deselectAll() {

        this._selectedShapes.forEach(shape => {
            shape.setSelected(false);
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

        this.deselectAll();
        this._shapes.forEach((shape) => {

            if (shape.isInRect(x, y, width, height)) {
                shape.setSelected(true);
                this._selectedShapes.add(shape);
            }
            console.log('selected: ' + this._selectedShapes.size);
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

    /*-----------------------------------------------------------------------*/
    /*                                                                       */
    /* All about shape operations                                            */
    /*                                                                       */
    /*-----------------------------------------------------------------------*/

    /**
     * Rufe für alle Shapes den angegebenen Visitor auf
     * 
     * @param visitor 
     */
    public forEachShape(visitor: ShapeVisitor) {

        this._shapes.forEach(shape => visitor.invoke(this, shape));
    }

    /**
     * Rufe für alle selectierten Shapes den Visitor auf
     *   
     * @param visitor 
     */
    public forEachSelectedShape(visitor: ShapeVisitor) {

        this._selectedShapes.forEach(shape => visitor.invoke(this, shape));
    }
}
