import { configureStore } from "@reduxjs/toolkit";
import themeReducer from './reducers/themeSlice';
import userReducer from './reducers/userSlice';
import recipeReducer from './reducers/recipeSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    recipe: recipeReducer,
  },
});

export default store;
