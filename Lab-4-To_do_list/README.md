# My Interactive "Pro" To-Do List

<img width="1214" height="656" alt="image" src="https://github.com/user-attachments/assets/e4092141-8ec9-431b-8e36-f63a05cf74e6" />


A sleek, modern task management web application built entirely with vanilla JavaScript, HTML, and CSS. Designed with a strict **Model-View-Controller (MVC)** architecture, this app features a premium "Glassmorphism" UI, complete data persistence, and dynamic filtering.

## ✨ Features

* **MVC Architecture:** Clean, maintainable codebase separated into data (Model), presentation (View), and logic (Controller) layers.
* **Persistent Storage:** Tasks are automatically saved to the browser's `localStorage` so you never lose your data upon refreshing.
* **Advanced Task Management:** * Add new tasks with timestamps.
  * Edit existing tasks via a custom, centered UI modal.
  * Toggle completion status (strikes through text and dims the item).
  * Delete individual tasks or clear the entire list.
* **Filtering & Sorting:**
  * Instantly filter tasks by **All**, **Completed**, or **Incomplete**.
  * Auto-sort tasks alphabetically for better organization.
* **Modern "Vibe Coder" UI:**
  * Dark-mode Glassmorphism design with a deep space gradient.
  * Smooth CSS keyframe animations (`slideIn`) and hover transitions.
  * Dynamic vector icons powered by Font Awesome.

## 🛠️ Tech Stack

* **HTML5:** Semantic structure and custom modal implementation.
* **CSS3:** Flexbox, Backdrop Filters, Keyframe Animations, and Custom Properties.
* **JavaScript (ES6+):** ES6 Classes, Arrow Functions, Array Methods (`filter`, `map`, `sort`), Event Delegation, and the DOM API.

## 🚀 Getting Started

Since this project relies completely on native web technologies, there are no dependencies or build tools required.

1. Clone the repository:
   ```bash
   git clone https://github.com/M-besheer/Lab4-Todolist-app-IP.git
   ```
2. Navigate to the project folder.

3. Open `index.html` in your favorite web browser.

## 🧠 Architecture Overview
This project was intentionally built without global variables or tangled event listeners.

`TodoModel`: Manages the source of truth (`this.tasks`) and handles all localStorage commits.

`TodoView`: Manages the DOM. It acts as a "dumb" presentation layer that uses Event Delegation to pass user actions (clicks, inputs) back to the Controller.

`TodoController`: The middleman that wires the Model and View together, ensuring data and UI stay perfectly in sync.
