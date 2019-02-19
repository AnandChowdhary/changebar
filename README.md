# 🔔 Changebar

[![NPM](https://img.shields.io/npm/v/changebar.svg)](https://www.npmjs.com/package/changebar)
[![GitHub](https://img.shields.io/github/license/anandchowdhary/changebar.svg)](https://github.com/AnandChowdhary/changebar/blob/master/LICENSE)
![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/AnandChowdhary/changebar.svg)
[![Minzipped size](https://img.shields.io/bundlephobia/minzip/changebar.svg)](https://www.npmjs.com/package/changebar)

Changebar is a GitHub-powered changelog notifications widget for the web. Easily tell your users what's new, fetched directly from GitHub by [Staticaly CDN](https://www.staticaly.com/).

## ⭐ How it works

Add Changebar to your project with NPM:

```bash
npm install changebar
```

Import it to your project:

```js
import Changebar from "changebar";
```

Initialize it with your button (which, on click, will open Changebar), GitHub repo and file with your changelog (respect Semantic Versioning for best results, see [Keep a Changelog](https://keepachangelog.com)):

```js
const notifications = new Changebar({
  element: "button#notifs",
  repo: "AnandChowdhary/changebar",
  file: "CHANGELOG.md"
});
```

Then, the magic happens:

- Changebar will now use the GitHub API and find the most recent commit hash
- This hash is used to get the most recent version of your Markdown file with the changelog
- [Staticaly CDN](https://www.staticaly.com/) will serve the file from your most recent commit
- The total number of "notifications" is the number of subheadings in your semantic changelog
- Changebar will add the number of unread notifications to your button:

![Notifications button](https://raw.githubusercontent.com/AnandChowdhary/changebar/master/docs/button.png)

- When a user clicks on the button, Changebar will show a beautiful notifications interface with your changelog, rendering Markdown and applying CSS rules
- Using local storage, Changebar will remember how many notifications a user has already seen

## 🖼 Screenshot

![Screenshot of Changebar](https://raw.githubusercontent.com/AnandChowdhary/changebar/master/docs/screenshot.png)

## 💻 Configuration

You can use the following options in the constructor:

```js
new Changebar({
  element: "#notifs", // Button to add notifications to
  repo: "username/repository", // GitHub username/repo format
  file: "CHANGELOG.md", // Name of the file to look at
  heading: "h2", // Selector for headings in rendered HTML (optional)
  hide: "h1" // Hide these elements the rendered HTML (optional)
})
```

Changebar adds the `changebar-is-fetching`, `changebar-has-error`, and `changebar-completed` classes to your button to keep track of the Fetch requests.

It also adds the `data-unread-count` attribute with the number of unread notifications and the `changebar-has-unread` class if there are unread notifications.

### Methods

You can use the following methods for programatical access:

| Method | Description |
| - | - |
| `open()` | Opens Changebar |
| `close()` | Closes Changebar |
| `toggle()` | Toggles the open state |
| `isOpen()` | Returns whether Changebar is open |

For example, you can open Changebar like this:

```js
changebar.open();
```

## 🛠️ Development

Start development server with HMR and prettier:

```bash
yarn start
```

### Production

Build a production version:

```bash
yarn build
```

Changebar doesn't ship with any polyfills, just ES6 transpiled to ES5. You might want to add polyfills for the following in your build process, based on how backwards-compatible you want to be:

- Fetch API (no IE, Chrome 42+, Firefox 40+)
- Promise (No IE, Chrome 33+, Firefox 29+)
- Array.prototype.includes() (No IE, Chrome 47+, Firefox 43+)
- Element.classList (IE 10+, Chrome 8+, Firefox 3.6+)
- ParentNode.querySelector() (IE 8+, Chrome 4+, Firefox 3.5+)

## ✍️ Todo

- [x] Make it work
- [ ] Tests
- [ ] Better API with events

## 📝 License

MIT
