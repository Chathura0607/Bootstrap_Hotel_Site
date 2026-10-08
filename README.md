# 🏨 Nexus Inn Hotels & Resorts — 5-Star Luxury Web Experience

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Custom CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Vanilla JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive Design](https://img.shields.io/badge/Responsive-Mobile_First-00C853?style=for-the-badge&logo=googlechrome&logoColor=white)](#)

> A modern, ultra-responsive, five-star luxury hotel web application built purely with **HTML5, Bootstrap 5.3, Custom Glassmorphic CSS3, and Vanilla JavaScript**. Designed to deliver an opulent guest experience with 100% working interactive features, secure client-side state management, and seamless cross-device adaptability.

---

## ✨ Key Interactive Features

### 1. 🛎️ Real-Time Live Fare Booking Engine
- **Instant Cost Calculation**: Dynamically updates nights count, room subtotal, 10% luxury service fee, 5% government tax, and final estimated total in real-time as users change check-in/out dates, guest counts, or suite selections.
- **Promo Code Voucher System**: Live validation for VIP promo codes:
  - `WELCOME10`: 10% discount on all bookings.
  - `NEXUSVIP`: 20% discount on luxury escapes.
  - `EARLYBIRD`: 15% discount on advance stays.
- **Form Validation & Date Constraints**: Automated check-in/out date pickers with minimum stay rules and intelligent date auto-adjustment.

### 2. 📄 Clean 1-Page Printable Confirmation Voucher
- Generates an official, dedicated reservation voucher with unique booking reference ID (`NX-XXXXXX`), guest breakdown, and security badge.
- Utilizes `window.printCleanVoucher()` to isolate the receipt and print a pristine single-page document with an official header and watermark, eliminating background page cloning.

### 3. ⚖️ Side-by-Side Suite Comparison Tool
- Compare up to **3 luxury suites/villas** simultaneously.
- Floating glassmorphic bottom drawer with live circular thumbnails and selected counter.
- Comprehensive side-by-side comparison modal covering:
  - High-resolution gallery preview
  - Real-time converted pricing per night
  - Floor area (sq. ft. & m²)
  - Bedding configuration & maximum guest capacity
  - Scenic outlook (Ocean, Skyline, Garden)
  - Star ratings & verified guest review volume
  - Included VIP privileges and perks
  - Top amenities tags & cancellation policy
  - Direct booking and details triggers

### 4. 🔍 Filterable Rooms & Services Catalog
- **Category Tabs**: Filter between All, Ocean View, Penthouses, Private Villas, and Executive Suites.
- **Live Price Range Slider**: Adjust maximum budget with live currency display.
- **Live Search & Sorting**: Instant real-time search by keywords or amenities, with multi-criteria sorting (Price Low-to-High, Price High-to-Low, Rating, Room Size).

### 5. 💱 Dynamic Multi-Currency Converter
- Live currency switching across **USD ($), LKR (Rs.), EUR (€), and GBP (£)**.
- Automatically updates all displayed prices, catalog rate tags, comparison matrixes, and live fare summaries instantly.
- Preference saved to `localStorage`.

### 6. ⭐ Verified Guest Reviews & LocalStorage Persistence
- Interactive 5-star review submission modal with live DOM updates.
- Complete booking storage with "My Reservations" modal drawer allowing users to review, reprint vouchers, or cancel active bookings.

### 7. 🖼️ Full-Screen Lightbox Photo Gallery
- Filterable multi-category resort photo gallery (Suites, Dining, Pools, Spa, Architecture, Events).
- Custom full-screen modal lightbox with keyboard arrow navigation (`←` / `→`) and responsive zoom overlays.

### 8. 🛡️ Security & Performance Best Practices
- **XSS Prevention**: DOM sanitization using `window.escapeHTML()` on all dynamic guest inputs.
- **Anti-Spam Protection**: Invisible honeypot trap on inquiry forms.
- **No Heavy Framework Overhead**: Built with lightweight native web technologies for lightning-fast initial load times.

---

## 📁 Project Architecture & Directory Structure

```text
Bootstrap_Hotel_Site-main/
│
├── index.html                  # Main luxury landing page & hero carousel
├── README.md                   # Project documentation & overview
│
├── pages/
│   ├── rooms.html              # Filterable suites catalog & comparison drawer
│   ├── services.html           # Dining, Lotus Spa & excursions catalog
│   ├── gallery.html            # Lightbox photo gallery with category filters
│   ├── about.html              # Resort heritage, pillars, awards & timeline
│   └── contact.html            # VIP concierge inquiries, honeypot & live map
│
└── assets/
    ├── css/
    │   └── style.css           # 5-star custom design system & print styles
    ├── js/
    │   ├── rooms-data.js       # Master inventory repository & exchange rates
    │   └── main.js             # Core application logic & UI controllers
    ├── images/                 # Optimized luxury suite & resort imagery
    └── videos/                 # High-definition promotional experience tour
```

---

## 🚀 Getting Started & Local Development

No complex build tools, Node runtime, or dependencies required.

### Method 1: Direct File Open
Double-click `index.html` in your file explorer to open the site directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari).

### Method 2: Local HTTP Server (Recommended)
Using Python:
```bash
python -m http.server 8080
```
Then visit:
```text
http://localhost:8080/index.html
```

Using VS Code:
- Install the **Live Server** extension.
- Right-click `index.html` and select **"Open with Live Server"**.

---

## 🎨 Design System & Color Palette

| Token | Hex Value | Description |
| :--- | :--- | :--- |
| **Gold Primary** | `#d4af37` | Luxury accent, active highlights, key CTA buttons |
| **Gold Light** | `#f3e5ab` | Subtle golden tints and delicate borders |
| **Dark 950** | `#070a0f` | Deep obsidian background |
| **Dark 900** | `#0c1017` | Card backgrounds and modal containers |
| **Glass Border**| `rgba(212, 175, 55, 0.2)` | Translucent borders for glassmorphism cards |

---

## 🌐 Browser Compatibility & Standards

- ✅ Google Chrome (Latest)
- ✅ Microsoft Edge (Latest)
- ✅ Mozilla Firefox (Latest)
- ✅ Apple Safari (Latest)
- ✅ Opera & Brave (Latest)
- ✅ Fully tested on iOS Safari & Android Chrome

---

## 👨‍💻 Author & Credits

- **Project Lead & Developer**: Chathura Lakmina
- **Organization**: Nexus Inn Hotels & Resorts Group
- **License**: MIT License — Free to use for educational and commercial showcases.
