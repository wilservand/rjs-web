# PT. Renindo Jaya Sukses — Corporate Website & Customs Assistant

A premium, high-performance corporate landing page built for **PT. Renindo Jaya Sukses** (RJS), a dedicated Customs Clearance (PPJK) service provider based in Batam, Indonesia. The website features a floating, real-time AI Customs Assistant powered by Google Gemini.

## 🚀 Features

- **Corporate Landing Sections:** Home, About Us, Core Services (Customs Clearance, PIB/PEB documentation, FTZ handling), and Contact/Map Location.
- **AI Customs Assistant:** Floating conversational chat widget that answers general customs regulations and Batam Free Trade Zone (FTZ) inquiries.
- **Premium UI/UX:**
  - Animated pulsing typing indicator ("Thinking..." states).
  - Smooth custom scrollbars for the chat container.
  - Dynamic mobile hamburger menu utilizing CSS-only transform transitions.
  - Throttled scroll performance optimization.
  - Markdown support inside chat bubbles (rendering bold text, links, code blocks, lists).
- **Stateless Multi-User Sessions:** Conversation history is tracked client-side in the JavaScript runtime and sent to a stateless backend, ensuring visitors never overlap or leak chat sessions.

---

## 🛠️ Technology Stack

- **Structure:** HTML5 (Semantic tags, SVG icons)
- **Styling:** Vanilla CSS3 (Custom properties/variables, media queries, flexbox, grid, keyframe animations)
- **Interactivity:** Vanilla JavaScript
- **Libraries:** [marked.js](https://github.com/markedjs/marked) (Loaded via jsDelivr public CDN to parse Markdown responses)

---

## 💻 Local Setup & Development

1. **Clone/Download the files:** Ensure `index.html`, `styles.css`, and `script.js` are in the same folder.
2. **Open the project:**
   - Double-click [index.html](index.html) to open it in your browser directly.
   - Alternatively, serve it locally with Python:
     ```bash
     python -m http.server 3000
     ```
     Then open `http://localhost:3000` in your web browser.

---

## ⚙️ Configuration

To connect the chatbot to your live backend server:
1. Open [script.js](script.js).
2. Locate the `fetch()` URL inside `sendMessage()` (around line 157).
3. Update the endpoint to point to your deployed production URL:
   ```javascript
   const response = await fetch('https://your-chatbot-backend.onrender.com/api/chat', { ... })
   ```

---

## 📝 Author & Creator

- **Developer:** Wilhelmus Ervando Walangare
- **Affiliation:** PT. Renindo Jaya Sukses
- **Portfolio:** [wervando.vercel.app](https://wervando.vercel.app)
