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

function createButton(label, className, handler) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.className = className;
  btn.addEventListener("click", handler);
  return btn;
}


function handleDelete(note, id) {
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(() => {
    note.remove();
    recipesData = recipesData.filter((r) => r.id !== id);
  });
}

function handleEdit(note, recipe) {
  note.innerHTML = "";

  const nameInput = createInput("text", recipe.name);
  const ingInput = createTextarea(recipe.ingredients);
  const instInput = createTextarea(recipe.instructions);
  const saveBtn = createButton("Save", "btn-save", () => {
    const updated = {
      name: nameInput.value,
      ingredients: ingInput.value,
      instructions: instInput.value,
    };

    fetch(`${BASE_URL}/${recipe.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then((data) => {
        recipesData = recipesData.map((r) => (r.id === data.id ? data : r));
        fetchRecipes();
      });
  });

  note.append(nameInput, ingInput, instInput, saveBtn);
}


const createInput = (type, value) => {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  return input;
};

const createTextarea = (value) => {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  return textarea;
};

function fetchRecipes() {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((data) => {
      recipesData = data;
      showAllRecipes();
    });
}

function showAllRecipes() {
  recipeList.innerHTML = "";
  clearAndHideAddForm();
  recipesData.forEach(renderRecipe);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const ingredients = document.getElementById("ingredients").value.trim();
  const instructions = document.getElementById("instructions").value.trim();

  if (!name || !ingredients || !instructions) {
    alert("Please fill in all fields.");
    return;
  }

  const newRecipe = { name, ingredients, instructions };

  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRecipe),
  })
    .then((res) => res.json())
    .then((data) => {
      recipesData.push(data);
      fetchRecipes();
      scrollToRecipePage();
    });
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  searchDropdown.innerHTML = "";

  if (!term) return (searchDropdown.style.display = "none");

  const matches = recipesData.filter((r) =>
    r.name.toLowerCase().includes(term)
  );

  matches.forEach((match) => {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action";
    li.textContent = match.name;
    li.addEventListener("click", () => {
      recipeList.innerHTML = "";
      renderRecipe(match);
      searchInput.value = "";
      searchDropdown.style.display = "none";
      scrollToRecipePage();
    });
    searchDropdown.appendChild(li);
  });

  searchDropdown.style.display = matches.length ? "block" : "none";
});

document.querySelector("[data-bs-target='#addRecipeForm']").addEventListener("click", () => {
  recipeList.innerHTML = "";
  addFormCollapse.classList.add("show");
  scrollToRecipePage();
});

