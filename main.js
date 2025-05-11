const SEARCH_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const RANDOM_API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsGrid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");
const randomButton = document.getElementById("random-button");
randomButton.addEventListener("click", getRandomRecipe);

async function getRandomRecipe() {
  showMessage("Loading random recipe...", false, true);
  resultsGrid.innerHTML = "";
  try {
    const response = await fetch(RANDOM_API_URL);
    if (!response.ok) throw new Error("Something went wrong");
    const data = await response.json();
    clearMessage();
    if (data.meals && data.meals.length > 0) {
      displayRecipes(data.meals);
    } else {
      showMessage("No recipes found", true);
    }
  } catch (error) {
    showMessage("An error occurred. Please try again later.", true);
  }
}
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    searchRecipes(searchTerm);
  } else {
    showMessage("Please enter searchTerm", true);
  }
});

async function searchRecipes(query) {
  showMessage(`Searching for ${query}...`, false, true);
  resultsGrid.innerHTML = "";
  try {
    const response = await fetch(`${SEARCH_API_URL}${query}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    clearMessage();
    if (data.meals && data.meals.length > 0) {
      displayRecipes(data.meals);
    } else {
      showMessage("No recipes found", true);
    }
  } catch (error) {
    showMessage("An error occurred. Please try again later.", true);
  }
}
function showMessage(message, isError = false, isLoading = false) {
  messageArea.textContent = message;
  if (isError) messageArea.classList.add("error");
  if (isLoading) messageArea.classList.add("loading");
}

function clearMessage() {
  messageArea.textContent = "";
  messageArea.className = "message";
}

function displayRecipes(recipes) {
  if (!recipes || recipes.length === 0) {
    showMessage("No recipes found", true);
    return;
  }
  recipes.forEach((recipe) => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-item");
    recipeDiv.innerHTML = `
      <img src = "${recipe.strMealThumb}" alt = "${recipe.strMeal}" loading="lazy"/>
      <h3>${recipe.strMeal}</h3> `;
    resultsGrid.appendChild(recipeDiv);
  });
}
