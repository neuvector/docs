# Contributing to NeuVector Docs

Thanks for your interest in improving the NeuVector documentation!

## About this repo

This repository contains the source code for the official [NeuVector documentation site](https://open-docs.neuvector.com). The documentation content is written in Markdown and the site is statically generated using [Docusaurus](https://docusaurus.io/).

## Getting started
## Get started

To preview your changes locally, install the following tools:

* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)

1. Fork the repository to your GitHub account, then clone your fork and navigate to the `docs` directory.

   ```shell
   git clone https://github.com/<your-fork>/docs.git
   cd docs
   ```

2. Install the project dependencies.

   ```shell
   yarn install
   ```

3. Start the local development server.

   ```shell
   yarn start
   ```

`yarn start` launches a local development server (usually at http://localhost:3000) with live reload enabled. This allows you to preview your changes exactly as they will render on the live site before you submit a Pull Request.

If you need to test the static production build locally to ensure everything compiles correctly:

```shell
yarn build
yarn serve   # preview the built output
```

## Reporting issues

If you find a typo, an error, a gap in the documentation, or an outdated instruction, please open an issue.

To help us resolve the issue quickly, please include:

- The URL or file path of the affected page.
- A description of what is currently wrong or unclear.
- What you would expect to see instead.

## Making a change

When you are ready to contribute a fix or an update, follow these steps:

1. Create a branch: Create a new branch on your fork for your changes (e.g., `git checkout -b fix/typo-in-getting-started`).
2. Edit the content: Make your changes to the relevant files under the docs/ directory.
   * Most content is plain Markdown (.md), but Docusaurus also supports `.mdx` for pages that embed React components. Be sure to check the file extension before assuming standard Markdown syntax alone will apply.
3. Check older versions: If your change applies to content that also exists in an older documentation version (found in the `versioned_docs`/ directory), please consider applying the same fix to those versions.
4. Preview locally: Use `yarn start` to verify that your formatting for Docusaurus-specific admonitions like `:::note`, `:::warning`, and `:::info—renders` correctly.
5. Submit a Pull Request: Open a Pull Request against the `main` branch. Provide a clear and concise description of what was changed and why.

**Important**: by submitting a pull request, you agree to allow the project owner to license your work under the same license as used by this project.

## Questions

For anything not covered here, or if you need assistance with your contribution, please feel free to open an issue. We are here to help!
