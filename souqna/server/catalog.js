'use strict';

// Categories carry structured attribute schemas. Structured data is what powers
// real filters and price insights, which free-text-only classifieds can't offer.
const CATEGORIES = {
  cars: {
    ar: 'سيارات', en: 'Cars', icon: '🚗',
    attrs: {
      make: { type: 'enum', ar: 'الشركة', en: 'Make', options: ['Toyota', 'Hyundai', 'Nissan', 'Kia', 'Ford', 'Chevrolet', 'GMC', 'Lexus', 'Mercedes', 'BMW', 'Honda', 'Mazda', 'Other'], required: true },
      model: { type: 'text', ar: 'الموديل', en: 'Model', required: true },
      year: { type: 'int', ar: 'سنة الصنع', en: 'Year', min: 1970, max: 2027, required: true },
      mileage: { type: 'int', ar: 'الممشى (كم)', en: 'Mileage (km)', min: 0, max: 2000000 },
      transmission: { type: 'enum', ar: 'ناقل الحركة', en: 'Transmission', options: ['automatic', 'manual'] },
      fuel: { type: 'enum', ar: 'الوقود', en: 'Fuel', options: ['petrol', 'diesel', 'hybrid', 'electric'] },
    },
  },
  real_estate: {
    ar: 'عقارات', en: 'Real estate', icon: '🏠',
    attrs: {
      type: { type: 'enum', ar: 'النوع', en: 'Type', options: ['apartment', 'villa', 'land', 'floor', 'shop', 'farm'], required: true },
      purpose: { type: 'enum', ar: 'الغرض', en: 'Purpose', options: ['sale', 'rent'], required: true },
      rooms: { type: 'int', ar: 'الغرف', en: 'Rooms', min: 0, max: 50 },
      area_sqm: { type: 'int', ar: 'المساحة (م²)', en: 'Area (m²)', min: 1, max: 10000000 },
    },
  },
  electronics: {
    ar: 'أجهزة', en: 'Electronics', icon: '📱',
    attrs: {
      brand: { type: 'enum', ar: 'الماركة', en: 'Brand', options: ['Apple', 'Samsung', 'Huawei', 'Sony', 'Xiaomi', 'Lenovo', 'HP', 'Dell', 'Other'] },
      condition: { type: 'enum', ar: 'الحالة', en: 'Condition', options: ['new', 'like_new', 'used'] },
    },
  },
  animals: {
    ar: 'مواشي وحيوانات', en: 'Livestock & pets', icon: '🐪',
    attrs: {
      kind: { type: 'enum', ar: 'النوع', en: 'Kind', options: ['camels', 'sheep', 'goats', 'horses', 'birds', 'cats', 'other'], required: true },
    },
  },
  furniture: {
    ar: 'أثاث', en: 'Furniture', icon: '🛋️',
    attrs: {
      condition: { type: 'enum', ar: 'الحالة', en: 'Condition', options: ['new', 'like_new', 'used'] },
    },
  },
  services: { ar: 'خدمات', en: 'Services', icon: '🛠️', attrs: {} },
  other: { ar: 'أخرى', en: 'Other', icon: '📦', attrs: {} },
};

const CITIES = {
  riyadh: { ar: 'الرياض', en: 'Riyadh' },
  jeddah: { ar: 'جدة', en: 'Jeddah' },
  makkah: { ar: 'مكة', en: 'Makkah' },
  madinah: { ar: 'المدينة', en: 'Madinah' },
  dammam: { ar: 'الدمام', en: 'Dammam' },
  khobar: { ar: 'الخبر', en: 'Khobar' },
  ahsa: { ar: 'الأحساء', en: 'Al-Ahsa' },
  taif: { ar: 'الطائف', en: 'Taif' },
  tabuk: { ar: 'تبوك', en: 'Tabuk' },
  buraidah: { ar: 'بريدة', en: 'Buraidah' },
  hail: { ar: 'حائل', en: 'Hail' },
  abha: { ar: 'أبها', en: 'Abha' },
  khamis: { ar: 'خميس مشيط', en: 'Khamis Mushait' },
  jazan: { ar: 'جازان', en: 'Jazan' },
  najran: { ar: 'نجران', en: 'Najran' },
  yanbu: { ar: 'ينبع', en: 'Yanbu' },
};

// Validates and normalizes category attributes. Returns { attrs } or { error }.
function validateAttrs(category, input) {
  const schema = CATEGORIES[category]?.attrs;
  if (!schema) return { error: 'invalid_category' };
  const out = {};
  const src = input && typeof input === 'object' ? input : {};
  for (const [key, def] of Object.entries(schema)) {
    let v = src[key];
    if (v === undefined || v === null || v === '') {
      if (def.required) return { error: `missing_attr:${key}` };
      continue;
    }
    if (def.type === 'int') {
      v = Number(v);
      if (!Number.isInteger(v) || v < def.min || v > def.max) return { error: `invalid_attr:${key}` };
    } else if (def.type === 'enum') {
      if (!def.options.includes(v)) return { error: `invalid_attr:${key}` };
    } else {
      v = String(v).trim().slice(0, 60);
      if (!v) return { error: `invalid_attr:${key}` };
    }
    out[key] = v;
  }
  return { attrs: out };
}

module.exports = { CATEGORIES, CITIES, validateAttrs };
