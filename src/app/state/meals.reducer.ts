import {Meal} from "../models/meal.model";
import {MealActions} from "./meals.actions";
import {createReducer, on} from '@ngrx/store';

export interface MealsState {
  meals: Meal[];
}

export const initialState: MealsState = {
  meals: [],
}

export const mealsReducer = createReducer(
    initialState,
    on(MealActions.addMeal, (state, {meal}) => ({
      ...state,
      meals: [...state.meals, meal] // Як state.meals + meal у Kotlin
    })),

    on(MealActions.deleteMeal, (state, {id}) => ({
      ...state,
      meals: state.meals.filter(m => m.id !== id)
    }))
);
