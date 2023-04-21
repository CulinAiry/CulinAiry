import { Option } from "react-multi-select-component";
import { NewOption } from "../interfaces/NewOption";
import RecipeRequest from "../interfaces/RecipeRequest";

export default interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  value: string[];
  optionType: keyof RecipeRequest;
  onChange: (selectedOptions: NewOption[] | Option[], optionType: keyof RecipeRequest) => void;
}