import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL; // e.g. https://.../api

export default function Tenders() {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [keralaOnly, setKeralaOnly] = useState(false);

  const loadTenders = async () => {
    setLoading(true);
    setError("");

    try {
      const url = new URL(`${API_BASE}/tenders`);
      if (query) url.searchParams.set("q", query);
      if (keralaOnly) url.searchParams.set("keralaOnly", "true");
      url.searchParams.set("limit", "200");

      const token = localStorage.getItem("token");

      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }

      setTenders(data.items || []);
    } catch (e) {
      setError(e.message || "Failed to load tenders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = tenders.length;
    const active = tenders.filter(t => t.status === "active").length;
    const closing = tenders.filter(t => t.status === "closing_soon").length;
    const kerala = tenders.filter(t => (t.location || "").toLowerCase().includes("kerala") || (t.state || "").toLowerCase().includes("kerala")).length;
    return { total, active, closing, kerala };
  }, [tenders]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Tenders</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tenders..."
          style={{ flex: 1, padding: 10 }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={keralaOnly}
            onChange={(e) => setKeralaOnly(e.target.checked)}
          />
          Kerala only
        </label>
        <button onClick={loadTenders}>Refresh</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div>Total: {stats.total}</div>
        <div>Active: {stats.active}</div>
        <div>Closing Soon: {stats.closing}</div>
        <div>Kerala: {stats.kerala}</div>
      </div>

      {error && (
        <div style={{ background: "#ffd5d5", padding: 10, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : tenders.length === 0 ? (
        <p>No tenders found matching your filters.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {tenders.map((t) => (
            <div
              key={`${t.source}-${t.sourceId}`}
              style={{ border: "1px solid #eee", padding: 12, borderRadius: 10, cursor: "pointer" }}
              onClick={() => navigate(`/tenders/${t._id}`)}
            >
              <div style={{ fontWeight: 700 }}>{t.title}</div>
              <div style={{ opacity: 0.8 }}>{t.organization} • {t.location}</div>
              <div style={{ opacity: 0.8 }}>
                Closes: {t.closeDate ? new Date(t.closeDate).toLocaleDateString() : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
