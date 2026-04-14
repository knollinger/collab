import { WhiteboardModel } from "../models/whiteboard-model";
import { IFillEffectJSON } from "./abstract-fill-effect";
import { EGradientFillDirection, GradientFillEffect } from "./gradient-fill-effect";

export interface IColorFillEffectJSON extends IFillEffectJSON {
    color: string
}

/**
 * Der ColorFillEffect setzt eigentlich nur eine Hintergrund-Farbe...eigentlich
 * könnte man am Shape einfach "fill: #myColor" setzen.
 * 
 * FillEffekte werden in den AbstractShapes aber als Referenzen auf Resourcen
 * im "//svg/defs"-Knoten implementiert. Aus diesem Grund wird der ColorFillEffect
 * als GradientFillEffect implementiert. Ist doof....aber was solls.
 */
export class ColorFillEffect extends GradientFillEffect {

    /**
     * 
     * @param typeName 
     * @param model 
     * @param color 
     */
    constructor(typeName: string, model: WhiteboardModel, private color: string) {
        super(typeName, model, 'TopDown', color, color);
    }
}