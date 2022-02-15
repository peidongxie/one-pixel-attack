# OnePixelAttack

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/one-pixel-attack/main/packages/frontend/public/static/logo/logo-96.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/one-pixel-attack" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/one-pixel-attack" />
</p>

An intuitive user interface, the frontend of an adversarial image generator

## Table of Contents

- [Background](#background)
- [Installation](#installation)
- [Usage](#usage)
- [Related Efforts](#related-efforts)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

OnePixelAttack was inspired by ['One pixel attack for fooling deep neural networks'](https://arxiv.org/abs/1710.08864). I found that I could borrow its principles to make a tool that could meet the following characteristics:

- Input configurable
- Output intuitive
- Easy to use

As a result, I made an adversarial image generator. In January 2020, I started developing version 1.0 of the project based on Python. In September 2021, I started developing version 2.0 of the project based on Python bindings.

## Installation

This project uses Node.js and its package manager. Please make sure they are installed locally.

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/frontend
$ npm install
```

or

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/frontend
$ yarn
```

## Usage

This project can be started in production mode or development mode.

For production mode:

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/frontend
$ npm run build
$ npm run start
```

or

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/frontend
$ yarn build
$ yarn start
```

For development mode:

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/frontend
$ npm run dev
```

or

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/frontend
$ yarn dev
```

## Related Efforts

- [Chart.js](https://github.com/chartjs/Chart.js)
- [MUI](https://github.com/mui-org/material-ui)
- [React](https://github.com/facebook/react)

## Maintainers

[@peidongxie](https://github.com/peidongxie)

## Contributing

Feel free to open an [issue](https://github.com/peidongxie/one-pixel-attack/issues/new) or [PR](https://github.com/peidongxie/one-pixel-attack/compare).

## License

[MIT](LICENSE) © 谢沛东
