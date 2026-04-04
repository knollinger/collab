import { WhiteboardDocument } from "../models/whiteboard-document";
import { AbstractFillEffect } from "./abstract-fill-effect";
import { GradientLeftRightFillEffect } from "./gradient-left-right-fill-effect";

/**
 * 
 */
export class ColorFillEffect extends GradientLeftRightFillEffect {


    constructor(model: WhiteboardDocument, color: string) {

        super(model, color, color);
    }
}