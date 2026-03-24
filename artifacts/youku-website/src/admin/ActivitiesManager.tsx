import { useState, useEffect } from "react";
import { Search, Download, Activity, Clock, ChevronDown } from "lucide-react";
import { api } from "./api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const inp = {
  width: "100%", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px",
  color: "#fff", fontSize: 13, outline: "none"
};

const ACTION_COLORS: Record<string, string> = {
  page_view: "#6366f1", content_play: "#10b981", content_click: "#3b82f6",
  search: "#f59e0b", login: "#8b5cf6", logout: "#6b7280", signup: "#ec4899",
  subscription_view: "#0ea5e9", subscription_purchase: "#10b981",
  profile_update: "#f97316", watchlist_add: "#06b6d4", watchlist_remove: "#ef4444",
  episode_play: "#84cc16", trailer_play: "#a855f7",
};
const ACTION_TYPES = Object.keys(ACTION_COLORS);

type Period = "all" | "today" | "week" | "month";

function Badge({ c, label }: { c: string; label: string }) {
  return <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: `${c}22`, color: c, textTransform: "capitalize" }}>{label?.replace(/_/g, " ")}</span>;
}

function filterByPeriod(items: any[], period: Period): any[] {
  if (period === "all") return items;
  const now = new Date();
  const start = new Date();
  if (period === "today") { start.setHours(0, 0, 0, 0); }
  else if (period === "week") { start.setDate(now.getDate() - 7); start.setHours(0, 0, 0, 0); }
  else if (period === "month") { start.setDate(1); start.setHours(0, 0, 0, 0); }
  return items.filter(i => new Date(i.createdAt) >= start);
}

function periodLabel(period: Period): string {
  if (period === "today") return "Today — " + new Date().toLocaleDateString();
  if (period === "week") return "This Week — " + new Date(Date.now() - 7 * 86400000).toLocaleDateString() + " to " + new Date().toLocaleDateString();
  if (period === "month") return "This Month — " + new Date().toLocaleString("default", { month: "long", year: "numeric" });
  return "All Time";
}

function buildActivityPDF(records: any[], period: Period) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const accentR = 99, accentG = 102, accentB = 241;

  doc.setFillColor(10, 10, 24);
  doc.rect(0, 0, W, 38, "F");

  doc.setFillColor(accentR, accentG, accentB);
  doc.roundedRect(10, 7, 46, 12, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("LUO FILM.SITE", 33, 15.5, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("VJ PAUL FREE DOWNLOAD", 33, 19.5, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("USER ACTIVITY REPORT", W / 2, 14, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 200);
  doc.text(`Period: ${periodLabel(period)}`, W / 2, 21, { align: "center" });
  doc.text(`Generated: ${new Date().toLocaleString()}   |   Total Records: ${records.length}`, W / 2, 27, { align: "center" });

  doc.setTextColor(150, 150, 180);
  doc.setFontSize(8);
  doc.text("admin@luofilm.site  |  luofilm.site  |  +256 700 000000", W - 10, 16, { align: "right" });

  autoTable(doc, {
    head: [["#", "Date & Time", "User Name", "Email", "Phone", "User ID", "Action", "Page / Screen", "Content", "IP Address", "Details"]],
    body: records.map((a, i) => [
      i + 1,
      new Date(a.createdAt).toLocaleString(),
      a.userName || "Guest",
      a.userEmail || "-",
      a.userPhone || "-",
      a.userId || a.anonId || "-",
      a.actionType?.replace(/_/g, " ") || "-",
      a.page || "-",
      a.contentTitle || "-",
      a.ipAddress || "-",
      a.details || "-",
    ]),
    startY: 42,
    styles: { fontSize: 7, cellPadding: 2, textColor: [30, 30, 50] },
    headStyles: { fillColor: [accentR, accentG, accentB], textColor: 255, fontStyle: "bold", fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 245, 252] },
    columnStyles: {
      0: { cellWidth: 7 },
      1: { cellWidth: 32 },
      2: { cellWidth: 28 },
      3: { cellWidth: 36 },
      4: { cellWidth: 24 },
      5: { cellWidth: 22 },
      6: { cellWidth: 24 },
      7: { cellWidth: 24 },
      8: { cellWidth: 30 },
      9: { cellWidth: 22 },
      10: { cellWidth: 28 },
    },
    margin: { left: 10, right: 10 },
    didDrawPage: (data: any) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 170);
      doc.text(
        `LUO FILM.SITE — Confidential  |  Page ${data.pageNumber} of ${pageCount}`,
        W / 2, doc.internal.pageSize.getHeight() - 5, { align: "center" }
      );
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 18;
  const H = doc.internal.pageSize.getHeight();
  const sigY = Math.min(finalY, H - 45);

  doc.setDrawColor(accentR, accentG, accentB);
  doc.setFillColor(248, 248, 255);
  doc.roundedRect(10, sigY, W - 20, 34, 3, 3, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentR, accentG, accentB);
  doc.text("AUTHORIZED SIGNATURE", 20, sigY + 7);

  doc.setDrawColor(80, 80, 120);
  doc.setLineWidth(0.4);
  doc.line(20, sigY + 22, 100, sigY + 22);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 120);
  doc.text("Chief Executive Officer — LUO FILM.SITE", 20, sigY + 27);
  doc.text("Name: ______________________________", 20, sigY + 32);

  doc.line(110, sigY + 22, 190, sigY + 22);
  doc.text("Date: ______________________________", 110, sigY + 27);
  doc.text("Official Stamp:", 110, sigY + 32);

  doc.setFontSize(7);
  doc.setTextColor(160, 160, 180);
  doc.text(`Document ID: ACT-${Date.now()}  |  This report is auto-generated and confidential.`, W / 2, sigY + 32, { align: "center" });

  doc.save(`luofilm-activity-${period}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function ActivitiesManager() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [exportDropdown, setExportDropdown] = useState(false);

  const load = () => {
    api.activities.list({ search, actionType, limit: "500" }).then(d => setActivities(d.activities || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, actionType]);
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [autoRefresh, search, actionType]);

  const doExport = (period: Period) => {
    setExportDropdown(false);
    const filtered = filterByPeriod(activities, period);
    buildActivityPDF(filtered, period);
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
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{activities.length} records — Full user interaction tracking</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => setAutoRefresh(!autoRefresh)} style={{ padding: "8px 16px", background: autoRefresh ? "#10b98122" : "rgba(255,255,255,0.06)", color: autoRefresh ? "#34d399" : "#fff", border: `1px solid ${autoRefresh ? "#10b98144" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
            {autoRefresh ? "● Live" : "Auto-Refresh"}
          </button>
          <button onClick={load} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Refresh</button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setExportDropdown(!exportDropdown)} style={{ padding: "8px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={14} /> Export PDF <ChevronDown size={13} />
            </button>
            {exportDropdown && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setExportDropdown(false)} />
                <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, overflow: "hidden", minWidth: 170, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
                  {([
                    { period: "all" as Period, label: "All Records", icon: "📋" },
                    { period: "today" as Period, label: "Today", icon: "📅" },
                    { period: "week" as Period, label: "This Week", icon: "🗓️" },
                    { period: "month" as Period, label: "This Month", icon: "📆" },
                  ]).map(opt => (
                    <button key={opt.period} onClick={() => doExport(opt.period)}
                      style={{ width: "100%", padding: "11px 16px", background: "transparent", border: "none", color: "#fff", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span>{opt.icon}</span> {opt.label} ({filterByPeriod(activities, opt.period).length})
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Top Actions</h3>
          {topActions.map(([action, count]) => (
            <div key={action} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
              <Badge c={ACTION_COLORS[action] || "#6366f1"} label={action} />
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{count as number}</span>
            </div>
          ))}
          {topActions.length === 0 && <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No data yet</p>}
        </div>
        <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Quick Stats</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {[
              { label: "Total Events", value: activities.length, color: "#6366f1" },
              { label: "Today", value: filterByPeriod(activities, "today").length, color: "#10b981" },
              { label: "This Week", value: filterByPeriod(activities, "week").length, color: "#f59e0b" },
              { label: "Unique Users", value: new Set(activities.filter(a => a.userId).map(a => a.userId)).size, color: "#ec4899" },
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
          <input style={{ ...inp, paddingLeft: 36 }} placeholder="Search by user, email, phone, content or page..." value={search} onChange={e => setSearch(e.target.value)} />
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
              {["Time", "User Name", "Email", "Phone", "User ID", "Action", "Page", "Content", "IP", "Details"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading activities...</td></tr>
            ) : activities.length === 0 ? (
              <tr><td colSpan={10} style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                <Activity size={32} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                No activities recorded yet.
              </td></tr>
            ) : activities.map(a => (
              <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={10} />{new Date(a.createdAt).toLocaleString()}</div>
                </td>
                <td style={{ padding: "8px 12px" }}>
                  <div style={{ color: "#fff", fontWeight: 600 }}>{a.userName || "Guest"}</div>
                </td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.5)" }}>{a.userEmail || "-"}</td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.5)" }}>{a.userPhone || "-"}</td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace" }}>
                  {(a.userId || a.anonId || "-")?.toString().slice(0, 14)}
                </td>
                <td style={{ padding: "8px 12px" }}><Badge c={ACTION_COLORS[a.actionType] || "#6366f1"} label={a.actionType} /></td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.4)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.page || "-"}</td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.5)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.contentTitle || "-"}</td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 11 }}>{a.ipAddress || "-"}</td>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.35)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.details || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
