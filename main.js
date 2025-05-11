const SEARCH_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const RANDOM_API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
const LOOKUP_API_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsGrid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");
const randomButton = document.getElementById("random-button");
randomButton.addEventListener("click", getRandomRecipe);

const modal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("recipe-details-content");
const modelcloseBtn = document.getElementById("modal-close-btn");

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
    recipeDiv.dataset.id = recipe.idMeal;
    recipeDiv.innerHTML = `
      <img src = "${recipe.strMealThumb}" alt = "${recipe.strMeal}" loading="lazy"/>
      <h3>${recipe.strMeal}</h3> `;
    resultsGrid.appendChild(recipeDiv);
  });
}

function showModal() {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

resultsGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".recipe-item");
  if (card) {
    const recipeId = card.dataset.id;
    getRecipeDetails(recipeId);
  }
});

async function getRecipeDetails(id) {
  modalContent.innerHTML = `<p class="message loading">Loading recipe details...</p>`;
  showModal();
  try {
    const response = await fetch(`${LOOKUP_API_URL}${id}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
      displayRecipeDetails(data.meals[0]);
    } else {
      modalContent.innerHTML = `<p class="message error">No recipe details found</p>`;
    }
  } catch (error) {
    modalContent.innerHTML = `<p class="message error">Failed to load details...</p>`;
  }
}

modelcloseBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

function displayRecipeDetails(recipe) {
  const ingrediants = [];
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingrediants.push(
        `${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`
      );
    }
  }
  const categoryHTML = recipe.strCategory
    ? `<h3>Category: ${recipe.strCategory}</h3>`
    : "";
  const areaHTML = recipe.strArea ? `<h3>Area: ${recipe.strArea}</h3>` : "";
  const ingrediantsHTML = ingrediants.length
    ? `<h3>Ingrediants:</h3><ul>${ingrediants
        .map((ingrediant) => `<li>${ingrediant}</li>`)
        .join("")}</ul>`
    : "";
  const instructionsHTML = recipe.strInstructions
    ? `<h3>Instructions:</h3><p>${
        recipe.strInstructions
          ? recipe.strInstructions.replace(/\r?\n/g, "<br>")
          : "Instructions Not Available"
      }</p>`
    : "";
  const youtubeHTML = recipe.strYoutube
    ? `<h3>Video Recipe: </h3> <div class="video-wrapper"><a href="${recipe.strYoutube}" target="_blank">Watch On Youtube </a></div>`
    : "";

  const sourceHTML = recipe.strSource
    ? `<h3>Source: </h3> <div class="video-wrapper"><a href="${recipe.strSource}" target="_blank">Source </a></div>`
    : "";
  modalContent.innerHTML = `
  <h2>${recipe.strMeal}</h2>
  <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
  ${categoryHTML}
  ${areaHTML}
  ${ingrediantsHTML}
  ${instructionsHTML}
  ${youtubeHTML}
  ${sourceHTML}
  `;
}
