import { AbstractPattern } from './abstract-pattern';
import { ImageBackgroundPattern } from './image-background-pattern';
import { VoidPattern } from './void-pattern';

/**
 * 
 */
export class PatternManager {

    private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    private defsElement: SVGDefsElement;
    private nextKeyId: number = 0;
    private voidPattern;

    /**
     * Der Konstruktor stellt schon mal sicher, dass im svgRoot ein SVGDefsElement
     * existiert. Er hält dann auch die Referenz auf dieses Element.
     * 
     * Zusätzlich wird ein VoidPattern angelegt, also ein leeres Pattern. Dieses dient
     * in der FactoryMethode als Default.
     * 
     * @param svgRoot 
     * @param inodeSvc 
     */
    constructor(
        private svgRoot: SVGSVGElement) {

        let defs = this.svgRoot.getElementsByTagName('defs').item(0);
        if (!defs) {
            defs = document.createElementNS(PatternManager.SVG_NAMESPACE, 'defs') as SVGDefsElement;
            this.svgRoot.appendChild(defs);
        }
        
        this.defsElement = defs;
        this.voidPattern = new VoidPattern(this.createKey());
        this.defsElement.appendChild(this.voidPattern.patternElement);
    }

    /**
     * 
     * @param patternId 
     * @param args 
     * @returns 
     */
    public createPattern(patternId: string, ...args: any[]): AbstractPattern {

        let result: AbstractPattern;

        switch (patternId) {
            case 'image':
                result = new ImageBackgroundPattern(this.createKey(), args[0]);
                break;

            default:
                result = this.voidPattern;
                break;
        }

        if (result) {
            this.defsElement.appendChild(result.patternElement);
        }
        
        return result;
    }

    /**
     * 
     * @returns 
     */
    private createKey(): string {
        return `pattern_${this.nextKeyId++}`;
    }
}