import Quill from "quill";

/**
 * Das Options-Objekt für das Quill-Modul.
 * 
 * Wir benötigen lediglich ein Array von CSS-Klassen.
 */
export interface IQuillAddClassModuleOptions {
    classes: string[]
}

/**
 * Quill-Modul, welches eine oder mehrere CSS-Klassen
 * an den eigentlichen QuillEditor anfügt.
 */
export class QuillAddClassModule {

    /**
     * Der Konstruktor nimmt die nötigen Anpassungen am Editor vor.
     * 
     * @param quill Der zu customizende Editor
     * @param options Die Options
     */
    constructor(quill: Quill, options: IQuillAddClassModuleOptions) {

        if (options && options.classes && options.classes.length > 0) {

            const editors = quill.container.getElementsByClassName('ql-editor');
            if (editors && editors.length > 0) {

                for (let i = 0; i < editors.length; ++i) {

                    const editor = editors.item(i);
                    if (editor) {

                        options.classes.forEach(clazz => {
                            editor.className = this.addClass(editor.className, clazz);
                        })
                    }
                }
            }
        }
    }

    /**
     * Füge eine CSS-Klasse an die angegebene ClassList hinzu sofern sie
     * noch nicht enthalten ist.
     * 
     * @param classList 
     * @param clazz 
     * @returns die ggf. modifizierte ClassList
     */
    private addClass(classList: string, clazz: string): string {

        const search = ` ${clazz}`;
        if (classList.length === 0 || !classList.includes(search)) {
            classList += search;
        }
        return classList;
    }
}

/**
 * Registriere das Modul unter dem Namen '**modules/addClasses**'
 */
Quill.register('modules/addClasses', QuillAddClassModule);
