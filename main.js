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

function capitalizeLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function getVal() {
  let query = document.getElementById("search-bar");
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
  let repos;
  let reposUnique;

  if (url !== "") {
    repos = await fetch(url);
    reposUnique = await repos.json();
  }

  let menu = document.getElementsByTagName("li");
  if (menu) {
    for (var i = menu.length - 1; i >= 0; --i) {
      menu[i].remove();
    }
  }

  if (url === "") {
    return;
  }

  if (reposUnique["items"]) {
    reposUnique["items"].forEach((object) => {
      let name = object["name"];
      let owner = object["owner"]["login"];
      let stars = object["stargazers_count"];

      let newElement = document.createElement("li");
      let text = document.createTextNode(name);
      newElement.appendChild(text);
      newElement.classList.add("search-bar__result");
      document.getElementById("search-bar__wrapper").appendChild(newElement);
      newElement.addEventListener("click", () => {
        addRepos(name, owner, stars);
        let query = document.getElementById("search-bar");
        query.value = "";
        if (menu) {
          for (var i = menu.length - 1; i >= 0; --i) {
            menu[i].remove();
          }
        }
      });
    });
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
  let repos = document.getElementById("added-repos");
  let repo = document.createElement("div");
  repo.classList.add("repo");

  let repoInfo = document.createElement("div");
  repoInfo.classList.add("repo__info", "info");

  let args = [name, owner, stars];
  let argsLabels = ["name", "owner", "stars"];

  let button = addButton()();
  removeRepos(repo, button);

  for (let i = 0; i < args.length; i++) {
    let divField = document.createElement("div");
    divField.classList.add(`info__${argsLabels[i]}`, `${argsLabels[i]}`);
    let divLabel = document.createElement("div");
    divLabel.classList.add(`${args[0]}__label`, `label`);
    let text = document.createTextNode(`${capitalizeLetter(argsLabels[i])}: `);
    divLabel.appendChild(text);
    divField.appendChild(divLabel);
    let divText = document.createElement("div");
    text = document.createTextNode(`${args[i]}`);
    divText.classList.add(`${argsLabels[i]}__text`);
    divText.appendChild(text);
    divField.appendChild(divText);
    repoInfo.appendChild(divField);
  }

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
  }
}

let app = new Search();
