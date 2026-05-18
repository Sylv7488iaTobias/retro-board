# retro-board

> Minimal self-hosted retrospective board with real-time collaboration and export to Markdown.

---

## Features

- 🗂 Organize feedback into **Went Well**, **To Improve**, and **Action Items** columns
- ⚡ Real-time collaboration powered by WebSockets
- 📄 Export your board to a clean Markdown file
- 🏠 Fully self-hosted — your data stays yours

---

## Installation

```bash
git clone https://github.com/your-username/retro-board.git
cd retro-board
npm install && npm run build && npm start
```

---

## Usage

Once the server is running, open your browser at `http://localhost:3000`.

1. Create a new board and share the URL with your team.
2. Add cards to any column in real time.
3. When the retro is done, click **Export → Markdown** to download a summary.

**Example exported output:**

```markdown
## Retro — 2024-06-10

### ✅ Went Well
- Smooth deployment pipeline

### 🔧 To Improve
- Clearer ticket descriptions

### 🎯 Action Items
- [ ] Set up weekly sync (@alice)
```

---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Real-time:** Socket.IO
- **Frontend:** Vite + React

---

## License

[MIT](LICENSE) © 2024 Your Name