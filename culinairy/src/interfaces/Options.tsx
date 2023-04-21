export interface Options {
  timeToMake: string[],
  mealType: string[],
  cuisine: string[],
  dietaryRestrictions: string[],
  cookingAccessibility: string[]
}
export type OptionType = keyof Options;