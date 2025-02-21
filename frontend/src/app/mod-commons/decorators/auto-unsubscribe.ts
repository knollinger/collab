/**
 * Kann als Class-Decorators zu einer Klasse hinzu gefügt 
 * werden. Die Klasse sollte dabei das Interface OnDestroy
 * implementieren.
 * 
 * Beim Aufruf von OnDestroy grätscht jetzt der Decorator
 * dazwischen und checkt alle Properties des Objektes.
 * Sollte ein oder mehrere Properties die methode ngOnDestroy
 * besitzen, so wird diese gerufen.
 * 
 * Im Anschluss wird die Orginal-Implementierung von 
 * ngOnDestroy aufgerufen.
 * 
 * @param target 
 * @param context 
 */
export function AutoUnSubscribe(target: any) {

    const original = target.prototype.ngOnDestroy;
    target.prototype.ngOnDestroy = function () {
        
        for (const prop in this) {

            const property = this[prop];
            if (property && typeof property.unsubscribe === 'function') {
                property.unsubscribe();
            }
        }
        original?.apply(this, arguments);
    };
}