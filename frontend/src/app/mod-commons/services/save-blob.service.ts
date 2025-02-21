import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveBlobService {

  constructor() {

  }

  /**
   * 
   * @param blob 
   * @param name 
   */
  public saveBlob(blob: Blob, name: string) {

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    link.download = name;
    link.setAttribute('download', name);
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}
