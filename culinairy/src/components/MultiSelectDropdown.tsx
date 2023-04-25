import { MultiSelect, Option } from "react-multi-select-component";
import MultiSelectDropdownProps from "../interfaces/MultiSelectDropdownProps";
import { useReducer, useEffect } from "react";
import { NewOption } from "../interfaces/NewOption";
import { getEmoji } from "../scripts/emojiFromEnglish";

// define initial state and action types
type State = NewOption[] | Option[];
type Action =
  | { type: "SET_OPTIONS"; payload: State }
  | { type: "ADD_OPTION"; payload: NewOption };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "SET_OPTIONS":
        return action.payload;
      case "ADD_OPTION":
        const newOption = action.payload as NewOption;
        if (state.some(option => option.value === newOption.value)) {
          // option already exists, return state without adding the new option
          return state;
        }
        return [...state, newOption];
      default:
        return state;
    }
  }


export default function MultiSelectDropdown({ label, options, value, optionType, onChange }: MultiSelectDropdownProps) {
  const [selectedOptions, dispatch] = useReducer(reducer, value ? options.filter((option) => value.includes(option)).map((option) => ({ label: option, value: option, isNew: false })) : []);

  const handleNewField = (inputValue: string) => {
    const newOption: NewOption = {
      label: inputValue,
      value: inputValue,
      isNew: true,
    };
    // console.log('%c old selectedOptions', 'color: blue', selectedOptions);
    // console.log('%c newOption', 'color: green', newOption);

    dispatch({ type: "ADD_OPTION", payload: newOption });
    return newOption;
  };

  const handleChange = (newSelectedOptions: NewOption[] | Option[]) => {
    // console.log('%c change', 'color: red');
    // console.log('%c old selectedOptions', 'color: orange', selectedOptions);
    // console.log('%c newSelectedOptions', 'color: yellow', newSelectedOptions);

    dispatch({ type: "SET_OPTIONS", payload: newSelectedOptions });
    onChange(newSelectedOptions, optionType);
  };

  return (
    <>
      <label>
        <span id="label">{label}</span>
        <br />
        <MultiSelect
          ClearSelectedIcon={null}
          isCreatable={true}
          valueRenderer={(selected) => {
            return selected.length
              ? selected.map(({ label }) => {
                const emoji = getEmoji(label) || "";
                return `${emoji}${label} `;
              })
              : "Any";
          }}
          overrideStrings={{
            search: "Search/Add",
          }}
          onCreateOption={handleNewField}
          options={options.map((option) => ({ label: option, value: option }))}
          value={selectedOptions}
          onChange={handleChange}
          labelledBy={label}
        />
      </label>
    </>
  );
}
