'use strict';

// Fills a fresh database with realistic demo data so the marketplace doesn't look empty.
// Demo login: phone 0500000001 … 0500000006, password "password123".
const fs = require('node:fs');
const path = require('node:path');
const { openDb, indexListing } = require('./db');
const { hashPassword } = require('./trust');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });
const db = openDb(path.join(dataDir, 'souqna.db'));
if (db.prepare('SELECT COUNT(*) AS n FROM users').get().n) {
  console.log('Database already has data — skipping seed.');
  process.exit(0);
}

const now = Date.now();
const DAY = 86400000;
const pw = hashPassword('password123');
const users = [
  ['أبو فهد', 'riyadh', 1, 1], ['سارة', 'jeddah', 1, 0], ['محمد العتيبي', 'riyadh', 0, 0],
  ['معرض النخبة للسيارات', 'dammam', 1, 1], ['نورة', 'makkah', 0, 0], ['خالد الشمري', 'hail', 1, 0],
].map(([name, city, verified, dealer], i) => Number(db.prepare(
  'INSERT INTO users (name, phone, password_hash, city, verified, is_dealer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
).run(name, `96650000000${i + 1}`, pw, city, verified, dealer, now - (400 - i * 30) * DAY).lastInsertRowid));

const listings = [
  [0, 'cars', 'كامري 2021 فل كامل نظيفة جداً', 'السيارة نظيفة جداً، صيانة وكالة، بدون حوادث، فحص دوري ساري.', 84000, 'riyadh', { make: 'Toyota', model: 'Camry', year: 2021, mileage: 62000, transmission: 'automatic', fuel: 'petrol' }],
  [2, 'cars', 'تويوتا كامري 2020 ستاندر', 'ممشى قليل، مالك أول، السعر قابل للتفاوض البسيط.', 72000, 'riyadh', { make: 'Toyota', model: 'Camry', year: 2020, mileage: 91000, transmission: 'automatic', fuel: 'petrol' }],
  [3, 'cars', 'كامري 2022 GLE هايبرد', 'ضمان وكالة ساري، لون أبيض لؤلؤي، تمويل متاح.', 99000, 'dammam', { make: 'Toyota', model: 'Camry', year: 2022, mileage: 30000, transmission: 'automatic', fuel: 'hybrid' }],
  [3, 'cars', 'كامري 2021 SE رياضي', 'فحص شامل، جاهزة للاستخدام.', 88000, 'dammam', { make: 'Toyota', model: 'Camry', year: 2021, mileage: 55000, transmission: 'automatic', fuel: 'petrol' }],
  [3, 'cars', 'هيونداي النترا 2023', 'كالجديدة، ممشى 12 ألف فقط.', 69000, 'dammam', { make: 'Hyundai', model: 'Elantra', year: 2023, mileage: 12000, transmission: 'automatic', fuel: 'petrol' }],
  [0, 'cars', 'جمس يوكن 2019 دينالي', 'فل كامل، سقف، شاشات خلفية.', 145000, 'riyadh', { make: 'GMC', model: 'Yukon', year: 2019, mileage: 140000, transmission: 'automatic', fuel: 'petrol' }],
  [1, 'real_estate', 'شقة للإيجار حي الروضة 3 غرف', 'شقة دور أول، مدخل مستقل، قريبة من الخدمات.', 38000, 'jeddah', { type: 'apartment', purpose: 'rent', rooms: 3, area_sqm: 140 }],
  [4, 'real_estate', 'شقة للإيجار العزيزية', 'قريبة من الحرم، مؤثثة بالكامل.', 42000, 'jeddah', { type: 'apartment', purpose: 'rent', rooms: 3, area_sqm: 150 }],
  [1, 'real_estate', 'شقة عائلية للإيجار حي السلامة', 'تكييف مركزي، مطبخ راكب.', 45000, 'jeddah', { type: 'apartment', purpose: 'rent', rooms: 4, area_sqm: 170 }],
  [0, 'real_estate', 'أرض سكنية للبيع شمال الرياض', 'صك إلكتروني، شارعين، موقع مميز.', 1250000, 'riyadh', { type: 'land', purpose: 'sale', area_sqm: 625 }],
  [1, 'electronics', 'ايفون 15 برو ماكس 256 جيجا', 'استخدام شهرين، مع الكرتون والملحقات، بطارية 100%.', 3900, 'jeddah', { brand: 'Apple', condition: 'like_new' }],
  [2, 'electronics', 'بلايستيشن 5 مع يدتين', 'نظيف ويشتغل بدون مشاكل.', 1600, 'riyadh', { brand: 'Sony', condition: 'used' }],
  [5, 'animals', 'حاشي مجاهيم للبيع', 'عمر سنتين، صحة ممتازة.', 9000, 'hail', { kind: 'camels' }],
  [5, 'animals', 'قعود مجاهيم', 'مربى على الشعير.', 8000, 'hail', { kind: 'camels' }],
  [5, 'animals', 'ناقة مجاهيم حلوب', 'تحلب يومياً.', 12000, 'hail', { kind: 'camels' }],
  [5, 'animals', 'طلي نعيمي للبيع', 'جاهز للذبح.', 1400, 'hail', { kind: 'sheep' }],
  [4, 'furniture', 'كنب مودرن 7 مقاعد', 'استخدام سنة، بحالة ممتازة.', 2200, 'makkah', { condition: 'used' }],
  [2, 'services', 'نقل عفش داخل الرياض مع الفك والتركيب', 'عمالة مدربة، تغليف، ضمان.', null, 'riyadh', {}],
];

listings.forEach(([u, category, title, description, price, city, attrs], i) => {
  const created = now - (listings.length - i) * 3 * 3600000;
  const id = Number(db.prepare(`INSERT INTO listings (user_id, category, title, description, price, city, attrs, featured_until, views, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(users[u], category, title, description, price, city, JSON.stringify(attrs),
    i === 2 || i === 9 ? now + 5 * DAY : 0, Math.floor(Math.random() * 900), created, created).lastInsertRowid);
  indexListing(db, { id, title, description, attrs });
});

console.log(`Seeded ${users.length} users and ${listings.length} listings.`);
