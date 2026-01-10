import {createFeatureSelector, createSelector} from "@ngrx/store";
import {MealsState} from "./meals.reducer";

export const selectMealState = createFeatureSelector<MealsState>('meals');

export const selectAllMeals = createSelector(
  selectMealState,
  (state: MealsState) => state.meals
);
