import { doc, getDocs, setDoc, collection, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export type Recipe = {
  name: string;
  favorite: boolean;
  recipe: string;
};

export const saveUserRecipe = async (userId: string, recipe: Recipe) => {
  try {
    const userRef = doc(db, 'userRecipes', userId);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      await setDoc(userRef, {});
    }
    const recipeRef = doc(db, `userRecipes/${userId}/recipes/${recipe.name}`);
    await setDoc(recipeRef, recipe);
  } catch (error) {
    console.error('Error saving user recipe:', error);
  }
};


export const getUserRecipes = async (userId: string) => {
  try {
    const recipes: Recipe[] = [];
    const recipesRef = collection(db, `userRecipes/${userId}/recipes`);
    const snapshot = await getDocs(recipesRef);
    snapshot.forEach((doc) => {
      recipes.push(doc.data() as Recipe);
    });
    return recipes;
  } catch (error) {
    console.error('Error getting user recipes:', error);
    return [];
  }
};

export const deleteUserRecipe = async (userId: string, recipeName: string) => {
  try {
    const recipeRef = doc(db, `userRecipes/${userId}/recipes`, recipeName);
    await deleteDoc(recipeRef);
  } catch (error) {
    console.error('Error deleting user recipe:', error);
  }
};
