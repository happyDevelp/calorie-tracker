import {CommonModule} from '@angular/common'; // Обов'язково додай цей імпорт зверху
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonNote, IonFab, IonFabButton, IonIcon, AlertController
} from '@ionic/angular/standalone';
import {Component, inject, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {selectAllMeals} from "../state/meals.selectors";
import {MealActions} from "../state/meals.actions";
import {add} from "ionicons/icons";
import {addIcons} from "ionicons";

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
    IonNote,
    IonFab,
    IonFabButton,
    IonIcon
  ],
})

export class HomePage implements OnInit {

  private store = inject(Store);
  meals$ = this.store.select(selectAllMeals);

  // Inject a window controller
  private alertCtrl = inject(AlertController);

  constructor() {
    addIcons({add})
  }

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

  async addNewMeal() {
    const alert = await this.alertCtrl.create({
      header: "Add Meal",
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: "Pizza"
        },
        {
          name: "calories",
          type: "number",
          placeholder: "calories"
        }
      ],
        buttons: [
      {
        text: "Cancel",
        role: "cancel",
      },
          {
            text: "Add",
            handler: (data) => {
              this.store.dispatch(MealActions.addMeal({
                meal: {
                  id: Date.now().toString(),
                  title: data.title,
                  calories: Number(data.calories),
                  date: new Date().toISOString()
                }
              }));
            }
          }

      ]
    })
    await alert.present();
  }
}
