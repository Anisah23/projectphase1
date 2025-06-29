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

function renderRecipe(recipe) {
  const note = document.createElement("div");
  note.classList.add("recipe-note");

  const name = document.createElement("h4");
  name.textContent = recipe.name;

  const ing = document.createElement("p");
  ing.innerHTML = `<strong>Ingredients:</strong> ${recipe.ingredients}`;

  const inst = document.createElement("p");
  inst.innerHTML = `<strong>Instructions:</strong> ${recipe.instructions}`;

  const editBtn = createButton("Edit", "btn-edit", () => handleEdit(note, recipe));
  const delBtn = createButton("Delete", "btn-delete", () => handleDelete(note, recipe.id));

  note.append(name, ing, inst, editBtn, delBtn);
  recipeList.appendChild(note);
}

