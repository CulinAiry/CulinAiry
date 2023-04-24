import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getUserRecipes, saveUserRecipe, deleteUserRecipe } from '../db/firebaseRecipes';
import { UserState } from "../reducers/userSlice";
import Markdown from 'markdown-to-jsx';
type Recipe = {
  name: string;
  favorite: boolean;
  recipe: string;
};
export default function SavedRecipes() {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state: { user: UserState }) => state.user.loggedIn);
  const user = useSelector((state: { user: UserState }) => state.user.user);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getUserRecipes(user.uid).then((res) => {
      setRecipes(res);
    });
  }, [user.uid]);

  const toggleFavorite = async (recipe: Recipe) => {
    const updatedRecipe = { ...recipe, favorite: !recipe.favorite };
    await saveUserRecipe(user.uid, updatedRecipe);
    setRecipes((prevRecipes) => prevRecipes.map((r) => (r.name === recipe.name ? updatedRecipe : r)));
  };

  const deleteRecipe = async (recipe: Recipe) => {
    await deleteUserRecipe(user.uid, recipe.name);
    setRecipes((prevRecipes) => prevRecipes.filter((r) => r.name !== recipe.name));
  };

  return (
    <div className="text-center">
      {loggedIn !== undefined && loggedIn && (
        <div id="saved">
          {recipes.length > 0 &&
            recipes.map((recipe) => (
              <div key={recipe.name} id="markdown" className="text-left flex justify-between items-start">
                <div>
                  <button
                    className={`fa fa-star text-[2em]`}
                    style={{ color: recipe.favorite ? '#eed21b' : 'rgb(214 211 209 / var(--tw-text-opacity))' }}
                    onClick={() => toggleFavorite(recipe)}
                  />
                  <h1 className="mt-1">{recipe.name}</h1>
                  <Markdown>
                    {recipe.recipe}
                  </Markdown>
                </div>
                <button
                  className={`fa-solid fa-trash-can text-[2em] text-stone-900`}
                  onClick={() => deleteRecipe(recipe)}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}