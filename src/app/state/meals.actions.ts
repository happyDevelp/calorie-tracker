import {createActionGroup, props, emptyProps} from "@ngrx/store";
import {Meal} from '../models/meal.model';

export const MealActions = createActionGroup({
  source: 'Meal Page', // Logic: Identifies where the action comes from
  events: {
    'Add Meal': props<{ meal: Meal }>(),
    'Delete Meal': props<{ id: string }>(),
    'Load Meals': emptyProps,
    'Load Meals Success': props<{ meals: Meal[] }>(),
    'Load Meals Failure': props<{ error: any }>(),
  }
})

// NgRx Architecture: actions
