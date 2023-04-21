export interface NewOption {
  label: string,
  value: string,
  isNew: boolean
}
export type NewOptionType = keyof NewOption;