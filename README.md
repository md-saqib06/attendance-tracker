<div align="center">
  <h1>🎯 Attendance Tracker</h1>
  <p>A modern, full-featured attendance tracking web application built with React, TypeScript, and Vite. The system provides secure authentication, real-time analytics, and a clean, responsive UI for managing class attendance efficiently.</p>

  <p>
    <a href="https://tracker.pegioncloud.com">View Demo</a>
    ·
    <a href="https://github.com/md-saqib06/internhunt/issues">Report Bug</a>
    ·
    <a href="https://deepwiki.com/md-saqib06/attendance-tracker">Documentation</a>
  </p>
</div>

---

## 🌟 Features

- 🔐 Authentication via Clerk (with social login)
- 📊 Real-time attendance statistics using Recharts
- 🧾 Track and manage attendance records
- 📆 Calendar view and date-picker integration
- 🌙 Light/Dark theme toggle
- 📱 Responsive, modern UI using TailwindCSS + Radix UI
- 🔧 Built with Vite for fast dev experience

---

## 🛠 Tech Stack

| Layer        | Technology                        |
|-------------|-----------------------------------|
| Frontend     | React, TypeScript, Vite          |
| UI/UX        | TailwindCSS, Radix UI, Lucide Icons |
| Charts       | Recharts                         |
| Auth         | Clerk                            |
| Routing      | React Router DOM                 |
| Date Utils   | date-fns, react-day-picker       |

---

## 📂 Project Structure

```
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
```

---

## 🚀 Setup Instructions


### 1. Clone the repo
```bash
git clone https://github.com/md-saqib06/attendance-tracker.git
cd attendance-tracker
```

### 2. Install dependencies
```js
bun install
```

### 3. Add environment variables
```bash
touch .env
```

### Fill in the Clerk publishable key
```env
CLERK_PUBLISHABLE_KEY=your_key_here
```

### 4. Start the dev server
```js
bun dev
```

---

## 📘 Documentation

For complete architecture, flow diagrams, and component breakdowns, check the full documentation on DeepWiki:

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/md-saqib06/attendance-tracker)

---

## 📄 License

MIT License © [md-saqib06](https://github.com/md-saqib06)
