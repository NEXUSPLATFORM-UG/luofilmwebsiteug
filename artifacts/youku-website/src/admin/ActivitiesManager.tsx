import { useState, useEffect } from "react";
import { Search, Download, Activity, Clock, User, Monitor } from "lucide-react";
import { api } from "./api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const inp = {
  width: "100%", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px",
  color: "#fff", fontSize: 13, outline: "none"
};

const ACTION_COLORS: Record<string, string> = {
  page_view: "#6366f1",
  content_play: "#10b981",
  content_click: "#3b82f6",
  search: "#f59e0b",
  login: "#8b5cf6",
  logout: "#6b7280",
  signup: "#ec4899",
  subscription_view: "#0ea5e9",
  subscription_purchase: "#10b981",
  profile_update: "#f97316",
  watchlist_add: "#06b6d4",
  watchlist_remove: "#ef4444",
  episode_play: "#84cc16",
  trailer_play: "#a855f7",
};

const ACTION_TYPES = Object.keys(ACTION_COLORS);

function Badge({ c, label }: { c: string; label: string }) {
  return <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: `${c}22`, color: c, textTransform: "capitalize" }}>{label?.replace(/_/g, " ")}</span>;
}

export default function ActivitiesManager() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const load = () => {
    api.activities.list({ search, actionType, limit: "500" }).then(d => setActivities(d.activities || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, actionType]);
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [autoRefresh, search, actionType]);

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.text("User Activity Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}  |  Total Records: ${activities.length}`, 14, 30);

    autoTable(doc, {
      head: [["Timestamp", "User", "Email", "Phone", "Action", "Page", "Content", "IP Address", "Details"]],
      body: activities.map(a => [
        new Date(a.createdAt).toLocaleString(),
        a.userName || "Guest",
        a.userEmail || "-",
        a.userPhone || "-",
        a.actionType?.replace(/_/g, " "),
        a.page || "-",
        a.contentTitle || "-",
        a.ipAddress || "-",
        a.details || "-",
      ]),
      startY: 37,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 250] },
    });

    doc.save(`activities-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const actionCounts = activities.reduce((acc, a) => {
    acc[a.actionType] = (acc[a.actionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topActions = Object.entries(actionCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Activity Log</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            {activities.length} records — Full user interaction tracking with all details
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{ padding: "8px 16px", background: autoRefresh ? "#10b98122" : "rgba(255,255,255,0.06)", color: autoRefresh ? "#34d399" : "#fff", border: `1px solid ${autoRefresh ? "#10b98144" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, fontSize: 13, cursor: "pointer" }}
          >
            {autoRefresh ? "● Live" : "Auto-Refresh"}
          </button>
          <button onClick={load} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Refresh</button>
          <button onClick={exportPDF} style={{ padding: "8px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Top Actions</h3>
          {topActions.map(([action, count]) => (
            <div key={action} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Badge c={ACTION_COLORS[action] || "#6366f1"} label={action} />
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{count as number}</span>
            </div>
          ))}
          {topActions.length === 0 && <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No data yet</p>}
        </div>
        <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Quick Stats</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: "Total Events", value: activities.length, color: "#6366f1" },
              { label: "Unique Users", value: new Set(activities.filter(a => a.userId).map(a => a.userId)).size, color: "#10b981" },
              { label: "Content Plays", value: activities.filter(a => a.actionType === "content_play" || a.actionType === "episode_play").length, color: "#f59e0b" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input style={{ ...inp, paddingLeft: 36, width: "100%" }} placeholder="Search by user, email, phone, content or page..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={{ ...inp, width: 180 }} value={actionType} onChange={e => setActionType(e.target.value)}>
          <option value="">All Action Types</option>
          {ACTION_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Time", "User", "Email", "Phone", "Action", "Page", "Content", "IP Address", "Details"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading activities...</td></tr>
            ) : activities.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                <Activity size={32} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                No activities recorded yet. Activities will appear here as users interact with the site.
              </td></tr>
            ) : activities.map(a => (
              <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={10} />
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                </td>
                <td style={{ padding: "8px 12px", color: "#fff", fontWeight: 500 }}>{a.userName || "Guest"}</td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.5)" }}>{a.userEmail || "-"}</td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.5)" }}>{a.userPhone || "-"}</td>
                <td style={{ padding: "8px 12px" }}><Badge c={ACTION_COLORS[a.actionType] || "#6366f1"} label={a.actionType} /></td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.4)" }}>{a.page || "-"}</td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.5)", maxWidth: 160 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.contentTitle || "-"}</div>
                </td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace", fontSize: 11 }}>{a.ipAddress || "-"}</td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.35)", maxWidth: 160 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.details || "-"}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
