import { LibraryInterface, GitHubResponse, Constructor } from "./interfaces";
import Popper from "popper.js";
// @ts-ignore
import snarkdown from "snarkdown";
import "./styles.scss";
import {
  unreadCountClass,
  hasUnreadCountClass,
  hasUnreadCountVisibleClass,
  unreadCountDataAttribute,
  localStorageKey,
  visibleClass,
  fetchingClass,
  errorClass,
  completedClass,
  textClass,
  baseClass
} from "./constants";

let popperElement: Popper;

export default class Changebar implements LibraryInterface {
  repo: string;
  file: string;
  heading: string;
  element?: HTMLElement;
  hide?: string;
  container?: HTMLDivElement;
  totalCount?: number;
  readCount?: number;
  constructor({ element, repo, file, heading, hide }: Constructor) {
    this.repo = repo;
    this.file = file;
    this.hide = hide;
    this.heading = heading || "h2";
    const valueElement: HTMLElement | null = document.querySelector(element);
    if (valueElement) {
      this.element = valueElement;
      this.element.addEventListener("click", this.toggle.bind(this));
      this.element.classList.add(fetchingClass);
    }
    this.fetchGitHubHash()
      .then(hash => this.generateCdnUrl(<string>hash))
      .then(url => this.fetchFileContents(url))
      .then(text => {
        if (this.element) {
          this.element.classList.remove(errorClass);
          this.element.classList.add(completedClass);
        }
        this.append(<string>text);
      })
      .catch((error: any) => {
        if (this.element) this.element.classList.add(errorClass);
        console.log("Got error", error);
      })
      .then(() => this.element && this.element.classList.remove(fetchingClass));
    (<HTMLElement>document.documentElement).addEventListener(
      "click",
      (event: MouseEvent) => {
        if (
          document.querySelector(`.${baseClass}`) &&
          !event
            .composedPath()
            .includes(<HTMLDivElement>(
              document.querySelector(`.${baseClass}`)
            )) &&
          !event.composedPath().includes(<HTMLElement>this.element) &&
          this.isOpen()
        )
          this.close();
      }
    );
  }
  append(text: string) {
    this.container = document.createElement("div");
    this.container.classList.add(baseClass);
    this.container.innerHTML = `<div class="${textClass}">${snarkdown(
      text
    )}</div>`;
    if (!document.querySelector(`.${baseClass}`)) {
      document.body.appendChild(this.container);
    } else {
      this.container = <HTMLDivElement>document.querySelector(`.${baseClass}`);
    }
    this.container.focus();
    if (this.hide) {
      const hideElements: NodeList = this.container.querySelectorAll(this.hide);
      for (let i = 0; i < hideElements.length; i++) {
        (<HTMLElement>hideElements[i].parentNode).removeChild(hideElements[i]);
      }
    }
    let firstHeadingIndex: number = Infinity;
    const childNodes = (<Node>(
      document.querySelector(`.${baseClass} > .${textClass}`)
    )).childNodes;
    const toRemove: HTMLElement[] = [];
    const allHeadings: HTMLElement[] = Array.from(
      document.querySelectorAll(`.${baseClass} ${this.heading}`)
    );
    for (let i = 0; i < childNodes.length; i++) {
      const element = <HTMLElement>childNodes[i];
      if (!isFinite(firstHeadingIndex)) {
        if (allHeadings.includes(element)) firstHeadingIndex = i;
        if (i < firstHeadingIndex) toRemove.push(element);
      }
    }
    toRemove.forEach(element => {
      if (element.nodeName === "#text") {
        element.remove();
      } else {
        (<HTMLElement>element.parentNode).removeChild(element);
      }
    });
    const allHeadingElements = this.container.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );
    for (let i = 0; i < allHeadingElements.length; i++) {
      allHeadingElements[i].classList.add(
        "changebar-heading-" +
          allHeadingElements[i].innerHTML
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-")
      );
      allHeadingElements[i].innerHTML = `<span>${
        allHeadingElements[i].innerHTML
      }</span>`;
    }
    if (this.element) {
      popperElement = new Popper(this.element, this.container, {
        placement: "bottom"
      });
    }
    this.updateStore();
  }
  updateCounts() {
    this.totalCount = (<NodeList>(
      document.querySelectorAll(`.${baseClass} ${this.heading}`)
    )).length;
    this.readCount = parseInt(localStorage.getItem(localStorageKey) || "0");
  }
  updateStore() {
    this.updateCounts();
    const unreadCount: number =
      <number>this.totalCount - <number>this.readCount;
    let unreadNumber: HTMLElement = document.createElement("strong");
    if (document.querySelector(`.${unreadCountClass}`)) {
      unreadNumber = <HTMLElement>(
        document.querySelector(`.${unreadCountClass}`)
      );
      unreadNumber.innerHTML = unreadCount.toString();
    } else if (this.element) {
      unreadNumber.classList.add(unreadCountClass);
      unreadNumber.innerHTML = unreadCount.toString();
      this.element.appendChild(unreadNumber);
    }
    if (this.element) {
      this.element.setAttribute(
        unreadCountDataAttribute,
        unreadCount.toString()
      );
      if (unreadCount > 0) {
        this.element.classList.add(hasUnreadCountClass);
        unreadNumber.classList.add(hasUnreadCountVisibleClass);
      } else {
        this.element.classList.remove(hasUnreadCountClass);
        unreadNumber.classList.remove(hasUnreadCountVisibleClass);
      }
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
      document.querySelector(`.${baseClass}`) &&
      (<HTMLDivElement>(
        document.querySelector(`.${baseClass}`)
      )).classList.contains(visibleClass)
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
    if (document.querySelector(`.${baseClass}`)) {
      (<HTMLDivElement>(
        document.querySelector(`.${baseClass}`)
      )).classList.remove(visibleClass);
    }
  }
  open() {
    if (this.container && this.totalCount) {
      this.container.classList.add(visibleClass);
      this.container.focus();
      popperElement.update();
      localStorage.setItem(localStorageKey, this.totalCount.toString());
    }
    this.updateStore();
  }
}

(<any>window).Changebar = Changebar;
