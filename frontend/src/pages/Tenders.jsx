import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MapPin, Building2, Calendar, ArrowLeft } from "lucide-react";

function formatINR(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

function isClosingSoon(closeDateStr, days = 7) {
  if (!closeDateStr) return false;
  const d = new Date(closeDateStr);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  const diffDays = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

function normalizeTender(t) {
  // Support multiple backend field names safely
  return {
    id: t._id || t.id || t.tenderId || t.tender_id,
    title: t.title || t.name || t.tenderTitle || "Untitled Tender",
    department: t.department || t.organization || t.org || "",
    location: t.location || t.city || "",
    state: t.state || "",
    closeDate: t.closeDate || t.closingDate || t.bidEndDate || t.endDate || "",
    category: t.category || t.segment || "",
    website: t.website || t.source || "",
    url: t.url || t.link || "",
    status: (t.status || "").toLowerCase(), // "active" etc
    estimatedValue:
      t.estimatedValue ?? t.estimated_cost ?? t.value ?? t.amount ?? null,
    raw: t,
  };
}

const Tenders = () => {
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL; // e.g. https://seacco-backend.onrender.com/api

  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | closing_soon
  const [keralaOnly, setKeralaOnly] = useState(false);

  const fetchTenders = async () => {
    setError("");
    setLoading(true);

    try {
      if (!API_BASE) throw new Error("VITE_API_URL is not set");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/tenders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to load tenders (${res.status}): ${txt}`);
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.tenders || [];
      setTenders(list.map(normalizeTender));
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load tenders");
      setTenders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tenders.filter((t) => {
      // status derived
      const closingSoon = isClosingSoon(t.closeDate, 7);
      const computedStatus =
        t.status === "active"
          ? "active"
          : closingSoon
          ? "closing_soon"
          : t.status || "active";

      // status filter
      if (statusFilter !== "all") {
        if (statusFilter === "active" && computedStatus !== "active") return false;
        if (statusFilter === "closing_soon" && computedStatus !== "closing_soon")
          return false;
      }

      // kerala filter (checks location or state)
      if (keralaOnly) {
        const loc = `${t.location} ${t.state}`.toLowerCase();
        if (!loc.includes("kerala")) return false;
      }

      // search filter
      if (!q) return true;
      const hay = `${t.title} ${t.department} ${t.location} ${t.state} ${t.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [tenders, search, statusFilter, keralaOnly]);

  const stats = useMemo(() => {
    const total = filtered.length;

    let active = 0;
    let closingSoon = 0;
    let kerala = 0;

    for (const t of filtered) {
      const closing = isClosingSoon(t.closeDate, 7);
      const computedStatus =
        t.status === "active"
          ? "active"
          : closing
          ? "closing_soon"
          : t.status || "active";

      if (computedStatus === "active") active += 1;
      if (computedStatus === "closing_soon") closingSoon += 1;

      const loc = `${t.location} ${t.state}`.toLowerCase();
      if (loc.includes("kerala")) kerala += 1;
    }

    return { total, active, closingSoon, kerala };
  }, [filtered]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          className="p-2 rounded-lg hover:bg-gray-100"
          onClick={() => navigate(-1)}
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Tenders</h1>

        <div className="ml-auto flex gap-2">
          <button
            className="px-3 py-2 rounded-lg border hover:bg-gray-50"
            onClick={fetchTenders}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="w-full pl-10 pr-3 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Search tenders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="w-5 h-5 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              className="pl-10 pr-8 py-3 rounded-xl border bg-white focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="closing_soon">Closing Soon</option>
            </select>
          </div>

          <label className="flex items-center gap-2 px-3 py-3 rounded-xl border bg-white">
            <input
              type="checkbox"
              checked={keralaOnly}
              onChange={(e) => setKeralaOnly(e.target.checked)}
            />
            <span className="text-sm">Kerala only</span>
          </label>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl border bg-white">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 rounded-xl border bg-white">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-3xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="p-4 rounded-xl border bg-white">
          <div className="text-sm text-gray-500">Closing Soon</div>
          <div className="text-3xl font-bold text-amber-600">{stats.closingSoon}</div>
        </div>
        <div className="p-4 rounded-xl border bg-white">
          <div className="text-sm text-gray-500">Kerala</div>
          <div className="text-3xl font-bold text-purple-600">{stats.kerala}</div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-gray-600">Loading tenders...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-600">No tenders found matching your filters.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => {
            const closingSoon = isClosingSoon(t.closeDate, 7);
            const computedStatus =
              t.status === "active"
                ? "active"
                : closingSoon
                ? "closing_soon"
                : t.status || "active";

            return (
              <div
                key={t.id || `${t.title}-${t.closeDate}`}
                className="p-5 rounded-2xl border bg-white hover:shadow-sm transition cursor-pointer"
                onClick={() => navigate(`/tenders/${t.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          computedStatus === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {computedStatus === "active" ? "Active" : "Closing Soon"}
                      </span>

                      {t.category && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {t.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-2">{t.title}</h3>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                      {t.department && (
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {t.department}
                        </span>
                      )}

                      {(t.location || t.state) && (
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {[t.location, t.state].filter(Boolean).join(", ")}
                        </span>
                      )}

                      {t.closeDate && (
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Closes: {String(t.closeDate).slice(0, 10)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right min-w-[140px]">
                    {t.estimatedValue != null && (
                      <>
                        <div className="text-lg font-extrabold text-indigo-600">
                          {formatINR(t.estimatedValue)}
                        </div>
                        <div className="text-xs text-gray-500">Estimated Value</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tenders;
