import { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import getRecipe from '../scripts/getRecipe';
import Dropdown from '../components/Dropdown';
import RecipeRequest from '../interfaces/RecipeRequest';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import Markdown from 'markdown-to-jsx';
import { OptionType, Options } from "../interfaces/Options";
import { NewOption } from "../interfaces/NewOption";
import { Option } from "react-multi-select-component";
// import { root } from 'postcss';

export default function NewRecipe() {
  const [surprise, setSurprise] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [recipeRequest, setRecipeRequest] = useState<RecipeRequest>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<OptionType, string[]>>({
    timeToMake: ["less than 15 minutes", "less than 30 minutes", "less than 1 hour", "less than 2 hours", "more than 2 hours"],
    mealType: ["breakfast", "lunch", "dinner", "snack"],
    cuisine: ["American", "Chinese", "French", "Indian", "Italian", "Japanese", "Mexican", "Thai"],
    dietaryRestrictions: ["gluten-free", "vegan", "vegetarian", "paleo", "whole30"],
    cookingAccessibility: ["oven", "microwave", "stovetop", "barbeque", "slow cooker", "instant pot", "airfryer"]
  });

  const isRespondingRef = useRef<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isRespondingRef.current) {
      return;
    }
    isRespondingRef.current = true;

    const requestString = buildRequestString(recipeRequest);
    const fullQuestion = surprise ? `Give me a yummy meal recipe!` : `Give me a delicious recipe${requestString}`;

    console.log(fullQuestion);

    await getRecipe(fullQuestion, (message) => {
      setResponse(message);
      setTimeout(() => {
        isRespondingRef.current = false;
      }, 10000);
    });
  }


  useEffect(() => {
    const root = document.documentElement;
    if (response) root.scrollTo({ top: root.scrollHeight, behavior: 'smooth' })
  }, [response])

  function buildRequestString(request: RecipeRequest): string {
    const { timeToMake, mealType, cuisine, dietaryRestrictions, cookingAccessibility } = request;
    const parts = [];

    if (mealType) {
      parts.push(`for ${mealType}`);
    }

    if (timeToMake) {
      parts.push(`that can be made in ${timeToMake}`);
    }

    if (cuisine && cuisine.length > 0) {
      parts.push(`of ${cuisine.join(', or ')} cuisine`);
    }

    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
      parts.push(`that is ${dietaryRestrictions.join(' and ')}`);
    }

    if (tags && tags.length > 0) {
      parts.push(`using the ingredients ${tags.join(', ')}`);
    }

    if (cookingAccessibility && cookingAccessibility.length > 0) {
      parts.push(`that can be made using a ${cookingAccessibility.join(' or ')}`);
    }

    if (parts.length > 0) {
      return ` ${parts.join(', ')}. Respond with markdown format.`;
    } else {
      return '';
    }
  }

  function addOption(optionType: OptionType, optionValue: string) {
    const options = selectedOptions[optionType];
    if (!options) {
      console.log(`Invalid option type: ${optionType}`);
      return;
    }
    if (options.indexOf(optionValue) !== -1) {
      console.log(`Option ${optionValue} already exists in ${optionType} options`);
      return;
    }

    setSelectedOptions((prevState) => ({
      ...prevState,
      [optionType]: [...prevState[optionType], optionValue],
    }));
  }

  function handleDropdownChange(selectedOptions: any[], optionType: keyof RecipeRequest) {

    console.log(selectedOptions, optionType)
    selectedOptions.forEach((option: Option | NewOption) => {
      console.log(option)
      if ( "isNew" in option ) {
        console.log('isNew', optionType, option.value)
        addOption(optionType, option.value)
      }
    });
    setRecipeRequest((prevState) => ({
      ...prevState,
      [optionType]: selectedOptions.map((option: any) => option.value),
    }));
  }

  function handleTagInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    // If the user enters a pipe character, add the current input value as a tag
    if (value.endsWith(';') && value.trim().length > 1) {
      const newTag = value.slice(0, -1).trim();
      setTags([...tags, newTag]);
      setInputValue('');
    } else {
      setInputValue(value);
    }
  }

  function removeTag(tag: string) {
    console.log(`tag: ${tag}, tags:`, tags)
    setTags(tags.filter((t) => t !== tag));
  }
  return (
    <div id="newRecipeForm" className="max-w-[80vw] min-height-[100vw] mx-auto p-3 md:p-20 md:p-0">
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <Dropdown
          label="Time to make"
          options={selectedOptions['timeToMake']}
          value={recipeRequest.timeToMake || ""}
          onChange={(event) =>
            setRecipeRequest({
              ...recipeRequest,
              timeToMake: event.target.value,
            })
          }
        />
        <Dropdown
          label="Meal type"
          options={selectedOptions['mealType']}
          value={recipeRequest.mealType || ""}
          onChange={(event) =>
            setRecipeRequest({
              ...recipeRequest,
              mealType: event.target.value,
            })
          }
        />
        <MultiSelectDropdown
          label="Cuisines"
          options={selectedOptions['cuisine']}
          value={recipeRequest.cuisine || []}
          optionType="cuisine"
          onChange={handleDropdownChange}
        />
        <MultiSelectDropdown
          label="Dietary restrictions"
          options={selectedOptions['dietaryRestrictions']}
          value={recipeRequest.dietaryRestrictions || []}
          optionType="dietaryRestrictions"
          onChange={handleDropdownChange}
        />
        <label className="w-full">
          Available ingredients:
          <div className="w-full">
            <div className="tags p-2">
              {tags.map((tag, index) => (
                <div key={index} className="tag inline-flex">
                  <div className="">
                    {tag}
                  </div>
                  <button className="pl-2 pt-[2px]" type="button">
                    <span className="closeB fa-solid fa-xmark" onClick={() => removeTag(tag)} />
                  </button>
                </div>
              ))}
              <br />
            </div>
            <br />
            <input
              type="text"
              id="ingredients"
              value={inputValue}
              onChange={handleTagInputChange}
              placeholder="Enter ingredient and press ; to add as tag"
              className="w-full"
            />
          </div>
        </label>
        <MultiSelectDropdown
          label="Cooking accessibility"
          options={selectedOptions['cookingAccessibility']}
          value={recipeRequest.cookingAccessibility || []}
          optionType="cookingAccessibility"
          onChange={handleDropdownChange}
        />
        <div className="col-span-2 flex justify-between">
          <button type="submit" onClick={() => setSurprise(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Ask
          </button>
          <button type="submit" onClick={() => setSurprise(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Surprise Me
          </button>
        </div>
      </form>
      {response && (
        <div>
          <h2>Response:</h2>
          <div id="markdown">
            <Markdown>
              {response}
            </Markdown>
          </div>
          <div id="tracker"/>
        </div>
      )}
    </div>
  );
}