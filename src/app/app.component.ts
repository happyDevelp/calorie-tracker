import {Component, inject} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {Store} from "@ngrx/store";
import {MealActions} from "./state/meals.actions";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private store = inject(Store);

  constructor() {
    this.store.dispatch(MealActions.loadMeals());
  }
}
