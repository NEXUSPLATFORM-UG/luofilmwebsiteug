import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, User, Phone, Mail, Shield } from "lucide-react";
import { api } from "./api";

const inp = {
  width: "100%", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px",
  color: "#fff", fontSize: 13, outline: "none"
};

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

function Badge({ c, label }: { c: string; label: string }) {
  return <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${c}22`, color: c }}>{label}</span>;
}

function UserForm({ initial, onSave, onClose }: any) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", role: "user", status: "active", ...initial });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      if (initial?.id) await api.users.update(initial.id, form);
      else await api.users.create(form);
      onSave();
    } catch (e) { alert(String(e)); }
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { label: "Full Name", key: "name", placeholder: "John Doe" },
          { label: "Email", key: "email", placeholder: "john@example.com" },
          { label: "Phone Number", key: "phone", placeholder: "+1234567890" },
          { label: "Country", key: "country", placeholder: "United States" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>{label}</label>
            <input style={inp} value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
          </div>
        ))}
        <div>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Role</label>
          <select style={inp} value={form.role} onChange={e => set("role", e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>Status</label>
          <select style={inp} value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
        <button onClick={onClose} style={{ ...inp, width: "auto", cursor: "pointer" }}>Cancel</button>
        <button onClick={save} style={{ padding: "8px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {saving ? "Saving..." : (initial?.id ? "Update User" : "Create User")}
        </button>
      </div>
    </div>
  );
}

export default function UsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState<null | "create" | any>(null);
  const [detail, setDetail] = useState<any>(null);

  const load = () => {
    setLoading(true);
    api.users.list({ search, status }).then(d => setUsers(d.users || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, status]);

  const del = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await api.users.delete(id);
    load();
  };

  const viewDetail = async (id: number) => {
    const d = await api.users.get(id);
    setDetail(d);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>User Management</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{users.length} total users</p>
        </div>
        <button onClick={() => setModal("create")} style={{ padding: "8px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={15} /> Add User
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input style={{ ...inp, paddingLeft: 36, width: "100%" }} placeholder="Search by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={{ ...inp, width: 150 }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["User", "Email", "Phone", "Country", "Role", "Status", "Joined", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No users found</td></tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {u.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <span style={{ color: "#fff", fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{u.email}</td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{u.phone || "-"}</td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)" }}>{u.country || "-"}</td>
                <td style={{ padding: "10px 14px" }}>
                  <Badge c={u.role === "admin" ? "#f59e0b" : "#6366f1"} label={u.role} />
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <Badge c={u.status === "active" ? "#10b981" : u.status === "suspended" ? "#f59e0b" : "#ef4444"} label={u.status} />
                </td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.4)" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button onClick={() => viewDetail(u.id)} style={{ padding: "4px 8px", background: "#10b98122", border: "none", borderRadius: 6, color: "#34d399", cursor: "pointer" }}>View</button>
                    <button onClick={() => setModal(u)} style={{ padding: "4px 8px", background: "#6366f122", border: "none", borderRadius: 6, color: "#818cf8", cursor: "pointer" }}><Edit size={12} /></button>
                    <button onClick={() => del(u.id)} style={{ padding: "4px 8px", background: "#ef444422", border: "none", borderRadius: 6, color: "#f87171", cursor: "pointer" }}><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === "create" ? "Add New User" : `Edit: ${modal.name}`} onClose={() => setModal(null)}>
          <UserForm initial={modal === "create" ? null : modal} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
        </Modal>
      )}

      {detail && (
        <Modal title={`User Details: ${detail.user?.name}`} onClose={() => setDetail(null)}>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { icon: User, label: "Name", val: detail.user?.name },
                { icon: Mail, label: "Email", val: detail.user?.email },
                { icon: Phone, label: "Phone", val: detail.user?.phone || "N/A" },
                { icon: Shield, label: "Role", val: detail.user?.role },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Icon size={13} color="#818cf8" />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{val}</div>
                </div>
              ))}
            </div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#818cf8", marginBottom: 10 }}>Subscription History</h4>
            {(detail.subscriptions || []).length === 0
              ? <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No subscriptions</p>
              : (detail.subscriptions || []).map((s: any) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                  <span style={{ color: "#fff", textTransform: "capitalize" }}>{s.plan} Plan</span>
                  <Badge c={s.status === "active" ? "#10b981" : "#ef4444"} label={s.status} />
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>${s.price}</span>
                </div>
              ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
