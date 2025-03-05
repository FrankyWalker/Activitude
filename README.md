# Repl Academy: Teach Rust

Welcome to **Repl Academy: Teach Rust**! This project is designed as an interactive and beginner-friendly platform to help users learn and practice the **Rust programming language**. Whether you're just starting with Rust or looking to enhance your skills, this project provides a structured learning experience.

## 🚀 Features

- **Interactive Lessons**: Step-by-step lessons designed to build Rust knowledge from basic to advanced levels.
- **Code Playground**: Write, test, and debug Rust code directly within the platform. Experiment with Rust without any additional setup!
- **Challenges**: Solve real-world coding tasks to apply your newly learned skills.
- **Progress Tracking**: Keep track of your progress and revisit your lessons for review.
- **Rust Code Editor**: A custom embeddable editor with syntax highlighting using CodeMirror, featuring the [One Dark Theme](https://codemirror.net/) for enhanced readability.
- **Hints & Support**: Get helpful hints and debugging tips along the way.

## 🛠️ Tech Stack

This project is built using the following technologies:

- **Frontend**:
    - ⚛️ [React](https://reactjs.org/) (v19.0.0) for the user interface.
    - 📜 [CodeMirror](https://codemirror.net/) for the Rust code editor (`@codemirror/lang-rust` and `@codemirror/theme-one-dark`).
    - 💅 [Styled-Components](https://styled-components.com/) for custom styling.
    - [Framer Motion](https://www.framer.com/motion/) for interactive animations.
- **State Management**:
    - 🟥 [Redux Toolkit](https://redux-toolkit.js.org/) (v2.5.1) and [React-Redux](https://react-redux.js.org/) for state management.
- **Backend**:
    - 🛠️ [Firebase](https://firebase.google.com/) for authentication, database, and hosting.
- **Miscellaneous**:
    - 🌟 [Monaco Editor](https://microsoft.github.io/monaco-editor/) via `@monaco-editor/react` for an advanced editor experience.

## 🎓 Learning Outcomes

By engaging with this project, users will:

1. Understand fundamental Rust concepts (ownership, borrowing, structs, enums, etc.).
2. Write efficient, readable, and secure Rust code.
3. Solve programming challenges that emphasize problem-solving and Rust best practices.
4. Use Rust tooling such as `cargo` for building and testing applications.

## 🔥 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v16 or later)
- [npm](https://www.npmjs.com/) (v7 or later) for managing dependencies.

You do **not** need Rust installed on your local machine, as the project uses an in-browser Rust environment.

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/repl-academy-teach-rust.git
   cd repl-academy-teach-rust
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Visit the app in your browser at [http://localhost:3000](http://localhost:3000).

---

### Project Structure

Here's a quick overview of the project directory structure:

```plaintext
/src
 ├── components        # Reusable React components
 ├── pages             # Main pages (e.g., Lessons, Challenges, Editor)
 ├── redux             # Redux slices for state management
 ├── services          # API and utility services
 ├── styles            # Global and shared styles
 └── App.js            # Main application entry point
```

---

## 🧪 Testing

We encourage writing tests to ensure a consistent and bug-free experience.

1. Run unit tests:

   ```bash
   npm test
   ```

2. For end-to-end testing, consider using tools like [Cypress](https://www.cypress.io/) or [Testing Library](https://testing-library.com/).

---

## 🚧 Roadmap

Planned features for future updates:

- **Gamification**: Add badges and points for completing lessons and challenges.
- **Multiplayer Support**: Collaborate with other learners and solve challenges together.
- **Offline Mode**: Download lessons for offline learning.
- **Code Refactoring Tools**: Get tips on how to write better Rust code.

---

## 💬 Support

If you encounter any issues or have questions, feel free to open an issue in the repository or reach out to us at **support@replacademy.com**.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more details.

---

Happy Learning! 🎉