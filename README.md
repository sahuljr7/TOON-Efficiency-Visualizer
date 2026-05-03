# TOON (Token-Oriented Object Notation) Efficiency Dashboard

TOON is a transformer-optimized data format designed to reduce token overhead when passing structured data to Large Language Models (LLMs). This dashboard allows you to convert standard JSON into TOON, analyze token savings, and visualize the increased data density.

## 🚀 Why TOON?

Standard JSON is designed for machine-to-machine communication but is highly inefficient for LLM context windows. It suffers from:
- **Key Redundancy:** Repeating keys (like `"id"`, `"name"`) for every object in an array.
- **Structural Noise:** Braces `{}`, brackets `[]`, and quotes `""` consume valuable tokens.
- **Attention Overload:** LLMs must "attend" to these structural markers repeatedly.

**TOON removes this tax, typically saving 30-60% of your token budget.**

## ✨ Features

- **Instant Conversion:** Paste JSON and see it transformed into high-density TOON format.
- **Real-time Token Analysis:** Compare JSON vs. TOON token counts using a 3.5 chars/token heuristic.
- **Visual Breakdown:** A dashboard-style interface showing reduction percentages and structural signal maps.
- **Responsive Design:** Optimized for mobile, tablet, and desktop views.
- **Interactive Highlighting:** Visually distinguish between schema logic and raw data.
- **URL Persistence:** Share your JSON input via encoded URL parameters.
- **Copy & Export:** Quickly copy optimized TOON for your next LLM prompt.

## 🛠️ Getting Started

### 1. Requirements
- Node.js (v18+)
- npm or yarn

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Development
```bash
# Start the development server
npm run dev
```

### 4. Build
```bash
# Build for production
npm run build
```

## 📖 How it Works

TOON follows a simple, high-density specification:
1. **Schema Hoisting:** The keys and collection name are declared once in a header.
   - Format: `collection[count]{key1,key2,...}:`
2. **Normalized Rows:** Data rows follow the header, separated by commas.
   - Format: `val1,val2,val3`

### Example
**JSON (Inefficient):**
```json
[
  {"id": 1, "status": "active"},
  {"id": 2, "status": "pending"}
]
```

**TOON (Optimized):**
```text
items[2]{id,status}:
1,active
2,pending
```

## 🧠 Technical Architecture

- **Frontend:** React 18+ with TypeScript
- **Styling:** Tailwind CSS (v4) with custom premium SaaS theme
- **Animations:** Framer Motion (`motion/react`)
- **Data Viz:** Recharts for responsive token distribution charts
- **Icons:** Lucide React

## ♿ Accessibility & UX
- Fully responsive layout with mobile-specific tab navigation.
- High-contrast color palette for readability.
- Keyboard-friendly interactions.
- Immediate visual feedback on copy/export.

---

*Built for the LLM Era. Optimize your context windows today.*
