export class AbstractGlassPane {

    protected static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    protected glassPaneElem: SVGRectElement;

    /**
     * 
     */
    constructor(private svgRoot: SVGSVGElement) {

        this.glassPaneElem = document.createElementNS(AbstractGlassPane.SVG_NAMESPACE, 'rect') as SVGRectElement;
        this.glassPaneElem.setAttribute('x', '0');
        this.glassPaneElem.setAttribute('y', '0');
        this.glassPaneElem.setAttribute('width', '100%');
        this.glassPaneElem.setAttribute('height', '100%');
        this.glassPaneElem.setAttribute('fill', 'transparent');
        this.svgRoot.appendChild(this.glassPaneElem);

        this.glassPaneElem.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.glassPaneElem.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.glassPaneElem.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.glassPaneElem.addEventListener('mouseup', this.onMouseUp.bind(this));

    }

    /**
     * Entferne die GlassPane
     */
    protected dismiss() {
        this.glassPaneElem.remove();
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
     * Default-Impl für mouseUp
     * @param evt 
     */
    protected onMouseUp(evt: MouseEvent) {
        this.dismiss();
    }
}