# 🎨 Figma Export & Design Guide for Solar Explorer

Here are two easy ways to open and edit the exact UI inside Figma, along with the complete design token specification.

---

## ⚡ Method 1: Instant Drag & Drop (Recommended)

We generated high-fidelity vector design files for each page. You can drag and drop them directly onto any Figma canvas:

1. Open [Figma](https://www.figma.com/) and create a **New design file**.
2. Open your file explorer and go to: `solar-system/figma/`
3. Drag & drop these files directly into Figma:
   - **[`figma_landing_page.svg`](figma_landing_page.svg)** — Full landing page mockup (Desktop 1440x900)
   - **[`figma_planets_page.svg`](figma_planets_page.svg)** — 8 planet cards layout (Desktop 1440x1020)
   - **[`figma_missions_page.svg`](figma_missions_page.svg)** — 6 space missions layout (Desktop 1440x920)
4. Figma will automatically convert all elements into **editable vector shapes, frames, layers, colors, and text**.

---

## 🔌 Method 2: 1-Click Import via "html.to.design" Plugin

If you want Figma to automatically generate Auto-Layout frames directly from your live code:

1. In Figma, click on **Plugins** -> Search for **`html.to.design`** (free).
2. Run the plugin.
3. Choose **Import URL** or **Chrome Extension** (for local files).
4. If your repo is on GitHub Pages (e.g. `https://harsh33t.github.io/webdev-project/`), paste the URL and click **Import**.
5. The plugin creates pixel-perfect Figma components with Auto-Layout, variants, and text styles.

---

## 📐 Design System & UI Specifications

### 🎨 Color Palette
- **Primary Background**: `#000000` (Pure Black)
- **Secondary Surfaces / Cards**: `#0d0d0d`
- **Card & Divider Borders**: `#262626` / `#222222` (1px solid)
- **Brand Accent / Logo**: `pink` / `#ffc0cb`
- **Headings & Body Text**: `#ffffff` (White, opacity 0.85 – 1.0)
- **Buttons**:
  - Normal: Background `#ffffff`, Text `#000000`, Border 1px `#ffffff`
  - Hover: Background `#38bdf8` (Cyan), Text `#000000`
- **Footer Text**: `#ffffff` (opacity 0.6)

### 🔤 Typography
- **Font Family**: `'Century Gothic'`, `'Trebuchet MS'`, `Arial`, `sans-serif`
- **Landing Hero Title**: `52px` (Bold, letter-spacing `3px`)
- **Page Titles**: `36px` (Bold)
- **Card Headings**: `19px` (Bold)
- **Body / Descriptions**: `14px` (Line-height `1.4`)
- **Buttons & Nav Items**: `15px` (Bold)

### 📦 Layout & Dimensions
- **Desktop Artboard**: `1440px` width
- **Navbar**: Height `65px`, Padding `15px 30px`
- **Planet Cards**: Width `230px`, Height `260px`, Padding `20px 15px`, Gap `20px`
- **Mission Cards**: Width `320px`, Height `240px`, Padding `20px 15px`, Gap `20px`
- **Corners**: `0px` (Square, no curved border-radius)
