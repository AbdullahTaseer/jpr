"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const CSV_COLUMNS = [
  { name: "product_name", required: true, desc: "Full product name" },
  { name: "slug", required: false, desc: "URL-friendly identifier (auto-generated if omitted)" },
  { name: "price", required: true, desc: "Numeric price without currency symbol (e.g. 29.99)" },
  { name: "category", required: false, desc: "Category name — created automatically if missing" },
  { name: "brand", required: false, desc: "Brand name — created automatically if missing" },
  { name: "short_desc", required: false, desc: "Short product summary (max 500 characters)" },
  { name: "redirect_url", required: false, desc: "Optional affiliate or external product URL" },
  { name: "status", required: false, desc: '"active" or "inactive" (defaults to "active")' },
];

const SAMPLE_CSV = `product_name,slug,price,category,brand,short_desc,redirect_url,status
"Organic Cotton Wrap Dress","organic-cotton-wrap-dress",49.99,"Women Fashion","EcoStyle Co.","Eco-friendly wrap dress made from 100% organic cotton.",,active
"Artisan Leather Tote","artisan-leather-tote",129.00,"Bags","CraftCo Leather","Hand-crafted full-grain leather tote.",,active
`;

const IcoUpload = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);
const IcoCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IcoDownload = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current);
    rows.push(fields);
  }
  return rows;
}

type ImportResult = {
  imported: number;
  updated: number;
  skipped: number;
  createdCategories?: number;
  createdBrands?: number;
  errors: string[];
};

type VendorOption = { id: string; name: string; shopName: string | null };

export default function ImportPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin-dashboard");

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [vendorId, setVendorId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/admin/vendors/approved")
      .then((r) => r.json())
      .then((d) => setVendors(d.vendors ?? []))
      .catch(() => {});
  }, [isAdmin]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      alert("Please upload a .csv file");
      return;
    }
    setFile(f);
    setResult(null);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;
    if (isAdmin && !vendorId) {
      alert("Please select a vendor to assign products to.");
      return;
    }
    setImporting(true);
    setResult(null);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length < 2) {
        alert("CSV must have a header row and at least one data row.");
        return;
      }

      const headers = rows[0].map((h) => h.trim().toLowerCase());
      const dataRows = rows.slice(1);
      const idx = (col: string) => headers.indexOf(col);

      const products = dataRows
        .map((row) => {
          const get = (col: string) => (row[idx(col)] ?? "").trim();
          const statusRaw = get("status");
          return {
            title: get("product_name"),
            slug: get("slug") || undefined,
            price: get("price"),
            categoryName: get("category") || undefined,
            brandName: get("brand") || undefined,
            shortDesc: get("short_desc") || undefined,
            redirectUrl: get("redirect_url") || undefined,
            isActive: statusRaw === "" || statusRaw.toLowerCase() === "active",
          };
        })
        .filter((p) => p.title);

      const endpoint = isAdmin ? "/api/admin/products/import" : "/api/vendor/products/import";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isAdmin ? { products, vendorId } : { products }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      setResult(data);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full">
      <div>
        <h1 className="text-white text-2xl font-bold">Import CSV</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Bulk-upload products by importing a CSV file. Existing slugs are updated; missing categories and brands are created.
        </p>
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-white font-semibold">CSV Format Guide</h2>
            <p className="text-[#6b7280] text-sm mt-0.5">Your CSV must have the following columns in any order</p>
          </div>
          <button
            onClick={downloadSample}
            className="flex items-center gap-2 bg-[#1B6FEB]/15 text-[#1B6FEB] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1B6FEB]/25 transition-colors whitespace-nowrap"
          >
            <IcoDownload />
            Download Sample
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">Column</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">Required</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6b7280] uppercase tracking-wide">Description</th>
              </tr>
            </thead>
            <tbody>
              {CSV_COLUMNS.map((col) => (
                <tr key={col.name} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-3.5">
                    <code className="bg-[#242424] text-[#1B6FEB] text-xs px-2 py-1 rounded font-mono">{col.name}</code>
                  </td>
                  <td className="px-6 py-3.5">
                    {col.required ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                        <IcoCheck /> Required
                      </span>
                    ) : (
                      <span className="text-[#6b7280] text-xs">Optional</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-[#9ca3af] text-sm">{col.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-5">
        <h2 className="text-white font-semibold">Upload Your File</h2>

        {isAdmin && (
          <div className="space-y-1.5">
            <label className="text-white text-sm font-semibold">
              Assign to Vendor <span className="text-red-400">*</span>
            </label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#1B6FEB]/60"
            >
              <option value="">Select vendor...</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.shopName ?? v.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer
            ${dragging ? "border-[#1B6FEB] bg-[#1B6FEB]/5" : "border-white/15 hover:border-[#1B6FEB]/50 hover:bg-white/3"}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files[0]);
          }}
        >
          <div className={`flex justify-center mb-4 transition-colors ${dragging || file ? "text-[#1B6FEB]" : "text-[#4b5563]"}`}>
            <IcoUpload />
          </div>
          {file ? (
            <>
              <p className="text-white font-semibold">{file.name}</p>
              <p className="text-[#6b7280] text-sm mt-1">
                {(file.size / 1024).toFixed(1)} KB · Click to change
              </p>
            </>
          ) : (
            <>
              <p className="text-white font-medium">
                Drop your CSV file here or <span className="text-[#1B6FEB]">click to browse</span>
              </p>
              <p className="text-[#6b7280] text-sm mt-2">Only .csv files are accepted</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {result && (
          <div
            className={`rounded-xl px-5 py-4 border ${
              result.imported + result.updated > 0
                ? "bg-emerald-950/30 border-emerald-500/20"
                : "bg-amber-500/10 border-amber-500/20"
            }`}
          >
            <p
              className={`text-sm font-semibold mb-1 ${
                result.imported + result.updated > 0 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {result.imported} created, {result.updated} updated, {result.skipped} skipped
              {(result.createdCategories || result.createdBrands) ? (
                <span className="font-normal text-[#9ca3af]">
                  {" "}
                  · {result.createdCategories ?? 0} categories & {result.createdBrands ?? 0} brands created
                </span>
              ) : null}
            </p>
            {result.errors.length > 0 && (
              <ul className="text-amber-300/80 text-sm space-y-0.5 list-disc list-inside mt-2 max-h-40 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4">
          <p className="text-amber-400 text-sm font-semibold mb-1">Before importing</p>
          <ul className="text-amber-300/80 text-sm space-y-1 list-disc list-inside">
            <li>Ensure all required columns are present and correctly named</li>
            <li>Missing categories and brands are created automatically from CSV values</li>
            <li>Re-importing the same slug updates that product (category, brand, price, etc.)</li>
            <li>Maximum 500 products per import</li>
          </ul>
        </div>

        <button
          disabled={!file || importing || (isAdmin && !vendorId)}
          onClick={handleImport}
          className="w-full bg-[#1B6FEB] text-white font-semibold py-3 rounded-xl hover:bg-[#1557D0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {importing ? "Importing..." : "Import Products"}
        </button>
      </div>
    </div>
  );
}
