import {CommonModule} from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonNote, IonFab, IonFabButton, IonIcon, AlertController, IonItemSliding, IonItemOptions,
  IonItemOption, IonButton, Platform, IonProgressBar
} from '@ionic/angular/standalone';
import {Component, inject, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {selectAllMeals} from "../state/meals.selectors";
import {MealActions} from "../state/meals.actions";
import {addIcons} from "ionicons";
import {add, alertCircleOutline, checkmarkCircleOutline, sparkles, trash} from "ionicons/icons";
import {ToastController} from "@ionic/angular";
import {GeminiService} from "../services/gemini.service";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

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
    IonButton,
    IonProgressBar
  ],
})

export class HomePage /*implements OnInit*/ {

  private store = inject(Store);
  meals$ = this.store.select(selectAllMeals);

  isLoading = false;
  private aiService = inject(GeminiService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private platform = inject(Platform);
  isDesktop = false;


  constructor() {
    addIcons({add, alertCircleOutline, checkmarkCircleOutline, trash, sparkles});

    // It will return false if it's a mobile browser or a native app
    this.isDesktop = this.platform.is('desktop');
  }


  // This is a method that is automatically called by Angular once when the component appears on the screen
  /*  ngOnInit() {
      this.store.dispatch(MealActions.addMeal({
        meal: {
          id: Date.now().toString(),
          title: 'Test Apple',
          calories: 95,
          date: new Date().toISOString()
        }
      }));
    }*/

  async scanMeal() {
    try {
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
      });


      if (image.base64String) {
        this.isLoading = true;
        /*
        const loading = await this.loadingController.create({
          message: 'Analyzing food... 🍔'
        });
        await loading.present();*/

        try {
          // trying to recognize a picture
          const result = await this.aiService.analyzeImage(image.base64String);

          // If successful - open the window
          await this.openAddModal(result.title, result.calories);
        } catch (e) {
          console.error(e);
          await this.showToast('AI Error: ' + e, 'danger', 'alert-circle-outline');
        } finally {
          this.isLoading = false;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async openAddModal(prefilledTitle: string = '', prefilledCalories: number | string = '') {
    const alert = await this.alertController.create({
      header: "Add Meal",
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: "F.e. Pizza...",
          value: prefilledTitle
        },
        {
          name: "calories",
          type: "number",
          placeholder: "calories",
          value: prefilledCalories
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
              this.showToast('Please fill in all fields!', 'danger', 'alert-circle-outline');
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
    const alert = await this.alertController.create({
      header: "Delete Meal",
      message: `Are you sure you want to delete Meal?`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary"
        },
        {
          role: "destructive",
          text: "Yes, Delete",
          handler: () => {
            this.store.dispatch(MealActions.deleteMeal({id: mealId}))

            this.showToast(
              'Successfully deleted',
              'success',
              'checkmark-circle-outline'
            )
          }
        }
      ]
    })
    await alert.present();

  }


  async showToast(message: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      color: color,
      position: "bottom",
      icon: icon
    });
    await toast.present();
  }
}
