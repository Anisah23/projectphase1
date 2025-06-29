const BASE_URL = "http://localhost:3000/recipes";
const form = document.getElementById("recipe-form");
const recipeList = document.getElementById("recipe-list");
const searchInput = document.getElementById("search-input");
const searchDropdown = document.getElementById("search-dropdown");
const addFormCollapse = document.getElementById("addRecipeForm");

let recipesData = [];

const scrollToRecipePage = () =>
  document.getElementById("recipepage").scrollIntoView({ behavior: "smooth" });

const clearAndHideAddForm = () => {
  form.reset();
  addFormCollapse.classList.remove("show");
};

