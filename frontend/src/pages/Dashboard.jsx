import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function isClosingSoon(closeDateStr, days = 7) {
  if (!closeDateStr) return false;
  const d = new Date(closeDateStr);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  const diffDays = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

function normalizeTender(t) {
  return {
    id: t._id || t.id || t.tenderId || t.tender_id,
    title: t.title || t.name || t.tenderTitle || "Untitled Tender",
    location: t.location || t.city || "",
    state: t.state || "",
    closeDate: t.closeDate || t.closingDate || t.bidEndDate || t.endDate || "",
    status: (t.status || "").toLowerCase(),
    raw: t,
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const stats = useMemo(() => {
    const total = tenders.length;
    let active = 0;
    let kerala = 0;
    let closingSoon = 0;

    for (const t of tenders) {
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

    return { total, active, kerala, closingSoon };
  }, [tenders]);

  const recent = useMemo(() => {
    // show latest 5 by close date if available, else first 5
    const sorted = [...tenders].sort((a, b) => {
      const da = a.closeDate ? new Date(a.closeDate).getTime() : 0;
      const db = b.closeDate ? new Date(b.closeDate).getTime() : 0;
      return db - da;
    });
    return sorted.slice(0, 5);
  }, [tenders]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back</p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-5 rounded-2xl border bg-white">
          <div className="text-sm text-gray-500">Total Tenders</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>

        <div className="p-5 rounded-2xl border bg-white">
          <div className="text-sm text-gray-500">Active Tenders</div>
          <div className="text-3xl font-bold">{stats.active}</div>
        </div>

        <div className="p-5 rounded-2xl border bg-white">
          <div className="text-sm text-gray-500">Kerala Tenders</div>
          <div className="text-3xl font-bold">{stats.kerala}</div>
        </div>

        <div className="p-5 rounded-2xl border bg-white">
          <div className="text-sm text-gray-500">Closing Soon</div>
          <div className="text-3xl font-bold">{stats.closingSoon}</div>
        </div>
      </div>

      <div className="p-5 rounded-2xl border bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Tenders</h2>
          <button
            className="px-3 py-2 rounded-lg border hover:bg-gray-50"
            onClick={() => navigate("/tenders")}
          >
            View all
          </button>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading tenders...</div>
        ) : recent.length === 0 ? (
          <div className="text-gray-600">
            No tenders found. The scraper will populate this soon.
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((t) => (
              <div
                key={t.id || `${t.title}-${t.closeDate}`}
                className="p-4 rounded-xl border hover:shadow-sm transition cursor-pointer"
                onClick={() => navigate(`/tenders/${t.id}`)}
              >
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {[t.location, t.state].filter(Boolean).join(", ")}
                  {t.closeDate ? ` • Closes: ${String(t.closeDate).slice(0, 10)}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
