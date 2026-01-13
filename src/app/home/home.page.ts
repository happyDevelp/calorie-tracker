import {CommonModule} from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonNote, IonFab, IonFabButton, IonIcon, AlertController, IonItemSliding, IonItemOptions,
  IonItemOption, IonButton, Platform
} from '@ionic/angular/standalone';
import {Component, inject, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {selectAllMeals} from "../state/meals.selectors";
import {MealActions} from "../state/meals.actions";
import {addIcons} from "ionicons";
import {add, alertCircleOutline, trash} from "ionicons/icons";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, // This unlocks *ngFor and | async
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
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonButton
  ],
})

export class HomePage implements OnInit {

  private store = inject(Store);
  meals$ = this.store.select(selectAllMeals);

  // Inject a window controller
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private platform = inject(Platform);
  isDesktop = false;


  constructor() {
    addIcons({add, alertCircleOutline, trash});

    // 2. Determine if this is a desktop browser
    // This function returns true if it's Windows, macOS, or Linux.
    // It will return false if it's a mobile browser or a native app
    this.isDesktop = this.platform.is('desktop');
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
    const alert = await this.alertController.create({
      header: "Add Meal",
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: "F.e. Pizza...",
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
          // HANDLER: This is a callback function
          handler: (data) => { // 'data' is an object automatically created by Ionic from inputs.
            // It looks like: { title: "Pizza", calories: "500" } (based on 'name' fields above)

            console.log("data param from handler: ", data);

            // VALIDATION: check whether the fields are not empty
            if (!data.title || !data.calories) {
              this.showErrorToast('Please fill in all fields!');
              return false;
            }
            this.store.dispatch(MealActions.addMeal({
              meal: {
                id: Date.now().toString(),
                title: data.title,
                calories: Number(data.calories),
                date: new Date().toISOString()
              }
            }));
            return true;
          }
        }
      ]
    })
    await alert.present();
  }


  async deleteMeal(mealId: string) {
    this.store.dispatch(MealActions.deleteMeal({id: mealId}))
  }


  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      color: "danger",
      position: "bottom",
      icon: "alert-circle-outline"
    });
    await toast.present();
  }
}
