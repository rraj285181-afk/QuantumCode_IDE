# CodeXrun IDE - Stylish Online Compiler

A premium, modern web-based development environment (IDE) and compiler that executes Python, Java, C, and C++ code.

## Key Features

- **Stylish Dark Theme**: Premium styling featuring glassmorphism, responsive grid layout, visual stats bar, and custom controls.
- **Monaco Editor Support**: Uses VS Code's editor engine, providing high-quality code completion, auto-indentation, find & replace, and code map.
- **Virtual File Manager**: Support for creating, renaming, and deleting multiple files, which are persisted inside the browser's `localStorage`.
- **Real Compilation & Execution**: Connects to the public sandboxed **Piston API** to compile and run code on rapid secure servers.
- **Multi-File Compile Support**: Automatically includes files of the same language in the workspace when running compilation.
- **XSS Resistant**: Designed using secure Vanilla JS DOM interfaces to prevent compilation logs from triggering client-side scripts.
- **Stdin Input Channel**: Feed line-by-line keyboard input to running console applications.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher recommended)
- `npm` (installed automatically with Node.js)

### Installation & Run

1. Open a terminal in the project directory.
2. Install local development dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (typically `http://127.0.0.1:5173`) in your web browser.

## Custom Keyboard Shortcuts

- `Ctrl` + `Enter`: Run code immediately.
- `Ctrl` + `S`: Force save workspace files to storage.
- `Alt` + `N`: Focus File Explorer and trigger the new file wizard.
