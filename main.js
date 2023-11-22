function debounce(fn, debounceTime = 500) {
  let timeout;
  function result() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, debounceTime);
  }
  return result;
}

function getVal() {
  let query = app.query;
  const val = query.value;
  if (val.trimStart() !== "") {
    app.input = val.trimStart();
    app.url = `https://api.github.com/search/repositories?q=${app.input.replace(
      / /g,
      "+"
    )}+in:name&per_page=5&page=1`;
    getRepos(app.url);
    return app.input;
  } else {
    getRepos("");
  }
}

async function getRepos(url) {
  if (url === "") {
    return;
  }
  let repos;
  let reposUnique;

  try {
    repos = await fetch(url);
    reposUnique = await repos.json();
  } catch (e) {
    console.log(e.message);
    alert("Something went wrong, exiting the search!");
  }

  let menu = document.querySelector("ul");
  clearList(menu);

  if (reposUnique["items"]) {
    reposUnique["items"].forEach((object) => {
      let name = object["name"];
      let owner = object["owner"]["login"];
      let stars = object["stargazers_count"];

      let newElement = document.createElement("li");
      let text = document.createTextNode(name);
      newElement.appendChild(text);
      newElement.classList.add("search-bar__result");
      document.getElementById("search-bar__list").appendChild(newElement);
      newElement.addEventListener("click", () => {
        addRepos(name, owner, stars);
        let query = app.query;
        query.value = "";
        clearList(menu);
      });
    });
  }
}

function clearList(ul) {
  if (ul) {
    ul.innerHTML = "";
  }
}

function addButton() {
  return function () {
    let button = document.createElement("button");
    button.classList.add("repo__remove");
    let buttonText = document.createTextNode("X");
    button.appendChild(buttonText);
    return button;
  };
}

function removeRepos(repo, button) {
  button.addEventListener("click", () => {
    repo.remove();
  });
}

function addRepos(name, owner, stars) {
  let repos = app.repos;
  let template = app.template;

  let repo = document.createElement("div");
  repo.classList.add("repo");

  let repoInfo = document.createElement("div");
  repoInfo.classList.add("repo__info", "info");
  repoInfo.append(template.content.cloneNode(true));

  let divFields = repoInfo.getElementsByClassName("block__text");

  let args = [name, owner, stars];
  let i = 0;

  let button = addButton()();
  removeRepos(repo, button);

  Array.from(divFields).forEach((field) => {
    field.appendChild(document.createTextNode(`${args[i++]}`));
  });

  repo.appendChild(repoInfo);
  repo.appendChild(button);
  repos.appendChild(repo);

  return true;
}

const processChange = debounce(() => getVal());

class Search {
  constructor() {
    this.app = document.getElementById("autocomplete");
    this.input = null;
    this.url = null;
    this.query = document.getElementById("search-bar");
    this.repos = document.getElementById("added-repos");
    this.template = document.getElementById("repo__info-template");
  }
}

let app = new Search();
