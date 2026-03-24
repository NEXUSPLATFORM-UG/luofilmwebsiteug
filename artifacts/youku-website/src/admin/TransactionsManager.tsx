import { useState, useEffect } from "react";
import { Search, Download, ReceiptText, ChevronDown } from "lucide-react";
import { api } from "./api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const inp = {
  width: "100%", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px",
  color: "#fff", fontSize: 13, outline: "none"
};

const TYPE_COLORS: Record<string, string> = {
  subscription: "#6366f1", withdrawal: "#ef4444", topup: "#10b981",
  refund: "#f59e0b", adjustment: "#8b5cf6",
};

type Period = "all" | "today" | "week" | "month";

function Badge({ c, label }: { c: string; label: string }) {
  return <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${c}22`, color: c, textTransform: "capitalize" }}>{label}</span>;
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

function fmtUGX(amount: number) {
  return `${amount > 0 ? "+" : ""}UGX ${Math.abs(amount).toLocaleString()}`;
}

function buildTransactionPDF(records: any[], period: Period) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const accentR = 99, accentG = 102, accentB = 241;
  const greenR = 16, greenG = 185, greenB = 129;

  doc.setFillColor(10, 10, 24);
  doc.rect(0, 0, W, 42, "F");

  doc.setFillColor(accentR, accentG, accentB);
  doc.roundedRect(10, 7, 48, 14, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("LUO FILM.SITE", 34, 15.5, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("VJ PAUL FREE DOWNLOAD", 34, 19.5, { align: "center" });

  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TRANSACTIONS REPORT", W / 2, 14, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 210);
  doc.text(`Period: ${periodLabel(period)}`, W / 2, 21, { align: "center" });
  doc.text(`Generated: ${new Date().toLocaleString()}   |   Records: ${records.length}`, W / 2, 27, { align: "center" });

  const totalIn = records.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = records.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const net = totalIn - totalOut;
  doc.text(`Total In: UGX ${totalIn.toLocaleString()}   |   Total Out: UGX ${totalOut.toLocaleString()}   |   Net: UGX ${net.toLocaleString()}`, W / 2, 33, { align: "center" });

  doc.setTextColor(150, 160, 190);
  doc.setFontSize(8);
  doc.text("admin@luofilm.site  |  luofilm.site", W - 10, 16, { align: "right" });

  autoTable(doc, {
    head: [["#", "Date & Time", "User Name", "Email", "Phone", "User ID", "Plan", "Type", "Amount (UGX)", "Status", "Description", "Reference"]],
    body: records.map((t, i) => [
      i + 1,
      new Date(t.createdAt).toLocaleString(),
      t.userName || "System",
      t.userEmail || "-",
      t.userPhone || "-",
      t.userId || "-",
      t.plan || "-",
      t.type || "-",
      `${t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString()}`,
      t.status || "-",
      t.description || "-",
      t.reference || t.id || "-",
    ]),
    startY: 46,
    styles: { fontSize: 7.5, cellPadding: 2.5, textColor: [30, 30, 50] },
    headStyles: { fillColor: [accentR, accentG, accentB], textColor: 255, fontStyle: "bold", fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 245, 252] },
    bodyStyles: { lineColor: [220, 220, 235], lineWidth: 0.1 },
    columnStyles: {
      0: { cellWidth: 7 },
      1: { cellWidth: 32 },
      2: { cellWidth: 26 },
      3: { cellWidth: 34 },
      4: { cellWidth: 22 },
      5: { cellWidth: 20 },
      6: { cellWidth: 16 },
      7: { cellWidth: 18 },
      8: { cellWidth: 22, fontStyle: "bold" },
      9: { cellWidth: 18 },
      10: { cellWidth: 28 },
      11: { cellWidth: 18 },
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

  const finalY = (doc as any).lastAutoTable.finalY + 14;
  const H = doc.internal.pageSize.getHeight();
  const sigY = Math.min(finalY, H - 50);

  doc.setDrawColor(accentR, accentG, accentB);
  doc.setFillColor(248, 248, 255);
  doc.roundedRect(10, sigY, W - 20, 40, 3, 3, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentR, accentG, accentB);
  doc.text("FINANCIAL SUMMARY", 20, sigY + 7);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 60);
  doc.setFontSize(8.5);
  doc.text(`Total Revenue In:  UGX ${totalIn.toLocaleString()}`, 20, sigY + 14);
  doc.text(`Total Withdrawn:   UGX ${totalOut.toLocaleString()}`, 20, sigY + 20);
  doc.setFont("helvetica", "bold");
  doc.text(`Net Balance:       UGX ${net.toLocaleString()}`, 20, sigY + 26);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentR, accentG, accentB);
  doc.text("AUTHORIZED BY — CEO SIGNATURE", W / 2 + 10, sigY + 7);

  doc.setLineWidth(0.5);
  doc.setDrawColor(60, 60, 100);
  doc.line(W / 2 + 10, sigY + 20, W - 15, sigY + 20);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 120);
  doc.setFontSize(8);
  doc.text("Chief Executive Officer — LUO FILM.SITE", W / 2 + 10, sigY + 25);
  doc.text("Name: ______________________________", W / 2 + 10, sigY + 30);
  doc.text("Date:  ______________________________", W / 2 + 10, sigY + 35);

  doc.setFontSize(7);
  doc.setTextColor(160, 160, 180);
  doc.text(`Document ID: TXN-${Date.now()}  |  This is an official financial document of LUO FILM.SITE`, W / 2, sigY + 38, { align: "center" });

  doc.save(`luofilm-transactions-${period}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function TransactionsManager() {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [exportDropdown, setExportDropdown] = useState(false);

  const load = () => {
    setLoading(true);
    api.transactions.list({ type, status, search }).then(d => {
      setTxs(d.transactions || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, type, status]);

  const doExport = (period: Period) => {
    setExportDropdown(false);
    const filtered = filterByPeriod(txs, period);
    buildTransactionPDF(filtered, period);
  };

  const totalIn = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = txs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Transactions</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{txs.length} records — UGX currency</p>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setExportDropdown(!exportDropdown)} style={{ padding: "8px 18px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Download size={15} /> Export PDF <ChevronDown size={13} />
          </button>
          {exportDropdown && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setExportDropdown(false)} />
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, overflow: "hidden", minWidth: 180, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
                {([
                  { period: "all" as Period, label: "All Records", icon: "📋" },
                  { period: "today" as Period, label: "Today", icon: "📅" },
                  { period: "week" as Period, label: "This Week", icon: "🗓️" },
                  { period: "month" as Period, label: "This Month", icon: "📆" },
                ]).map(opt => (
                  <button key={opt.period} onClick={() => doExport(opt.period)}
                    style={{ width: "100%", padding: "11px 16px", background: "transparent", border: "none", color: "#fff", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left" as const, transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(16,185,129,0.15)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <span>{opt.icon}</span> {opt.label} ({filterByPeriod(txs, opt.period).length})
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total In", value: `UGX ${totalIn.toLocaleString()}`, color: "#10b981" },
          { label: "Total Out", value: `UGX ${totalOut.toLocaleString()}`, color: "#ef4444" },
          { label: "Net Balance", value: `UGX ${(totalIn - totalOut).toLocaleString()}`, color: totalIn - totalOut >= 0 ? "#10b981" : "#ef4444" },
          { label: "Today's Txns", value: filterByPeriod(txs, "today").length, color: "#6366f1" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input style={{ ...inp, paddingLeft: 36 }} placeholder="Search by user, email, phone or description..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={{ ...inp, width: 150 }} value={type} onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="subscription">Subscription</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="topup">Top Up</option>
          <option value="refund">Refund</option>
          <option value="adjustment">Adjustment</option>
        </select>
        <select style={{ ...inp, width: 140 }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Date & Time", "User Name", "Email", "Phone", "User ID", "Plan", "Type", "Amount (UGX)", "Status", "Description", "Reference"].map(h => (
                <th key={h} style={{ padding: "12px 12px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</td></tr>
            ) : txs.length === 0 ? (
              <tr><td colSpan={11} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                <ReceiptText size={32} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                No transactions found
              </td></tr>
            ) : txs.map(t => (
              <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", fontSize: 12 }}>{new Date(t.createdAt).toLocaleString()}</td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ color: "#fff", fontWeight: 600 }}>{t.userName || "System"}</div>
                </td>
                <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{t.userEmail || "-"}</td>
                <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.5)" }}>{t.userPhone || "-"}</td>
                <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace" }}>
                  {(t.userId || "-")?.toString().slice(0, 12)}
                </td>
                <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{t.plan || "-"}</td>
                <td style={{ padding: "10px 12px" }}><Badge c={TYPE_COLORS[t.type] || "#6366f1"} label={t.type} /></td>
                <td style={{ padding: "10px 12px", fontWeight: 700, color: t.amount > 0 ? "#10b981" : "#ef4444", whiteSpace: "nowrap" }}>
                  {fmtUGX(t.amount)}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <Badge c={t.status === "completed" ? "#10b981" : t.status === "pending" ? "#f59e0b" : "#ef4444"} label={t.status || "unknown"} />
                </td>
                <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.5)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description || "-"}</td>
                <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{t.reference || `#${t.id?.slice(0, 8)}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
