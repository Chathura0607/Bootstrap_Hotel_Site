/**
 * NEXUS INN HOTELS & RESORTS - MAIN APPLICATION LOGIC
 * High-performance, modular, secure JavaScript engine
 */

(function () {
  "use strict";

  // ==========================================
  // 1. GLOBAL STATE & SECURITY UTILITIES
  // ==========================================

  // Prevent XSS vulnerability: Sanitize strings before DOM insertion
  window.escapeHTML = function (str) {
    if (typeof str !== "string") return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Currency State
  let currentCurrency = localStorage.getItem("nexus_currency") || "USD";

  window.formatPrice = function (priceInUSD) {
    const config = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.USD;
    const converted = Math.round(priceInUSD * config.rate);
    return `${config.symbol} ${converted.toLocaleString()}`;
  };

  window.getCurrencySymbol = function () {
    return (CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.USD).symbol;
  };

  window.setCurrency = function (newCurrency) {
    if (CURRENCY_RATES[newCurrency]) {
      currentCurrency = newCurrency;
      localStorage.setItem("nexus_currency", newCurrency);
      document.querySelectorAll(".currency-display-value").forEach((el) => {
        const usdVal = parseFloat(el.getAttribute("data-usd"));
        if (!isNaN(usdVal)) {
          el.textContent = window.formatPrice(usdVal);
        }
      });
      document.querySelectorAll(".currency-selector-select").forEach((sel) => {
        sel.value = newCurrency;
      });
      // Re-trigger live calculation if booking modal is open
      if (typeof window.updateBookingCostEstimate === "function") {
        window.updateBookingCostEstimate();
      }
      showToast("Currency Updated", `Prices are now displayed in ${CURRENCY_RATES[newCurrency].name}`);
    }
  };

  // ==========================================
  // 2. TOAST NOTIFICATION HELPER
  // ==========================================
  window.showToast = function (title, message, type = "gold") {
    let container = document.getElementById("luxuryToastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "luxuryToastContainer";
      container.className = "toast-container position-fixed bottom-0 end-0 p-3";
      container.style.zIndex = "1090";
      document.body.appendChild(container);
    }

    const toastId = "toast_" + Date.now();
    const icon = type === "success" ? "fa-circle-check text-success" : type === "error" ? "fa-circle-exclamation text-danger" : "fa-bell text-warning";

    const toastHtml = `
      <div id="${toastId}" class="toast toast-luxury align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <i class="fa-solid ${icon} me-2"></i>
          <strong class="me-auto">${window.escapeHTML(title)}</strong>
          <small class="text-muted">Just now</small>
          <button type="button" class="btn-close btn-close-luxury" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${window.escapeHTML(message)}
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", toastHtml);
    const toastEl = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4500 });
    bsToast.show();
    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
  };

  // ==========================================
  // 3. NAVBAR, SCROLL & BACK-TO-TOP
  // ==========================================
  document.addEventListener("DOMContentLoaded", () => {
    // Navbar scroll effect
    const navbar = document.querySelector(".navbar-luxury");
    const backToTopBtn = document.getElementById("backToTopBtn");

    window.addEventListener("scroll", () => {
      const scrollPos = window.scrollY;
      if (navbar) {
        if (scrollPos > 50) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }

      if (backToTopBtn) {
        if (scrollPos > 300) {
          backToTopBtn.classList.add("show");
        } else {
          backToTopBtn.classList.remove("show");
        }
      }
    });

    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Currency Switcher Listeners
    document.querySelectorAll(".currency-selector-select").forEach((select) => {
      select.value = currentCurrency;
      select.addEventListener("change", (e) => {
        window.setCurrency(e.target.value);
      });
    });

    // Initialize Default Dates for Booking Inputs
    initDatePickers();

    // Attach real-time Live Fare calculation listeners
    const modalRoomSelect = document.getElementById("bookingModalRoomSelect");
    const modalCheckin = document.getElementById("bookingModalCheckin");
    const modalCheckout = document.getElementById("bookingModalCheckout");
    const modalPromo = document.getElementById("bookingModalPromo");
    const modalGuests = document.getElementById("bookingModalGuests");

    if (modalRoomSelect) {
      modalRoomSelect.addEventListener("change", () => window.updateBookingCostEstimate());
      modalRoomSelect.addEventListener("input", () => window.updateBookingCostEstimate());
    }
    if (modalCheckin) {
      modalCheckin.addEventListener("change", () => window.updateBookingCostEstimate());
      modalCheckin.addEventListener("input", () => window.updateBookingCostEstimate());
    }
    if (modalCheckout) {
      modalCheckout.addEventListener("change", () => window.updateBookingCostEstimate());
      modalCheckout.addEventListener("input", () => window.updateBookingCostEstimate());
    }
    if (modalPromo) {
      modalPromo.addEventListener("input", () => window.updateBookingCostEstimate());
      modalPromo.addEventListener("keyup", () => window.updateBookingCostEstimate());
      modalPromo.addEventListener("change", () => window.updateBookingCostEstimate());
    }
    if (modalGuests) {
      modalGuests.addEventListener("change", () => window.updateBookingCostEstimate());
    }

    // Initialize Global Booking Count Badge
    updateBookingCountBadge();

    // Check if on specific pages and initialize page-specific modules
    initPageModules();
  });

  // ==========================================
  // 4. DATE PICKERS INITIALIZATION
  // ==========================================
  function initDatePickers() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkinInputs = document.querySelectorAll(".checkin-date-input");
    const checkoutInputs = document.querySelectorAll(".checkout-date-input");

    const formatDateStr = (d) => d.toISOString().split("T")[0];

    const todayStr = formatDateStr(today);
    const tomorrowStr = formatDateStr(tomorrow);

    checkinInputs.forEach((input) => {
      input.min = todayStr;
      if (!input.value) input.value = todayStr;

      input.addEventListener("change", (e) => {
        const newCheckin = new Date(e.target.value);
        const nextDay = new Date(newCheckin);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = formatDateStr(nextDay);

        checkoutInputs.forEach((outInput) => {
          outInput.min = nextDayStr;
          if (new Date(outInput.value) <= newCheckin) {
            outInput.value = nextDayStr;
          }
        });
        if (typeof window.updateBookingCostEstimate === "function") {
          window.updateBookingCostEstimate();
        }
      });
    });

    checkoutInputs.forEach((input) => {
      input.min = tomorrowStr;
      if (!input.value) input.value = tomorrowStr;

      input.addEventListener("change", () => {
        if (typeof window.updateBookingCostEstimate === "function") {
          window.updateBookingCostEstimate();
        }
      });
    });
  }

  // ==========================================
  // 5. BOOKING ENGINE & LOCALSTORAGE MANAGER
  // ==========================================
  window.getBookings = function () {
    try {
      const stored = localStorage.getItem("nexus_inn_bookings");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  window.saveBooking = function (bookingObj) {
    const bookings = window.getBookings();
    bookings.unshift(bookingObj);
    localStorage.setItem("nexus_inn_bookings", JSON.stringify(bookings));
    updateBookingCountBadge();
    return bookingObj;
  };

  window.cancelBooking = function (bookingId) {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    let bookings = window.getBookings();
    bookings = bookings.filter((b) => b.id !== bookingId);
    localStorage.setItem("nexus_inn_bookings", JSON.stringify(bookings));
    updateBookingCountBadge();
    renderMyBookingsList();
    showToast("Booking Cancelled", "Your reservation has been cancelled successfully.", "success");
  };

  // Safe DOM text/HTML setters to prevent null pointer crashes
  function setSafeText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setSafeHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // Update Booking Count Badge
  function updateBookingCountBadge() {
    const count = window.getBookings().length;
    document.querySelectorAll(".my-bookings-count").forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? "inline-block" : "none";
    });
  }

  // Open Direct Room Booking Modal
  window.openBookingModal = function (roomId = "deluxe-ocean-view") {
    const room = HOTEL_ROOMS_DATA.find((r) => r.id === roomId) || HOTEL_ROOMS_DATA[0];
    const modalEl = document.getElementById("roomBookingModal");
    if (!modalEl) return;

    const modalRoomSelect = document.getElementById("bookingModalRoomSelect");
    if (modalRoomSelect) {
      modalRoomSelect.value = room.id;
    }

    setSafeText("bookingModalRoomTitle", room.name);
    setSafeText("bookingModalRoomPrice", `${window.formatPrice(room.priceUSD)} / night`);

    window.updateBookingCostEstimate();

    let bsModal = bootstrap.Modal.getInstance(modalEl);
    if (!bsModal) {
      bsModal = new bootstrap.Modal(modalEl);
    }
    bsModal.show();
  };

  // Live Cost Estimate Calculation
  window.updateBookingCostEstimate = function () {
    const roomSelect = document.getElementById("bookingModalRoomSelect");
    const checkinInput = document.getElementById("bookingModalCheckin");
    const checkoutInput = document.getElementById("bookingModalCheckout");
    const guestsInput = document.getElementById("bookingModalGuests");
    const promoInput = document.getElementById("bookingModalPromo");

    if (!roomSelect || !checkinInput || !checkoutInput) return;

    const room = HOTEL_ROOMS_DATA.find((r) => r.id === roomSelect.value) || HOTEL_ROOMS_DATA[0];

    setSafeText("bookingModalRoomTitle", room.name);
    setSafeText("bookingModalRoomPrice", `${window.formatPrice(room.priceUSD)} / night`);

    let checkin = new Date(checkinInput.value);
    let checkout = new Date(checkoutInput.value);

    if (isNaN(checkin.getTime())) {
      checkin = new Date();
      checkinInput.value = checkin.toISOString().split("T")[0];
    }
    if (isNaN(checkout.getTime()) || checkout <= checkin) {
      checkout = new Date(checkin);
      checkout.setDate(checkout.getDate() + 1);
      checkoutInput.value = checkout.toISOString().split("T")[0];
    }

    const diffTime = Math.abs(checkout.getTime() - checkin.getTime());
    let nights = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

    let subtotalUSD = room.priceUSD * nights;

    // Check promo code
    let discountPercent = 0;
    const promo = (promoInput ? promoInput.value : "").trim().toUpperCase();
    if (promo === "WELCOME10") discountPercent = 0.10;
    else if (promo === "NEXUSVIP") discountPercent = 0.20;
    else if (promo === "EARLYBIRD") discountPercent = 0.15;

    const discountAmountUSD = subtotalUSD * discountPercent;
    const discountedSubtotal = subtotalUSD - discountAmountUSD;
    const serviceFeeUSD = discountedSubtotal * 0.10; // 10% service charge
    const taxUSD = discountedSubtotal * 0.05; // 5% luxury tax
    const totalUSD = discountedSubtotal + serviceFeeUSD + taxUSD;

    setSafeText("estimateNightsCount", `${nights} night${nights > 1 ? "s" : ""}`);
    setSafeText("estimateSubtotal", window.formatPrice(subtotalUSD));

    const discountRow = document.getElementById("estimateDiscountRow");
    if (discountRow) {
      if (discountPercent > 0) {
        discountRow.style.display = "flex";
        setSafeText("estimateDiscount", `-${window.formatPrice(discountAmountUSD)} (${Math.round(discountPercent * 100)}%)`);
      } else {
        discountRow.style.display = "none";
      }
    }
    setSafeText("estimateServiceFee", window.formatPrice(serviceFeeUSD));
    setSafeText("estimateTax", window.formatPrice(taxUSD));
    setSafeText("estimateTotal", window.formatPrice(totalUSD));
  };

  // Submit Booking Form
  window.submitBookingForm = function (e) {
    if (e) e.preventDefault();

    const form = document.getElementById("luxuryBookingForm");
    if (!form || !form.checkValidity()) {
      if (form) form.reportValidity();
      return;
    }

    const roomSelect = document.getElementById("bookingModalRoomSelect");
    const checkinInput = document.getElementById("bookingModalCheckin");
    const checkoutInput = document.getElementById("bookingModalCheckout");
    const guestsInput = document.getElementById("bookingModalGuests");
    const nameInput = document.getElementById("bookingGuestName");
    const emailInput = document.getElementById("bookingGuestEmail");
    const phoneInput = document.getElementById("bookingGuestPhone");
    const requestsInput = document.getElementById("bookingSpecialRequests");
    const promoInput = document.getElementById("bookingModalPromo");

    const room = HOTEL_ROOMS_DATA.find((r) => r.id === roomSelect.value) || HOTEL_ROOMS_DATA[0];
    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);
    const diffTime = Math.abs(checkout.getTime() - checkin.getTime());
    const nights = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

    let discountPercent = 0;
    const promo = (promoInput ? promoInput.value : "").trim().toUpperCase();
    if (promo === "WELCOME10") discountPercent = 0.10;
    else if (promo === "NEXUSVIP") discountPercent = 0.20;
    else if (promo === "EARLYBIRD") discountPercent = 0.15;

    const subtotalUSD = room.priceUSD * nights;
    const discountAmountUSD = subtotalUSD * discountPercent;
    const totalUSD = (subtotalUSD - discountAmountUSD) * 1.15;

    const referenceId = "NX-" + Math.floor(100000 + Math.random() * 900000);

    const newBooking = {
      id: referenceId,
      roomName: room.name,
      roomId: room.id,
      roomImage: room.images[0],
      checkin: checkinInput.value,
      checkout: checkoutInput.value,
      nights: nights,
      guests: guestsInput ? guestsInput.value : 2,
      guestName: nameInput.value.trim(),
      guestEmail: emailInput.value.trim(),
      guestPhone: phoneInput.value.trim(),
      specialRequests: requestsInput ? requestsInput.value.trim() : "",
      totalUSD: totalUSD,
      currency: currentCurrency,
      totalFormatted: window.formatPrice(totalUSD),
      bookedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      status: "Confirmed"
    };

    window.saveBooking(newBooking);

    // Hide booking modal
    const bookingModalEl = document.getElementById("roomBookingModal");
    if (bookingModalEl) {
      const bsModal = bootstrap.Modal.getInstance(bookingModalEl);
      if (bsModal) bsModal.hide();
    }

    // Show Confirmation Voucher Modal
    window.showBookingConfirmationModal(newBooking);
  };

  // Show Booking Confirmation Voucher
  window.showBookingConfirmationModal = function (booking) {
    const modalEl = document.getElementById("bookingConfirmationModal");
    if (!modalEl) return;

    setSafeText("confirmVoucherRef", booking.id);
    setSafeText("confirmVoucherGuest", booking.guestName);
    setSafeText("confirmVoucherEmail", booking.guestEmail);
    setSafeText("confirmVoucherPhone", booking.guestPhone);
    setSafeText("confirmVoucherRoom", booking.roomName);
    setSafeText("confirmVoucherDates", `${booking.checkin} → ${booking.checkout} (${booking.nights} night${booking.nights > 1 ? "s" : ""})`);
    setSafeText("confirmVoucherGuests", `${booking.guests} Guest(s)`);
    setSafeText("confirmVoucherTotal", booking.totalFormatted);
    setSafeText("confirmVoucherDate", booking.bookedAt);

    let bsConfirmModal = bootstrap.Modal.getInstance(modalEl);
    if (!bsConfirmModal) {
      bsConfirmModal = new bootstrap.Modal(modalEl);
    }
    bsConfirmModal.show();
  };

  // Clean Single-Page Luxury Voucher Printing
  window.printCleanVoucher = function () {
    const ref = document.getElementById("confirmVoucherRef")?.textContent || "NX-2026-VIP";
    const guest = document.getElementById("confirmVoucherGuest")?.textContent || "Honored Guest";
    const guestsCount = document.getElementById("confirmVoucherGuests")?.textContent || "2 Guests";
    const room = document.getElementById("confirmVoucherRoom")?.textContent || "Luxury Suite";
    const dates = document.getElementById("confirmVoucherDates")?.textContent || "";
    const email = document.getElementById("confirmVoucherEmail")?.textContent || "";
    const phone = document.getElementById("confirmVoucherPhone")?.textContent || "";
    const date = document.getElementById("confirmVoucherDate")?.textContent || "Today";
    const total = document.getElementById("confirmVoucherTotal")?.textContent || "";

    const printWin = window.open("", "_blank", "width=850,height=750");
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reservation Receipt - ${ref}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #1e293b; background: #fff; line-height: 1.6; margin: 0; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px; }
          .brand { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
          .badge { background: #d4af37; color: #000; padding: 8px 16px; border-radius: 4px; font-weight: 700; font-size: 15px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px; }
          .item-label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 4px; }
          .item-val { font-size: 16px; font-weight: 600; color: #0f172a; }
          .item-val.highlight { color: #b45309; font-size: 18px; }
          .total-box { background: #f8fafc; border: 1.5px solid #d4af37; border-radius: 8px; padding: 20px; text-align: right; margin-bottom: 30px; }
          .total-val { font-size: 26px; font-weight: 700; color: #b45309; }
          .footer { font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="brand">NEXUS INN HOTELS & RESORTS</h1>
            <div style="font-size: 12px; color: #d4af37; letter-spacing: 2px; font-weight: 600; margin-top: 4px;">OFFICIAL RESERVATION CONFIRMATION VOUCHER</div>
          </div>
          <div class="badge">REF: ${ref}</div>
        </div>
        <div class="grid">
          <div><div class="item-label">Primary Guest</div><div class="item-val">${guest}</div></div>
          <div><div class="item-label">Occupancy</div><div class="item-val">${guestsCount}</div></div>
          <div><div class="item-label">Reserved Accommodation</div><div class="item-val highlight">${room}</div></div>
          <div><div class="item-label">Dates of Stay</div><div class="item-val">${dates}</div></div>
          <div><div class="item-label">Guest Email</div><div class="item-val">${email}</div></div>
          <div><div class="item-label">Guest Phone</div><div class="item-val">${phone}</div></div>
          <div><div class="item-label">Booking Timestamp</div><div class="item-val">${date}</div></div>
          <div><div class="item-label">Status</div><div class="item-val" style="color: #15803d; font-weight: 700;">Guaranteed & Confirmed</div></div>
        </div>
        <div class="total-box">
          <div class="item-label">Total Amount Guaranteed (All Taxes & Service Charges Included)</div>
          <div class="total-val">${total}</div>
        </div>
        <div class="footer">
          <p>Nexus Inn Hotels & Resorts Group • No. 215, Galle Road, Sri Lanka • Direct Concierge: +94 91 256 9753</p>
          <p>Check-in: 2:00 PM | Check-out: 12:00 PM (Noon). Please present this voucher at the reception upon arrival.</p>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        <\/script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  // Render "My Bookings" List in Modal
  window.renderMyBookingsList = function () {
    const container = document.getElementById("myBookingsListContainer");
    if (!container) return;

    const bookings = window.getBookings();
    if (bookings.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5 text-muted">
          <i class="fa-solid fa-calendar-xmark fa-3x mb-3 text-warning"></i>
          <h5>No Active Reservations</h5>
          <p class="small">Explore our luxury suites and reserve your unforgettable getaway.</p>
          <a href="/pages/rooms.html" class="btn btn-gold btn-sm mt-2">Browse Rooms</a>
        </div>
      `;
      return;
    }

    let html = '<div class="d-flex flex-column gap-3">';
    bookings.forEach((b) => {
      html += `
        <div class="glass-card p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div class="d-flex align-items-center gap-3">
            <img src="${window.escapeHTML(resolveAsset(b.roomImage))}" alt="${window.escapeHTML(b.roomName)}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-glass);">
            <div>
              <div class="d-flex align-items-center gap-2">
                <h6 class="mb-0 text-white">${window.escapeHTML(b.roomName)}</h6>
                <span class="badge bg-success small">${window.escapeHTML(b.status)}</span>
              </div>
              <p class="small text-muted mb-0">Ref: <strong class="text-warning">${window.escapeHTML(b.id)}</strong> | ${window.escapeHTML(b.checkin)} to ${window.escapeHTML(b.checkout)} (${b.nights}n)</p>
              <p class="small text-gold mb-0">Total: ${window.escapeHTML(b.totalFormatted)}</p>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-glass btn-sm" onclick="window.printBookingVoucher('${window.escapeHTML(b.id)}')">
              <i class="fa-solid fa-print me-1"></i> Voucher
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="window.cancelBooking('${window.escapeHTML(b.id)}')">
              <i class="fa-solid fa-trash-can me-1"></i> Cancel
            </button>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  };

  window.openMyBookingsModal = function () {
    window.renderMyBookingsList();
    const modalEl = document.getElementById("myBookingsModal");
    if (modalEl) {
      let bsModal = bootstrap.Modal.getInstance(modalEl);
      if (!bsModal) {
        bsModal = new bootstrap.Modal(modalEl);
      }
      bsModal.show();
    }
  };

  window.printBookingVoucher = function (bookingId) {
    const booking = window.getBookings().find((b) => b.id === bookingId);
    if (!booking) return;
    window.showBookingConfirmationModal(booking);
  };

  // ==========================================
  // 6. ROOM DETAILS & COMPARISON MODAL
  // ==========================================
  window.openRoomDetailsModal = function (roomId) {
    const room = (typeof HOTEL_ROOMS_DATA !== "undefined" ? HOTEL_ROOMS_DATA.find((r) => r.id === roomId) : null) || (HOTEL_ROOMS_DATA && HOTEL_ROOMS_DATA[0]);
    if (!room) return;

    const modalEl = document.getElementById("roomDetailsModal");
    if (!modalEl) return;

    setSafeText("roomDetailsTitle", room.name);
    setSafeText("roomDetailsTagline", room.tagline || "5-Star Luxury Experience");
    setSafeText("roomDetailsPrice", `${window.formatPrice(room.priceUSD)} / night`);
    setSafeText("roomDetailsCategory", room.categoryLabel || "Suite");
    setSafeText("roomDetailsBed", room.bedType || "King Bed");
    setSafeText("roomDetailsGuests", `Up to ${room.maxGuests} Guests`);
    setSafeText("roomDetailsSize", `${room.sizeSqFt} sq. ft.`);
    setSafeText("roomDetailsView", room.view || "Scenic View");
    setSafeText("roomDetailsDescription", room.longDescription || room.description || "");
    setSafeText("roomDetailsCancellation", room.cancellationPolicy || "Free cancellation up to 48 hours before check-in.");

    // Amenities
    if (room.amenities && room.amenities.length > 0) {
      setSafeHTML(
        "roomDetailsAmenities",
        room.amenities
          .map((a) => `<div class="col-sm-6 mb-2"><i class="fa-solid fa-check text-gold me-2"></i><span class="text-light small">${window.escapeHTML(a)}</span></div>`)
          .join("")
      );
    }

    // Perks
    if (room.perks && room.perks.length > 0) {
      setSafeHTML(
        "roomDetailsPerks",
        room.perks
          .map((p) => `<span class="badge bg-gold me-2 mb-2 p-2">${window.escapeHTML(p)}</span>`)
          .join("")
      );
    }

    // Carousel Images
    if (room.images && room.images.length > 0) {
      setSafeHTML(
        "roomDetailsCarouselInner",
        room.images
          .map((img, idx) => `
            <div class="carousel-item ${idx === 0 ? "active" : ""}">
              <img src="${window.escapeHTML(resolveAsset(img))}" class="d-block w-100" style="height: 380px; object-fit: cover;" alt="${window.escapeHTML(room.name)}">
            </div>
          `)
          .join("")
      );
    }

    // Book Now button inside modal
    const bookBtn = document.getElementById("roomDetailsBookBtn");
    if (bookBtn) {
      bookBtn.onclick = function () {
        const bsDetailsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsDetailsModal) bsDetailsModal.hide();
        window.openBookingModal(room.id);
      };
    }

    let bsModal = bootstrap.Modal.getInstance(modalEl);
    if (!bsModal) {
      bsModal = new bootstrap.Modal(modalEl);
    }
    bsModal.show();
  };

  // Advanced Room Comparison Tool
  let comparisonRoomIds = [];

  window.toggleCompareRoom = function (roomId) {
    const room = HOTEL_ROOMS_DATA.find((r) => r.id === roomId);
    if (!room) return;

    if (comparisonRoomIds.includes(roomId)) {
      comparisonRoomIds = comparisonRoomIds.filter((id) => id !== roomId);
      showToast("Room Removed", `${room.name} removed from comparison table.`);
    } else {
      if (comparisonRoomIds.length >= 3) {
        showToast("Maximum Reached", "You can compare up to 3 rooms at a time. Remove one first.", "error");
        return;
      }
      comparisonRoomIds.push(roomId);
      showToast("Room Added", `${room.name} added to comparison. Click 'Compare Now' to view.`);
    }

    // Update all matching compare button UI states
    document.querySelectorAll(`.btn-compare[data-compare-id="${roomId}"]`).forEach((btn) => {
      if (comparisonRoomIds.includes(roomId)) {
        btn.classList.add("active");
        btn.setAttribute("title", "Remove from Compare");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("title", "Add to Compare");
      }
    });

    updateCompareBar();
  };

  window.clearCompareRooms = function () {
    comparisonRoomIds = [];
    document.querySelectorAll(".btn-compare").forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("title", "Add to Compare");
    });
    updateCompareBar();
    const modalEl = document.getElementById("roomComparisonModal");
    if (modalEl) {
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    }
    showToast("Comparison Cleared", "All rooms have been removed from comparison list.");
  };

  function updateCompareBar() {
    const bars = document.querySelectorAll(".room-compare-bar, #roomCompareFloatingBar");
    bars.forEach((bar) => {
      const countEl = bar.querySelector("#roomCompareCount") || document.getElementById("roomCompareCount");
      const thumbsContainer = bar.querySelector(".room-compare-thumbs") || document.getElementById("roomCompareThumbs");

      if (comparisonRoomIds.length > 0) {
        bar.classList.add("show");
        bar.style.display = "flex";
        if (countEl) countEl.textContent = comparisonRoomIds.length;

        if (thumbsContainer) {
          const selectedRooms = HOTEL_ROOMS_DATA.filter((r) => comparisonRoomIds.includes(r.id));
          thumbsContainer.innerHTML = selectedRooms
            .map((r) => `<img src="${window.escapeHTML(resolveAsset(r.images[0]))}" alt="${window.escapeHTML(r.name)}" class="compare-thumb-img" title="${window.escapeHTML(r.name)}">`)
            .join("");
        }
      } else {
        bar.classList.remove("show");
        bar.style.display = "none";
        if (countEl) countEl.textContent = "0";
        if (thumbsContainer) thumbsContainer.innerHTML = "";
      }
    });
  }

  window.openComparisonModal = function () {
    if (comparisonRoomIds.length === 0) {
      showToast("No Rooms Selected", "Please click 'Add to Compare' on at least 1 room first.", "error");
      return;
    }

    const modalEl = document.getElementById("roomComparisonModal");
    const container = document.getElementById("roomComparisonContent");
    if (!modalEl || !container) return;

    const rooms = HOTEL_ROOMS_DATA.filter((r) => comparisonRoomIds.includes(r.id));

    let html = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-gold small"><i class="fa-solid fa-layer-group me-1"></i> Comparing <strong>${rooms.length}</strong> Luxury Accommodation${rooms.length > 1 ? "s" : ""}</span>
        <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="window.clearCompareRooms()">
          <i class="fa-solid fa-trash-can me-1"></i> Clear All
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-dark table-bordered border-gold compare-table align-middle text-center mb-0">
          <thead>
            <tr>
              <th style="width: 22%;" class="compare-feature-label text-start">Suite / Feature</th>
              ${rooms.map((r) => `
                <th style="width: ${78 / rooms.length}%; background: rgba(212, 175, 55, 0.05);">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge bg-gold text-dark">${window.escapeHTML(r.categoryLabel)}</span>
                    <button class="btn btn-sm text-danger p-0" title="Remove" onclick="window.toggleCompareRoom('${r.id}'); window.openComparisonModal();">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <h6 class="text-white font-serif mb-0">${window.escapeHTML(r.name)}</h6>
                </th>
              `).join("")}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-start compare-feature-label">Gallery View</td>
              ${rooms.map((r) => `
                <td>
                  <img src="${window.escapeHTML(resolveAsset(r.images[0]))}" class="rounded shadow-sm" style="height: 140px; width: 100%; object-fit: cover; border: 1px solid var(--border-glass);" alt="${window.escapeHTML(r.name)}">
                </td>
              `).join("")}
            </tr>
            <tr>
              <td class="text-start compare-feature-label">Price / Night</td>
              ${rooms.map((r) => `
                <td>
                  <span class="fw-bold fs-4 text-warning currency-display-value" data-usd="${r.priceUSD}">${window.formatPrice(r.priceUSD)}</span>
                  <div class="small text-muted">Includes Breakfast & Taxes</div>
                </td>
              `).join("")}
            </tr>
            <tr>
              <td class="text-start compare-feature-label">Room Dimensions</td>
              ${rooms.map((r) => `<td class="text-light fw-bold">${r.sizeSqFt} sq. ft. / ${Math.round(r.sizeSqFt * 0.0929)} m²</td>`).join("")}
            </tr>
            <tr>
              <td class="text-start compare-feature-label">Bed & Max Guests</td>
              ${rooms.map((r) => `<td class="text-light">${window.escapeHTML(r.bedType)}<br><span class="badge bg-dark-800 border border-gold mt-1"><i class="fa-solid fa-user-group me-1 text-gold"></i>Up to ${r.maxGuests} Guests</span></td>`).join("")}
            </tr>
            <tr>
              <td class="text-start compare-feature-label">Scenic Outlook</td>
              ${rooms.map((r) => `<td class="text-gold fw-semibold"><i class="fa-solid fa-eye me-1"></i>${window.escapeHTML(r.view)}</td>`).join("")}
            </tr>
            <tr>
              <td class="text-start compare-feature-label">Guest Rating</td>
              ${rooms.map((r) => `<td class="text-light"><div class="text-warning mb-1"><i class="fa-solid fa-star"></i> <strong>${r.rating}</strong> / 5.0</div><small class="text-muted">(${r.reviewsCount} verified reviews)</small></td>`).join("")}
            </tr>
            <tr>
              <td class="text-start compare-feature-label">VIP Privileges Included</td>
              ${rooms.map((r) => `
                <td class="text-start">
                  <ul class="list-unstyled small mb-0">
                    ${r.perks.map((p) => `<li class="mb-1"><i class="fa-solid fa-gem text-gold me-1"></i>${window.escapeHTML(p)}</li>`).join("")}
                  </ul>
                </td>
              `).join("")}
            </tr>
            <tr>
              <td class="text-start compare-feature-label">Amenities</td>
              ${rooms.map((r) => `
                <td class="text-start">
                  <div class="d-flex flex-wrap gap-1">
                    ${r.amenities.slice(0, 4).map((a) => `<span class="badge bg-dark-800 border border-secondary text-secondary small p-1">${window.escapeHTML(a)}</span>`).join("")}
                  </div>
                </td>
              `).join("")}
            </tr>
            <tr>
              <td class="text-start compare-feature-label">Cancellation</td>
              ${rooms.map((r) => `<td class="small text-muted"><i class="fa-solid fa-shield-halved text-success me-1"></i>${window.escapeHTML(r.cancellationPolicy)}</td>`).join("")}
            </tr>
            <tr>
              <td class="text-start compare-feature-label">Reserve Stay</td>
              ${rooms.map((r) => `
                <td>
                  <button class="btn btn-gold btn-sm w-100 mb-2 py-2" onclick="bootstrap.Modal.getInstance(document.getElementById('roomComparisonModal')).hide(); window.openBookingModal('${r.id}');">
                    <i class="fa-solid fa-lock me-1"></i> Book Now
                  </button>
                  <button class="btn btn-glass btn-sm w-100" onclick="bootstrap.Modal.getInstance(document.getElementById('roomComparisonModal')).hide(); window.openRoomDetailsModal('${r.id}');">
                    <i class="fa-solid fa-circle-info me-1"></i> Details
                  </button>
                </td>
              `).join("")}
            </tr>
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
    let bsModal = bootstrap.Modal.getInstance(modalEl);
    if (!bsModal) {
      bsModal = new bootstrap.Modal(modalEl);
    }
    bsModal.show();
  };

  // ==========================================
  // 7. REVIEWS & TESTIMONIALS SYSTEM
  // ==========================================
  window.getReviews = function () {
    try {
      const stored = localStorage.getItem("nexus_inn_reviews");
      return stored ? JSON.parse(stored) : INITIAL_REVIEWS_DATA;
    } catch (e) {
      return INITIAL_REVIEWS_DATA;
    }
  };

  window.renderReviews = function (containerId = "reviewsListContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const reviews = window.getReviews();
    let html = "";

    reviews.forEach((rev) => {
      const stars = Array(rev.rating)
        .fill('<i class="fa-solid fa-star"></i>')
        .join("");

      html += `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="review-card">
            <i class="fa-solid fa-quote-right review-quote-icon"></i>
            <div class="review-rating">${stars}</div>
            <p class="text-light mb-3" style="font-size: 0.95rem; font-style: italic;">
              "${window.escapeHTML(rev.comment)}"
            </p>
            <div class="reviewer-info">
              <img src="${window.escapeHTML(rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80')}" alt="${window.escapeHTML(rev.author)}" class="reviewer-avatar">
              <div>
                <h6 class="mb-0 text-white fw-bold">${window.escapeHTML(rev.author)}</h6>
                <small class="text-gold">${window.escapeHTML(rev.room || 'Guest Stay')} • ${window.escapeHTML(rev.country || 'Verified Guest')}</small>
                <div class="text-muted" style="font-size: 0.75rem;">${window.escapeHTML(rev.date)}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  window.submitReviewForm = function (e) {
    if (e) e.preventDefault();
    const form = document.getElementById("writeReviewForm");
    if (!form || !form.checkValidity()) {
      if (form) form.reportValidity();
      return;
    }

    const name = document.getElementById("reviewAuthorName").value.trim();
    const country = document.getElementById("reviewAuthorCountry").value.trim();
    const room = document.getElementById("reviewRoomSelect").value;
    const rating = parseInt(document.getElementById("reviewRatingSelect").value, 10) || 5;
    const comment = document.getElementById("reviewCommentText").value.trim();

    const newReview = {
      id: "rev-" + Date.now(),
      author: name,
      country: country || "Verified Guest",
      rating: rating,
      date: "Just now",
      room: room,
      comment: comment,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
    };

    const reviews = window.getReviews();
    reviews.unshift(newReview);
    localStorage.setItem("nexus_inn_reviews", JSON.stringify(reviews));

    // Reset form and close modal
    form.reset();
    const modalEl = document.getElementById("writeReviewModal");
    if (modalEl) {
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    }

    window.renderReviews();
    showToast("Review Published!", "Thank you for sharing your luxury experience with us.", "success");
  };

  // ==========================================
  // 8. GALLERY LIGHTBOX
  // ==========================================
  let currentGalleryIndex = 0;
  let currentGalleryList = [];

  window.openGalleryLightbox = function (index, list = null) {
    if (list) currentGalleryList = list;
    currentGalleryIndex = index;

    const modalEl = document.getElementById("galleryLightboxModal");
    if (!modalEl || currentGalleryList.length === 0) return;

    updateLightboxContent();

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  };

  function updateLightboxContent() {
    const item = currentGalleryList[currentGalleryIndex];
    if (!item) return;

    const imgEl = document.getElementById("lightboxImage");
    const captionEl = document.getElementById("lightboxCaption");
    const counterEl = document.getElementById("lightboxCounter");

    if (imgEl) imgEl.src = item.src;
    if (captionEl) captionEl.textContent = item.title || "Nexus Inn Hotels & Resorts";
    if (counterEl) counterEl.textContent = `${currentGalleryIndex + 1} / ${currentGalleryList.length}`;
  }

  window.lightboxNext = function () {
    if (currentGalleryList.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryList.length;
    updateLightboxContent();
  };

  window.lightboxPrev = function () {
    if (currentGalleryList.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryList.length) % currentGalleryList.length;
    updateLightboxContent();
  };

  // Keyboard navigation for Lightbox
  document.addEventListener("keydown", (e) => {
    const modalEl = document.getElementById("galleryLightboxModal");
    if (modalEl && modalEl.classList.contains("show")) {
      if (e.key === "ArrowRight") window.lightboxNext();
      if (e.key === "ArrowLeft") window.lightboxPrev();
    }
  });

  // ==========================================
  // 9. CONTACT & NEWSLETTER FORMS
  // ==========================================
  window.submitContactForm = function (e) {
    if (e) e.preventDefault();
    const form = document.getElementById("nexusContactForm");
    if (!form || !form.checkValidity()) {
      if (form) form.reportValidity();
      return;
    }

    // Honeypot spam check
    const honeypot = document.getElementById("website_hp");
    if (honeypot && honeypot.value) {
      console.warn("Spam detected");
      return;
    }

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    const ticketId = "INQ-" + Math.floor(10000 + Math.random() * 90000);

    // Save inquiry to localStorage
    try {
      const inquiries = JSON.parse(localStorage.getItem("nexus_inquiries") || "[]");
      inquiries.unshift({ id: ticketId, name, email, subject, message, date: new Date().toISOString() });
      localStorage.setItem("nexus_inquiries", JSON.stringify(inquiries));
    } catch (err) {}

    form.reset();
    showToast("Message Transmitted", `Thank you ${window.escapeHTML(name)}. Reference #${ticketId} created. Our VIP Concierge will respond within 2 hours.`, "success");
  };

  window.submitNewsletterForm = function (e) {
    if (e) e.preventDefault();
    const input = document.getElementById("newsletterEmailInput");
    if (!input || !input.checkValidity()) {
      if (input) input.reportValidity();
      return;
    }

    const email = input.value.trim();
    input.value = "";
    showToast("Subscribed to Nexus Club", `Welcome to our private circle! Exclusive seasonal privileges will be sent to ${window.escapeHTML(email)}.`, "success");
  };

  // ==========================================
  // 10. PAGE MODULES DISPATCHER
  // ==========================================
  function initPageModules() {
    // Reviews container
    if (document.getElementById("reviewsListContainer")) {
      window.renderReviews();
    }

    // Rooms page catalog
    if (document.getElementById("roomsCatalogContainer")) {
      initRoomsCatalog();
    }

    // Services page catalog
    if (document.getElementById("servicesCatalogContainer")) {
      initServicesCatalog();
    }

    // Gallery page catalog
    if (document.getElementById("galleryGridContainer")) {
      initGalleryCatalog();
    }
  }

  // ROOMS CATALOG PAGE LOGIC
  function initRoomsCatalog() {
    const container = document.getElementById("roomsCatalogContainer");
    const categoryFilters = document.querySelectorAll(".room-cat-filter");
    const priceSlider = document.getElementById("roomPriceRange");
    const priceDisplay = document.getElementById("roomPriceRangeDisplay");
    const searchInput = document.getElementById("roomSearchInput");
    const sortSelect = document.getElementById("roomSortSelect");
    const guestSelect = document.getElementById("roomGuestsSelect");

    let currentCategory = "all";
    let maxPrice = 500;
    let searchQuery = "";
    let sortBy = "default";
    let minGuests = 1;

    function renderFilteredRooms() {
      let filtered = HOTEL_ROOMS_DATA.filter((r) => {
        const matchesCat = currentCategory === "all" || r.category === currentCategory;
        const matchesPrice = r.priceUSD <= maxPrice;
        const matchesSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery) || r.amenities.some((a) => a.toLowerCase().includes(searchQuery));
        const matchesGuests = r.maxGuests >= minGuests;
        return matchesCat && matchesPrice && matchesSearch && matchesGuests;
      });

      // Sorting
      if (sortBy === "price-low") filtered.sort((a, b) => a.priceUSD - b.priceUSD);
      else if (sortBy === "price-high") filtered.sort((a, b) => b.priceUSD - a.priceUSD);
      else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
      else if (sortBy === "size") filtered.sort((a, b) => b.sizeSqFt - a.sizeSqFt);

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="fa-solid fa-bed fa-3x text-muted mb-3"></i>
            <h4>No Suites Match Your Search Criteria</h4>
            <p class="text-muted">Try resetting your filters or price slider.</p>
            <button class="btn btn-gold-outline btn-sm" onclick="location.reload()">Reset Filters</button>
          </div>
        `;
        return;
      }

      let html = "";
      filtered.forEach((r) => {
        html += `
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="room-card">
              <div class="room-img-wrapper">
                <img src="${window.escapeHTML(resolveAsset(r.images[0]))}" alt="${window.escapeHTML(r.name)}" loading="lazy">
                <span class="room-badge-category">${window.escapeHTML(r.categoryLabel)}</span>
                <div class="room-price-tag">
                  <div class="room-price-val currency-display-value" data-usd="${r.priceUSD}">${window.formatPrice(r.priceUSD)}</div>
                  <div class="room-price-period">per night</div>
                </div>
              </div>
              <div class="room-body">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="text-gold small"><i class="fa-solid fa-star"></i> ${r.rating} (${r.reviewsCount})</span>
                  <span class="text-muted small"><i class="fa-solid fa-eye me-1 text-gold"></i>${window.escapeHTML(r.view)}</span>
                </div>
                <h4 class="room-title">${window.escapeHTML(r.name)}</h4>
                <p class="text-muted small mb-3">${window.escapeHTML(r.tagline)}</p>
                <div class="room-specs">
                  <span><i class="fa-solid fa-bed"></i> ${window.escapeHTML(r.bedType)}</span>
                  <span><i class="fa-solid fa-user-group"></i> Up to ${r.maxGuests}</span>
                  <span><i class="fa-solid fa-vector-square"></i> ${r.sizeSqFt} sq.ft</span>
                </div>
                <div class="room-amenities-pills">
                  ${r.amenities.slice(0, 3).map((a) => `<span class="amenity-pill"><i class="fa-solid fa-check text-gold me-1"></i>${window.escapeHTML(a)}</span>`).join("")}
                  ${r.amenities.length > 3 ? `<span class="amenity-pill text-gold">+${r.amenities.length - 3} more</span>` : ""}
                </div>
                <div class="room-footer">
                  <button class="btn btn-gold flex-grow-1" onclick="window.openBookingModal('${r.id}')">
                    Book Now
                  </button>
                  <button class="btn btn-glass" title="View Suite Details" onclick="window.openRoomDetailsModal('${r.id}')">
                    <i class="fa-solid fa-circle-info"></i>
                  </button>
                  <button class="btn btn-glass btn-compare ${comparisonRoomIds.includes(r.id) ? 'active' : ''}" data-compare-id="${r.id}" title="${comparisonRoomIds.includes(r.id) ? 'Remove from Compare' : 'Add to Compare'}" onclick="window.toggleCompareRoom('${r.id}')">
                    <i class="fa-solid fa-scale-balanced"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    }

    categoryFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryFilters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.getAttribute("data-category");
        renderFilteredRooms();
      });
    });

    if (priceSlider) {
      priceSlider.addEventListener("input", (e) => {
        maxPrice = parseInt(e.target.value, 10);
        if (priceDisplay) priceDisplay.textContent = window.formatPrice(maxPrice);
        renderFilteredRooms();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderFilteredRooms();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        sortBy = e.target.value;
        renderFilteredRooms();
      });
    }

    if (guestSelect) {
      guestSelect.addEventListener("change", (e) => {
        minGuests = parseInt(e.target.value, 10) || 1;
        renderFilteredRooms();
      });
    }

    renderFilteredRooms();
  }

  // SERVICES CATALOG PAGE LOGIC
  function initServicesCatalog() {
    const container = document.getElementById("servicesCatalogContainer");
    const categoryFilters = document.querySelectorAll(".service-cat-filter");

    let currentCategory = "all";

    function renderFilteredServices() {
      let filtered = HOTEL_SERVICES_DATA.filter((s) => {
        return currentCategory === "all" || s.category === currentCategory;
      });

      let html = "";
      filtered.forEach((s) => {
        html += `
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="glass-card h-100 d-flex flex-column">
              <div style="height: 240px; overflow: hidden; position: relative;">
                <img src="${window.escapeHTML(resolveAsset(s.image))}" alt="${window.escapeHTML(s.title)}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;" class="service-img">
                <span class="badge bg-dark text-gold position-absolute top-0 start-0 m-3 px-3 py-2 border border-gold" style="font-size: 0.75rem;">
                  ${window.escapeHTML(s.categoryLabel)}
                </span>
                <span class="badge bg-gold position-absolute top-0 end-0 m-3 px-3 py-2" style="font-size: 0.75rem;">
                  ${window.escapeHTML(s.priceIndicator)}
                </span>
              </div>
              <div class="p-4 d-flex flex-column flex-grow-1">
                <h4 class="h5 text-white mb-2">${window.escapeHTML(s.title)}</h4>
                <div class="text-gold small mb-3"><i class="fa-regular fa-clock me-1"></i>${window.escapeHTML(s.hours)}</div>
                <p class="text-muted small mb-3">${window.escapeHTML(s.description)}</p>
                <div class="p-2 rounded mb-4" style="background: rgba(212, 175, 55, 0.08); border-left: 3px solid var(--gold-400);">
                  <small class="text-gold"><i class="fa-solid fa-gem me-1"></i> ${window.escapeHTML(s.highlight)}</small>
                </div>
                <div class="mt-auto">
                  <button class="btn btn-gold-outline w-100 btn-sm" onclick="window.openServiceInquiryModal('${s.id}')">
                    <i class="fa-regular fa-calendar-check me-1"></i> Reserve / Inquire
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    }

    categoryFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryFilters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.getAttribute("data-category");
        renderFilteredServices();
      });
    });

    renderFilteredServices();
  }

  // Service Inquiry Modal
  window.openServiceInquiryModal = function (serviceId) {
    const service = HOTEL_SERVICES_DATA.find((s) => s.id === serviceId) || HOTEL_SERVICES_DATA[0];
    const modalEl = document.getElementById("serviceInquiryModal");
    if (!modalEl) return;

    document.getElementById("serviceInquiryTitle").textContent = `Reserve: ${service.title}`;
    document.getElementById("serviceInquiryHiddenId").value = service.id;

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  };

  window.submitServiceInquiry = function (e) {
    if (e) e.preventDefault();
    const form = document.getElementById("serviceInquiryForm");
    if (!form || !form.checkValidity()) {
      if (form) form.reportValidity();
      return;
    }

    const name = document.getElementById("serviceGuestName").value.trim();
    const date = document.getElementById("serviceDate").value;
    const time = document.getElementById("serviceTime").value;
    const guests = document.getElementById("serviceGuests").value;

    const modalEl = document.getElementById("serviceInquiryModal");
    if (modalEl) {
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    }
    form.reset();

    showToast("Reservation Confirmed", `Thank you ${window.escapeHTML(name)}. Your reservation for ${guests} guest(s) on ${date} at ${time} has been registered.`, "success");
  };

  // GALLERY CATALOG PAGE LOGIC
  function initGalleryCatalog() {
    const container = document.getElementById("galleryGridContainer");
    const categoryFilters = document.querySelectorAll(".gallery-cat-filter");

    const GALLERY_ITEMS = [
      { id: 1, category: "rooms", title: "Royal Presidential Suite Living Salon", src: resolveAsset("assets/images/G1.jpg") },
      { id: 2, category: "events", title: "Grand Ballroom & Gala Banqueting", src: resolveAsset("assets/images/G2.jpg") },
      { id: 3, category: "pool", title: "Sunset Infinity Pool with Ocean Panorama", src: resolveAsset("assets/images/g3.jpg") },
      { id: 4, category: "rooms", title: "Panoramic Balcony Suite with Ocean Breezes", src: resolveAsset("assets/images/G4.jpg") },
      { id: 5, category: "spa", title: "Lotus Ayurvedic Hydrotherapy & Spa Suites", src: resolveAsset("assets/images/g5.jpg") },
      { id: 6, category: "rooms", title: "Penthouse Sky Deck & Private Jacuzzi", src: resolveAsset("assets/images/G6.jpg") },
      { id: 7, category: "dining", title: "Azure Bay Fine Dining Experience", src: resolveAsset("assets/images/Bayfonte-BG.jpg") },
      { id: 8, category: "pool", title: "Oceanfront Swimming Pavilion", src: resolveAsset("assets/images/0S3A2445 (1).jpg") },
      { id: 9, category: "villas", title: "Private Beachfront Sanctuary Villa", src: resolveAsset("assets/images/Still0317_00003.jpg") },
      { id: 10, category: "architecture", title: "Nexus Inn Architectural Grandeur", src: resolveAsset("assets/images/26 (1).jpg") },
      { id: 11, category: "rooms", title: "Executive Grand Suite Interior", src: resolveAsset("assets/images/26.jpg") },
      { id: 12, category: "events", title: "Special Celebrations & Gala Events", src: resolveAsset("assets/images/CHILDRENS-DAY-ART-3-768x768.jpg") }
    ];

    let currentCategory = "all";

    function renderFilteredGallery() {
      let filtered = GALLERY_ITEMS.filter((g) => {
        return currentCategory === "all" || g.category === currentCategory;
      });

      currentGalleryList = filtered;

      let html = "";
      filtered.forEach((item, idx) => {
        html += `
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="gallery-grid-item" onclick="window.openGalleryLightbox(${idx})">
              <img src="${window.escapeHTML(item.src)}" alt="${window.escapeHTML(item.title)}" loading="lazy">
              <div class="gallery-overlay">
                <span class="badge bg-gold mb-2 align-self-start">${window.escapeHTML(item.category.toUpperCase())}</span>
                <h5 class="text-white mb-0 font-serif">${window.escapeHTML(item.title)}</h5>
              </div>
              <div class="gallery-zoom-btn">
                <i class="fa-solid fa-expand"></i>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    }

    categoryFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryFilters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.getAttribute("data-category");
        renderFilteredGallery();
      });
    });

    renderFilteredGallery();
  }
})();

