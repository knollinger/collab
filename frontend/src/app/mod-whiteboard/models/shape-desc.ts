export interface IShapeDesc {
    type: string,
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    stroke: {
        color: string,
        width: number,
        style: string
    }
}