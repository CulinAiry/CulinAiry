import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { getUserRecipes, saveUserRecipe, deleteUserRecipe, Recipe } from '../db/firebaseRecipes';
import { UserState } from "../reducers/userSlice";
import Markdown from 'markdown-to-jsx';

export default function SavedRecipes() {
  const loggedIn = useSelector((state: { user: UserState }) => state.user.loggedIn);
  const user = useSelector((state: { user: UserState }) => state.user.user);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

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

  const filteredRecipes = recipes
    .filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.recipe.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((recipe) => !showFavorites || recipe.favorite);

  return (
    <div className="text-center">
      {loggedIn !== undefined && loggedIn && (
        <div id="saved">
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-400 rounded py-2 px-3 mr-2 leading-tight focus:outline-none"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className={`${showFavorites ? 'bg-yellow-500' : 'bg-gray-500'
                } hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded`}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              {showFavorites ? 'Show All' : 'Show Favorites'}
            </button>
          </div>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.name}
                id="markdown"
                className="text-left flex justify-between items-start"
              >
                <div>
                  <button
                    className={`fa fa-star text-[2em]`}
                    style={{
                      color: recipe.favorite ? '#eed21b' : 'rgb(214 211 209 / var(--tw-text-opacity))'
                    }}
                    onClick={() => toggleFavorite(recipe)}
                  />
                  <Markdown>{recipe.recipe}</Markdown>
                </div>
                <button
                  className={'fa-solid fa-trash-can text-[2em] text-stone-900'}
                onClick={() => deleteRecipe(recipe)}
                    />
              </div>
            ))
          ) : (
            <div id="markdown">
              <Markdown>There are no saved recipes to display.</Markdown>
            </div>
          )}
        </div>
      )}
      {loggedIn !== undefined && !loggedIn && (
        <div id="markdown">
          <Markdown>## Log in to save recipes!</Markdown>
        </div>
      )}
    </div>
  );
}