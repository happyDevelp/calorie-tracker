import { CommonModule } from '@angular/common'; // Обов'язково додай цей імпорт зверху
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonNote
} from '@ionic/angular/standalone';
import {Component, inject, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {selectAllMeals} from "../state/meals.selectors";
import {MealActions} from "../state/meals.actions";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, // Це розблокує *ngFor та | async
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote
  ],
})

export class HomePage implements OnInit {

  private store = inject(Store);
  meals$ = this.store.select(selectAllMeals);


  // This is a method that is automatically called by Angular once when the component appears on the screen
  ngOnInit() {
    this.store.dispatch(MealActions.addMeal({
      meal: {
        id: Date.now().toString(),
        title: 'Test Apple 🍎',
        calories: 95,
        date: new Date().toISOString()
      }
    }));
  }
}
