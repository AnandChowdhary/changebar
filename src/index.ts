import {
  LibraryInterface,
  GitHubResponse,
  ChangebarConstructor
} from "./interfaces";

export default class Changebar implements LibraryInterface {
  repo: string;
  file: string;
  constructor({ element, repo, file }: ChangebarConstructor) {
    this.repo = repo;
    this.file = file;
    const valueElement: HTMLElement | null = document.querySelector(element);
    if (valueElement) {
      valueElement.addEventListener("click", this.open.bind(this));
    }
  }
  fetchGitHubHash() {
    return new Promise((resolve, reject) => {
      fetch(`https://api.github.com/repos/${this.repo}/commits/master`)
        .then(response => response.json())
        .then((json: GitHubResponse) => resolve(json.sha.substring(0, 8)))
        .catch(error => reject(error));
    });
  }
  open() {
    console.log("Opening!", this);
    this.fetchGitHubHash()
      .then(hash => console.log("Found hash", hash))
      .catch(error => console.log("Got error", error));
  }
}

(<any>window).Changebar = Changebar;
