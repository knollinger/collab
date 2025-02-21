import { Pipe, PipeTransform } from '@angular/core';

/**
 * Eine Pipe, welche einen numerischen Wert in eine menschenlesbare
 * Form für Dateigrößen überführt.
 * 
 * Statt 1024 Bytes wird also '1 KB' ausgespuckt, statt 1258291,2 Bytes
 * wird 1.30 MB ausgespuckt.
 * 
 * Die maximale Einheit sind Exabytes. Wenn die Länge größer wird, so
 * wird eine weitere down-skalierung abgebrochen, dann kommen halt 
 * 2978 EB zurück :-)
 * 
 * Und ein bisserl wird hin und her gerundet, das liegt in der 
 * Verantwortung von Intl.NumberFormat
 */
@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  private units: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'EB'];
  private format = new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    useGrouping: true,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  /**
   *
   * @param value
   * @returns
   */
  transform(value: number): string {

    let idx = 0;
    while (value > 1024 && idx < this.units.length) {

      value /= 1024;
      idx++;
    }
    return this.format.format(value) + ' ' + this.units[idx];
  }
}
