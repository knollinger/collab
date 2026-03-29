export interface IShapeRect {
    x: number,
    y: number,
    w: number,
    h: number,
}

export interface IShapeBorder {
    color: string,
    width: number,
    style: string
}

export interface IFillEffect {
    type: string
}

export interface IColorFill extends IFillEffect {
    color: string;
}

export interface IGradientFill extends IFillEffect {
    color1: string,
    color2: string
}

export interface IImageFill extends IFillEffect {
    uuid: string
}

export interface IShapeDesc {
    type: string,
    rect: IShapeRect,
    border: IShapeBorder
    fill: IColorFill | IGradientFill | IImageFill,
}
