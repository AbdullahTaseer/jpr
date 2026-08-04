const ORDERS = [
  { id: "#ORD-8821", customer: "Sarah Mitchell",  product: "Organic Cotton Wrap Dress",   amount: "$49.99",  status: "Delivered", date: "May 19, 2026" },
  { id: "#ORD-8820", customer: "James Okoro",     product: "Artisan Leather Tote Bag",    amount: "$129.00", status: "Processing",date: "May 19, 2026" },
  { id: "#ORD-8819", customer: "Aisha Patel",     product: "Minimalist Smart Watch",      amount: "$89.50",  status: "Shipped",   date: "May 18, 2026" },
  { id: "#ORD-8818", customer: "Daniel Torres",   product: "Natural Skincare Ritual Set", amount: "$65.00",  status: "Delivered", date: "May 18, 2026" },
  { id: "#ORD-8817", customer: "Emma Lindqvist",  product: "Bamboo Yoga & Fitness Mat",   amount: "$35.00",  status: "Cancelled", date: "May 17, 2026" },
  { id: "#ORD-8816", customer: "Kevin Adeyemi",   product: "Premium Wireless Earbuds",    amount: "$59.99",  status: "Delivered", date: "May 17, 2026" },
];

const STATUS_STYLES: Record<string, string> = {
  Delivered:  "bg-emerald-500/15 text-emerald-400",
  Processing: "bg-amber-500/15 text-amber-400",
  Shipped:    "bg-[#1B6FEB]/15 text-[#1B6FEB]",
  Cancelled:  "bg-red-500/15 text-red-400",
};

export default function AdminRecentOrders() {
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/10">
        <h3 className="text-white font-semibold text-base">Recent Orders</h3>
        <p className="text-[#6b7280] text-sm mt-0.5">Latest platform-wide orders</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {["Order ID", "Customer", "Product", "Amount", "Status", "Date"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS.map(o => (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-5 py-4 text-[#1B6FEB] text-sm font-mono font-semibold">{o.id}</td>
                <td className="px-5 py-4 text-white text-sm font-medium whitespace-nowrap">{o.customer}</td>
                <td className="px-5 py-4 text-[#9ca3af] text-sm max-w-[200px]"><span className="line-clamp-1">{o.product}</span></td>
                <td className="px-5 py-4 text-white text-sm font-semibold whitespace-nowrap">{o.amount}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-5 py-4 text-[#6b7280] text-sm whitespace-nowrap">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
