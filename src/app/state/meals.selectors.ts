import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MealsState } from './meals.reducer';

// 1. Select the entire "meals" feature state from the global store
export const selectMealsState = createFeatureSelector<MealsState>('meals');

// 2. Select the specific "meals" array for our UI components
export const selectAllMeals = createSelector(
);
