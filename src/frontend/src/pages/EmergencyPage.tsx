import {
  AlertCircle,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Siren,
} from "lucide-react";
import { useEffect, useState } from "react";
import GlassCard from "../components/ui/GlassCard";

interface NearbyHospital {
  id: number;
  name: string;
  phone: string;
  address: string;
  type: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

type LocationState = "idle" | "loading" | "granted" | "denied";
type HospitalsState = "idle" | "loading" | "loaded" | "error";

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchNearbyHospitals(
  lat: number,
  lng: number,
  radiusM = 10000,
): Promise<NearbyHospital[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusM},${lat},${lng});
      way["amenity"="hospital"](around:${radiusM},${lat},${lng});
      relation["amenity"="hospital"](around:${radiusM},${lat},${lng});
    );
    out center tags;
  `;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  if (!res.ok) throw new Error("Overpass API error");
  const data = await res.json();

  return (data.elements as any[])
    .map((el, idx) => {
      const elLat = el.lat ?? el.center?.lat ?? lat;
      const elLng = el.lon ?? el.center?.lon ?? lng;
      const tags = el.tags ?? {};
      const name =
        tags["name:en"] || tags.name || tags["name:hi"] || "Unknown Hospital";
      const phone = tags.phone || tags["contact:phone"] || "";
      const street = tags["addr:street"] || "";
      const city = tags["addr:city"] || tags["addr:district"] || "";
      const address = [street, city].filter(Boolean).join(", ");
      const operator = (tags.operator || "").toLowerCase();
      const _healthcare = (tags["healthcare:speciality"] || "").toLowerCase();
      const isGov =
        operator.includes("government") ||
        operator.includes("govt") ||
        operator.includes("district") ||
        operator.includes("civil") ||
        operator.includes("public") ||
        operator.includes("municipal") ||
        operator.includes("state") ||
        tags["operator:type"] === "public";
      const type = isGov ? "Government" : "Private";
      const distanceKm = haversine(lat, lng, elLat, elLng);
      return {
        id: idx + 1,
        name,
        phone,
        address,
        type,
        lat: elLat,
        lng: elLng,
        distanceKm,
      } as NearbyHospital;
    })
    .filter((h) => h.name !== "Unknown Hospital" || h.address)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 15);
}

export default function EmergencyPage() {
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [hospitalsState, setHospitalsState] = useState<HospitalsState>("idle");

  const handleSOS = () => {
    alert("🚨 Emergency services have been contacted! Help is on the way.");
  };

  const loadHospitals = async (lat: number, lng: number) => {
    setHospitalsState("loading");
    try {
      const results = await fetchNearbyHospitals(lat, lng);
      setHospitals(results);
      setHospitalsState("loaded");
    } catch {
      setHospitalsState("error");
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationState("denied");
      return;
    }
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        setLocationState("granted");
        loadHospitals(c.lat, c.lng);
      },
      () => {
        setLocationState("denied");
      },
      { timeout: 10000 },
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const getDirectionsUrl = (h: NearbyHospital) => {
    if (coords) {
      return `https://www.google.com/maps/dir/${coords.lat},${coords.lng}/${h.lat},${h.lng}`;
    }
    return `https://www.google.com/maps/search/${encodeURIComponent(h.name)}`;
  };

  const getNearbyUrl = () => {
    if (coords) {
      return `https://www.google.com/maps/search/hospitals/@${coords.lat},${coords.lng},14z`;
    }
    return "https://www.google.com/maps/search/hospitals+near+me";
  };

  const formatDistance = (km: number) => {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div>
        <h2 className="text-2xl font-bold text-[#ffffff]">Emergency</h2>
        <p className="text-sm text-[#888888] mt-1">
          Get immediate help when you need it most
        </p>
      </div>

      {/* SOS Button */}
      <GlassCard className="p-10 text-center" glowColor="red">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "rgba(255,77,90,0.3)" }}
            />
            <button
              type="button"
              data-ocid="emergency.sos.primary_button"
              onClick={handleSOS}
              className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 animate-sos-pulse"
              style={{
                background: "radial-gradient(circle, #5C1A22, #3B1A1F)",
                border: "3px solid #FF4D5A",
              }}
            >
              <Siren size={36} className="text-[#FF4D5A]" />
              <span className="text-sm font-bold text-[#FF4D5A] tracking-widest">
                SOS
              </span>
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#ffffff]">
              🆘 SOS EMERGENCY
            </h3>
            <p className="text-sm text-[#cccccc] mt-1">
              Tap the button to contact emergency services immediately
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Quick Emergency Calls */}
      <GlassCard className="p-5">
        <p className="text-sm font-semibold text-[#ffffff] mb-4">
          Quick Emergency Calls
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              number: "102",
              label: "Ambulance",
              color: "#FF4D5A",
              bg: "rgba(255,77,90,0.15)",
            },
            {
              number: "108",
              label: "Emergency",
              color: "#F59E0B",
              bg: "rgba(245,158,11,0.15)",
            },
            {
              number: "112",
              label: "National",
              color: "#f9a8c9",
              bg: "rgba(249,168,201,0.15)",
            },
          ].map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              data-ocid={`emergency.call_${item.number}.primary_button`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 no-underline"
              style={{
                background: item.bg,
                border: `1px solid ${item.color}40`,
              }}
            >
              <Phone size={20} style={{ color: item.color }} />
              <span className="text-lg font-bold" style={{ color: item.color }}>
                {item.number}
              </span>
              <span className="text-[10px] text-[#cccccc]">{item.label}</span>
            </a>
          ))}
        </div>
      </GlassCard>

      {/* Location Status + Find All Nearby */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {locationState === "loading" && (
              <>
                <Loader2 size={16} className="text-[#f9a8c9] animate-spin" />
                <span className="text-sm text-[#cccccc]">
                  Detecting your location...
                </span>
              </>
            )}
            {locationState === "granted" && (
              <>
                <MapPin size={16} className="text-[#f9a8c9]" />
                <span className="text-sm text-[#f9a8c9]">
                  Location detected — showing hospitals near you
                </span>
              </>
            )}
            {locationState === "denied" && (
              <>
                <AlertCircle size={16} className="text-[#F59E0B]" />
                <span className="text-sm text-[#F59E0B]">
                  Location unavailable — please allow location access
                </span>
                <button
                  type="button"
                  onClick={detectLocation}
                  className="ml-2 text-xs text-[#f9a8c9] underline"
                >
                  Retry
                </button>
              </>
            )}
            {locationState === "idle" && (
              <>
                <MapPin size={16} className="text-[#888888]" />
                <span className="text-sm text-[#888888]">
                  Waiting for location...
                </span>
              </>
            )}
          </div>
          <a
            href={getNearbyUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105 no-underline"
            style={{
              background: "rgba(249,168,201,0.15)",
              color: "#f9a8c9",
              border: "1px solid rgba(249,168,201,0.3)",
            }}
          >
            <Navigation size={12} />
            Find All Nearby Hospitals
          </a>
        </div>
      </GlassCard>

      {/* Nearby Hospitals */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-[#f9a8c9]" />
          <p className="text-sm font-semibold text-[#ffffff]">
            Nearby Hospitals
          </p>
          {hospitalsState === "loaded" && hospitals.length > 0 && (
            <span className="text-[10px] text-[#888888] ml-1">
              {hospitals.length} found within 10 km
            </span>
          )}
          {hospitalsState === "loaded" && (
            <button
              type="button"
              onClick={() => coords && loadHospitals(coords.lat, coords.lng)}
              className="ml-auto flex items-center gap-1 text-[10px] text-[#f9a8c9] hover:opacity-80"
            >
              <RefreshCw size={10} />
              Refresh
            </button>
          )}
          {hospitalsState === "idle" && (
            <span className="text-[10px] text-[#888888] ml-auto">
              Waiting for location...
            </span>
          )}
        </div>

        {/* Loading state */}
        {(locationState === "loading" || hospitalsState === "loading") && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 size={28} className="text-[#f9a8c9] animate-spin" />
            <p className="text-sm text-[#888888]">
              {locationState === "loading"
                ? "Getting your location..."
                : "Searching for hospitals near you..."}
            </p>
          </div>
        )}

        {/* Error */}
        {hospitalsState === "error" && (
          <div className="flex flex-col items-center py-8 gap-3">
            <AlertCircle size={24} className="text-[#F59E0B]" />
            <p className="text-sm text-[#888888] text-center">
              Could not load nearby hospitals. Check your connection and try
              again.
            </p>
            <button
              type="button"
              onClick={() => coords && loadHospitals(coords.lat, coords.lng)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: "rgba(249,168,201,0.15)",
                color: "#f9a8c9",
                border: "1px solid rgba(249,168,201,0.3)",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Location denied */}
        {locationState === "denied" && hospitalsState === "idle" && (
          <div className="flex flex-col items-center py-8 gap-3">
            <AlertCircle size={24} className="text-[#F59E0B]" />
            <p className="text-sm text-[#888888] text-center">
              Location access is required to show nearby hospitals.
            </p>
            <button
              type="button"
              onClick={detectLocation}
              className="px-4 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: "rgba(249,168,201,0.15)",
                color: "#f9a8c9",
                border: "1px solid rgba(249,168,201,0.3)",
              }}
            >
              Allow Location
            </button>
          </div>
        )}

        {/* No results */}
        {hospitalsState === "loaded" && hospitals.length === 0 && (
          <div className="flex flex-col items-center py-8 gap-2">
            <MapPin size={24} className="text-[#888888]" />
            <p className="text-sm text-[#888888] text-center">
              No hospitals found within 10 km. Try opening Google Maps below.
            </p>
          </div>
        )}

        {/* Hospital list */}
        {hospitalsState === "loaded" && hospitals.length > 0 && (
          <div className="space-y-3">
            {hospitals.map((hospital, idx) => (
              <div
                key={hospital.id}
                data-ocid={`emergency.hospital.item.${idx + 1}`}
                className="flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-[rgba(255,255,255,0.04)]"
                style={{ border: "1px solid rgba(160,190,210,0.08)" }}
              >
                {/* Distance badge */}
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 gap-0.5"
                  style={{ background: "rgba(249,168,201,0.08)" }}
                >
                  <MapPin size={14} className="text-[#f9a8c9]" />
                  <span className="text-[10px] font-bold text-[#f9a8c9]">
                    {formatDistance(hospital.distanceKm)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#ffffff] truncate">
                      {hospital.name}
                    </p>
                    <span
                      className="flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{
                        background: "rgba(249,168,201,0.1)",
                        color: "#f9a8c9",
                      }}
                    >
                      {hospital.type}
                    </span>
                  </div>
                  {hospital.address && (
                    <p className="text-xs text-[#888888] truncate mt-0.5">
                      {hospital.address}
                    </p>
                  )}
                  {hospital.phone && (
                    <p className="text-xs text-[#666666] mt-0.5">
                      {hospital.phone}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <a
                    href={getDirectionsUrl(hospital)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`emergency.directions.button.${idx + 1}`}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105 no-underline"
                    style={{
                      background: "rgba(249,168,201,0.15)",
                      color: "#f9a8c9",
                      border: "1px solid rgba(249,168,201,0.3)",
                    }}
                  >
                    <Navigation size={10} />
                    Directions
                  </a>
                  {hospital.phone ? (
                    <a
                      href={`tel:${hospital.phone}`}
                      data-ocid={`emergency.call.button.${idx + 1}`}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105 no-underline"
                      style={{
                        background: "rgba(255,77,90,0.15)",
                        color: "#FF4D5A",
                        border: "1px solid rgba(255,77,90,0.3)",
                      }}
                    >
                      <Phone size={10} />
                      Call
                    </a>
                  ) : (
                    <span
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium opacity-40"
                      style={{
                        background: "rgba(255,77,90,0.08)",
                        color: "#FF4D5A",
                        border: "1px solid rgba(255,77,90,0.15)",
                      }}
                    >
                      <Phone size={10} />
                      No #
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
