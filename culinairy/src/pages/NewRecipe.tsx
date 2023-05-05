import { useEffect, useState } from "react";
import getRecipe from "../scripts/getRecipe";
import Dropdown from "../components/Dropdown";
import RecipeRequest from "../interfaces/RecipeRequest";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import Markdown from "markdown-to-jsx";
import { UserState } from "../reducers/userSlice";
import { OptionType } from "../interfaces/Options";
import { NewOption } from "../interfaces/NewOption";
import { Option } from "react-multi-select-component";
import { getEmoji } from "../scripts/emojiFromEnglish";
import defaultEmojiMap from "../scripts/defaultEmojiMap";
import { saveUserRecipe } from "../db/firebaseRecipes";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrent } from "../reducers/recipeSlice";

export default function NewRecipe() {
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<OptionType, string[]>
  >({
    timeToMake: [
      "less than 15 minutes",
      "less than 30 minutes",
      "less than 1 hour",
      "less than 2 hours",
      "more than 2 hours",
    ],
    mealType: ["breakfast", "lunch", "dinner", "snack", "drink"],
    cuisine: [
      "American",
      "Chinese",
      "French",
      "Indian",
      "Italian",
      "Japanese",
      "Mexican",
      "Thai",
    ],
    dietaryRestrictions: [
      "gluten-free",
      "vegan",
      "vegetarian",
      "paleo",
      "whole30",
    ],
    allergies: [
      "gluten",
      "fish",
      "peanuts",
      "tree nuts",
      "milk",
      "eggs",
      "soy",
      "wheat",
      "shellfish",
    ],
    cookingAccessibility: [
      "oven",
      "microwave",
      "stovetop",
      "barbeque",
      "slow cooker",
      "instant pot",
      "airfryer",
    ],
  });
  const user = useSelector((state: { user: UserState }) => state.user.user);
  const loggedIn = useSelector(
    (state: { user: UserState }) => state.user.loggedIn
  );
  const [recipeRequest, setRecipeRequest] = useState<RecipeRequest>({});
  const [surprise, setSurprise] = useState<boolean>(false);
  const [scrollOn, setScrollOn] = useState<boolean>(true);
  const [ended, setEnded] = useState<boolean>(true);
  const [response, setResponse] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;

    const wheelHandler = () => setScrollOn(false);
    const touchStartHandler = () => setScrollOn(false);
    const touchMoveHandler = () => setScrollOn(false);

    window.addEventListener("wheel", wheelHandler);
    window.addEventListener("touchstart", touchStartHandler);
    window.addEventListener("touchmove", touchMoveHandler);

    if (root.scrollTop + root.clientHeight + 10 > root.scrollHeight) {
      setScrollOn(true);
    }

    let canScroll = true;

    function debounceScroll() {
      if (canScroll) {
        canScroll = false;
        setTimeout(() => {
          canScroll = true;
          if (scrollOn) {
            root.scrollTo({ top: root.scrollHeight, behavior: "smooth" });
          }
        }, 500);
      }
    }

    if (response && scrollOn) {
      debounceScroll();
    }

    return () => {
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchmove", touchMoveHandler);
    };
  }, [response, scrollOn]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ended) {
      return;
    }
    setEnded(false);
    setScrollOn(true);

    const requestString = buildRequestString(recipeRequest);
    let fullQuestion = surprise
      ? `Give me a random yummy meal recipe!`
      : `Give me a delicious recipe${requestString}`;
    fullQuestion +=
      " I would like to receive your response in Markdown format and provide step-by-step instructions please. It is vital that you wrap the title of the recipe in an <h2> tag or start it with ##.";
    console.log(fullQuestion);

    await getRecipe(fullQuestion, (messageTuple) => {
      // add emoji after matching words in lists
      const lists = messageTuple[0].toLowerCase().match(/^- .*$/gm);
      if (lists) {
        lists.forEach((list) => {
          const words = list.substring(2).split(" ");
          words.forEach((word, i) => {
            if (defaultEmojiMap[word]) {
              words[i] = `${word} ${defaultEmojiMap[word]}`;
            }
          });
          const formattedList = `- ${words.join(" ")}`;
          messageTuple[0] = messageTuple[0].replace(list, formattedList);
        });
      }
      // Ended
      const end = messageTuple[1];
      if (end) {
        setEnded(true);
        setScrollOn(false);
        const root = document.documentElement;
        root.scrollTo({ top: root.scrollHeight, behavior: "smooth" });
      } else {
        setResponse(messageTuple[0]);
      }
    });
  }

  function buildRequestString(request: RecipeRequest): string {
    const {
      timeToMake,
      mealType,
      cuisine,
      dietaryRestrictions,
      cookingAccessibility,
      allergies,
    } = request;
    const parts = [];

    if (mealType) {
      parts.push(`for ${mealType}`);
    }
    if (timeToMake) {
      parts.push(`that can be made in ${timeToMake}`);
    }
    if (cuisine && cuisine.length > 0) {
      parts.push(`of ${cuisine.join(", or ")} cuisine`);
    }
    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
      parts.push(`that is ${dietaryRestrictions.join(" and ")}`);
    }
    if (tags && tags.length > 0) {
      parts.push(`using the ingredients ${tags.join(", ")}`);
    }
    if (cookingAccessibility && cookingAccessibility.length > 0) {
      parts.push(
        `that can be made using a ${cookingAccessibility.join(" or ")}`
      );
    }
    if (parts.length > 0) {
      return ` ${parts.join(", ")}.${
        allergies && allergies.length > 0
          ? ` IMPORTANT: I am allergic to  ${allergies.join(
              " and "
            )}, the recipe MUST NOT include ANY of these or i will die.`
          : ""
      }`;
    } else {
      return "";
    }
  }

  function addOption(optionType: OptionType, optionValue: string) {
    const options = selectedOptions[optionType];
    if (!options) {
      console.log(`Invalid option type: ${optionType}`);
      return;
    }
    if (options.indexOf(optionValue) !== -1) {
      console.log(
        `Option ${optionValue} already exists in ${optionType} options`
      );
      return;
    }

    setSelectedOptions((prevState) => ({
      ...prevState,
      [optionType]: [...prevState[optionType], optionValue],
    }));
  }

  function handleDropdownChange(
    selectedOptions: any[],
    optionType: keyof RecipeRequest
  ) {
    // console.log(selectedOptions, optionType)
    selectedOptions.forEach((option: Option | NewOption) => {
      // console.log(option);
      if ("isNew" in option) {
        // console.log('isNew', optionType, option.value)
        addOption(optionType, option.value);
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
    if (value.endsWith(";") && value.trim().length > 1) {
      const newTag = value.slice(0, -1).trim();
      setTags([...tags, getEmoji(newTag) + newTag]);
      setInputValue("");
    } else {
      setInputValue(value);
    }
  }

  function removeTag(tag: string) {
    // console.log(`tag: ${tag}, tags:`, tags)
    setTags(tags.filter((t) => t !== tag));
  }

  function save() {
    // find the first sentence wrapped in <h2> tags and set it as the title
    const regex = /(?:<h2>(.*?)<\/h2>|##\s*([^\\\n]*))/i;
    const match = response.match(regex);
    let title = "";
    if (match) {
      title = match[1] || match[2];
    }
    if (loggedIn) {
      saveUserRecipe(user.uid, {
        name: title,
        recipe: response,
        favorite: false,
      }).then(() => {
        navigate("/saved-recipes");
      });
    } else {
      dispatch(
        setCurrent({
          title: title,
          recipe: response,
        })
      );
      navigate("/login");
    }
  }
  return (
    <>
      <div
        id="newRecipeForm"
        className="min-w-fit sm:max-w-[80vw] min-height-[100vw] p-7 md:pb-12 md:px-20 md:pt-12 md:p-20 mx-[2vw] sm:mx-[10vw] md:mx-[15vw] "
      >
        <div
          className="container md:mx-auto pb-8 text-center"
          style={{ color: "#fff5e0" }}
        >
          <p className="text-[1.3em]">
            To request a recipe with specific constraints, fill out the form and
            click "Ask". Alternatively, you can click "Surprise Me" to receive a
            random recipe with no specific requirements.
          </p>
          <p className="text-[0.95em]">
            (Leave a field blank if you don't want to include it in the
            request.)
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flow-root lg:grid gap-4 md:grid-cols-2"
        >
          {ended && (
            <div className="col-span-2 flex justify-center mb-8">
              <button
                type="submit"
                onClick={() => setSurprise(true)}
                className="hyper font-bold py-2 px-4 sm:text-lg sm:py-3 sm:px-6 md:text-xl md:py-4 md:px-8"
              >
                Surprise Me
              </button>
            </div>
          )}
          <div id="inner-form-box">
            <Dropdown
              label="Time to make:   "
              options={selectedOptions["timeToMake"]}
              value={recipeRequest.timeToMake || ""}
              onChange={(event) =>
                setRecipeRequest({
                  ...recipeRequest,
                  timeToMake: event.target.value,
                })
              }
            />
          </div>
          <div id="inner-form-box">
            <Dropdown
              label="Meal type:   "
              options={selectedOptions["mealType"]}
              value={recipeRequest.mealType || ""}
              onChange={(event) =>
                setRecipeRequest({
                  ...recipeRequest,
                  mealType: event.target.value,
                })
              }
            />
          </div>
          <div id="inner-form-box">
            <MultiSelectDropdown
              label="Cuisines:   "
              options={selectedOptions["cuisine"]}
              value={recipeRequest.cuisine || []}
              optionType="cuisine"
              onChange={handleDropdownChange}
            />
          </div>
          <div id="inner-form-box">
            <MultiSelectDropdown
              label="Allergies:   "
              options={selectedOptions["allergies"]}
              value={recipeRequest.cookingAccessibility || []}
              optionType="allergies"
              onChange={handleDropdownChange}
            />
          </div>
          <div id="inner-form-box">
            <MultiSelectDropdown
              label="Dietary restrictions:   "
              options={selectedOptions["dietaryRestrictions"]}
              value={recipeRequest.dietaryRestrictions || []}
              optionType="dietaryRestrictions"
              onChange={handleDropdownChange}
            />
          </div>
          <div id="inner-form-box">
            <MultiSelectDropdown
              label="Cooking accessibility:   "
              options={selectedOptions["cookingAccessibility"]}
              value={recipeRequest.cookingAccessibility || []}
              optionType="cookingAccessibility"
              onChange={handleDropdownChange}
            />
          </div>
          <div>
            <label className="w-full">
              <span id="label">Available ingredients:</span>
              <br />
              <span id="label" className="text-[1em] text-stone-300">
                {"(Or what dish you would like)"}
              </span>
              <input
                type="text"
                id="ingredients"
                value={inputValue}
                onChange={handleTagInputChange}
                placeholder="Enter ingredient and press ; to add"
                className="w-full"
              />
            </label>
          </div>
          <div className="w-full">
            <div className="tags p-2">
              {tags.map((tag, index) => (
                <div key={index} className="tag inline-flex">
                  <div className="">{tag}</div>
                  <button className="pl-2 pt-[2px]" type="button">
                    <span
                      className="closeB fa-solid fa-xmark"
                      onClick={() => removeTag(tag)}
                    />
                  </button>
                </div>
              ))}
              <br />
            </div>
            <br />
          </div>
          {ended && (
            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                onClick={() => setSurprise(false)}
                className="hyper font-bold py-2 px-4 sm:text-lg sm:py-3 sm:px-6 md:text-xl md:py-4 md:px-8"
              >
                Ask
              </button>
            </div>
          )}
        </form>
        {response && (
          <div>
            <br />
            <div
              id="markdown"
              className="m-0 mx-[-1em] p-0 px-[12px] !important"
            >
              <Markdown>{response}</Markdown>
            </div>
            {ended && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded mt-4"
                onClick={save}
              >
                Save
              </button>
            )}
          </div>
        )}
        <div id="tracker" />
      </div>
    </>
  );
}
