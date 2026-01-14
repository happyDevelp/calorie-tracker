import {inject, Injectable} from '@angular/core';
import { Storage } from '@ionic/storage-angular'
import {Meal} from "../models/meal.model";

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  private storage = inject(Storage);

  constructor() {
    this.init()
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async getMeals(): Promise<Meal[]> {
    if (!this._storage) await this.init();
    const meals = await this._storage?.get('meals');
    return meals || [];
  }

  async saveMeals(meals: Meal[]) {
    if (!this._storage) await this.init();
    await this._storage?.set('meals', meals);
  }

}
