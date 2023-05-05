import { createSlice } from '@reduxjs/toolkit';

interface Recipe {
  title: string;
  recipe: string;
}
interface RecipeState {
  currentRecipe: Recipe;
}
const initialState: RecipeState = {
  currentRecipe: {
    title: '',
    recipe: '',
  },
};

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setCurrent: (state, action) => {
      state.currentRecipe = action.payload;
    },
  },
});

export const { setCurrent } = recipeSlice.actions;

export default recipeSlice.reducer;
