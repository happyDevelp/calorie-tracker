import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {CommonModule} from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
} from '@ionic/angular/standalone';
import {selectAllMeals} from '../state/meals.selectors';
import {MealActions} from '../state/meals.actions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, // Required for the 'async' pipe
    IonHeader, IonToolbar, IonTitle, IonContent,
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
