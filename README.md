# Dumbledore

`dumbledore` is a knowledge base and documentation platform that leverages Github for storage.

Current features supported:

- Auto-sync with Github
- Markdown
- Offline editing/viewing
- Content Hot-reloading
- Simple Search

Upcoming features:

- Homebrew install
- In-browser editing
- Linking between knowledge bases
- Simplified checkout process
- Improved CLI

## Requirements

`dumbledore` requires NodeJS version 6 or above (for now).

## Installation

```
npm install -g dumbledore
```

## Getting Started

Once installed, you create a new project by running `dumbledore create [label]`.

<aside class="notice">
While you can label each project anything you want, be aware that labels containing spaces must be wrapped in quotation marks (ie. `dumbledore create "Test Project"`).
</aside>

Running `create` will initialize the project configuration settings in `~/.dumbledore/config.json`, spin up a server and open a browser window into the project.

## Common Operations

### Stopping, Starting and Restarting a Server

You can run a Dumbledore project server without much impact on your system's resources, but should you ever wish to shut down a server, simply run `dumbledore stop <label>`.

You can always spin up a new server by running `dumbledore start <label>` or restart a server with `dumbledore restart <label>`.

### Opening a Project in the Browser

Running `dumbledore open <label>` will open the base directory

### Opening a Project in an IDE

Running `dumbledore edit <label>` currently attempts to open the project in a code editor such as [Atom](https://atom.io/), [Sublime Text](https://www.sublimetext.com/), or [TextMate](https://macromates.com/). In the future other editors will be supported, but until then, you can manipulate or add files in the directory at `~/.dumbledore/docs/<label>`.
