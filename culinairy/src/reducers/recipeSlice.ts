import { createSlice } from '@reduxjs/toolkit';

interface RecipeState {
  currentRecipe: string;
  savedRecipes: string[];
}
const initialState: RecipeState = {
  currentRecipe: '',
  savedRecipes: [],
};

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setCurrent: (state, action) => {
      state.currentRecipe = action.payload;
    },
    addCurrent: (state, action) => {
      state.savedRecipes.push(action.payload);
    },
  },
});

export const { setCurrent, addCurrent } = recipeSlice.actions;

export default recipeSlice.reducer;
