/**
 * NEXUS INN HOTELS & RESORTS - DATA REPOSITORY
 * Comprehensive room inventories, spa treatments, dining options, and experiences
 */

// Helper to resolve asset path whether from root or /pages/ subdirectory
function resolveAsset(path) {
  const clean = path.startsWith('/') ? path.substring(1) : path;
  const isInsidePages = typeof window !== 'undefined' && (window.location.pathname.includes('/pages/') || window.location.href.includes('/pages/'));
  return isInsidePages ? '../' + clean : clean;
}

const HOTEL_ROOMS_DATA = [
  {
    id: "deluxe-ocean-view",
    name: "Deluxe Ocean View Room",
    category: "ocean-view",
    categoryLabel: "Ocean View",
    tagline: "Panoramic Indian Ocean sunsets with private balcony",
    priceUSD: 180,
    rating: 4.9,
    reviewsCount: 128,
    maxGuests: 2,
    bedType: "King Bed",
    sizeSqFt: 520,
    view: "Direct Ocean Front",
    featured: true,
    images: [
      "assets/images/G1.jpg",
      "assets/images/0S3A2445 (1).jpg",
      "assets/images/g5.jpg"
    ],
    amenities: [
      "Free High-Speed Wi-Fi",
      "Private Balcony",
      "Rain Shower & Luxury Tub",
      "Smart 55\" 4K TV",
      "Nespresso Coffee Station",
      "24/7 Room Service",
      "Organic Bath Amenities",
      "Mini Bar & Wine Cooler"
    ],
    description: "Immerse yourself in coastal elegance. Floor-to-ceiling glass windows open onto your private ocean-facing terrace where tropical breezes and rhythmic waves set the tone for total relaxation.",
    longDescription: "Our Deluxe Ocean View rooms provide an intimate sanctuary overlooking the azure waters of Galle. Featuring contemporary teak furnishings, handcrafted Sri Lankan textiles, a plush king-size bed with 500-thread-count Egyptian cotton linens, and a spa-inspired marble bathroom with a deep soaking tub and rain shower.",
    perks: ["Complimentary Artisan Breakfast", "Welcome Tropical Cocktail", "Daily Sunset Yoga Session"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in date."
  },
  {
    id: "presidential-suite",
    name: "Royal Presidential Suite",
    category: "penthouse",
    categoryLabel: "Penthouse",
    tagline: "The pinnacle of bespoke opulence with personal butler",
    priceUSD: 450,
    rating: 5.0,
    reviewsCount: 84,
    maxGuests: 4,
    bedType: "2 Master King Beds",
    sizeSqFt: 1450,
    view: "360° Ocean & Skyline",
    featured: true,
    images: [
      "assets/images/G6.jpg",
      "assets/images/Still0317_00003.jpg",
      "assets/images/26.jpg"
    ],
    amenities: [
      "24/7 Private Butler Service",
      "Infinity Plunge Pool on Deck",
      "Private Dining Room for 8",
      "Bang & Olufsen Sound System",
      "Walk-in Dressing Room",
      "VIP Airport Chauffeur",
      "Jacuzzi with Ocean Panorama",
      "Dedicated High-Speed Fibre Line"
    ],
    description: "Designed for royalty and discerning travelers. Spanning a palatial 1,450 sq.ft, this penthouse features expansive living areas, a private plunge pool on the sky deck, and dedicated 24-hour butler attention.",
    longDescription: "The Royal Presidential Suite is our crowning jewel. Featuring bespoke architectural details, soaring 12-foot ceilings, a formal dining salon, a master bedroom with panoramic ocean wrap-around terraces, a walk-in wardrobe, and a master bath adorned with Italian Carrara marble and an oversized hydrotherapy jacuzzi.",
    perks: ["Complimentary Dom Pérignon Welcome Bottle", "Private Chef Dining Experience", "Unlimited Spa Treatments"],
    cancellationPolicy: "Free cancellation up to 7 days before arrival."
  },
  {
    id: "luxury-beachfront-villa",
    name: "Luxury Beachfront Pool Villa",
    category: "villa",
    categoryLabel: "Private Villa",
    tagline: "Secluded sanctuary steps from golden sands",
    priceUSD: 320,
    rating: 4.95,
    reviewsCount: 112,
    maxGuests: 3,
    bedType: "King Bed + Daybed",
    sizeSqFt: 980,
    view: "Private Beach & Garden",
    featured: true,
    images: [
      "assets/images/Still0317_00003.jpg",
      "assets/images/0S3A2445 (1).jpg",
      "assets/images/G4.jpg"
    ],
    amenities: [
      "Private Heated Swimming Pool",
      "Direct Beach Access",
      "Open-Air Tropical Garden Bath",
      "Sun Loungers & Private Cabana",
      "Evening Turndown with Aromatherapy",
      "Bespoke Cocktail Bar",
      "Bluetooth Sound System",
      "Complimentary Laundry Service"
    ],
    description: "Experience total seclusion surrounded by lush tropical greenery with your own private swimming pool and a private gate leading straight onto the pristine sandy beach.",
    longDescription: "Our Beachfront Villas offer the ultimate tropical escape. Seamless indoor-outdoor living spaces flow from the handcrafted timber bedroom to your private sundeck and sparkling swimming pool. Step through your private garden gate directly onto the golden sands for an evening stroll under starlit skies.",
    perks: ["Daily Floating Breakfast in Pool", "Private Beach Cabana Reservation", "Complimentary High Tea"],
    cancellationPolicy: "Free cancellation up to 72 hours before check-in."
  },
  {
    id: "executive-suite",
    name: "Executive Grand Suite",
    category: "suite",
    categoryLabel: "Executive Suite",
    tagline: "Sophisticated blend of business efficiency and luxury leisure",
    priceUSD: 240,
    rating: 4.88,
    reviewsCount: 96,
    maxGuests: 2,
    bedType: "1 Super King Bed",
    sizeSqFt: 720,
    view: "Cityscape & Ocean Coastline",
    featured: true,
    images: [
      "assets/images/26.jpg",
      "assets/images/G4.jpg",
      "assets/images/g3.jpg"
    ],
    amenities: [
      "Executive Club Lounge Access",
      "Ergonomic Workspace & Printer",
      "Dual Vanity Luxury Bathroom",
      "Espresso Machine & Teas",
      "Two 65\" Ultra HD Screens",
      "Complimentary Meeting Room (2hrs)",
      "Daily International Newspaper",
      "Express Pressing Service"
    ],
    description: "Tailored for business leaders and sophisticated leisure travelers seeking generous living space, an ergonomic workspace, and exclusive Executive Club privileges.",
    longDescription: "The Executive Grand Suite boasts a separate living lounge with designer leather seating, an executive desk with universal charging hubs, and access to our private 14th-floor Executive Club Lounge offering complimentary all-day refreshments, afternoon tea, and evening cocktails.",
    perks: ["Executive Club Lounge Privileges", "Complimentary High-Speed Airport Transfer", "Priority Check-in & Late Checkout"],
    cancellationPolicy: "Free cancellation up to 24 hours before check-in."
  },
  {
    id: "family-garden-suite",
    name: "Family Garden Oasis Suite",
    category: "suite",
    categoryLabel: "Family Suite",
    tagline: "Spacious dual-bedroom comfort for the whole family",
    priceUSD: 280,
    rating: 4.92,
    reviewsCount: 145,
    maxGuests: 5,
    bedType: "1 King + 2 Twin Beds",
    sizeSqFt: 1100,
    view: "Lush Tropical Botanical Gardens",
    featured: false,
    images: [
      "assets/images/G4.jpg",
      "assets/images/G1.jpg",
      "assets/images/Still0317_00003.jpg"
    ],
    amenities: [
      "Two Separate En-Suite Bedrooms",
      "Kids Play Area & Games Console",
      "Spacious Dining & Living Lounge",
      "Baby Cot & Childcare Kit on Request",
      "Kitchenette with Microwave & Fridge",
      "Direct Access to Family Pool",
      "Complimentary Kids Club Access",
      "Interconnecting Room Layout"
    ],
    description: "An idyllic haven for families, offering two expansive bedrooms, child-friendly amenities, a garden terrace, and easy access to our kids waterplay zone and main resort pool.",
    longDescription: "Our Family Garden Suite guarantees effortless family holidays with generous space for all. Parents enjoy their private master suite with a deep soaking tub, while children have a fun, themed twin room equipped with board games and media entertainment. The large garden terrace opens onto manicured lawns perfect for outdoor fun.",
    perks: ["Complimentary Kids Club All Day", "Family Pizza Making Class", "Free Ice Cream for Kids Daily"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in."
  },
  {
    id: "panoramic-sky-penthouse",
    name: "Panoramic Sky Penthouse",
    category: "penthouse",
    categoryLabel: "Penthouse",
    tagline: "Top floor grandeur with private rooftop jacuzzi",
    priceUSD: 390,
    rating: 4.96,
    reviewsCount: 78,
    maxGuests: 3,
    bedType: "King Bed",
    sizeSqFt: 1250,
    view: "Unobstructed 180° Ocean View",
    featured: false,
    images: [
      "assets/images/G6.jpg",
      "assets/images/26 (1).jpg",
      "assets/images/g5.jpg"
    ],
    amenities: [
      "Rooftop Jacuzzi Under the Stars",
      "Private Teppanyaki Bar & Lounge",
      "Floor-to-Ceiling Motorized Blinds",
      "Surround Sound Cinema Setup",
      "Walk-in Rain Shower with Views",
      "VIP Fast-Track Check-in",
      "Sommelier-Curated Wine Cellar",
      "Dedicated Guest Experience Host"
    ],
    description: "Perched on our highest floor, this penthouse offers cinematic ocean vistas, an open-air rooftop spa deck, and bespoke designer furnishings throughout.",
    longDescription: "Experience the height of luxury high above the coast. The Panoramic Sky Penthouse features a breathtaking terrace complete with an open-air jacuzzi, custom lounge sunbeds, and a private dining bar. Inside, enjoy sleek minimalist architecture complemented by warm tropical accents, state-of-the-art smart room controls, and a master bath with dramatic ocean viewpoints.",
    perks: ["Rooftop Champagne Toast at Sunset", "Private Yoga Session on Sky Deck", "Personalized Aromatherapy Menu"],
    cancellationPolicy: "Free cancellation up to 5 days before check-in."
  }
];

const HOTEL_SERVICES_DATA = [
  {
    id: "fine-dining",
    title: "Azure Bay Fine Dining & Grill",
    category: "dining",
    categoryLabel: "Gourmet Dining",
    image: "assets/images/Bayfonte-BG.jpg",
    hours: "Breakfast: 06:30 - 10:30 | Dinner: 18:30 - 23:00",
    description: "Award-winning international fine dining curated by Master Chefs. Relish fresh catch of the day from the Indian Ocean paired with vintage world wines.",
    highlight: "Michelin Star-inspired seafood gastronomy",
    priceIndicator: "$$$$"
  },
  {
    id: "lotus-spa",
    title: "Ayurveda & Lotus Wellness Spa",
    category: "spa",
    categoryLabel: "Wellness & Spa",
    image: "assets/images/g5.jpg",
    hours: "Daily: 08:00 - 21:00",
    description: "Restore inner harmony with ancient Ayurvedic rituals, holistic herbal oil massages, organic facials, and modern hydrotherapy treatments.",
    highlight: "Authentic herbal steam & ocean-view massage suites",
    priceIndicator: "$$$"
  },
  {
    id: "infinity-pool",
    title: "Sunset Infinity Pool & Bar",
    category: "experience",
    categoryLabel: "Pool & Lounge",
    image: "assets/images/0S3A2445 (1).jpg",
    hours: "Pool: 06:00 - 20:00 | Bar: 10:00 - 00:00",
    description: "Unwind by our cliffside infinity pool that seamlessly merges with the ocean horizon. Enjoy signature artisan cocktails, tapas, and chill-out DJ sets at dusk.",
    highlight: "Temperature-controlled swimming & underwater acoustics",
    priceIndicator: "$$"
  },
  {
    id: "weddings-events",
    title: "Royal Grand Ballroom & Beach Weddings",
    category: "events",
    categoryLabel: "Weddings & Banquets",
    image: "assets/images/G2.jpg",
    hours: "By Appointment | 24/7 Event Concierge",
    description: "Create unforgettable memories with our fairy-tale wedding venues, oceanfront beach ceremonies, and state-of-the-art corporate conference facilities accommodating up to 600 guests.",
    highlight: "Dedicated wedding planners & bespoke banquet menus",
    priceIndicator: "Custom"
  },
  {
    id: "island-excursions",
    title: "VIP Island Tours & Yacht Charters",
    category: "experience",
    categoryLabel: "Excursions & Yachting",
    image: "assets/images/Still0317_00003.jpg",
    hours: "Departures Daily: 06:00 & 14:00",
    description: "Private luxury catamaran whale watching, historic Galle Fort walking tours, tea plantation visits, and deep-sea diving adventures guided by expert naturalists.",
    highlight: "Private skippered catamarans & champagne cruises",
    priceIndicator: "$$$"
  },
  {
    id: "fitness-yoga",
    title: "Elite Fitness Studio & Sunset Yoga",
    category: "wellness",
    categoryLabel: "Fitness & Yoga",
    image: "assets/images/g3.jpg",
    hours: "24/7 Gym Access | Yoga: 07:00 & 17:30",
    description: "State-of-the-art Technogym equipment, personal trainers on demand, and daily guided sunrise and sunset yoga sessions on the oceanfront pavilion.",
    highlight: "Personalized fitness coaching & oceanfront pavilion",
    priceIndicator: "Included"
  }
];

const INITIAL_REVIEWS_DATA = [
  {
    id: "rev-1",
    author: "Eleanor & James Vance",
    country: "United Kingdom",
    rating: 5,
    date: "March 2026",
    room: "Royal Presidential Suite",
    comment: "An extraordinary experience from the moment the private chauffeur met us. The ocean panorama from the penthouse is breathtaking, and our butler treated us like royalty. Nexus Inn sets the gold standard for luxury.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "rev-2",
    author: "Dr. Johann Schmidt",
    country: "Germany",
    rating: 5,
    date: "February 2026",
    room: "Luxury Beachfront Pool Villa",
    comment: "The beachfront villa was sheer paradise. Waking up to the sound of waves, having breakfast delivered right to our private pool, and the world-class Ayurvedic spa made this the best vacation of our lives.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "rev-3",
    author: "Kavinda & Dilhani Silva",
    country: "Sri Lanka / Australia",
    rating: 5,
    date: "January 2026",
    room: "Deluxe Ocean View Room",
    comment: "We celebrated our 10th anniversary here and were blown away by the hospitality. The dinner at Azure Bay was Michelin quality. Thank you to the entire Nexus Inn team for making our stay unforgettable!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
  }
];

const CURRENCY_RATES = {
  USD: { symbol: "$", rate: 1, name: "USD ($)" },
  LKR: { symbol: "Rs.", rate: 310, name: "LKR (Rs.)" },
  EUR: { symbol: "€", rate: 0.92, name: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.79, name: "GBP (£)" }
};
