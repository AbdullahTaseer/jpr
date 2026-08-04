import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

const BLOGS = [
  {
    title: "10 Ways to Build a More Sustainable Wardrobe",
    slug: "10-ways-sustainable-wardrobe",
    category: "Fashion",
    author: "Sarah Mitchell",
    isFeatured: true,
    status: "PUBLISHED" as const,
    readTime: 6,
    featuredImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&q=85&auto=format&fit=crop",
    excerpt: "Discover how small changes in your daily shopping habits can have an enormous impact on the environment and the communities behind your clothes.",
    content: `
<h1>10 Ways to Build a More Sustainable Wardrobe</h1>

<p>Fast fashion has transformed how we buy clothes — but at a steep cost to the planet. The good news? You don't have to overhaul your entire lifestyle overnight. Small, intentional shifts in how you shop, care for, and think about clothing can add up to a meaningful difference.</p>

<blockquote>
  "The most sustainable garment is the one already in your wardrobe." — Orsola de Castro, Fashion Revolution co-founder
</blockquote>

<h2>1. Buy Less, Choose Well</h2>
<p>The single most impactful thing you can do is simply buy less. Before adding any item to your cart, ask: <strong>Will I wear this at least 30 times?</strong> If the answer is uncertain, put it back. Quality over quantity is the mantra of every sustainable wardrobe.</p>

<img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=500&q=85&auto=format&fit=crop" alt="Sustainable fashion choices" style="max-width:100%;border-radius:16px;margin:24px 0;" />

<h2>2. Invest in Timeless Pieces</h2>
<p>Trends come and go, but classic silhouettes endure. A well-cut white shirt, quality denim, a versatile blazer — these pieces form the backbone of a wardrobe that never goes out of style. When you invest in timeless pieces, you buy less frequently and wear each item far more.</p>

<h2>3. Shop Secondhand First</h2>
<p>Before buying new, check secondhand sources. Thrift stores, consignment shops, and online resale platforms offer incredible finds at a fraction of retail prices. Buying secondhand keeps clothing in circulation longer and dramatically reduces demand for new production.</p>

<h3>Best places to shop secondhand:</h3>
<ul>
  <li>Local thrift and charity shops</li>
  <li>Consignment boutiques for higher-end pieces</li>
  <li>Online resale platforms and marketplaces</li>
  <li>Clothing swaps with friends and community groups</li>
  <li>Estate sales and vintage markets</li>
</ul>

<h2>4. Support Independent Vendors</h2>
<p>When you do buy new, choose <strong>independent vendors and small makers</strong> over fast fashion giants. Independent sellers typically produce in smaller quantities, use higher-quality materials, and pay their workers fairly. Platforms like ours exist precisely to connect conscious shoppers with these purpose-driven sellers.</p>

<h2>5. Care for Your Clothes Properly</h2>
<p>Proper care dramatically extends the lifespan of your clothing. Washing on cold, air-drying instead of tumble drying, and storing items correctly can double or triple how long they last.</p>

<table style="border-collapse:collapse;width:100%;margin:24px 0;">
  <thead>
    <tr>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Fabric</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Wash Temp</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Drying Method</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Special Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Cotton</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Cold (30°C)</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Air dry flat</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Avoid over-washing</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Wool</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Hand wash</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Lay flat to dry</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Store folded, not hung</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Silk</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Hand wash cold</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Air dry away from sun</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Iron on low heat inside-out</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Linen</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Cold (30°C)</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Air dry</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Gets softer with each wash</td>
    </tr>
  </tbody>
</table>

<h2>6. Learn Basic Repairs</h2>
<p>A missing button, a split seam, or a small hole doesn't mean an item is finished. Learning basic mending skills — or finding a good tailor — keeps your clothes in rotation far longer. Many cities now have repair cafés where volunteers help fix clothing for free.</p>

<h2>7. Rent for Special Occasions</h2>
<p>Formal events, weddings, and one-off occasions are prime candidates for rental rather than purchase. Dress rental platforms have exploded in recent years, giving access to designer pieces for a fraction of the purchase price — and without the wardrobe guilt of a rarely-worn item.</p>

<h2>8. Choose Natural and Recycled Fibres</h2>
<p>When buying new, prioritise <strong>organic cotton, linen, Tencel, recycled polyester, or wool</strong> over virgin synthetics. Synthetic fabrics like virgin polyester shed microplastics with every wash, contributing to ocean pollution.</p>

<h2>9. Audit Your Wardrobe Regularly</h2>
<p>Twice a year, pull everything out and assess honestly. Items you haven't touched in 12 months are better donated, sold, or swapped. A smaller, curated wardrobe makes getting dressed easier and reduces the temptation to buy more.</p>

<h2>10. Shift Your Mindset</h2>
<p>Ultimately, sustainable fashion is about seeing clothing differently — as an investment rather than a disposable commodity. When you value what you own, you naturally care for it better, replace it less often, and make more intentional choices when you do shop.</p>

<hr style="border:none;border-top:2px solid #e5e7eb;margin:32px 0;" />

<p><strong>The journey to a more sustainable wardrobe doesn't happen overnight.</strong> Start with one or two changes and build from there. Every conscious choice — no matter how small — moves the needle in the right direction.</p>
    `.trim(),
  },

  {
    title: "From Side Hustle to 6-Figure Vendor: A Seller's Story",
    slug: "side-hustle-to-six-figures-vendor-story",
    category: "Business",
    author: "Marcus Williams",
    isFeatured: false,
    status: "PUBLISHED" as const,
    readTime: 8,
    featuredImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&q=85&auto=format&fit=crop",
    excerpt: "How one maker went from selling at local markets to generating over $100K annually through our platform — without compromising their values.",
    content: `
<h1>From Side Hustle to 6-Figure Vendor: A Seller's Story</h1>

<p>Three years ago, Emma Lawson was hand-stitching leather goods on her kitchen table between shifts at her day job. Today, her brand <strong>CraftCo Leather</strong> generates over $120,000 in annual revenue — entirely through conscious, independent selling. This is her story.</p>

<img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&h=500&q=85&auto=format&fit=crop" alt="Emma at her workshop" style="max-width:100%;border-radius:16px;margin:24px 0;" />

<h2>The Beginning: A Hobby That Wouldn't Stay Quiet</h2>

<p>Emma started making leather wallets as gifts for friends. "People kept asking to buy them," she recalls. "I thought, maybe there's something here." She began selling at weekend markets — a grind she describes as exhausting but educational.</p>

<blockquote>
  "Markets taught me everything about customers. I could see their faces when they picked up my work. I learned what made people reach for their wallets — both literally and figuratively."
</blockquote>

<p>But markets had a ceiling: limited reach, unpredictable weather, and the physical toll of setup and breakdown every weekend. Emma knew she needed to scale differently.</p>

<h2>Finding the Right Platform</h2>

<p>Emma tried several large marketplaces before finding ours. "The big platforms bury you," she says. "You're competing with mass-produced imports at a fraction of your price. Customers there aren't shopping for <em>you</em> — they're shopping for the cheapest option."</p>

<p>On Latter Day Shopping, she found something different: <strong>buyers who were specifically seeking independent makers</strong>. The community orientation meant her story and craft were features, not noise.</p>

<h2>Growth By the Numbers</h2>

<table style="border-collapse:collapse;width:100%;margin:24px 0;">
  <thead>
    <tr>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Year</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Revenue</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Products Listed</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Key Milestone</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Year 1</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">$18,400</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">12</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Left day job in month 9</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Year 2</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">$67,200</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">28</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Hired first assistant</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Year 3</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">$124,800</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">41</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Moved to dedicated studio</td>
    </tr>
  </tbody>
</table>

<h2>What Made the Difference</h2>

<p>Emma credits four factors for her growth:</p>

<ol>
  <li><strong>Photography investment.</strong> "The first thing I did was hire a photographer for half a day. My sales jumped 40% the following month. Visuals are everything online."</li>
  <li><strong>Telling her story.</strong> Every product description explains the craft, the materials, and the care that goes in. "People aren't just buying a wallet — they're buying a piece of someone's life's work."</li>
  <li><strong>Customer service as marketing.</strong> Emma responds to every message within two hours. Her 100% positive review rate has become her most powerful sales tool.</li>
  <li><strong>Listening to buyers.</strong> Two of her best-selling products were custom requests she later added to her standard range. "Your customers will tell you what to make next if you pay attention."</li>
</ol>

<h2>Advice for New Vendors</h2>

<blockquote>
  "Don't wait until everything is perfect to start. My first product photos were taken on a grey blanket with my phone. Start where you are. Improve as you go. The market will tell you what's working."
</blockquote>

<p>Emma also emphasises the importance of pricing correctly from the start. "Underpricing your work is a trap. It attracts buyers who don't value craft, burns you out, and leaves no room to grow. Price for sustainability — yours and theirs."</p>

<hr style="border:none;border-top:2px solid #e5e7eb;margin:32px 0;" />

<p>Emma's story isn't unique on this platform — it's a blueprint. If you're a maker ready to take your craft to the next level, <strong>your story starts here.</strong></p>
    `.trim(),
  },

  {
    title: "The Science of Mindful Shopping: What Research Says",
    slug: "science-of-mindful-shopping",
    category: "Lifestyle",
    author: "Dr. Olivia Chen",
    isFeatured: false,
    status: "PUBLISHED" as const,
    readTime: 5,
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&q=85&auto=format&fit=crop",
    excerpt: "Research shows that intentional purchasing decisions lead to greater satisfaction and reduced buyer's remorse. Here's what the data says about shopping psychology.",
    content: `
<h1>The Science of Mindful Shopping: What Research Says</h1>

<p>We've all experienced it: the rush of buying something new, followed by a quiet deflation when the novelty wears off. Consumer psychologists call this the <strong>"hedonic treadmill"</strong> — our tendency to return quickly to a baseline level of happiness regardless of what we acquire.</p>

<p>But a growing body of research suggests there's a way off the treadmill. <em>Mindful shopping</em> — purchasing with intention, awareness, and alignment to your values — consistently produces higher satisfaction and less regret than impulse buying.</p>

<img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=500&q=85&auto=format&fit=crop" alt="Mindful consumer" style="max-width:100%;border-radius:16px;margin:24px 0;" />

<h2>What the Research Shows</h2>

<p>A 2023 study published in the <em>Journal of Consumer Psychology</em> followed 1,200 shoppers over six months, tracking both their purchasing behaviour and reported wellbeing. The findings were striking:</p>

<ul>
  <li>Shoppers who paused 48 hours before non-essential purchases reported <strong>67% less buyer's remorse</strong></li>
  <li>Those who purchased from brands aligned with their personal values reported <strong>2.3× higher satisfaction</strong> with their purchases one month later</li>
  <li>Impulse buyers returned items at a rate <strong>4× higher</strong> than intentional shoppers</li>
  <li>Mindful shoppers reported feeling <strong>more in control</strong> of their finances and more satisfied with their overall quality of life</li>
</ul>

<h2>The Neuroscience of the Purchase Decision</h2>

<p>When we consider buying something, the brain's reward circuitry lights up in anticipation of pleasure. The <strong>nucleus accumbens</strong> — the brain's pleasure centre — activates, flooding us with dopamine. The problem: this anticipatory pleasure is often greater than the pleasure of actually owning the item.</p>

<blockquote>
  "We are consistently and predictably wrong about how much pleasure we'll get from things we buy. The brain is built to want, not to have." — Dr. Daniel Kahneman, Nobel laureate in Economics
</blockquote>

<p>Understanding this circuit helps explain why mindful shopping works: when you introduce deliberate pauses and reflection into the buying process, you interrupt the dopamine loop and engage your prefrontal cortex — the rational decision-making centre.</p>

<h2>The STOP Framework for Mindful Shopping</h2>

<p>Researchers at Stanford's Center for Compassion and Altruism Research developed a simple framework used by mindful shoppers worldwide:</p>

<table style="border-collapse:collapse;width:100%;margin:24px 0;">
  <thead>
    <tr>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#EBF3FF;font-weight:700;text-align:left;">Letter</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#EBF3FF;font-weight:700;text-align:left;">Step</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#EBF3FF;font-weight:700;text-align:left;">Question to Ask</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;font-weight:700;color:#1B6FEB;">S</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Stop</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Am I shopping out of boredom, stress, or emotion?</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;font-weight:700;color:#1B6FEB;">T</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Think</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Do I genuinely need this, or do I already own something similar?</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;font-weight:700;color:#1B6FEB;">O</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Observe</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Will I still want this in 30 days?</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;font-weight:700;color:#1B6FEB;">P</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Proceed (or Pass)</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Does buying this align with my values and financial goals?</td>
    </tr>
  </tbody>
</table>

<h2>Experience vs. Material: What Actually Makes Us Happy</h2>

<p>Perhaps the most consistent finding in happiness research is that <strong>experiences provide more lasting satisfaction than material possessions</strong>. A memorable dinner, a travel experience, a skill learned — these tend to grow richer in memory over time, while objects fade in novelty.</p>

<p>This doesn't mean you shouldn't buy things. But it does suggest framing purchases differently:</p>

<ol>
  <li>Choose items that <em>enable experiences</em> rather than just sitting on a shelf</li>
  <li>Prioritise quality items you'll use daily — their value compounds over time</li>
  <li>When in doubt, choose an experience over an object</li>
</ol>

<h2>Conscious Commerce as a Path to Wellbeing</h2>

<p>There's a growing body of research showing that <strong>purchasing from businesses aligned with your values increases satisfaction</strong>. When you know the story behind a product — the maker, the materials, the ethos — the purchase becomes meaningful in a way that pure commodity shopping never can.</p>

<blockquote>
  "The most satisfied consumers in our study weren't those who bought the most or spent the most. They were those who bought with the most intention."
</blockquote>

<hr style="border:none;border-top:2px solid #e5e7eb;margin:32px 0;" />

<p>Mindful shopping isn't about buying less for its own sake — it's about ensuring that what you do buy genuinely adds value to your life. That shift in perspective, backed by the science, makes all the difference.</p>
    `.trim(),
  },

  {
    title: "Organic Beauty Products That Actually Work: 3-Month Test Results",
    slug: "organic-beauty-products-that-work",
    category: "Wellness",
    author: "Priya Nair",
    isFeatured: false,
    status: "PUBLISHED" as const,
    readTime: 7,
    featuredImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=600&q=85&auto=format&fit=crop",
    excerpt: "We tested 30 organic skincare products from our vendors over 3 months with a panel of 15 testers. Here are the products that genuinely delivered results.",
    content: `
<h1>Organic Beauty Products That Actually Work: 3-Month Test Results</h1>

<p>The natural beauty aisle can feel like a minefield. Greenwashing is rampant, ingredient lists are confusing, and the price point for truly clean products can be eye-watering. So we decided to do the work for you.</p>

<p>Over three months, our panel of <strong>15 testers</strong> — spanning ages 22 to 58, and a range of skin types — tried <strong>30 organic skincare products</strong> from vendors on our platform. They tracked results weekly, photographed their skin, and completed detailed questionnaires. Here's what actually performed.</p>

<img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&h=500&q=85&auto=format&fit=crop" alt="Natural skincare products" style="max-width:100%;border-radius:16px;margin:24px 0;" />

<h2>Our Testing Methodology</h2>

<p>To qualify for testing, each product had to meet three criteria:</p>

<ol>
  <li><strong>Certified organic ingredients</strong> — at least 70% certified organic content by weight</li>
  <li><strong>No synthetic fragrance</strong> — a leading cause of skin irritation and hormone disruption</li>
  <li><strong>Independently verified</strong> — third-party certifications from recognised bodies (COSMOS, USDA Organic, or equivalent)</li>
</ol>

<p>Testers were asked not to change any other aspects of their skincare routine during the trial period to ensure the results were attributable to the tested products.</p>

<h2>Category Results</h2>

<h3>Facial Serums</h3>
<p>This was the category with the most dramatic results. The standout performer — a <em>rosehip and bakuchiol serum</em> from PureGlow Beauty — was rated by 11 of 15 testers as producing <strong>visible improvement in skin texture and tone</strong> within 4 weeks. Bakuchiol, a plant-based alternative to retinol, delivered retinol-like results without the irritation that synthetic retinol commonly causes.</p>

<blockquote>
  "I've tried every retinol on the market and always had to stop because of flaking. This serum gave me the same glow with zero irritation. I'm genuinely shocked." — Test panel member, 41
</blockquote>

<h3>Moisturisers</h3>
<p>Results in this category were mixed. Heavier creams performed better in autumn/winter testing than lighter gels, as expected. The top performer was a <strong>shea butter and hyaluronic acid cream</strong> that 12 of 15 testers rated as their preferred moisturiser by week 8 — replacing whichever product they had been using before.</p>

<h3>Cleansers</h3>
<p>The organic cleansers tested here were universally gentler than conventional counterparts. However, only two of six cleansers tested achieved our threshold for removing makeup effectively without a second cleanse.</p>

<h2>Full Results Summary</h2>

<table style="border-collapse:collapse;width:100%;margin:24px 0;">
  <thead>
    <tr>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Product Type</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Tested</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Highly Rated</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Avg. Satisfaction</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Top Result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Serums</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">8</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">5</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">4.3 / 5</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Texture improvement</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Moisturisers</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">7</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">4</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">4.1 / 5</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Hydration & softness</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Cleansers</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">6</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">2</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">3.6 / 5</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Gentleness</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Face Oils</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">5</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">4</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">4.5 / 5</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Glow & radiance</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">SPF Products</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">4</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">2</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">3.9 / 5</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">No white cast</td>
    </tr>
  </tbody>
</table>

<h2>Ingredients to Look For</h2>

<p>Based on our results, these ingredients consistently delivered across skin types:</p>

<ul>
  <li><strong>Bakuchiol</strong> — plant-based retinol alternative, no irritation</li>
  <li><strong>Rosehip seed oil</strong> — rich in vitamin A and essential fatty acids</li>
  <li><strong>Niacinamide</strong> (from natural sources) — brightening, pore-minimising</li>
  <li><strong>Hyaluronic acid</strong> — deep hydration without heaviness</li>
  <li><strong>Sea buckthorn</strong> — potent antioxidant, healing for sensitive skin</li>
  <li><strong>Jojoba oil</strong> — closely mirrors skin's natural sebum</li>
</ul>

<h2>Ingredients to Avoid</h2>

<ul>
  <li>Synthetic fragrance (listed as "parfum" or "fragrance")</li>
  <li>Parabens and formaldehyde-releasing preservatives</li>
  <li>PEGs (polyethylene glycols)</li>
  <li>Mineral oil and petrolatum in facial products</li>
</ul>

<hr style="border:none;border-top:2px solid #e5e7eb;margin:32px 0;" />

<p>The organic beauty market has matured significantly. The best products from independent, purpose-driven vendors are now genuinely competitive with — and in many cases superior to — their conventional counterparts. The key is knowing what to look for.</p>
    `.trim(),
  },

  {
    title: "Smart Tech Gadgets from Ethical Makers: Our Top Picks",
    slug: "smart-tech-gadgets-ethical-makers",
    category: "Tech",
    author: "James Okoro",
    isFeatured: false,
    status: "PUBLISHED" as const,
    readTime: 5,
    featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&q=85&auto=format&fit=crop",
    excerpt: "You don't have to choose between cutting-edge technology and ethical sourcing. These vendors on our platform prove that both are possible.",
    content: `
<h1>Smart Tech Gadgets from Ethical Makers: Our Top Picks</h1>

<p>The consumer electronics industry has a troubled relationship with ethics — from supply chain opacity to planned obsolescence to mountains of e-waste. But a new generation of makers is building tech differently: with transparent sourcing, repairability, and longevity at the centre of their designs.</p>

<p>Here are our top picks from ethical tech vendors on our platform, across every budget.</p>

<img src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=500&q=85&auto=format&fit=crop" alt="Ethical tech gadgets" style="max-width:100%;border-radius:16px;margin:24px 0;" />

<h2>What Makes Tech "Ethical"?</h2>

<p>Before we dive into picks, it's worth defining our criteria. For a technology product to qualify for this list, vendors needed to demonstrate:</p>

<ol>
  <li><strong>Supply chain transparency</strong> — disclosure of where components are sourced and who manufactures them</li>
  <li><strong>Repairability</strong> — user-serviceable parts, available repair documentation, or repair services offered</li>
  <li><strong>Longevity design</strong> — built to last, with software support commitments beyond two years</li>
  <li><strong>E-waste responsibility</strong> — take-back programs or guidance on responsible end-of-life disposal</li>
</ol>

<h2>Our Top Picks by Category</h2>

<h3>Audio</h3>

<p>The standout in this category is a pair of <strong>open-ear bone conduction headphones</strong> from an independent audio maker in Wales. Crafted from recycled aluminium and bio-based plastics, they come with a lifetime repair guarantee and ship in fully compostable packaging.</p>

<blockquote>
  "Most headphones are designed to fail. Ours are designed to last. Every component is user-replaceable, and we stock parts indefinitely." — Vendor, TechVibe Audio
</blockquote>

<p>Sound quality? Excellent for spoken audio, podcasts, and calls. For audiophiles seeking deep bass, a traditional headphone will still win — but for everyday use, these are remarkable.</p>

<h3>Charging & Power</h3>

<p>Single-port fast chargers have largely commoditised into a race to the bottom. One vendor here breaks the mould with a <strong>modular charging station</strong> where individual ports can be replaced independently. No more discarding a whole unit because one port died.</p>

<h3>Home Office</h3>

<p>Our favourite find in this category is a <strong>mechanical keyboard</strong> built by a two-person studio in Edinburgh. Hand-assembled, with hot-swappable switches (meaning you can change the feel of every key without soldering) and an aluminium case designed to last decades.</p>

<table style="border-collapse:collapse;width:100%;margin:24px 0;">
  <thead>
    <tr>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Product</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Category</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Price Range</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Standout Feature</th>
      <th style="border:1px solid #e5e7eb;padding:12px 16px;background:#f9fafb;font-weight:700;text-align:left;">Our Rating</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Bone Conduction Headphones</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Audio</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">$120–$150</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Lifetime repair guarantee</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">⭐⭐⭐⭐⭐</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Modular Charging Station</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Power</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">$65–$85</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Individually replaceable ports</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">⭐⭐⭐⭐½</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Handbuilt Mechanical Keyboard</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Home Office</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">$180–$260</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">Hot-swap switches, decade lifespan</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;">⭐⭐⭐⭐⭐</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Solar Portable Charger</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Outdoor</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">$55–$75</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">Recycled panel housing</td>
      <td style="border:1px solid #e5e7eb;padding:10px 16px;background:#f9fafb;">⭐⭐⭐⭐</td>
    </tr>
  </tbody>
</table>

<h2>The Right-to-Repair Movement and Why It Matters</h2>

<p>The right-to-repair movement has gained significant momentum globally. At its core, it argues that when you buy a device, you should have the right — and the means — to fix it yourself or have it fixed by a third party.</p>

<p>The environmental stakes are enormous:</p>

<ul>
  <li>The world generates <strong>53.6 million metric tons</strong> of e-waste annually</li>
  <li>Only <strong>17.4%</strong> is formally recycled</li>
  <li>E-waste contains valuable materials — gold, silver, copper — largely lost to landfill</li>
  <li>Manufacturing a new smartphone generates more emissions than <strong>two years of using it</strong></li>
</ul>

<p>When you choose a repairable, long-lasting device, you're casting a vote for a different model of tech — one that respects both the planet and your wallet.</p>

<h2>How to Evaluate Tech Purchases</h2>

<p>Before your next gadget purchase, ask:</p>

<ol>
  <li>How long is the software support window?</li>
  <li>Are spare parts available, and for how long?</li>
  <li>Does the company have a take-back or recycling program?</li>
  <li>What is the repairability score? (Sites like iFixit provide independent ratings)</li>
  <li>What materials are used, and are they disclosed?</li>
</ol>

<hr style="border:none;border-top:2px solid #e5e7eb;margin:32px 0;" />

<p>Ethical tech exists and it's increasingly competitive. The makers on our platform are proving that you don't have to sacrifice performance for principle — and that buying with intention extends to every corner of your life, including the devices in your pocket.</p>
    `.trim(),
  },
];

async function main() {
  console.log("Seeding blogs...\n");

  for (const blog of BLOGS) {
    const existing = await prisma.blog.findUnique({ where: { slug: blog.slug } });
    if (existing) {
      console.log(`  Blog exists: "${blog.title}" — skipping`);
      continue;
    }
    await prisma.blog.create({ data: blog as never });
    console.log(`✓ Created: "${blog.title}" [${blog.category}] — ${blog.status}`);
  }

  console.log("\nDone! All 5 blogs seeded.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
