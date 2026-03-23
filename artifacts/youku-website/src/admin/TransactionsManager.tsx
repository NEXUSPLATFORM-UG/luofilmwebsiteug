import { useState, useEffect } from "react";
import { Search, Download, ReceiptText } from "lucide-react";
import { api } from "./api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const inp = {
  width: "100%", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px",
  color: "#fff", fontSize: 13, outline: "none"
};

const TYPE_COLORS: Record<string, string> = {
  subscription: "#6366f1",
  withdrawal: "#ef4444",
  topup: "#10b981",
  refund: "#f59e0b",
  adjustment: "#8b5cf6",
};

function Badge({ c, label }: { c: string; label: string }) {
  return <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${c}22`, color: c, textTransform: "capitalize" }}>{label}</span>;
}

export default function TransactionsManager() {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);

  const load = () => {
    setLoading(true);
    api.transactions.list({ type, status, search }).then(d => {
      setTxs(d.transactions || []);
      setTotal(d.total || 0);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, type, status]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Transaction Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Records: ${txs.length}  |  Net Total: $${total.toFixed(2)}`, 14, 37);

    autoTable(doc, {
      head: [["Date", "User", "Email", "Phone", "Type", "Amount", "Status", "Description"]],
      body: txs.map(t => [
        new Date(t.createdAt).toLocaleString(),
        t.userName || "-",
        t.userEmail || "-",
        t.userPhone || "-",
        t.type,
        `${t.amount > 0 ? "+" : ""}$${Math.abs(t.amount).toFixed(2)} ${t.currency || "USD"}`,
        t.status,
        t.description || "-",
      ]),
      startY: 44,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 250] },
    });

    doc.save(`transactions-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const totalIn = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = txs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Transactions</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{txs.length} records found</p>
        </div>
        <button onClick={exportPDF} style={{ padding: "8px 18px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Download size={15} /> Export PDF
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Total In</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#10b981" }}>+${totalIn.toFixed(2)}</div>
        </div>
        <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Total Out</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#ef4444" }}>-${totalOut.toFixed(2)}</div>
        </div>
        <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Net Balance</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: totalIn - totalOut >= 0 ? "#10b981" : "#ef4444" }}>${(totalIn - totalOut).toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input style={{ ...inp, paddingLeft: 36, width: "100%" }} placeholder="Search by user, email or description..." value={search} onChange={e => setSearch(e.target.value)} />
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
              {["Date & Time", "User", "Phone", "Type", "Amount", "Status", "Description", "Reference"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</td></tr>
            ) : txs.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                <ReceiptText size={32} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                No transactions found
              </td></tr>
            ) : txs.map(t => (
              <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", fontSize: 12 }}>{new Date(t.createdAt).toLocaleString()}</td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ color: "#fff", fontWeight: 500 }}>{t.userName || "System"}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{t.userEmail || "-"}</div>
                </td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)" }}>{t.userPhone || "-"}</td>
                <td style={{ padding: "10px 14px" }}><Badge c={TYPE_COLORS[t.type] || "#6366f1"} label={t.type} /></td>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: t.amount > 0 ? "#10b981" : "#ef4444" }}>
                  {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)} {t.currency || "USD"}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <Badge c={t.status === "completed" ? "#10b981" : t.status === "pending" ? "#f59e0b" : "#ef4444"} label={t.status} />
                </td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)", maxWidth: 200 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description || "-"}</div>
                </td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{t.reference || `#${t.id}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
