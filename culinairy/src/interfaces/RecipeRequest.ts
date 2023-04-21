export default interface RecipeRequest {
  timeToMake?: string;
  mealType?: string;
  cuisine?: string[];
  dietaryRestrictions?: string[];
  cookingAccessibility?: string[];
}