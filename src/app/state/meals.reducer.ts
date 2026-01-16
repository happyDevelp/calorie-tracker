import {Meal} from "../models/meal.model";
import {MealActions} from "./meals.actions";
import {createReducer, on} from '@ngrx/store';
import {state} from "@angular/animations";

export interface MealsState {
  meals: Meal[];
}

export const initialState: MealsState = {
  meals: [],
}

export const mealsReducer = createReducer(
  // first param of createReducer - initialState
  initialState,

  on(MealActions.loadMealsSuccess, (state, { meals }) => ({
    ...state,
    meals: [...meals]
  })),

  // on - listener for event. f.e.: If the "add meal" event/action comes, then execute the appropriate logic
  on(MealActions.addMeal, (state, {meal}) => ({
    ...state, // Copy all existing state properties
    meals: [...state.meals, meal] // Create a new array with all old meals + the new one
  })),

  on(MealActions.deleteMeal, (state, {id}) => ({
    ...state,
    meals: state.meals.filter(m => m.id !== id)
  }))
);

// NgRx Architecture: reducer
