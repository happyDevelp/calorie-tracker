import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {StorageService} from "../services/storage";
import {Store} from "@ngrx/store";
import {MealActions} from "../state/meals.actions";
import {switchMap, tap, withLatestFrom} from "rxjs";
import {selectAllMeals} from "../state/meals.selectors";

@Injectable()
export class MealEffects {
  private actions$ = inject(Actions);
  private storageService = inject(StorageService);
  private store = inject(Store);

  loadMeals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MealActions.loadMeals),
      switchMap(() =>
        this.storageService.getMeals().then(
          (meals) => MealActions.loadMealsSuccess({ meals }),
          (error ) => MealActions.loadMealsFailure({ error })
        )
      )
    )
  )

  persistMeals$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MealActions.addMeal, MealActions.deleteMeal),
        withLatestFrom(this.store.select(selectAllMeals)),
        tap(([action, meals]) => {
          console.log('Saving it in the phones memory:', meals); // Для перевірки в консолі
          this.storageService.saveMeals(meals);
        })
      ),
    { dispatch: false } // Важливо: цей ефект не повертає новий Action
  );
}
