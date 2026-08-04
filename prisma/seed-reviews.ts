import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

const USERS = [
  { name: "Sarah Mitchell",  email: "sarah.mitchell@example.com"  },
  { name: "James Carter",    email: "james.carter@example.com"    },
  { name: "Emily Rodriguez", email: "emily.rodriguez@example.com" },
  { name: "Daniel Kim",      email: "daniel.kim@example.com"      },
  { name: "Olivia Thompson", email: "olivia.thompson@example.com" },
  { name: "Marcus Johnson",  email: "marcus.johnson@example.com"  },
];

const REVIEWS = [
  {
    rating: 5,
    title: "Absolutely love this platform!",
    body: "Latter Day Shopping has completely changed how I shop. The vendors are incredibly passionate about what they sell and the quality is always top-notch. I've discovered so many amazing products I never would have found elsewhere.",
    status: "APPROVED",
  },
  {
    rating: 5,
    title: "A marketplace that actually cares",
    body: "I was skeptical at first but after my first few purchases I was hooked. Every vendor I've interacted with has been professional and the products are exactly as described. This is what online shopping should feel like.",
    status: "APPROVED",
  },
  {
    rating: 4,
    title: "Great selection, easy to navigate",
    body: "Finding products here is so much easier than on big-box marketplaces. I love that each vendor has a story behind their products. Dropped one star only because I wish there were more categories, but overall a fantastic experience.",
    status: "APPROVED",
  },
  {
    rating: 5,
    title: "My go-to shopping destination",
    body: "I've made over a dozen purchases on Latter Day Shopping and every single one has exceeded my expectations. The community feel is unlike anything else online. Highly recommend to anyone looking for unique, quality products.",
    status: "APPROVED",
  },
  {
    rating: 4,
    title: "Really impressed with the vendors",
    body: "The vendors on this platform genuinely care about their customers. I had a small issue with an order and the seller resolved it immediately. That kind of service is rare these days. Will definitely keep shopping here.",
    status: "PENDING",
  },
  {
    rating: 5,
    title: "Sustainable shopping made simple",
    body: "As someone who cares deeply about intentional living, this platform is a dream. Every product feels curated with purpose. I love that I can shop here knowing I'm supporting independent vendors who share my values.",
    status: "APPROVED",
  },
];

async function main() {
  const password = await bcrypt.hash("User@LDS2026!", 10);

  for (let i = 0; i < USERS.length; i++) {
    const u = USERS[i];
    const r = REVIEWS[i];

    let user = await prisma.user.findUnique({ where: { email: u.email } });

    if (!user) {
      user = await prisma.user.create({
        data: { name: u.name, email: u.email, password, role: "USER" },
      });
      console.log(`✓ Created user: ${u.name} (${u.email})`);
    } else {
      console.log(`  User exists: ${u.name} — skipping user creation`);
    }

    const existing = await prisma.review.findFirst({ where: { userId: user.id } });
    if (!existing) {
      await prisma.review.create({
        data: { userId: user.id, rating: r.rating, title: r.title, body: r.body, status: r.status as never },
      });
      console.log(`  ✓ Review added (${r.rating}★ · ${r.status}): "${r.title}"`);
    } else {
      console.log(`  Review already exists for ${u.name} — skipping`);
    }
  }

  console.log("\nDone! All users password: User@LDS2026!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
