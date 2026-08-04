import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

function slug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const CATEGORIES = [
  { name: "Home & Living",       imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", showOnHomepage: true  },
  { name: "Fashion & Apparel",   imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", showOnHomepage: true  },
  { name: "Health & Wellness",   imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400", showOnHomepage: true  },
  { name: "Electronics",         imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400", showOnHomepage: true  },
  { name: "Books & Education",   imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400", showOnHomepage: false },
  { name: "Toys & Kids",         imageUrl: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400", showOnHomepage: false },
  { name: "Sports & Outdoors",   imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400", showOnHomepage: true  },
  { name: "Beauty & Skincare",   imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400", showOnHomepage: true  },
  { name: "Food & Gourmet",      imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400", showOnHomepage: false },
  { name: "Art & Crafts",        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400", showOnHomepage: false },
];

const BRANDS = [
  { name: "NestWell",    website: "https://nestwell.example.com",    logoUrl: "https://ui-avatars.com/api/?name=NestWell&background=4f46e5&color=fff&size=128",    showOnHomepage: true  },
  { name: "ThreadLine",  website: "https://threadline.example.com",  logoUrl: "https://ui-avatars.com/api/?name=ThreadLine&background=0891b2&color=fff&size=128",  showOnHomepage: true  },
  { name: "PureForm",    website: "https://pureform.example.com",    logoUrl: "https://ui-avatars.com/api/?name=PureForm&background=059669&color=fff&size=128",    showOnHomepage: true  },
  { name: "VoltEdge",    website: "https://voltedge.example.com",    logoUrl: "https://ui-avatars.com/api/?name=VoltEdge&background=dc2626&color=fff&size=128",    showOnHomepage: true  },
  { name: "PageTurn",    website: "https://pageturn.example.com",    logoUrl: "https://ui-avatars.com/api/?name=PageTurn&background=d97706&color=fff&size=128",    showOnHomepage: false },
  { name: "JoyBlock",    website: "https://joyblock.example.com",    logoUrl: "https://ui-avatars.com/api/?name=JoyBlock&background=7c3aed&color=fff&size=128",    showOnHomepage: false },
  { name: "TrailForce",  website: "https://trailforce.example.com",  logoUrl: "https://ui-avatars.com/api/?name=TrailForce&background=16a34a&color=fff&size=128",  showOnHomepage: true  },
  { name: "GlowRitual",  website: "https://glowritual.example.com",  logoUrl: "https://ui-avatars.com/api/?name=GlowRitual&background=db2777&color=fff&size=128",  showOnHomepage: true  },
  { name: "HarvestCo",   website: "https://harvestco.example.com",   logoUrl: "https://ui-avatars.com/api/?name=HarvestCo&background=b45309&color=fff&size=128",   showOnHomepage: false },
  { name: "CraftRoot",   website: "https://craftroot.example.com",   logoUrl: "https://ui-avatars.com/api/?name=CraftRoot&background=6d28d9&color=fff&size=128",   showOnHomepage: false },
];

const VENDORS = [
  { name: "Ava Harrison",   email: "ava.harrison@vendor.com",   companyName: "Harrison Home Co.",      shopName: "Harrison Home",      ein: "12-3456781" },
  { name: "Liam Nguyen",    email: "liam.nguyen@vendor.com",    companyName: "Nguyen Threads LLC",     shopName: "Nguyen Threads",     ein: "12-3456782" },
  { name: "Sofia Patel",    email: "sofia.patel@vendor.com",    companyName: "Patel Wellness Group",   shopName: "Patel Wellness",     ein: "12-3456783" },
  { name: "Ethan Brooks",   email: "ethan.brooks@vendor.com",   companyName: "Brooks Tech Solutions",  shopName: "Brooks Tech",        ein: "12-3456784" },
  { name: "Mia Castillo",   email: "mia.castillo@vendor.com",   companyName: "Castillo Reads Inc.",    shopName: "Castillo Reads",     ein: "12-3456785" },
  { name: "Noah Williams",  email: "noah.williams@vendor.com",  companyName: "Williams Toy World",     shopName: "Williams Toys",      ein: "12-3456786" },
  { name: "Isabella Scott", email: "isabella.scott@vendor.com", companyName: "Scott Sports Co.",       shopName: "Scott Sports",       ein: "12-3456787" },
  { name: "James Turner",   email: "james.turner@vendor.com",   companyName: "Turner Beauty Studio",   shopName: "Turner Beauty",      ein: "12-3456788" },
  { name: "Chloe Adams",    email: "chloe.adams@vendor.com",    companyName: "Adams Gourmet Goods",    shopName: "Adams Gourmet",      ein: "12-3456789" },
  { name: "Lucas Martin",   email: "lucas.martin@vendor.com",   companyName: "Martin Craft House",     shopName: "Martin Crafts",      ein: "12-3456790" },
];

// 10 products per vendor — vendor i uses category[i] and brand[i]
const PRODUCT_TEMPLATES = [
  [
    { title: "Linen Throw Pillow Set",          price: 49.99,  comparePrice: 69.99,  sku: "HOME-001", stock: 50,  shortDesc: "Set of 2 premium linen throw pillows with hidden zipper closure." },
    { title: "Bamboo Cutting Board",             price: 34.99,  comparePrice: null,   sku: "HOME-002", stock: 80,  shortDesc: "Eco-friendly bamboo cutting board with juice groove and handle." },
    { title: "Ceramic Mug Set",                  price: 29.99,  comparePrice: 39.99,  sku: "HOME-003", stock: 120, shortDesc: "Set of 4 hand-glazed ceramic mugs, dishwasher safe." },
    { title: "Woven Storage Basket",             price: 22.99,  comparePrice: null,   sku: "HOME-004", stock: 60,  shortDesc: "Handwoven seagrass basket perfect for blankets and toys." },
    { title: "Scented Soy Candle",               price: 18.99,  comparePrice: 24.99,  sku: "HOME-005", stock: 200, shortDesc: "Hand-poured soy candle with lavender & vanilla fragrance, 40hr burn." },
    { title: "Macramé Wall Hanging",             price: 55.00,  comparePrice: null,   sku: "HOME-006", stock: 30,  shortDesc: "Boho-style handcrafted macramé wall décor, 24 inches wide." },
    { title: "Velvet Accent Chair",              price: 299.00, comparePrice: 399.00, sku: "HOME-007", stock: 15,  shortDesc: "Mid-century modern velvet accent chair in deep forest green." },
    { title: "Marble Cheese Board",              price: 44.99,  comparePrice: 59.99,  sku: "HOME-008", stock: 45,  shortDesc: "Natural marble cheese board with acacia wood handle." },
    { title: "Linen Duvet Cover",                price: 89.99,  comparePrice: 119.99, sku: "HOME-009", stock: 40,  shortDesc: "100% stonewashed linen duvet cover, queen size, 8 color options." },
    { title: "Rattan Pendant Light",             price: 129.00, comparePrice: 159.00, sku: "HOME-010", stock: 20,  shortDesc: "Handwoven rattan pendant light shade, fits E26 bulb." },
  ],
  [
    { title: "Organic Cotton Tote Bag",          price: 19.99,  comparePrice: null,   sku: "FASH-001", stock: 150, shortDesc: "Heavy-duty 100% organic cotton tote with interior pocket." },
    { title: "Merino Wool Beanie",               price: 32.00,  comparePrice: 42.00,  sku: "FASH-002", stock: 90,  shortDesc: "Soft merino wool beanie, one size fits most, 12 colors available." },
    { title: "Slim-Fit Chino Pants",             price: 64.99,  comparePrice: 84.99,  sku: "FASH-003", stock: 70,  shortDesc: "Stretch slim-fit chinos in 6 classic colors, sizes 28–40." },
    { title: "Linen Button-Down Shirt",          price: 54.99,  comparePrice: null,   sku: "FASH-004", stock: 60,  shortDesc: "Relaxed-fit linen shirt, perfect for warm weather, sizes XS–XXL." },
    { title: "Leather Bifold Wallet",            price: 39.99,  comparePrice: 54.99,  sku: "FASH-005", stock: 100, shortDesc: "Full-grain leather bifold wallet with RFID blocking, 6 card slots." },
    { title: "Ribbed Knit Sweater",              price: 72.00,  comparePrice: 95.00,  sku: "FASH-006", stock: 55,  shortDesc: "Chunky ribbed knit crewneck sweater in 8 seasonal shades." },
    { title: "Canvas Sneakers",                  price: 79.99,  comparePrice: 99.99,  sku: "FASH-007", stock: 80,  shortDesc: "Classic low-top canvas sneakers with rubber sole, unisex sizing." },
    { title: "Silk Scrunchie Set",               price: 14.99,  comparePrice: null,   sku: "FASH-008", stock: 300, shortDesc: "Set of 5 100% mulberry silk scrunchies in assorted colors." },
    { title: "Crossbody Bag",                    price: 89.00,  comparePrice: 115.00, sku: "FASH-009", stock: 40,  shortDesc: "Vegan leather crossbody bag with adjustable strap and zip closure." },
    { title: "Denim Jacket",                     price: 99.00,  comparePrice: 130.00, sku: "FASH-010", stock: 35,  shortDesc: "Classic washed denim jacket with two chest pockets, sizes XS–XL." },
  ],
  [
    { title: "Vitamin D3 + K2 Supplement",       price: 24.99,  comparePrice: 34.99,  sku: "HLTH-001", stock: 200, shortDesc: "High-potency D3 5000 IU with K2 MK-7, 90 vegetarian softgels." },
    { title: "Yoga Mat Pro",                      price: 69.99,  comparePrice: 89.99,  sku: "HLTH-002", stock: 60,  shortDesc: "6mm non-slip TPE yoga mat with alignment lines and carry strap." },
    { title: "Collagen Peptides Powder",          price: 39.99,  comparePrice: null,   sku: "HLTH-003", stock: 150, shortDesc: "Grass-fed bovine collagen powder, unflavored, 40 servings." },
    { title: "Foam Roller",                       price: 29.99,  comparePrice: 39.99,  sku: "HLTH-004", stock: 90,  shortDesc: "High-density foam roller for muscle recovery, 18-inch." },
    { title: "Magnesium Glycinate Capsules",      price: 19.99,  comparePrice: null,   sku: "HLTH-005", stock: 250, shortDesc: "Highly bioavailable magnesium glycinate, 400mg, 120 capsules." },
    { title: "Resistance Band Set",               price: 34.99,  comparePrice: 49.99,  sku: "HLTH-006", stock: 110, shortDesc: "Set of 5 fabric resistance bands with carry bag, light to extra-heavy." },
    { title: "Meditation Cushion",                price: 45.00,  comparePrice: 60.00,  sku: "HLTH-007", stock: 40,  shortDesc: "Buckwheat-filled zafu meditation cushion with removable cover." },
    { title: "Herbal Sleep Tea",                  price: 14.99,  comparePrice: null,   sku: "HLTH-008", stock: 300, shortDesc: "Caffeine-free chamomile, valerian root & passionflower blend, 30 bags." },
    { title: "Jump Rope Speed Cable",             price: 22.99,  comparePrice: 29.99,  sku: "HLTH-009", stock: 80,  shortDesc: "Adjustable speed jump rope with ball-bearing handles." },
    { title: "Acupressure Mat & Pillow Set",      price: 49.99,  comparePrice: 64.99,  sku: "HLTH-010", stock: 55,  shortDesc: "Lotus spike acupressure mat and pillow set for back and neck relief." },
  ],
  [
    { title: "Wireless Charging Pad",            price: 29.99,  comparePrice: 44.99,  sku: "ELEC-001", stock: 120, shortDesc: "10W fast wireless charging pad, compatible with Qi-enabled devices." },
    { title: "Bluetooth Earbuds",                price: 79.99,  comparePrice: 109.99, sku: "ELEC-002", stock: 80,  shortDesc: "True wireless earbuds with ANC, 8-hour battery + 24hr charging case." },
    { title: "USB-C Hub 7-in-1",                 price: 49.99,  comparePrice: 69.99,  sku: "ELEC-003", stock: 60,  shortDesc: "Compact 7-in-1 USB-C hub: HDMI 4K, 3× USB-A, SD, microSD, PD 100W." },
    { title: "Smart LED Desk Lamp",              price: 59.99,  comparePrice: 79.99,  sku: "ELEC-004", stock: 45,  shortDesc: "Touch-dimmer desk lamp with 5 color temps, USB-A charging port." },
    { title: "Portable Power Bank 20000mAh",     price: 44.99,  comparePrice: null,   sku: "ELEC-005", stock: 90,  shortDesc: "Slim 20000mAh power bank with 22.5W fast charge and dual USB-A/C." },
    { title: "Mechanical Keyboard TKL",          price: 89.99,  comparePrice: 119.99, sku: "ELEC-006", stock: 35,  shortDesc: "Tenkeyless mechanical keyboard with blue switches and RGB backlight." },
    { title: "Webcam 1080p",                     price: 64.99,  comparePrice: 84.99,  sku: "ELEC-007", stock: 55,  shortDesc: "Full HD 1080p/30fps webcam with built-in stereo mic and privacy cover." },
    { title: "Smart Plug 4-Pack",                price: 34.99,  comparePrice: 49.99,  sku: "ELEC-008", stock: 100, shortDesc: "Wi-Fi smart plugs with energy monitoring, works with Alexa & Google." },
    { title: "Cable Management Box",             price: 24.99,  comparePrice: null,   sku: "ELEC-009", stock: 70,  shortDesc: "Large cable management box hides power strips and excess cables." },
    { title: "Phone Stand Adjustable",           price: 17.99,  comparePrice: 24.99,  sku: "ELEC-010", stock: 150, shortDesc: "Aluminum adjustable phone and tablet stand, foldable and portable." },
  ],
  [
    { title: "The Art of Intentional Living",    price: 16.99,  comparePrice: 22.99,  sku: "BOOK-001", stock: 80,  shortDesc: "Bestselling guide to simplifying your life and finding purpose." },
    { title: "Watercolor Workbook",              price: 24.99,  comparePrice: null,   sku: "BOOK-002", stock: 60,  shortDesc: "Step-by-step beginner watercolor exercises with tear-out pages." },
    { title: "Kids' Science Encyclopedia",       price: 29.99,  comparePrice: 39.99,  sku: "BOOK-003", stock: 50,  shortDesc: "Visual science encyclopedia for ages 8–14 with 1,000+ illustrations." },
    { title: "Leather Journal",                  price: 22.99,  comparePrice: null,   sku: "BOOK-004", stock: 120, shortDesc: "Handmade genuine leather journal, 200 pages, lay-flat binding." },
    { title: "Language Flash Cards — Spanish",   price: 14.99,  comparePrice: 19.99,  sku: "BOOK-005", stock: 90,  shortDesc: "500 Spanish vocabulary flash cards with phonetic pronunciation guide." },
    { title: "Mindfulness Coloring Book",        price: 12.99,  comparePrice: null,   sku: "BOOK-006", stock: 150, shortDesc: "Anti-stress adult coloring book, 50 intricate mandala designs." },
    { title: "Cookbook: Plant-Based Feasts",     price: 34.99,  comparePrice: 44.99,  sku: "BOOK-007", stock: 40,  shortDesc: "100 vibrant whole-food plant-based recipes for every occasion." },
    { title: "Graph Paper Notebook 3-Pack",      price: 11.99,  comparePrice: null,   sku: "BOOK-008", stock: 200, shortDesc: "A5 graph paper notebooks, 80 pages each, perforated, hardcover." },
    { title: "World Map Scratch Poster",         price: 19.99,  comparePrice: 27.99,  sku: "BOOK-009", stock: 75,  shortDesc: "Scratch-off world map poster, 24×17in, tracks countries visited." },
    { title: "Chess Set Deluxe",                 price: 54.99,  comparePrice: 74.99,  sku: "BOOK-010", stock: 30,  shortDesc: "Folding wooden chess set with tournament-weight pieces, 15-inch board." },
  ],
  [
    { title: "Building Blocks 100-Piece Set",    price: 39.99,  comparePrice: 54.99,  sku: "TOYS-001", stock: 60,  shortDesc: "Colorful wooden building blocks, non-toxic paint, ages 2+." },
    { title: "Remote Control Car",               price: 34.99,  comparePrice: 49.99,  sku: "TOYS-002", stock: 50,  shortDesc: "2.4GHz RC car with 30-min runtime, rechargeable battery, ages 6+." },
    { title: "Art Supply Kit Kids",              price: 27.99,  comparePrice: null,   sku: "TOYS-003", stock: 80,  shortDesc: "140-piece art kit with crayons, markers, colored pencils and watercolors." },
    { title: "Magnetic Fishing Game",            price: 16.99,  comparePrice: 22.99,  sku: "TOYS-004", stock: 100, shortDesc: "Classic wooden magnetic fishing game for toddlers, ages 18m+." },
    { title: "Kids Ukulele Starter Set",         price: 44.99,  comparePrice: 59.99,  sku: "TOYS-005", stock: 35,  shortDesc: "21-inch soprano ukulele for kids with tuner, strap, picks and gig bag." },
    { title: "Foam Sword & Shield Set",          price: 19.99,  comparePrice: null,   sku: "TOYS-006", stock: 90,  shortDesc: "Safe foam role-play sword and shield set, ages 4+." },
    { title: "Puzzle 500 Pieces — Wildlife",     price: 14.99,  comparePrice: 19.99,  sku: "TOYS-007", stock: 70,  shortDesc: "500-piece wildlife jigsaw puzzle, finished size 20×27 inches." },
    { title: "Play-Dough 10-Color Pack",         price: 12.99,  comparePrice: null,   sku: "TOYS-008", stock: 200, shortDesc: "Non-toxic modeling dough, 10 bright colors, resealable containers." },
    { title: "Balance Board Kids",               price: 49.99,  comparePrice: 64.99,  sku: "TOYS-009", stock: 40,  shortDesc: "Wooden balance board with non-slip surface, supports up to 150 lbs." },
    { title: "Glow-in-the-Dark Stars Set",       price: 9.99,   comparePrice: null,   sku: "TOYS-010", stock: 300, shortDesc: "200-piece glow-in-the-dark ceiling star stickers, ages 4+." },
  ],
  [
    { title: "Trekking Pole Set",                price: 59.99,  comparePrice: 79.99,  sku: "SPRT-001", stock: 45,  shortDesc: "Lightweight aluminum trekking poles with cork grip and quick-lock." },
    { title: "Hydration Running Vest",           price: 74.99,  comparePrice: 99.99,  sku: "SPRT-002", stock: 30,  shortDesc: "2L hydration vest with 12 pockets, fits most body types." },
    { title: "Camping Hammock",                  price: 34.99,  comparePrice: null,   sku: "SPRT-003", stock: 60,  shortDesc: "Double nylon camping hammock, holds 400 lbs, packs into built-in pouch." },
    { title: "Resistance Training Gloves",       price: 24.99,  comparePrice: 34.99,  sku: "SPRT-004", stock: 80,  shortDesc: "Padded weight lifting gloves with wrist wrap, sizes S–XL." },
    { title: "Insulated Water Bottle 32oz",      price: 32.99,  comparePrice: 44.99,  sku: "SPRT-005", stock: 100, shortDesc: "Double-wall vacuum insulated stainless steel bottle, keeps cold 24hr." },
    { title: "Pickleball Paddle Set",            price: 64.99,  comparePrice: 84.99,  sku: "SPRT-006", stock: 40,  shortDesc: "2 graphite paddles + 4 balls + bag, USAPA approved." },
    { title: "Cycling Helmet",                   price: 49.99,  comparePrice: 69.99,  sku: "SPRT-007", stock: 35,  shortDesc: "CPSC-certified road cycling helmet with 18 vents, sizes S/M/L." },
    { title: "Gym Duffle Bag",                   price: 39.99,  comparePrice: null,   sku: "SPRT-008", stock: 70,  shortDesc: "35L gym duffle with wet pocket, shoe compartment and laptop sleeve." },
    { title: "Ankle Weights 5 lb Pair",          price: 22.99,  comparePrice: 29.99,  sku: "SPRT-009", stock: 90,  shortDesc: "Adjustable ankle weights, 2.5 lbs each, soft neoprene with velcro." },
    { title: "Foam Swim Kickboard",              price: 12.99,  comparePrice: null,   sku: "SPRT-010", stock: 120, shortDesc: "High-density EVA foam kickboard for swim training, adult size." },
  ],
  [
    { title: "Vitamin C Brightening Serum",      price: 28.99,  comparePrice: 38.99,  sku: "BEAU-001", stock: 150, shortDesc: "15% stabilized Vitamin C + E + Ferulic acid serum, 30ml." },
    { title: "Facial Jade Roller",               price: 19.99,  comparePrice: null,   sku: "BEAU-002", stock: 200, shortDesc: "Dual-end genuine jade roller for lymphatic drainage and de-puffing." },
    { title: "Natural Deodorant",                price: 12.99,  comparePrice: 16.99,  sku: "BEAU-003", stock: 250, shortDesc: "Aluminum-free natural deodorant with baking soda and coconut oil." },
    { title: "Hydrating Sheet Mask 10-Pack",     price: 22.99,  comparePrice: 29.99,  sku: "BEAU-004", stock: 180, shortDesc: "Korean hydrating sheet masks with hyaluronic acid and aloe vera." },
    { title: "Eyebrow Pencil Micro",             price: 11.99,  comparePrice: null,   sku: "BEAU-005", stock: 300, shortDesc: "Ultra-fine micro brow pencil with spoolie brush, 6 shades." },
    { title: "Rose Hip Face Oil",                price: 24.99,  comparePrice: 34.99,  sku: "BEAU-006", stock: 100, shortDesc: "Cold-pressed organic rosehip seed oil for scars and anti-aging, 30ml." },
    { title: "Konjac Facial Sponge",             price: 9.99,   comparePrice: null,   sku: "BEAU-007", stock: 400, shortDesc: "100% natural konjac sponge for gentle daily cleansing, all skin types." },
    { title: "Shea Butter Body Lotion",          price: 17.99,  comparePrice: 23.99,  sku: "BEAU-008", stock: 130, shortDesc: "Thick unscented shea butter body lotion for dry skin, 16oz pump." },
    { title: "Bamboo Makeup Brush Set",          price: 34.99,  comparePrice: 44.99,  sku: "BEAU-009", stock: 75,  shortDesc: "12-piece synthetic makeup brush set with bamboo handles and roll pouch." },
    { title: "Lip Balm SPF 30 3-Pack",           price: 13.99,  comparePrice: null,   sku: "BEAU-010", stock: 350, shortDesc: "Moisturizing SPF 30 lip balm in vanilla, mint and cherry, set of 3." },
  ],
  [
    { title: "Raw Wildflower Honey 16oz",        price: 14.99,  comparePrice: 19.99,  sku: "FOOD-001", stock: 120, shortDesc: "Unfiltered raw wildflower honey, single-source, glass jar." },
    { title: "Artisan Olive Oil 500ml",          price: 19.99,  comparePrice: null,   sku: "FOOD-002", stock: 80,  shortDesc: "Cold-pressed extra-virgin olive oil from family-owned Sicilian groves." },
    { title: "Dark Chocolate Bar 3-Pack",        price: 16.99,  comparePrice: 21.99,  sku: "FOOD-003", stock: 100, shortDesc: "70%, 85%, and 90% cacao dark chocolate bars, ethically sourced." },
    { title: "Organic Matcha Powder",            price: 24.99,  comparePrice: 34.99,  sku: "FOOD-004", stock: 90,  shortDesc: "Ceremonial grade organic Japanese matcha, 100g tin." },
    { title: "Mixed Nut Butter Sampler",         price: 22.99,  comparePrice: null,   sku: "FOOD-005", stock: 70,  shortDesc: "4-jar sampler: almond, cashew, pecan, and walnut butter, 6oz each." },
    { title: "Himalayan Pink Salt Grinder",      price: 9.99,   comparePrice: 13.99,  sku: "FOOD-006", stock: 200, shortDesc: "Refillable adjustable ceramic grinder filled with fine Himalayan salt." },
    { title: "Dried Mango Strips 12oz",          price: 12.99,  comparePrice: null,   sku: "FOOD-007", stock: 150, shortDesc: "Unsulfured, no-sugar-added dried mango strips, resealable bag." },
    { title: "Specialty Coffee Blend 12oz",      price: 17.99,  comparePrice: 24.99,  sku: "FOOD-008", stock: 90,  shortDesc: "Medium-roast single-origin Colombia whole bean coffee, 12oz bag." },
    { title: "Sea Salt Caramels Box",            price: 15.99,  comparePrice: null,   sku: "FOOD-009", stock: 80,  shortDesc: "Handcrafted buttery caramels with fleur de sel, 16-piece gift box." },
    { title: "Herbal Tea Sampler",               price: 18.99,  comparePrice: 24.99,  sku: "FOOD-010", stock: 110, shortDesc: "40-count herbal tea sampler: 8 unique caffeine-free blends." },
  ],
  [
    { title: "Watercolor Paint Set 36-Color",    price: 29.99,  comparePrice: 39.99,  sku: "ARTS-001", stock: 80,  shortDesc: "Professional 36-color watercolor palette in half-pans with mixing tray." },
    { title: "Sketching Pencil Set",             price: 19.99,  comparePrice: null,   sku: "ARTS-002", stock: 120, shortDesc: "12-piece artist sketching pencil set, 6H to 8B grades, cedar wood." },
    { title: "Crochet Starter Kit",              price: 34.99,  comparePrice: 44.99,  sku: "ARTS-003", stock: 60,  shortDesc: "Complete crochet kit with 9 hooks, yarn, needle, scissors and guide." },
    { title: "Air-Dry Clay 2lb",                 price: 16.99,  comparePrice: null,   sku: "ARTS-004", stock: 100, shortDesc: "Smooth white air-dry clay, no kiln needed, paintable when dry." },
    { title: "Linocut Printmaking Kit",          price: 44.99,  comparePrice: 59.99,  sku: "ARTS-005", stock: 35,  shortDesc: "Complete linocut kit with carving tools, linoleum blocks and ink." },
    { title: "Brush Pen Calligraphy Set",        price: 22.99,  comparePrice: 29.99,  sku: "ARTS-006", stock: 90,  shortDesc: "12-piece brush pen set for modern calligraphy with practice worksheets." },
    { title: "Canvas Panels 12-Pack",            price: 24.99,  comparePrice: null,   sku: "ARTS-007", stock: 70,  shortDesc: "8x10in triple-primed cotton canvas panels, acid-free, 12-pack." },
    { title: "Embroidery Starter Kit",           price: 27.99,  comparePrice: 37.99,  sku: "ARTS-008", stock: 55,  shortDesc: "Beginner embroidery kit with 3 pattern hoops, thread, needles and guide." },
    { title: "Palette Knife Set 5-Piece",        price: 14.99,  comparePrice: null,   sku: "ARTS-009", stock: 110, shortDesc: "Stainless steel palette knife set for oil and acrylic painting." },
    { title: "Alcohol Ink Set 24 Colors",        price: 32.99,  comparePrice: 44.99,  sku: "ARTS-010", stock: 65,  shortDesc: "Vibrant alcohol ink set for yupo paper, resin and glass art." },
  ],
];

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
  "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
];

async function main() {
  const password = await bcrypt.hash("Vendor@LDS2026!", 10);

  // Upsert categories
  console.log("\n── Categories ──");
  const categoryIds: string[] = [];
  for (const cat of CATEGORIES) {
    const s = slug(cat.name);
    const existing = await prisma.category.findUnique({ where: { slug: s } });
    if (existing) {
      categoryIds.push(existing.id);
      console.log(`  exists: ${cat.name}`);
    } else {
      const created = await prisma.category.create({ data: { name: cat.name, slug: s, imageUrl: cat.imageUrl, showOnHomepage: cat.showOnHomepage } });
      categoryIds.push(created.id);
      console.log(`  ✓ ${cat.name}`);
    }
  }

  // Upsert brands
  console.log("\n── Brands ──");
  const brandIds: string[] = [];
  for (const brand of BRANDS) {
    const s = slug(brand.name);
    const existing = await prisma.brand.findUnique({ where: { slug: s } });
    if (existing) {
      brandIds.push(existing.id);
      console.log(`  exists: ${brand.name}`);
    } else {
      const created = await prisma.brand.create({ data: { name: brand.name, slug: s, logoUrl: brand.logoUrl, website: brand.website, showOnHomepage: brand.showOnHomepage } });
      brandIds.push(created.id);
      console.log(`  ✓ ${brand.name}`);
    }
  }

  // Create vendors + products
  console.log("\n── Vendors & Products ──");
  for (let i = 0; i < VENDORS.length; i++) {
    const v = VENDORS[i];
    const shopSlug = slug(v.shopName);

    let vendor = await prisma.user.findUnique({ where: { email: v.email } });
    if (vendor) {
      console.log(`\n  vendor exists: ${v.name} — skipping vendor creation`);
    } else {
      vendor = await prisma.user.create({
        data: {
          name: v.name,
          email: v.email,
          password,
          role: "VENDOR",
          companyName: v.companyName,
          shopName: v.shopName,
          shopSlug,
          ein: v.ein,
          vendorStatus: "APPROVED",
          isActive: true,
        },
      });
      console.log(`\n  ✓ Vendor: ${v.name} (${v.email})`);
    }

    const templates = PRODUCT_TEMPLATES[i];
    for (let j = 0; j < templates.length; j++) {
      const t = templates[j];
      const productSlug = slug(t.title) + "-" + shopSlug;

      const existing = await prisma.product.findUnique({ where: { slug: productSlug } });
      if (existing) {
        console.log(`    exists: ${t.title}`);
        continue;
      }

      await prisma.product.create({
        data: {
          title: t.title,
          slug: productSlug,
          shortDesc: t.shortDesc,
          description: `<p>${t.shortDesc}</p><p>Brought to you by ${v.shopName}, a trusted vendor on Latter Day Shopping.</p>`,
          price: t.price,
          comparePrice: t.comparePrice ?? undefined,
          sku: t.sku,
          stock: t.stock,
          images: [PRODUCT_IMAGES[i]],
          redirectUrl: `https://example.com/products/${slug(t.title)}`,
          vendorId: vendor.id,
          categoryId: categoryIds[i],
          brandId: brandIds[i],
          isFeatured: j < 2,
          isNewArrival: j >= 8,
          isActive: true,
        },
      });
      console.log(`    ✓ ${t.title}`);
    }
  }

  console.log("\n✓ Done! All vendor passwords: Vendor@LDS2026!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
