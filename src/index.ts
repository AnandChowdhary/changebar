import {
  LibraryInterface,
  GitHubResponse,
  ChangebarConstructor
} from "./interfaces";
import Popper from "popper.js";
// @ts-ignore
import snarkdown from "snarkdown";
import "./styles.scss";

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
      this.element.addEventListener("click", this.toggle.bind(this));
    }
    this.open();
    (<HTMLElement>document.documentElement).addEventListener(
      "click",
      (event: MouseEvent) => {
        if (
          document.querySelector(".changebar") &&
          !event
            .composedPath()
            .includes(<HTMLDivElement>document.querySelector(".changebar")) &&
          !event.composedPath().includes(<HTMLElement>this.element) &&
          this.isOpen()
        )
          this.close();
      }
    );
  }
  append(text: string) {
    let container: HTMLDivElement = document.createElement("div");
    container.classList.add("changebar");
    container.classList.add("changebar-visible");
    container.innerHTML = `<div class="changebar-text">${snarkdown(
      text
    )}</div>`;
    if (!document.querySelector(".changebar")) {
      document.body.appendChild(container);
    } else {
      container = <HTMLDivElement>document.querySelector(".changebar");
    }
    if (this.element) {
      const popper = new Popper(this.element, container, {
        placement: "bottom"
      });
    }
  }
  generateCdnUrl(hash: string) {
    return `https://cdn.staticaly.com/gh/${this.repo}/${hash}/${this.file}`;
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
  isOpen() {
    return (
      document.querySelector(".changebar") &&
      (<HTMLDivElement>document.querySelector(".changebar")).classList.contains(
        "changebar-visible"
      )
    );
  }
  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
  close() {
    if (document.querySelector(".changebar")) {
      (<HTMLDivElement>document.querySelector(".changebar")).classList.remove(
        "changebar-visible"
      );
    }
  }
  open() {
    if (!document.querySelector(".changebar")) {
      this.fetchGitHubHash()
        .then(hash => this.generateCdnUrl(<string>hash))
        .then(url => this.fetchFileContents(url))
        .then(text => {
          this.append(<string>text);
        })
        .catch((error: any) => console.log("Got error", error));
    } else {
      (<HTMLDivElement>document.querySelector(".changebar")).classList.add(
        "changebar-visible"
      );
    }
  }
}

(<any>window).Changebar = Changebar;
