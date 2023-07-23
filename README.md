# Storybook for Nuxt  <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->

- [Supported Features](#supported-features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [In a project without Storybook](#in-a-project-without-storybook)
    - [Automatic migration](#automatic-migration)
- [Documentation](#documentation)
  - [Options](#options)
  - [Next.js's Image Component](#nextjss-image-component)
    - [Local Images](#local-images)
    - [Remote Images](#remote-images)
    - [AVIF](#avif)
  - [Next.js Font Optimization](#nextjs-font-optimization)
    - [next/font/google](#nextfontgoogle)
    - [next/font/local](#nextfontlocal)
    - [Not supported features of next/font](#not-supported-features-of-nextfont)
  - [Next.js Routing](#nextjs-routing)
    - [Overriding defaults](#overriding-defaults)
    - [Global Defaults](#global-defaults)
    - [Default Router](#default-router)
    - [Actions Integration Caveats](#actions-integration-caveats)
  - [Next.js Navigation](#nextjs-navigation)
    - [Set `nextjs.appDirectory` to `true`](#set-nextjsappdirectory-to-true)
    - [Overriding defaults](#overriding-defaults-1)
    - [Global Defaults](#global-defaults-1)
    - [`useSelectedLayoutSegment` `useSelectedLayoutSegments` and `useParams` hook](#useselectedlayoutsegment-useselectedlayoutsegments-and-useparams-hook)
    - [Default Navigation Context](#default-navigation-context)
    - [Actions Integration Caveats](#actions-integration-caveats-1)
  - [Next.js Head](#nextjs-head)
  - [Sass/Scss](#sassscss)
  - [Css/Sass/Scss Modules](#csssassscss-modules)
  - [Styled JSX](#styled-jsx)
  - [Postcss](#postcss)
  - [Absolute Imports](#absolute-imports)
  - [Runtime Config](#runtime-config)
  - [Custom Webpack Config](#custom-webpack-config)
  - [Typescript](#typescript)
  - [Notes for Yarn v2 and v3 users](#notes-for-yarn-v2-and-v3-users)
  - [FAQ](#faq)
    - [Stories for pages/components which fetch data](#stories-for-pagescomponents-which-fetch-data)
    - [Statically imported images won't load](#statically-imported-images-wont-load)
    - [Module not found: Error: Can't resolve `package name`](#module-not-found-error-cant-resolve-package-name)
    - [What if I'm using the Vite builder?](#what-if-im-using-the-vite-builder)
- [Acknowledgements](#acknowledgements)

## Supported Features

👉 [Nuxt Modules](#nextjss-image-component)

👉 [Nuxt Plugins](#nextjs-font-optimization)

👉 [All in-built Nuxt Component](#nextjs-routing)

👉 [Sass/Scss](#sassscss)

👉 [Css/Sass/Scss Modules](#csssassscss-modules)

👉 [ JSX ](#styled-jsx)

👉 [Postcss](#postcss)

👉 [Auto Imports](#absolute-imports)

👉 [Runtime Config](#runtime-config)

👉 [Composables](#custom-webpack-config)

👉 [Typescript](#typescript) (already supported out of the box by Storybook)

## Requirements

- [Nuxt](https://nuxt.com/) >= 3.x
- [Storybook](https://storybook.js.org/) >= 7.x

## Getting Started

### In a project without Storybook

Follow the prompts after running this command in your Nuxt project's root directory:

```bash
npx storybook@latest init
```

[More on getting started with Storybook](https://storybook.js.org/docs/vue3/get-started/install)

#### Automatic migration

When running the `upgrade` command above, you should get a prompt asking you to migrate to `@storybook/nextjs`, which should handle everything for you. In case that auto-migration does not work for your project, refer to the manual migration below.



Update your `main.js` to change the framework property:

```js
// .storybook/main.js
export default {
  // ...
  framework: {
    // name: '@storybook/react-webpack5', // Remove this
    name: '@storybook-vue/nuxt', // Add this
    options: {},
  },
};
```

## Documentation

In progress