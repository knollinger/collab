import { AbstractFillEffect } from "./abstract-fill-effect";
import { GradientLeftRightFillEffect } from "./gradient-left-right-fill-effect";

/**
 * 
 */
export class ColorFillEffect extends GradientLeftRightFillEffect {


    constructor(svgRoot: SVGSVGElement, color: string) {

        super(svgRoot, color, color);
    }
}