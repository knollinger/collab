import { WhiteboardDocument } from "../models/whiteboard-document";
import { AbstractFillEffect } from "./abstract-fill-effect";

export class ImageFillEffect extends AbstractFillEffect {

    private image: SVGImageElement | undefined;
    private pattern: SVGPatternElement | undefined;

    constructor(model: WhiteboardDocument, imgUrl: string) {

        super(model, ImageFillEffect.createElement(imgUrl));
    }

    private static createElement(imgUrl: string): SVGElement {

        const image = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'image') as SVGImageElement;
        image.setAttribute('href', imgUrl);
        image.setAttribute('x', '0');
        image.setAttribute('y', '0');
        image.setAttribute('preserveAspectRatio', 'xMidYMid slice');

        const pattern = document.createElementNS(AbstractFillEffect.SVG_NAMESPACE, 'pattern') as SVGPatternElement;
        pattern.setAttribute('x', '0');
        pattern.setAttribute('y', '0');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        pattern.appendChild(image);
        return pattern;
    }

    public set width(width: number) {
        this.imgElem.setAttribute('width', width.toString());
        this.patternElem.setAttribute('width', width.toString());
    }

    public set height(height: number) {

        this.imgElem.setAttribute('height', height.toString());
        this.patternElem.setAttribute('height', height.toString());
    }

    private get imgElem(): SVGElement {
        const pattern = this.patternElem; 
        return pattern.getElementsByTagName('image').item(0)!;
    }

    private get patternElem(): SVGElement {
        return this.effectElem;
    }
}