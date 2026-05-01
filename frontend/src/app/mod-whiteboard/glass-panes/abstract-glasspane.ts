/**
 * Die Basis aller Glasspanes.
 * 
 * Glasspanes werden verwendet, um die EventVerarbeitung wärend 
 * der verschiedenen Drag-Operationen (resize, drawLine, ....)
 * an jeweils einer Stelle zu konsolidieren.
 * 
 * Eigentlich würde ein SVGRectElement reichen, welches einfach über 
 * das komplette SVGRoot gespannt wird. Dummerweise unterstützen
 * SVGElemente kein Doppelklick-Event. Wir verwenden also ein
 * SVGForeignObject-Element welches ein HTMLDivElement hosted. An
 * dieses DIV-Element werden alle EventHandler gebunden.
 * 
 */
export class AbstractGlassPane {

    protected static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    public readonly glassPaneHost: SVGForeignObjectElement;


    /**
     * 
     */
    constructor(private svgRoot: SVGSVGElement) {

        const glassPaneElem = document.createElement('div');
        glassPaneElem.style.position = 'absolute';
        glassPaneElem.style.top = '0';
        glassPaneElem.style.left = '0';
        glassPaneElem.style.width = '100%';
        glassPaneElem.style.height = '100%';
        glassPaneElem.style.backgroundColor = 'transparent';
        glassPaneElem.style.cursor = 'crosshair';
        
        glassPaneElem.addEventListener('mousemove', (evt) => {
            evt.stopPropagation();
            this.onMouseMove(evt);
        })

        glassPaneElem.addEventListener('mouseenter', (evt) => {
            evt.stopPropagation();
            this.onMouseEnter(evt);
        })

        glassPaneElem.addEventListener('mouseleave', (evt) => {
            evt.stopPropagation();
            this.onMouseLeave(evt);
        })

        glassPaneElem.addEventListener('mousedown', (evt) => {
            evt.stopPropagation();
            this.onMouseDown(evt);
        })

        glassPaneElem.addEventListener('mouseup', (evt) => {
            evt.stopPropagation();
            this.onMouseUp(evt);
        })

        glassPaneElem.addEventListener('click', (evt) => {
            evt.stopPropagation();
            this.onClick(evt);
        })
        
        glassPaneElem.addEventListener('dblclick', (evt) => {
            evt.stopPropagation();
            this.onDoubleClick(evt);
        })

        this.glassPaneHost = document.createElementNS(AbstractGlassPane.SVG_NAMESPACE, 'foreignObject') as SVGForeignObjectElement;
        this.glassPaneHost.setAttribute('x', '0');
        this.glassPaneHost.setAttribute('y', '0');
        this.glassPaneHost.setAttribute('width', '100%');
        this.glassPaneHost.setAttribute('height', '100%');
        this.glassPaneHost.appendChild(glassPaneElem);

        this.svgRoot.appendChild(this.glassPaneHost);

    }

    public get hintText(): string | undefined {
        return undefined;
    }

    /**
     * Entferne die GlassPane
     */
    protected dismiss() {
        console.log('dismiss');
        this.glassPaneHost.remove();
    }

    /**
     * Default-Impl für mouseEnter
     * @param evt 
     */
    protected onMouseEnter(evt: MouseEvent) { }

    /**
     * Default-Impl für mouseMove
     * @param evt 
     */
    protected onMouseMove(evt: MouseEvent) { }

    /**
     * Default-Impl für mouseLeave
     * @param evt 
     */
    protected onMouseLeave(evt: MouseEvent) { }

    /**
     * Default-Impl für mouseDown
     * @param evt 
     */
    protected onMouseDown(evt: MouseEvent) { }

    /**
     * Default-Impl für mouseUp
     * @param evt 
     */
    protected onMouseUp(evt: MouseEvent) { }

    /**
     * Default-Impl für click()
     * @param evt 
     */
    protected onClick(evt: MouseEvent) { }

    /**
     * Default-Impl für click()
     * @param evt 
     */
    protected onDoubleClick(evt: MouseEvent) { }
}
