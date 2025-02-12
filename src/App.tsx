import { useEffect, useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [recipeData, setRecipeData] = useState<any[]>([]);
  const [hideResults, setHideResults] = useState<boolean>(true);

  const fetchRecipes = async (inputVal: string) => {
    if (localStorage.getItem(inputVal)) {
      const cachedData = JSON.parse(localStorage.getItem(inputVal)!);
      setRecipeData(cachedData);
    } else {
      const recipePromise = await fetch(
        `https://dummyjson.com/recipes/search?q=${inputVal}`
      );
      const recipe = await recipePromise.json();
      localStorage.setItem(inputVal, JSON.stringify(recipe.recipes));
      setRecipeData(recipe.recipes);
    }
  };

  useEffect(() => {
    let timer: any;
    inputValue.length === 0 && setRecipeData([]);
    if (inputValue.length >= 1) {
      timer = setTimeout(() => {
        fetchRecipes(inputValue);
      }, 400);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleBlur = () => {
    setHideResults(true);
  };

  const handleFocus = () => {
    setHideResults(false);
  };

  return (
    <div className="autocomplete_parent_container">
      <div className="autocomplete_child_container">
        <h1 className="autocomplete_heading">Autocomplete Component</h1>
        <input
          onBlur={handleBlur}
          onFocus={handleFocus}
          className="autocomplete_input"
          value={inputValue}
          onChange={(event) => handleInputChange(event)}
        />
      </div>
      <div className="autocomplete_data" hidden={hideResults}>
        {recipeData &&
          recipeData?.map((recipe) => (
            <p className={`autocomplete_item`} key={recipe.id}>
              {recipe?.name}
            </p>
          ))}
      </div>
    </div>
  );
}

export default App;
