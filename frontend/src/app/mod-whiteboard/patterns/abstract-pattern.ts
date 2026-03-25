export abstract class AbstractPattern {

    protected static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    
    private _width: number = 0;
    private _height: number = 0;

    constructor(public readonly id: string) {

    }

    public abstract set width(width: number);
    public abstract set height(height: number);
    public abstract get patternElement(): SVGPatternElement;
}
