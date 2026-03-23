import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react";
import { api } from "./api";

const inp = {
  width: "100%", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px",
  color: "#fff", fontSize: 13, outline: "none"
};

const PLANS = ["free", "basic", "standard", "premium"];
const PLAN_PRICES: Record<string, number> = { free: 0, basic: 4.99, standard: 9.99, premium: 19.99 };
const PLAN_COLORS: Record<string, string> = { free: "#6b7280", basic: "#3b82f6", standard: "#8b5cf6", premium: "#f59e0b" };

function Badge({ c, label }: { c: string; label: string }) {
  return <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${c}22`, color: c, textTransform: "capitalize" }}>{label}</span>;
}

function Modal({ title, onClose, children }: any) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function SubForm({ initial, onSave, onClose }: any) {
  const defaultStart = new Date().toISOString().slice(0, 10);
  const defaultEnd = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const [form, setForm] = useState({
    userId: "", plan: "basic", status: "active",
    price: PLAN_PRICES.basic, currency: "USD", notes: "", activatedBy: "Admin",
    ...initial,
    startDate: initial?.startDate ? new Date(initial.startDate).toISOString().slice(0, 10) : defaultStart,
    endDate: initial?.endDate ? new Date(initial.endDate).toISOString().slice(0, 10) : defaultEnd,
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const data = { ...form, userId: Number(form.userId), price: Number(form.price), startDate: new Date(form.startDate), endDate: new Date(form.endDate) };
      if (initial?.id) await api.subscriptions.update(initial.id, data);
      else await api.subscriptions.create(data);
      onSave();
    } catch (e) { alert(String(e)); }
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>User ID</label>
          <input style={inp} value={form.userId} onChange={e => set("userId", e.target.value)} placeholder="User ID number" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Plan</label>
          <select style={inp} value={form.plan} onChange={e => { set("plan", e.target.value); set("price", PLAN_PRICES[e.target.value]); }}>
            {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} — ${PLAN_PRICES[p]}/mo</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Status</label>
          <select style={inp} value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Price ($)</label>
          <input style={inp} type="number" step="0.01" value={form.price} onChange={e => set("price", e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Start Date</label>
          <input style={inp} type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>End Date</label>
          <input style={inp} type="date" value={form.endDate} onChange={e => set("endDate", e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Currency</label>
          <select style={inp} value={form.currency} onChange={e => set("currency", e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="KES">KES</option>
            <option value="NGN">NGN</option>
            <option value="GHS">GHS</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Activated By</label>
          <input style={inp} value={form.activatedBy} onChange={e => set("activatedBy", e.target.value)} />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Notes</label>
          <textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Optional notes..." />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
        <button onClick={onClose} style={{ ...inp, width: "auto", cursor: "pointer" }}>Cancel</button>
        <button onClick={save} style={{ padding: "8px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {saving ? "Saving..." : (initial?.id ? "Update Subscription" : "Add Subscription")}
        </button>
      </div>
    </div>
  );
}

export default function SubscriptionsManager() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [modal, setModal] = useState<null | "create" | any>(null);

  const load = () => {
    setLoading(true);
    api.subscriptions.list({ status, plan }).then(d => {
      let res = d.subscriptions || [];
      if (search) {
        const s = search.toLowerCase();
        res = res.filter((x: any) =>
          (x.userName || "").toLowerCase().includes(s) ||
          (x.userEmail || "").toLowerCase().includes(s) ||
          (x.userPhone || "").includes(s)
        );
      }
      setSubs(res);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, status, plan]);

  const quickAction = async (id: number, newStatus: string) => {
    const sub = subs.find(s => s.id === id);
    if (!sub) return;
    await api.subscriptions.update(id, { ...sub, status: newStatus, activatedBy: "Admin" });
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Delete this subscription?")) return;
    await api.subscriptions.delete(id);
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Subscriptions</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{subs.filter(s => s.status === "active").length} active out of {subs.length} total</p>
        </div>
        <button onClick={() => setModal("create")} style={{ padding: "8px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={15} /> Add Subscription
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {PLANS.map(p => {
          const count = subs.filter(s => s.plan === p && s.status === "active").length;
          return (
            <div key={p} style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: PLAN_COLORS[p] }}>{count}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "capitalize" }}>{p} plan</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input style={{ ...inp, paddingLeft: 36, width: "100%" }} placeholder="Search by user name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={{ ...inp, width: 140 }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select style={{ ...inp, width: 140 }} value={plan} onChange={e => setPlan(e.target.value)}>
          <option value="">All Plans</option>
          {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
      </div>

      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["User", "Phone", "Plan", "Status", "Price", "Start", "End", "Activated By", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</td></tr>
            ) : subs.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No subscriptions found</td></tr>
            ) : subs.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ color: "#fff", fontWeight: 500 }}>{s.userName || `User #${s.userId}`}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.userEmail}</div>
                </td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{s.userPhone || "-"}</td>
                <td style={{ padding: "10px 14px" }}><Badge c={PLAN_COLORS[s.plan]} label={s.plan} /></td>
                <td style={{ padding: "10px 14px" }}>
                  <Badge c={s.status === "active" ? "#10b981" : s.status === "expired" ? "#f59e0b" : "#ef4444"} label={s.status} />
                </td>
                <td style={{ padding: "10px 14px", color: "#10b981", fontWeight: 600 }}>${s.price} {s.currency}</td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{s.startDate ? new Date(s.startDate).toLocaleDateString() : "-"}</td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{s.endDate ? new Date(s.endDate).toLocaleDateString() : "-"}</td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.4)" }}>{s.activatedBy || "-"}</td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {s.status !== "active" && <button onClick={() => quickAction(s.id, "active")} title="Activate" style={{ padding: "3px 7px", background: "#10b98122", border: "none", borderRadius: 5, color: "#34d399", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontSize: 11 }}><CheckCircle size={11} /> Activate</button>}
                    {s.status === "active" && <button onClick={() => quickAction(s.id, "inactive")} title="Deactivate" style={{ padding: "3px 7px", background: "#ef444422", border: "none", borderRadius: 5, color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontSize: 11 }}><XCircle size={11} /> Deactivate</button>}
                    <button onClick={() => setModal(s)} style={{ padding: "3px 7px", background: "#6366f122", border: "none", borderRadius: 5, color: "#818cf8", cursor: "pointer" }}><Edit size={11} /></button>
                    <button onClick={() => del(s.id)} style={{ padding: "3px 7px", background: "#ef444422", border: "none", borderRadius: 5, color: "#f87171", cursor: "pointer" }}><Trash2 size={11} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === "create" ? "Add Subscription" : "Edit Subscription"} onClose={() => setModal(null)}>
          <SubForm initial={modal === "create" ? null : modal} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
