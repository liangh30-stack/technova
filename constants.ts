
import { InventoryItem, Product, RepairJob, Language, Employee } from './types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  EN: {
    navShop: "Home",
    navTrack: "Track Repair",
    navEmp: "Staff Portal",
    heroTitle: "3 FOR 2 ON ALL ACCESSORIES",
    heroSubtitle: "Mix & Match your favorite styles",
    trending: "New Arrivals",
    hotBundle: "BEST SELLER",
    bundleDesc: "Ultimate Protection Pack",
    addToCart: "Add",
    trackTitle: "Track Your Repair",
    trackDesc: "Enter Order ID & Phone to see progress.",
    status: "Status",
    reviewTitle: "How was our service?",
    reviewDesc: "Rate us 5 stars on Google Maps to unlock a €5 coupon!",
    rateButton: "Rate on Google Maps",
    claimedTitle: "Coupon Unlocked!",
    claimedDesc: "Show this code at checkout:",
    waitTitle: "Waiting for your device?",
    waitDesc: "Browse our latest collection while you wait.",
    phoneLabel: "Phone Number",
    orderLabel: "Order ID",
    searchButton: "Track Order",
    kbSearchPlaceholder: "Search Order...",
    newJob: "New Job",
    allTechs: "All Techs",
    inDate: "In",
    outDate: "Out",
    techLabel: "Tech",
  },
  CN: {
    navShop: "首页",
    navTrack: "查进度",
    navEmp: "员工通道",
    heroTitle: "配件买二送一",
    heroSubtitle: "随意搭配您喜欢的风格",
    trending: "新品上市",
    hotBundle: "热销爆款",
    bundleDesc: "全方位保护套装",
    addToCart: "购买",
    trackTitle: "维修进度查询",
    trackDesc: "输入单号和手机号查看实时状态",
    status: "当前状态",
    reviewTitle: "服务还好吗？",
    reviewDesc: "在 Google Maps 给我们要个五星好评，立减 5 欧元！",
    rateButton: "去 Google 评价",
    claimedTitle: "优惠券已激活！",
    claimedDesc: "结账时出示此代码：",
    waitTitle: "等待的时候...",
    waitDesc: "为您的爱机选个新保护壳吧。",
    phoneLabel: "手机号码",
    orderLabel: "维修单号",
    searchButton: "查询",
    kbSearchPlaceholder: "搜索单号...",
    newJob: "新工单",
    allTechs: "所有技术员",
    inDate: "进",
    outDate: "出",
    techLabel: "技术员",
  },
  ES: {
    navShop: "Inicio",
    navTrack: "Reparaciones",
    navEmp: "Empleados",
    heroTitle: "3X2 EN ACCESORIOS",
    heroSubtitle: "Combina tus estilos favoritos",
    trending: "Novedades",
    hotBundle: "MÁS VENDIDO",
    bundleDesc: "Pack Protección Total",
    addToCart: "Añadir",
    trackTitle: "Estado de Reparación",
    trackDesc: "Introduce ID y teléfono.",
    status: "Estado",
    reviewTitle: "¿Qué tal el servicio?",
    reviewDesc: "¡5 estrellas en Google = Cupón 5€!",
    rateButton: "Valorar en Google",
    claimedTitle: "¡Cupón Activo!",
    claimedDesc: "Código de caja:",
    waitTitle: "¿Esperando tu móvil?",
    waitDesc: "Mira nuestras fundas nuevas.",
    phoneLabel: "Teléfono",
    orderLabel: "ID Orden",
    searchButton: "Buscar",
    kbSearchPlaceholder: "Buscar...",
    newJob: "Nuevo",
    allTechs: "Técnicos",
    inDate: "Entrada",
    outDate: "Salida",
    techLabel: "Téc",
  },
  FR: {
    navShop: "Accueil",
    navTrack: "Suivi",
    navEmp: "Staff",
    heroTitle: "3 POUR 2 SUR LES ACCESSOIRES",
    heroSubtitle: "Mélangez vos styles préférés",
    trending: "Nouveautés",
    hotBundle: "BEST-SELLER",
    bundleDesc: "Pack Protection Ultime",
    addToCart: "Ajouter",
    trackTitle: "Suivre Réparation",
    trackDesc: "Entrez ID et téléphone.",
    status: "Statut",
    reviewTitle: "Votre avis ?",
    reviewDesc: "5 étoiles sur Google = Coupon 5€ !",
    rateButton: "Noter sur Google",
    claimedTitle: "Coupon Débloqué !",
    claimedDesc: "Code caisse :",
    waitTitle: "En attendant...",
    waitDesc: "Découvrez nos nouvelles coques.",
    phoneLabel: "Téléphone",
    orderLabel: "ID Commande",
    searchButton: "Suivre",
    kbSearchPlaceholder: "Chercher...",
    newJob: "Nouveau",
    allTechs: "Tous",
    inDate: "Entrée",
    outDate: "Sortie",
    techLabel: "Tech",
  },
  DE: {
    navShop: "Startseite",
    navTrack: "Reparatur",
    navEmp: "Personal",
    heroTitle: "3 FÜR 2 AUF ZUBEHÖR",
    heroSubtitle: "Kombinieren Sie Ihre Favoriten",
    trending: "Neuheiten",
    hotBundle: "BESTSELLER",
    bundleDesc: "Ultimatives Schutzpaket",
    addToCart: "Hinzufügen",
    trackTitle: "Reparaturstatus",
    trackDesc: "Bestell-ID und Telefon eingeben.",
    status: "Status",
    reviewTitle: "Wie war der Service?",
    reviewDesc: "5 Sterne auf Google = 5€ Gutschein!",
    rateButton: "Auf Google bewerten",
    claimedTitle: "Gutschein Aktiv!",
    claimedDesc: "Code an der Kasse:",
    waitTitle: "Warten Sie?",
    waitDesc: "Stöbern Sie in unserer Kollektion.",
    phoneLabel: "Telefon",
    orderLabel: "Bestell-ID",
    searchButton: "Suchen",
    kbSearchPlaceholder: "Suchen...",
    newJob: "Neu",
    allTechs: "Alle",
    inDate: "Ein",
    outDate: "Aus",
    techLabel: "Tech",
  }
};

export const BRAND_MODELS: Record<string, string[]> = {
  "Apple": [
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
    "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
    "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
    "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 mini",
    "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
    "iPhone SE (3rd gen)", "iPhone SE (2nd gen)",
    "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X",
    "iPhone 8 Plus", "iPhone 8", "iPhone 7 Plus", "iPhone 7"
  ],
  "Samsung": [
    "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", 
    "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S23 FE",
    "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
    "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21", "Galaxy S21 FE",
    "Galaxy Z Fold5", "Galaxy Z Flip5", "Galaxy Z Fold4", "Galaxy Z Flip4",
    "Galaxy A54", "Galaxy A34", "Galaxy A14", "Galaxy A73", "Galaxy A53"
  ],
  "Xiaomi": [
    "Xiaomi 14 Ultra", "Xiaomi 14", "Xiaomi 13T Pro", "Xiaomi 13T", "Xiaomi 13 Ultra", "Xiaomi 13 Pro", "Xiaomi 13",
    "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13",
    "Redmi Note 12 Pro+", "Redmi Note 12 Pro", "Redmi Note 12",
    "POCO X6 Pro", "POCO X6", "POCO F5 Pro", "POCO F5", "POCO M6 Pro"
  ],
  "Huawei": [
    "P60 Pro", "P60", "Mate 60 Pro", "Mate 60", "Mate X3",
    "P50 Pro", "P50", "Mate 50 Pro", "Mate 50",
    "Nova 11 Pro", "Nova 11", "Nova 10 Pro", "Nova 10"
  ],
  "Oppo": [
    "Find X6 Pro", "Find X6", "Find N3 Flip", "Find N3",
    "Reno 11 Pro", "Reno 11", "Reno 10 Pro+", "Reno 10 Pro", "Reno 10",
    "Find X5 Pro", "Find X5"
  ],
  "Google": [
    "Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7", "Pixel 7a",
    "Pixel 6 Pro", "Pixel 6", "Pixel 6a", "Pixel Fold"
  ]
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Pink Marble Dream",
    price: 15.99,
    category: "Case",
    brand: "Apple",
    compatibleModels: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15"],
    image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&q=80&w=400",
    description: "Elegant marble finish with gold accents. Durable polycarbonate material provides excellent drop protection while maintaining a slim profile."
  },
  {
    id: 2,
    name: "Liquid Glitter Hearts",
    price: 19.99,
    category: "Case",
    brand: "Apple",
    compatibleModels: ["iPhone 14", "iPhone 13"],
    image: "https://images.unsplash.com/photo-1585351608678-75b85a360655?auto=format&fit=crop&q=80&w=400",
    description: "Interactive liquid glitter that moves with you. Made with high-quality mineral oil and non-toxic glitter. Perfect for adding a touch of sparkle to your day."
  },
  {
    id: 3,
    name: "Matte Black Stealth",
    price: 12.99,
    category: "Case",
    brand: "Samsung",
    compatibleModels: ["Galaxy S24 Ultra", "Galaxy S24"],
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=400",
    description: "Ultra-slim, soft-touch matte finish. Resists fingerprints and provides a secure grip. Minimalist design for those who prefer a clean look."
  },
  {
    id: 4,
    name: "Crystal Clear MagSafe",
    price: 24.99,
    category: "Case",
    brand: "Apple",
    compatibleModels: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15"],
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=400",
    description: "Show off your phone's color. Anti-yellowing technology keeps the case crystal clear over time. Integrated MagSafe magnets for seamless charging."
  },
  {
    id: 5,
    name: "Leopard Print Chic",
    price: 16.99,
    category: "Case",
    brand: "Xiaomi",
    compatibleModels: ["Redmi Note 13", "Xiaomi 13T"],
    image: "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?auto=format&fit=crop&q=80&w=400",
    description: "Bold animal print for the fashion forward. High-resolution print that won't fade. Impact-resistant edges for extra security."
  },
  {
    id: 6,
    name: "Privacy Glass Pro",
    price: 14.99,
    category: "Screen Protector",
    brand: "Apple",
    compatibleModels: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14"],
    image: "https://images.unsplash.com/photo-1635443265749-c124e393a571?auto=format&fit=crop&q=80&w=400",
    description: "Keep your screen private from prying eyes. Viewable only from directly in front. 9H hardness tempered glass protects against scratches and impacts."
  },
  {
    id: 7,
    name: "Rope Crossbody Strap",
    price: 9.99,
    category: "Strap",
    brand: "Universal",
    compatibleModels: ["iPhone 15", "Galaxy S24", "Redmi Note 13"],
    image: "https://images.unsplash.com/photo-1622434641406-a15810545060?auto=format&fit=crop&q=80&w=400",
    description: "Hands-free convenience with adjustable rope. Universal patch fits most phone cases. Perfect for travel, festivals, and busy days."
  },
  {
    id: 8,
    name: "Lavender Silicone",
    price: 18.99,
    category: "Case",
    brand: "Oppo",
    compatibleModels: ["Reno 10", "Find X5"],
    image: "https://images.unsplash.com/photo-1622329786480-1a7428f52285?auto=format&fit=crop&q=80&w=400",
    description: "Soft pastel silicone with microfiber lining. Silky-smooth texture that feels great in hand. Easy to clean and provides great shock absorption."
  },
  {
    id: 9,
    name: "Heavy Duty Armor",
    price: 29.99,
    category: "Case",
    brand: "Samsung",
    compatibleModels: ["Galaxy S24 Ultra", "Galaxy A54"],
    image: "https://images.unsplash.com/photo-1592890278983-18616401d4ed?auto=format&fit=crop&q=80&w=400",
    description: "Military grade drop protection. Dual-layer construction with a hard outer shell and soft inner core. Integrated kickstand for hands-free viewing."
  },
  {
    id: 10,
    name: "Disney Vibes",
    price: 22.99,
    category: "Case",
    brand: "Apple",
    compatibleModels: ["iPhone 14", "iPhone 13"],
    image: "https://images.unsplash.com/photo-1534970028765-38ce47ef7d8d?auto=format&fit=crop&q=80&w=400",
    description: "Cute cartoon patterns. Licensed designs featuring your favorite characters. Bright, vibrant colors and high-quality construction."
  }
];

export const HOT_BUNDLE: Product = {
  id: 999,
  name: "Summer Vibes Bundle",
  price: 24.99,
  originalPrice: 35.99,
  category: "Bundle",
  image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=400",
  description: "Colorful Case + Matching Crossbody Strap. The perfect duo for your summer adventures. Save 30% by buying as a bundle!",
  isBundle: true
};

export const MOCK_REPAIRS: RepairJob[] = [
  {
    id: "WX-8888",
    customerName: "Demo Customer",
    device: "iPhone 14 Pro",
    issue: "Screen Replacement",
    status: "Picked Up",
    progress: 100,
    estimatedCompletion: "Completed",
    telefono: "600123456",
    fechaEntrada: "2023-10-25T10:00:00Z"
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: "P-101", name: "iPhone 13 Screen (OLED)", sku: "SCR-IP13-OLED", stores: { downtown: 2, mall: 0, hq: 50 } },
  { id: "P-102", name: "Samsung S23 Battery", sku: "BAT-S23-GEN", stores: { downtown: 5, mall: 3, hq: 20 } },
];

export const EMPLOYEES: Employee[] = [
  {
    id: "EMP-ADMIN",
    name: "Super Admin",
    role: "admin",
    pin: "0000",
    store: "HQ",
    attendanceHistory: [],
    permissions: { canViewReports: true }
  },
  {
    id: "EMP-MANAGER",
    name: "主管 (Manager)",
    role: "Manager",
    pin: "1234",
    store: "Mall",
    attendanceHistory: [],
    permissions: { canViewReports: true }
  },
  {
    id: "EMP-WORKER",
    name: "工人 (Worker)",
    role: "Technician",
    pin: "8888",
    store: "Downtown",
    attendanceHistory: [],
    permissions: { canViewReports: false }
  }
];
