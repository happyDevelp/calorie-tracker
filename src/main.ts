import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// NgRx imports
import { provideStore } from '@ngrx/store';
import { mealsReducer } from './app/state/meals.reducer';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {importProvidersFrom} from "@angular/core";
import {IonicStorageModule} from "@ionic/storage-angular";
import {Drivers} from "@ionic/storage";
import {MealEffects} from "./app/store/meal.effects";

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Initialize NgRx Store with our meals reducer
    provideStore({ meals: mealsReducer }),
    provideEffects([MealEffects]),
    // add Storage settings
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: 'calorie_tracker_db',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
      })
    )
  ],
});
