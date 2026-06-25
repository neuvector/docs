# Contributing to NeuVector Docs

Thanks for your interest in improving the NeuVector documentation!

## About this repo

This repository contains the source for the NeuVector documentation site, published at https://open-docs.neuvector.com. Documentation content lives as Markdown files under `docs/`. The site itself is built with [Docusaurus](https://docusaurus.io/).

## Getting started

```shell
git clone https://github.com/<your-fork>/docs.git
cd docs
yarn install
yarn start
```

`yarn start` runs a local dev server with live reload, so you can preview your changes exactly as they'll render on the live site before submitting a PR.

To produce a static production build:

```shell
yarn build
yarn serve   # preview the built output
```

## Reporting issues

If you find an error, gap, or outdated instruction in the docs, please open an issue describing:
- The page/URL affected
- What's currently wrong or unclear
- What you'd expect instead

## Making a change

1. Fork the repo and create a branch for your change.
2. Edit the relevant file under `docs/` — most content is plain Markdown (`.md`), though Docusaurus also supports `.mdx` for pages that embed
   React components, so check the file extension before assuming Markdown syntax alone will apply.
3. If your change applies to content that also exists in an older doc version (see `versioned_docs/`), consider whether that version needs
   the same fix.
4. Preview locally with `yarn start` to confirm formatting and any admonitions (`:::note`, `:::warning`, etc.) render correctly.
5. Open a pull request against `main`, describing what changed and why.

**Important**: by submitting a pull request, you agree to allow the project owner to license your work under the same license as used by this project.

## Questions

For anything not covered here, feel free to open an issue.
