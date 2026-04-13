import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractFillEffect } from "./abstract-fill-effect";
import { GradientLeftRightFillEffect } from "./gradient-left-right-fill-effect";

/**
 * 
 */
export class ColorFillEffect extends GradientLeftRightFillEffect {


    constructor(model: WhiteboardModel, color: string) {

        super(model, color, color);
    }
}