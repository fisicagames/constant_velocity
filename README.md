# Constant Velocity 🚗

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Babylon.js](https://img.shields.io/badge/Babylon.js-7.5.0-purple.svg)](https://www.babylonjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.2.11-yellow.svg)](https://vitejs.dev/)

The first simulation of the SHIFT series — an interactive simulation on uniform motion (Movimento Retilíneo Uniforme).

### [🎮 Play Now!](https://fisicagames.com.br/)

---

## 📄 Table of Contents

* [About the Game](#-about-the-game)
* [Key Features](#-key-features)
* [How to Play](#-how-to-play)
* [Tech Stack](#-tech-stack)
* [Installation and Setup](#-installation-and-setup)
* [Architecture and Technical Highlights](#-architecture-and-technical-highlights)
* [License](#-license)
* [Author](#-author)

---

## 📖 About the Game

**Constant Velocity** is the first simulation in the SHIFT series, developed in January 2024 as a pilot study to validate the combination of TypeScript and Babylon.js for hypercasual physics simulations. The game illustrates the concept of uniform rectilinear motion (MRU) through a dynamic question-and-answer mechanic.

A car moves along a marked rectilinear trajectory while incomplete kinematic equations are displayed on screen. The player must deduce the missing constants — initial position (s₀) and velocity (v) — by observing the motion and choosing among multiple-choice options. Each correct answer increases the car's velocity and brings the response options closer together, progressively raising the difficulty.

This was the first simulation in the project, intentionally written with a minimal architecture to evaluate the chosen technology stack before scaling to a series of simulations.

---

## ✨ Key Features

* **Dynamic Equation Display:** The MRU equation s(t) = s₀ + v·t updates in real time as the car moves, with unknown values revealed progressively as the player answers correctly.
* **Adaptive Difficulty:** Velocity scales with the player's score, and answer options become numerically closer as the player advances.
* **Random Direction:** The car may move left or right, with the 3D model rotating accordingly.
* **Educational Question Mechanic:** Multiple-choice questions about kinematic constants are integrated with continuous motion observation.
* **Responsive:** Runs in any modern browser, including mobile devices.

---

## 🕹 How to Play

**Objective:** Deduce the missing kinematic constants in the displayed equation by observing the car's motion.

#### Controls

💻 **On PC:** Click on the answer options.

📱 **On Mobile / Touch:** Tap on the answer options.

The displayed equation begins as `s(t) = ? + ? · t` and is progressively filled in as the player answers correctly, integrating theory and observation.

---

## 🛠 Tech Stack

| Tool                                       | Version | Description                                                              |
| ------------------------------------------ | ------- | ------------------------------------------------------------------------ |
| [TypeScript](https://www.typescriptlang.org/) | 5.7.2   | Core language, providing type safety.                                    |
| [Babylon.js](https://www.babylonjs.com/)      | 7.5.0   | Graphics engine for 3D rendering and GUI system.                         |
| [Vite.js](https://vitejs.dev/)                | 5.2.11  | Build tool for ES6 module compilation, tree-shaking, and optimization.   |
| [Node.js](https://nodejs.org/en)              | 20+     | Development environment and runtime.                                     |

---

## 🚀 Installation and Setup

**Prerequisites:** Node.js (v20+), npm (v10+).

```sh
npm install
npm run dev      # development server
npm run build    # production build (generates the dist folder)
```

---

## 🏗 Architecture and Technical Highlights

As the first simulation of the SHIFT series, **Constant Velocity** was deliberately structured with a minimal architecture to test the technology stack before committing to a serial production approach.

* **Singleton single-class structure:** All game logic — initialization, graphics engine setup, state management, and rendering — is contained in a single class within a single source file.
* **State management via finite state machine:** Game states are defined through TypeScript `enum`, providing simple but tightly coupled control flow.
* **Manual MRU physics:** The motion is computed without any physics engine. The position is updated each frame using a discrete approximation of the closed-form equation:

  ```
  s(t + Δt) = s(t) + v · Δt
  ```

  where Δt is obtained from `engine.getDeltaTime()`.

* **Pragmatic, exploratory programming:** The design follows the agile principles of **KISS** (Keep It Simple, Stupid), **DRY** (Don't Repeat Yourself), and **YAGNI** (You Ain't Gonna Need It).

This pragmatic approach validated the TypeScript + Babylon.js combination but, by design, the strong coupling between rendering, game logic, and UI did not favor maintainability or scalability — challenges deliberately addressed in subsequent simulations through progressive refactoring and the eventual adoption of an MVC framework.

---

## 📸 Screenshots

<!-- Add screenshots here when available, e.g.:
<p align="center">
  <img src="image/README/screenshot1.png" width="30%" alt="Constant Velocity screenshot 1" />
  <img src="image/README/screenshot2.png" width="30%" alt="Constant Velocity screenshot 2" />
</p>
-->

---

## 📜 License

### Source Code

The source code in this repository is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file.

### Visual Assets

3D models, textures, and original visual content created by the author are licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

### Audio Assets

Music and sound effects in this project are sourced from [Pixabay](https://pixabay.com/) under the [Pixabay Content License](https://pixabay.com/service/license-summary/), which permits free use including for commercial purposes.

### Third-Party Libraries

* **Babylon.js** — Apache License 2.0
* **Vite.js** — MIT License

**Copyright © 2024 Rafael João Ribeiro.**

---

## 👨‍🔬 Author

Developed by:
**Prof. Dr. Rafael João Ribeiro**
Federal Institute of Paraná (IFPR)
[www.fisicagames.com.br](https://www.fisicagames.com.br)
