export default interface RecipeRequest {
  timeToMake?: string;
  mealType?: string;
  cuisine?: string[];
  allergies?: string[];
  dietaryRestrictions?: string[];
  cookingAccessibility?: string[];
}