import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getUserRecipes,
  saveUserRecipe,
  deleteUserRecipe,
  Recipe,
} from "../db/firebaseRecipes";
import { UserState } from "../reducers/userSlice";
import Markdown from "markdown-to-jsx";
import { marked } from "marked";

export default function SavedRecipes() {
  const loggedIn = useSelector(
    (state: { user: UserState }) => state.user.loggedIn
  );
  const user = useSelector((state: { user: UserState }) => state.user.user);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getUserRecipes(user.uid)
      .then((res) => {
        setRecipes(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [user.uid]);

  const toggleFavorite = async (recipe: Recipe) => {
    const updatedRecipe = { ...recipe, favorite: !recipe.favorite };
    await saveUserRecipe(user.uid, updatedRecipe);
    setRecipes((prevRecipes) =>
      prevRecipes.map((r) => (r.name === recipe.name ? updatedRecipe : r))
    );
  };

  const deleteRecipe = async (recipe: Recipe) => {
    await deleteUserRecipe(user.uid, recipe.name);
    setRecipes((prevRecipes) =>
      prevRecipes.filter((r) => r.name !== recipe.name)
    );
  };

  const filteredRecipes = recipes
    .filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.recipe.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((recipe) => !showFavorites || recipe.favorite);

  const printRecipe = (recipe: Recipe) => {
    const html = marked(recipe.recipe);
    const printWindow = window.open("", "Print Recipe", "height=600,width=800");
    if (typeof printWindow?.document !== "undefined") {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              h1, h2, h3, h4, h5, h6 {
                margin-top: 0;
              }
              img {
                max-width: 100%;
              }
            </style>
          </head>
          <body>
            <h1>${recipe.name}</h1>
            ${html}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else if (typeof document !== "undefined") {
      const link = document.createElement("a");
      link.href = `data:text/html;charset=UTF-8,${html}`;
      link.download = `${recipe.name}.html`;
      link.click();
    }
  };

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
              className={`${
                showFavorites ? "bg-yellow-500" : "bg-gray-500"
              } hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded`}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              {showFavorites ? "Show All" : "Show Favorites"}
            </button>
          </div>
          {loading ? (
            <div className="text-4xl text-gray-500">
              <i className="fas fa-gear fa-spin text-[2em] text-[#5259ad]"></i>
            </div>
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.name}
                id="markdown"
                className="flex flex-col items-center"
              >
                <div
                  id="topbar"
                  className="flex justify-between items-center w-full"
                >
                  <div id="star">
                    <button
                      className={`fa fa-star text-[2em]`}
                      style={{
                        color: recipe.favorite
                          ? "#eed21b"
                          : "rgb(214 211 209 / var(--tw-text-opacity))",
                      }}
                      onClick={() => toggleFavorite(recipe)}
                    />
                  </div>
                  <div id="buttons" className="flex justify-end">
                    <button
                      className={"fa fa-print text-[2em] text-stone-900 mr-5"}
                      onClick={() => printRecipe(recipe)}
                    />
                    <button
                      className={
                        "fa-solid fa-trash-can text-[2em] text-[#C96C45]"
                      }
                      onClick={() => deleteRecipe(recipe)}
                    />
                  </div>
                </div>
                <div className="text-left w-full">
                  <Markdown>{recipe.recipe}</Markdown>
                </div>
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
