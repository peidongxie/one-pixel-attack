# OnePixelAttack

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/one-pixel-attack/main/packages/frontend/public/static/logo/logo-96.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/one-pixel-attack" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/one-pixel-attack" />
</p>

A configurable pixel perturbation solver, the backend of an adversarial image generator

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

This app uses Node.js and its package manager. Please make sure they are installed locally.

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ npm install
$ cd one-pixel-attack/packages/backend
```

or

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ yarn
$ cd one-pixel-attack/packages/backend
```

## Usage

This app can be started in development mode.

```sh
$ yarn dev
```

or

```sh
$ npm run dev
```

This app can be built for production and be started in production mode once built. You can view the production build in the `build` directory.

```sh
$ yarn build
$ yarn start
```

or

```sh
$ npm run build
$ npm run start
```

## Related Efforts

- [Boa](https://github.com/imgcook/boa)
- [NumPy](https://github.com/numpy/numpy)
- [One Pixel Attack](https://github.com/Hyperparticle/one-pixel-attack-keras)
- [SciPy](https://github.com/scipy/scipy)
- [TensorFlow](https://github.com/tensorflow/tensorflow)

## Maintainers

[@peidongxie](https://github.com/peidongxie)

## Contributing

Feel free to open an [issue](https://github.com/peidongxie/one-pixel-attack/issues/new) or [PR](https://github.com/peidongxie/one-pixel-attack/compare).

## License

[MIT](LICENSE) © 谢沛东
