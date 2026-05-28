import { ExternalLink, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface Pharmacy {
  name: string;
  description: string;
  delivery: string;
  tag: string;
  tagColor: string;
  url: string;
  emoji: string;
}

const pharmacies: Pharmacy[] = [
  {
    name: "1mg",
    description:
      "Order prescription & OTC medicines, lab tests, and health products with ease.",
    delivery: "Delivers in 2–4 hrs",
    tag: "Most Popular",
    tagColor: "#f9a8c9",
    url: "https://www.1mg.com",
    emoji: "💊",
  },
  {
    name: "PharmEasy",
    description:
      "India's largest digital healthcare platform — medicines, tests & consultations.",
    delivery: "Delivers in 3–6 hrs",
    tag: "Fast Delivery",
    tagColor: "#f9a8c9",
    url: "https://pharmeasy.in",
    emoji: "🏥",
  },
  {
    name: "Netmeds",
    description:
      "Trusted online pharmacy with over 60,000 medicines and healthcare products.",
    delivery: "Delivers in 4–6 hrs",
    tag: "Trusted",
    tagColor: "#60A5FA",
    url: "https://www.netmeds.com",
    emoji: "💉",
  },
  {
    name: "Apollo Pharmacy",
    description:
      "India's leading pharmacy chain — genuine medicines, wellness & nutrition.",
    delivery: "Delivers in 2–3 hrs",
    tag: "Express",
    tagColor: "#F472B6",
    url: "https://www.apollopharmacy.in",
    emoji: "⚕️",
  },
  {
    name: "MedPlus",
    description:
      "Affordable medicines and health products with doorstep delivery across India.",
    delivery: "Delivers in 6–12 hrs",
    tag: "Affordable",
    tagColor: "#A78BFA",
    url: "https://www.medplusmart.com",
    emoji: "🩺",
  },
  {
    name: "Flipkart Health+",
    description:
      "Health & medicine section on Flipkart — wide range with competitive prices.",
    delivery: "Delivers in 1–2 days",
    tag: "Wide Range",
    tagColor: "#FB923C",
    url: "https://www.flipkart.com/health-beauty/medicines",
    emoji: "🛒",
  },
  {
    name: "Amazon Pharmacy",
    description:
      "Order medicines on Amazon with Prime delivery — authentic & affordable.",
    delivery: "Prime: Same day",
    tag: "Prime",
    tagColor: "#FBBF24",
    url: "https://www.amazon.in/pharmacy",
    emoji: "📦",
  },
  {
    name: "Practo",
    description:
      "Comprehensive medicine info, consult doctors online & book lab tests.",
    delivery: "Varies by city",
    tag: "Doctor Consult",
    tagColor: "#38BDF8",
    url: "https://www.practo.com/medicine-info",
    emoji: "👨‍⚕️",
  },
  {
    name: "Healthmug",
    description: "Specialised in Ayurvedic, Homeopathic, and Unani medicines.",
    delivery: "Delivers in 2–5 days",
    tag: "Ayurvedic",
    tagColor: "#6EE7B7",
    url: "https://www.healthmug.com",
    emoji: "🌿",
  },
  {
    name: "Zoylo",
    description:
      "Order medicines, book diagnostics, and consult specialists online.",
    delivery: "Delivers in 4–8 hrs",
    tag: "Diagnostics",
    tagColor: "#C084FC",
    url: "https://www.zoylo.com",
    emoji: "🔬",
  },
];

export default function MedicineDeliveryPage() {
  const [search, setSearch] = useState("");

  const filtered = pharmacies.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main
      className="min-h-screen p-6 animate-fadeInUp"
      style={{ background: "#0d0d0d" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #f9a8c9 0%, #60A5FA 100%)",
            }}
          >
            <ShoppingBag size={22} className="text-[#0d0d0d]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffffff]">
              Medicine <span style={{ color: "#f9a8c9" }}>Delivery</span>
            </h1>
            <p className="text-sm text-[#888888]">
              Order medicines from trusted online pharmacies
            </p>
          </div>
        </div>

        <p className="text-[#cccccc] text-sm mb-6 mt-3">
          Find and order medicines from India's top online pharmacies. Click
          “Order Now” to visit the pharmacy website directly.
        </p>

        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(160,190,210,0.1)",
          }}
        >
          <Search size={16} style={{ color: "#888888" }} />
          <input
            type="text"
            placeholder="Search pharmacy by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="medicine.search_input"
            className="flex-1 bg-transparent outline-none text-sm text-[#ffffff] placeholder:text-[#888888]"
          />
        </div>

        {filtered.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(160,190,210,0.08)",
            }}
            data-ocid="medicine.empty_state"
          >
            <p className="text-[#888888] text-sm">
              No pharmacies match “{search}”
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pharmacy, idx) => (
              <div
                key={pharmacy.name}
                className="rounded-2xl p-5 flex flex-col gap-3 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(160,190,210,0.1)",
                }}
                data-ocid={`medicine.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{pharmacy.emoji}</span>
                    <h2 className="text-[#ffffff] font-bold text-base">
                      {pharmacy.name}
                    </h2>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: `${pharmacy.tagColor}18`,
                      color: pharmacy.tagColor,
                      border: `1px solid ${pharmacy.tagColor}40`,
                    }}
                  >
                    {pharmacy.tag}
                  </span>
                </div>

                <p className="text-sm text-[#888888] leading-relaxed flex-1">
                  {pharmacy.description}
                </p>

                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(249,168,201,0.08)",
                      color: "#f9a8c9",
                    }}
                  >
                    🚚 {pharmacy.delivery}
                  </span>
                </div>

                <a
                  href={pharmacy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid={`medicine.primary_button.${idx + 1}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-85"
                  style={{
                    background: "linear-gradient(135deg, #f9a8c9, #f9a8c9)",
                    color: "#0d0d0d",
                  }}
                >
                  <ShoppingBag size={14} />
                  Order Now
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[#888888] text-xs mt-8">
          CareConnect X is not affiliated with any pharmacy. Links open external
          websites.
        </p>
      </div>
    </main>
  );
}
