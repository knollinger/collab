import { INodeService } from "../../mod-files/services/inode.service";
import { WhiteboardModel } from "../models/whiteboard-model";
import { AbstractFillEffect, IFillEffectJSON } from "./abstract-fill-effect";

export interface IImageFillEffectJSON extends IFillEffectJSON {
    uuid: string
}

export class ImageFillEffect extends AbstractFillEffect {

    constructor(typeName: string, private imgUUID: string, imgUrl: string) {

        super(typeName, ImageFillEffect.createElement(imgUrl));
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

        const val = width.toString();
        this.imgElem.setAttribute('width', val);
        this.patternElem.setAttribute('width', val);
    }

    public set height(height: number) {

        const val = height.toString();
        this.imgElem.setAttribute('height', val);
        this.patternElem.setAttribute('height', val);
    }

    private get imgElem(): SVGElement {
        const pattern = this.patternElem; 
        return pattern.getElementsByTagName('image').item(0)!;
    }

    private get patternElem(): SVGElement {
        return this.effectElem;
    }

    public toJSON(): IImageFillEffectJSON {
        return {
            id: this.id,
            type: this.typeName,
            uuid: this.imgUUID
        }
    }

    public static fromJSON(json: IImageFillEffectJSON, urlResolver: INodeService): ImageFillEffect {
        const uuid = json.uuid;
        const url = urlResolver.getContentUrl(uuid);
        return new ImageFillEffect(json.type, uuid, url);
    }
}