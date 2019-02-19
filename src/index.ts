import {
  LibraryInterface,
  GitHubResponse,
  ChangebarConstructor
} from "./interfaces";

export default class Changebar implements LibraryInterface {
  repo: string;
  file: string;
  element?: HTMLElement;
  constructor({ element, repo, file }: ChangebarConstructor) {
    this.repo = repo;
    this.file = file;
    const valueElement: HTMLElement | null = document.querySelector(element);
    if (valueElement) {
      this.element = valueElement;
      this.element.addEventListener("click", this.open.bind(this));
    }
  }
  generateCdnUrl(hash: string) {
    return `https://cdn.staticaly.com/gh/AnandChowdhary/hovercard/${hash}/${
      this.file
    }`;
  }
  fetchFileContents(url: string) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.text())
        .then((text: string) => resolve(text))
        .catch(error => reject(error));
    });
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
      .then(hash => this.generateCdnUrl(<string>hash))
      .then(url => this.fetchFileContents(url))
      .then(text => {
        console.log("Found this text", text);
      })
      .catch((error: any) => console.log("Got error", error));
  }
}

(<any>window).Changebar = Changebar;
