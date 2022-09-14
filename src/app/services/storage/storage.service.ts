import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) { }

  // Store the value
  async store(storageKey: string, value: any) {
    await this.storage.set(storageKey, value);
  }

  // Get the value
  async get(storageKey: string) {
    const ret = await this.storage.get(storageKey);
    return ret;
  }

  async removeStorageItem(storageKey: string) {
    await this.storage.remove(storageKey);
  }

  // Clear storage
  async clear() {
    await this.storage.clear();
  }
}