import { v4 as uuidv4} from 'uuid';

export interface IFillEffectJSON {
    id: string,
    type: string
}

/**
 * Der AbstactFillEffect dient der Verwaltung von Elementen,
 * welche in den Shapes via "fill=url(#effectId)" referenziert werden.
 * 
 * Das können Hintergrund-Bilder sein, Gradienten, ....was auch immer.
 * 
 * Konkrete Effekt-Klassen müssen von dieser Basis ableiten und ein
 * konkretes SVGElement am Konstruktor übergeben. Also zum Beispiel
 * ein SVGPatternElemen, ein SVGGradientElement, ...
 * 
 * Das übergebene Element wird in der "defs"-Node des SVGRootElements
 * mit einer neuen eindeutigen ID registriert. Diese ID kann später
 * abgefragt werden um die Referenz innerhalb des ZielShapes herstellen
 * zu können.
 * 
 * Für nicht mehr benötigte FillEffekte sollte die remove()-Methode
 * aufgerufen werden. Diese entfernt jedoch nur die Definition in
 * der Defs-Node und löscht **keine** Referenzen auf das Element!
 * 
 * Abgeleitete Klassen müssen auch die Property-Setter für die Breite
 * und die Höhe überschreiben. Sinn und Zweck des ganzen ist es, die 
 * Darstellung des FillEffects an sich geänderte Dimensionen des
 * referenzierenden Elements anpassen zu können.
 */
export abstract class AbstractFillEffect {

    protected static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    private _id: string;

    /**
     * Der Konstruktor nimmt das EffectElement entgegen, berechnet eine neue ID
     * und registriert das EffectElement im //svg/defs unter der neuen ID
     * 
     * @param svgRoot 
     * @param effectElem 
     */
    constructor(
        protected typeName: string,
        public readonly effectElem: SVGElement) {

        this._id = AbstractFillEffect.calcNextFreeKey();
        effectElem.setAttribute('id', this._id);
    }

    /**
     * 
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Entferne das EffectElement aus der Defs-Section
     */
    public remove() {

        // const defElems = this.model.defsElem.children;

        // for (let i = 0; i < defElems.length; ++i) {

        //     const elem = defElems.item(i);
        //     if (elem?.getAttribute('id') === this._id) {
        //         elem.remove();
        //         break;
        //     }
        // }
    }

    /**
     * berechne die nächte freie ElementId
     */
    private static calcNextFreeKey(): string {
        return `fill_effect_${uuidv4()}`;
    }

    public abstract set width(width: number);
    public abstract set height(height: number);
    public abstract toJSON(): IFillEffectJSON;
}