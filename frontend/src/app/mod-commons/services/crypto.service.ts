import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private textEncoder: TextEncoder = new TextEncoder();
  private crypto: Crypto = window.crypto;
  private cSubtle = window.crypto.subtle;

  constructor() {
  }


  /**
   * 
   * @param password 
   * @returns 
   */
  public async createKeystore(password: string): Promise<Blob> {

    const keyPair = await this.cSubtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-384",
      },
      true, // exportable!
      ["deriveKey"]
    );


    // export keypair components as json web keys and create the keystore object
    const keystore = {
      private: await this.cSubtle.exportKey("jwk", keyPair.privateKey!),
      public: await this.cSubtle.exportKey("jwk", keyPair.publicKey!)
    }

    // encrypt the keystore
    const key = await this.createKeystoreKey(password);
    const ciphertext = await this.cSubtle.encrypt(
      {
        name: "AES-GCM",
        iv: this.crypto.getRandomValues(new Uint8Array(12))
      },
      key,
      this.textEncoder.encode(JSON.stringify(keystore))
    );

    return new Blob([ciphertext], {
      type: 'application/octet-stream'
    });
  }

  /**
   * 
   * @param keystore 
   * @param password 
   * @returns 
   */
  public async openKeystore(keystore: Blob, password: string): Promise<CryptoKeyPair> {

    const encrypted = await this.loadKeystore(keystore);
    const key = await this.createKeystoreKey(password);
    const decrypted = await this.cSubtle.decrypt({
      name: 'AES-CGM',
      iv: this.crypto.getRandomValues(new Uint8Array(12))
    }, key, encrypted);

    const json = JSON.parse(new TextDecoder().decode(decrypted));
    console.log(JSON.stringify(json));

    return {
      privateKey: await this.cSubtle.importKey("jwk", json.privateKey, '', false, ["deriveKey"]),
      publicKey:  await this.cSubtle.importKey("jwk", json.privateKey, '', false, ["deriveKey"])
    }
  }

  /**
   * 
   * @param keystore 
   * @returns 
   */
  private loadKeystore(keystore: Blob): Promise<Uint8Array> {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          resolve(new Uint8Array(reader.result as ArrayBuffer));
        }
        catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(keystore);
    });
  }

  /**
   * Leite vom angegebenen Password einen AES-GCM-256 Key ab. Diese
   * wird zum verschlüsseln/entschlüsseln des Keystores verwendet.
   * 
   * @param password 
   * @returns 
   */
  private async createKeystoreKey(password: string): Promise<CryptoKey> {

    const keyMaterial = await this.cSubtle.importKey(
      "raw",
      this.textEncoder.encode(password),
      {
        name: "PBKDF2"
      },
      false,
      [
        "deriveBits",
        "deriveKey"]
    );

    const salt = window.crypto.getRandomValues(new Uint8Array(12));
    return this.cSubtle.deriveKey(
      {
        "name": "PBKDF2",
        salt: salt,
        "iterations": 100000,
        "hash": "SHA-256"
      },
      keyMaterial,
      { "name": "AES-GCM", "length": 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }
}