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
    public readonly glassPaneElem: HTMLDivElement;


    /**
     * 
     */
    constructor(private svgRoot: SVGSVGElement) {

        this.glassPaneElem = document.createElement('div');
        this.glassPaneElem.style.position = 'absolute';
        this.glassPaneElem.style.top = '0';
        this.glassPaneElem.style.left = '0';
        this.glassPaneElem.style.width = '100%';
        this.glassPaneElem.style.height = '100%';
        this.glassPaneElem.style.backgroundColor = 'transparent';
        this.glassPaneElem.style.cursor = 'crosshair';
        
        this.glassPaneElem.addEventListener('mousemove', (evt) => {
            evt.stopPropagation();
            this.onMouseMove(evt);
        })

        this.glassPaneElem.addEventListener('mouseenter', (evt) => {
            evt.stopPropagation();
            this.onMouseEnter(evt);
        })

        this.glassPaneElem.addEventListener('mouseleave', (evt) => {
            evt.stopPropagation();
            this.onMouseLeave(evt);
        })

        this.glassPaneElem.addEventListener('mousedown', (evt) => {
            evt.stopPropagation();
            this.onMouseDown(evt);
        })

        this.glassPaneElem.addEventListener('mouseup', (evt) => {
            evt.stopPropagation();
            this.onMouseUp(evt);
        })

        this.glassPaneElem.addEventListener('click', (evt) => {
            evt.stopPropagation();
            this.onClick(evt);
        })
        
        this.glassPaneElem.addEventListener('dblclick', (evt) => {
            evt.stopPropagation();
            this.onDoubleClick(evt);
        })

        this.glassPaneHost = document.createElementNS(AbstractGlassPane.SVG_NAMESPACE, 'foreignObject') as SVGForeignObjectElement;
        this.glassPaneHost.setAttribute('x', '0');
        this.glassPaneHost.setAttribute('y', '0');
        this.glassPaneHost.setAttribute('width', '100%');
        this.glassPaneHost.setAttribute('height', '100%');
        this.glassPaneHost.appendChild(this.glassPaneElem);

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
