import { AbstractFillEffect, IFillEffectJSON } from "./abstract-fill-effect";

export interface IPatternFillEffectJSON extends IFillEffectJSON {

}

/**
 * 
 */
export class PatternFillEffect extends AbstractFillEffect {

    constructor(typeName: string, private pattern: SVGPatternElement) {

        super(typeName, pattern);
    }

    public set width(width: number) {
        // nothing to do
    }

    public set height(height: number) {
        // nothing to do
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): IPatternFillEffectJSON {

        return {
            id: this.id,
            type: this.typeName
        }
    }

    public clone(): PatternFillEffect {
        return new PatternFillEffect(this.typeName, this.pattern.cloneNode(true) as SVGPatternElement);
    }
}