import { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown, ArrowDownCircle, Plus } from "lucide-react";
import { api } from "./api";

const CURRENCY_SYMBOLS: Record<string, string> = {
  UGX: "UGX", USD: "$", EUR: "€", GBP: "£", KES: "KES",
  NGN: "₦", GHS: "GH₵", ZAR: "R", TZS: "TZS", RWF: "RWF",
};

const inp = {
  width: "100%", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px",
  color: "#fff", fontSize: 13, outline: "none"
};

function Modal({ title, onClose, children }: any) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, width: "100%", maxWidth: 440 }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export default function WalletManager() {
  const [wallet, setWallet] = useState<any>(null);
  const [modal, setModal] = useState<"withdraw" | "topup" | null>(null);
  const [form, setForm] = useState({ amount: "", description: "", method: "bank", accountDetails: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [platformCurrency, setPlatformCurrency] = useState("UGX");

  const load = () => {
    Promise.all([
      api.wallet.get(),
      api.settings.get(),
    ]).then(([walletData, settingsData]: [any, any]) => {
      setWallet(walletData);
      if (settingsData?.currency) setPlatformCurrency(settingsData.currency);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const currSym = CURRENCY_SYMBOLS[platformCurrency] || platformCurrency;
  const fmt = (v: number) => `${currSym} ${v.toLocaleString()}`;

  const withdraw = async () => {
    setSaving(true);
    try {
      await api.wallet.withdraw({ amount: Number(form.amount), description: form.description, method: form.method, accountDetails: form.accountDetails });
      setModal(null);
      setForm({ amount: "", description: "", method: "bank", accountDetails: "" });
      load();
    } catch (e) { alert(String(e)); }
    setSaving(false);
  };

  const topup = async () => {
    setSaving(true);
    try {
      await api.wallet.topup({ amount: Number(form.amount), description: form.description });
      setModal(null);
      setForm({ amount: "", description: "", method: "bank", accountDetails: "" });
      load();
    } catch (e) { alert(String(e)); }
    setSaving(false);
  };

  if (loading) return <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</p>;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Wallet Management</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Manage your platform wallet and withdrawals</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { icon: Wallet, label: "Current Balance", value: fmt(wallet?.balance || 0), color: "#6366f1", sub: platformCurrency },
          { icon: TrendingUp, label: "Total Earned", value: fmt(wallet?.totalEarned || 0), color: "#10b981", sub: "All time" },
          { icon: TrendingDown, label: "Total Withdrawn", value: fmt(wallet?.totalWithdrawn || 0), color: "#ef4444", sub: "All time" },
        ].map(({ icon: Icon, label, value, color, sub }) => (
          <div key={label} style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={color} />
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{label}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <button onClick={() => setModal("withdraw")} style={{ padding: "10px 24px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <ArrowDownCircle size={16} /> Withdraw Funds
        </button>
        <button onClick={() => setModal("topup")} style={{ padding: "10px 24px", background: "#10b981", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={16} /> Add Funds
        </button>
      </div>

      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 16px" }}>Wallet Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Available for Withdrawal</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#10b981" }}>{fmt(wallet?.balance || 0)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Last Updated</div>
            <div style={{ fontSize: 14, color: "#fff" }}>{wallet?.updatedAt ? new Date(wallet.updatedAt).toLocaleString() : "-"}</div>
          </div>
        </div>
      </div>

      {modal === "withdraw" && (
        <Modal title="Withdraw Funds" onClose={() => setModal(null)}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Amount ({platformCurrency})</label>
            <input style={inp} type="number" step="1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Withdrawal Method</label>
            <select style={inp} value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
              <option value="mpesa">M-Pesa</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="check">Check</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Account Details</label>
            <textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={form.accountDetails} onChange={e => setForm(f => ({ ...f, accountDetails: e.target.value }))} placeholder="Bank account, PayPal email, phone number, wallet address..." />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Description (optional)</label>
            <input style={inp} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Reason for withdrawal" />
          </div>
          <div style={{ padding: "10px 14px", background: "#ef444411", borderRadius: 8, border: "1px solid #ef444433", marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: "#f87171" }}>Available balance: {fmt(wallet?.balance || 0)}</span>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setModal(null)} style={{ ...inp, width: "auto", cursor: "pointer" }}>Cancel</button>
            <button onClick={withdraw} disabled={saving} style={{ padding: "8px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {saving ? "Processing..." : "Confirm Withdrawal"}
            </button>
          </div>
        </Modal>
      )}

      {modal === "topup" && (
        <Modal title="Add Funds" onClose={() => setModal(null)}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Amount ({platformCurrency})</label>
            <input style={inp} type="number" step="1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Description</label>
            <input style={inp} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Source of funds" />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setModal(null)} style={{ ...inp, width: "auto", cursor: "pointer" }}>Cancel</button>
            <button onClick={topup} disabled={saving} style={{ padding: "8px 20px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {saving ? "Processing..." : "Add Funds"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
