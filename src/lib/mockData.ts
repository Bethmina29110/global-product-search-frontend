export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  color: string;
  similarity_score: number;
  tags: string[];
  source: string;
  image: string;
  rating: number;
}

const imgs = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
  "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
  "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800",
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
  "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800",
];

export const products: Product[] = [
  { id: "1", name: "Ergonomic Pro Gaming Chair", description: "High-back chair with adaptive lumbar support designed for 12-hour coding sessions.", category: "Furniture", brand: "DXRacer", price: 329, color: "Obsidian", similarity_score: 0.94, tags: ["ergonomic","gaming","lumbar"], source: "Amazon", image: imgs[3], rating: 4.7 },
  { id: "2", name: "Minimalist Sit-Stand Desk", description: "Electric height-adjustable desk in matte oak with cable management tray.", category: "Furniture", brand: "Fully", price: 599, color: "Oak", similarity_score: 0.91, tags: ["minimalist","standing","oak"], source: "Wayfair", image: imgs[2], rating: 4.8 },
  { id: "3", name: "Sony WH-1000XM5 Wireless", description: "Industry-leading noise cancelling headphones with rich bass and 30h battery.", category: "Electronics", brand: "Sony", price: 379, color: "Midnight", similarity_score: 0.96, tags: ["wireless","noise-cancelling","bass"], source: "BestBuy", image: imgs[1], rating: 4.9 },
  { id: "4", name: "MX Master 4 Productivity Mouse", description: "Precision wireless mouse with magspeed scrolling and gesture controls.", category: "Electronics", brand: "Logitech", price: 119, color: "Graphite", similarity_score: 0.88, tags: ["productivity","wireless","ergonomic"], source: "Logitech", image: imgs[0], rating: 4.6 },
  { id: "5", name: "Studio Display 27\" 5K", description: "Color-accurate 5K retina display with True Tone and tilt-adjustable stand.", category: "Electronics", brand: "Apple", price: 1599, color: "Silver", similarity_score: 0.89, tags: ["display","5k","creative"], source: "Apple", image: imgs[6], rating: 4.7 },
  { id: "6", name: "Merino Tech Sneakers", description: "Lightweight wool sneakers with breathable knit and recycled foam sole.", category: "Fashion", brand: "Allbirds", price: 135, color: "Stone", similarity_score: 0.82, tags: ["sustainable","comfort","wool"], source: "Allbirds", image: imgs[8], rating: 4.5 },
  { id: "7", name: "Smart Espresso Machine X1", description: "Bean-to-cup espresso machine with app-controlled brew profiles.", category: "Home Appliances", brand: "Breville", price: 899, color: "Stainless", similarity_score: 0.84, tags: ["smart","espresso","kitchen"], source: "Williams Sonoma", image: imgs[11], rating: 4.8 },
  { id: "8", name: "Mechanical Keyboard Aurora 75", description: "Hot-swappable 75% mechanical keyboard with RGB and gasket mount.", category: "Gaming", brand: "Keychron", price: 189, color: "Black", similarity_score: 0.93, tags: ["mechanical","hot-swap","rgb"], source: "Keychron", image: imgs[7], rating: 4.8 },
  { id: "9", name: "Ultralight Travel Backpack", description: "30L water-resistant backpack with laptop sleeve and modular compartments.", category: "Fashion", brand: "Peak Design", price: 249, color: "Charcoal", similarity_score: 0.79, tags: ["travel","modular","laptop"], source: "Peak Design", image: imgs[9], rating: 4.7 },
  { id: "10", name: "AI Smart Standing Lamp", description: "Voice-controlled floor lamp with adaptive color temperature for focus.", category: "Home Appliances", brand: "Govee", price: 159, color: "White", similarity_score: 0.81, tags: ["smart","lighting","focus"], source: "Govee", image: imgs[10], rating: 4.4 },
  { id: "11", name: "4K Streaming Webcam Pro", description: "AI auto-framing 4K webcam with studio-quality microphone array.", category: "Electronics", brand: "Insta360", price: 199, color: "Black", similarity_score: 0.87, tags: ["4k","webcam","ai"], source: "Insta360", image: imgs[5], rating: 4.6 },
  { id: "12", name: "Linen Tailored Blazer", description: "Breathable linen blazer with relaxed fit and natural drape.", category: "Fashion", brand: "COS", price: 225, color: "Sand", similarity_score: 0.74, tags: ["linen","minimalist","tailored"], source: "COS", image: imgs[4], rating: 4.5 },
];

export const categories = ["All","Furniture","Electronics","Gaming","Fashion","Home Appliances","Office"];
export const brands = ["DXRacer","Sony","Apple","Logitech","Keychron","Breville","Allbirds","Peak Design","COS","Govee","Insta360","Fully"];
export const sources = ["Amazon","BestBuy","Apple","Wayfair","Williams Sonoma","Keychron","Allbirds","Peak Design","COS","Govee","Insta360","Logitech"];

export const savedSearches = [
  { id: "s1", query: "ergonomic chair for long coding sessions", date: "2 hours ago", results: 18 },
  { id: "s2", query: "noise cancelling headphones with deep bass", date: "Yesterday", results: 24 },
  { id: "s3", query: "minimalist standing desk under $700", date: "3 days ago", results: 11 },
  { id: "s4", query: "AI-powered productivity gadgets", date: "Last week", results: 36 },
];

export const analyticsData = {
  trend: [
    { day: "Mon", searches: 124, matches: 980 },
    { day: "Tue", searches: 168, matches: 1240 },
    { day: "Wed", searches: 142, matches: 1110 },
    { day: "Thu", searches: 201, matches: 1580 },
    { day: "Fri", searches: 245, matches: 1820 },
    { day: "Sat", searches: 189, matches: 1420 },
    { day: "Sun", searches: 156, matches: 1190 },
  ],
  scoreDist: [
    { range: "0.5–0.6", count: 48 },
    { range: "0.6–0.7", count: 92 },
    { range: "0.7–0.8", count: 184 },
    { range: "0.8–0.9", count: 261 },
    { range: "0.9–1.0", count: 137 },
  ],
  topCategories: [
    { name: "Electronics", value: 412 },
    { name: "Furniture", value: 308 },
    { name: "Gaming", value: 256 },
    { name: "Fashion", value: 198 },
    { name: "Home", value: 144 },
  ],
};
