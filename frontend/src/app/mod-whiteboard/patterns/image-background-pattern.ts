import { AbstractPattern } from "./abstract-pattern";

/**
 * 
 */
export class ImageBackgroundPattern extends AbstractPattern {

    private image: SVGImageElement;
    private pattern: SVGPatternElement;

    /**
     * 
     * @param uuid 
     */
    constructor(patternId: string, url: string) {

        super(patternId);

        this.image = document.createElementNS(AbstractPattern.SVG_NAMESPACE, 'image') as SVGImageElement;
        this.image.setAttribute('href', url);
        this.image.setAttribute('xlink:href', url); // just for compatibility with older browsers
        this.image.setAttribute('x', '0');
        this.image.setAttribute('y', '0');
        this.image.setAttribute('preserveAspectRatio', 'xMidYMid slice');

        this.pattern = document.createElementNS(AbstractPattern.SVG_NAMESPACE, 'pattern') as SVGPatternElement;
        this.pattern.setAttribute('id', patternId);
        this.pattern.setAttribute('x', '0');
        this.pattern.setAttribute('y', '0');
        this.pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        this.pattern.appendChild(this.image);
    }

    /**
     * 
     */
    public set height(h: number) {

        this.image.setAttribute('height', h.toString());
        this.pattern.setAttribute('height', h.toString());
    }

    /**
     * 
     */
    public set width(w: number) {

        this.image.setAttribute('width', w.toString());
        this.pattern.setAttribute('width', w.toString());
    }

    /**
     * 
     */
    public get patternElement(): SVGPatternElement {
        return this.pattern;
    }
}
