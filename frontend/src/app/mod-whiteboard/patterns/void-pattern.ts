import { AbstractPattern } from "./abstract-pattern";

export class VoidPattern extends AbstractPattern {

    private pattern: SVGPatternElement;

    constructor(patternId: string) {
        super(patternId);
        this.pattern = document.createElementNS(AbstractPattern.SVG_NAMESPACE, 'pattern') as SVGPatternElement;
    }

    public set width(width: number) {
    }

    public set height(height: number) {
    }

    public get patternElement(): SVGPatternElement {
        return this.pattern;
    }

}