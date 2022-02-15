# OnePixelAttack

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/one-pixel-attack/main/packages/frontend/public/static/logo/logo-96.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/one-pixel-attack" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/one-pixel-attack" />
</p>

一个可配置的像素求解器，对抗性图像生成器后端

## 内容列表

- [背景](#背景)
- [安装](#安装)
- [使用](#使用)
- [相关工作](#相关工作)
- [维护者](#维护者)
- [如何贡献](#如何贡献)
- [使用许可](#使用许可)

## 背景

OnePixelAttack 受到 ['One pixel attack for fooling deep neural networks'](https://arxiv.org/abs/1710.08864) 一文的启发。 我发现我可以借鉴它的原理制作一个能够满足以下特性的工具:

- 输入可配置
- 输出直观
- 易于使用

于是，我制作了一个对抗性图像生成器。2020 年 1 月，我开始基于 Python 开发项目的 1.0 版本。2021 年 9 月，我开始基于 Python 绑定开发项目的 2.0 版本。

## 安装

本项目使用 Node.js 和它的包管理器。请确保本地安装了它们。

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/backend
$ npm install
```

或者

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/backend
$ yarn
```

## 使用

本项目可以以生产模式或开发模式启动。

对于生产模式：

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/backend
$ npm run build
$ npm run start
```

或者

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/backend
$ yarn build
$ yarn start
```

对于开发模式：

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/backend
$ npm run dev
```

或者

```sh
$ git clone https://github.com/peidongxie/one-pixel-attack
$ cd one-pixel-attack/packages/backend
$ yarn dev
```

## 相关工作

- [Boa](https://github.com/imgcook/boa)
- [NumPy](https://github.com/numpy/numpy)
- [One Pixel Attack](https://github.com/Hyperparticle/one-pixel-attack-keras)
- [SciPy](https://github.com/scipy/scipy)
- [TensorFlow](https://github.com/tensorflow/tensorflow)

## 维护者

[@peidongxie](https://github.com/peidongxie)

## 如何贡献

欢迎提 [issue](https://github.com/peidongxie/one-pixel-attack/issues/new) 或 [PR](https://github.com/peidongxie/one-pixel-attack/compare)。

## 使用许可

[MIT](LICENSE) © 谢沛东
