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

export interface IShapeFill {
        color: string,
}

export interface IShapeDesc {
    uuid: string,
    type: string,
    rect: IShapeRect,
    fill: IShapeFill,
    border: IShapeBorder
}

export class ShapeDesc {

    constructor(
        public readonly uuid: string,
        public readonly type: string,
        public readonly shapeRect: IShapeRect,
        public readonly shapeFill: IShapeFill,
        public readonly shapeBorder: IShapeBorder) {

    }
}