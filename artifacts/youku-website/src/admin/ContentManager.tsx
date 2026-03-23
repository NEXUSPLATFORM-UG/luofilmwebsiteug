import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Search, Film, Tv, Eye, List } from "lucide-react";
import { api } from "./api";

const GENRES = ["Romance","Drama","Action","Thriller","Fantasy","Historical","Comedy","Mystery","Xianxia","Wuxia","Campus","Medical","Period","Modern","Variety","Documentary","Sports","Anime"];
const BADGES = ["none","VIP","Express","New"];

function Btn({ children, onClick, color = "#6366f1", small }: any) {
  return (
    <button onClick={onClick} style={{
      padding: small ? "5px 12px" : "8px 18px",
      background: color, color: "#fff", border: "none", borderRadius: 8,
      fontSize: small ? 12 : 13, fontWeight: 600, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 6
    }}>{children}</button>
  );
}

function Modal({ title, onClose, children }: any) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, width: "100%", maxWidth: 680, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}

const inp = {
  width: "100%", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px",
  color: "#fff", fontSize: 13, outline: "none"
};

function ContentForm({ initial, onSave, onClose }: any) {
  const [form, setForm] = useState({ title: "", type: "movie", genre: "Romance", description: "", thumbnailUrl: "", coverUrl: "", videoUrl: "", trailerUrl: "", year: new Date().getFullYear(), rating: 8.0, badge: "none", duration: 120, status: "published", ...initial });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      if (initial?.id) await api.content.update(initial.id, form);
      else await api.content.create(form);
      onSave();
    } catch (e) { alert(String(e)); }
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Title">
          <input style={inp} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Content title" />
        </Field>
        <Field label="Type">
          <select style={inp} value={form.type} onChange={e => set("type", e.target.value)}>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
        </Field>
        <Field label="Genre">
          <select style={inp} value={form.genre} onChange={e => set("genre", e.target.value)}>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Year">
          <input style={inp} type="number" value={form.year} onChange={e => set("year", Number(e.target.value))} />
        </Field>
        <Field label="Rating (0-10)">
          <input style={inp} type="number" step="0.1" min="0" max="10" value={form.rating} onChange={e => set("rating", Number(e.target.value))} />
        </Field>
        <Field label="Badge">
          <select style={inp} value={form.badge} onChange={e => set("badge", e.target.value)}>
            {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Duration (mins)">
          <input style={inp} type="number" value={form.duration} onChange={e => set("duration", Number(e.target.value))} />
        </Field>
        <Field label="Status">
          <select style={inp} value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
      </div>
      <Field label="Description">
        <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} />
      </Field>
      <Field label="Thumbnail URL">
        <input style={inp} value={form.thumbnailUrl} onChange={e => set("thumbnailUrl", e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="Cover/Banner URL">
        <input style={inp} value={form.coverUrl} onChange={e => set("coverUrl", e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="Video URL (MP4 / Stream)">
        <input style={inp} value={form.videoUrl} onChange={e => set("videoUrl", e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="Trailer URL">
        <input style={inp} value={form.trailerUrl} onChange={e => set("trailerUrl", e.target.value)} placeholder="https://..." />
      </Field>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
        <button onClick={onClose} style={{ ...inp, width: "auto", cursor: "pointer" }}>Cancel</button>
        <Btn onClick={save}>{saving ? "Saving..." : (initial?.id ? "Save Changes" : "Upload Content")}</Btn>
      </div>
    </div>
  );
}

export default function ContentManager() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modal, setModal] = useState<null | "create" | any>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api.content.list({ search, type: typeFilter }).then(d => setContent(d.content || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, typeFilter]);

  const del = async (id: number) => {
    if (!confirm("Delete this content?")) return;
    setDeleting(id);
    await api.content.delete(id).catch(console.error);
    setDeleting(null);
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Content Management</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Manage movies, series and their episodes</p>
        </div>
        <Btn onClick={() => setModal("create")}><Plus size={15} /> Upload Content</Btn>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input style={{ ...inp, paddingLeft: 36, width: "100%" }} placeholder="Search content..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={{ ...inp, width: 140 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </select>
      </div>

      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Thumbnail", "Title", "Type", "Genre", "Year", "Rating", "Badge", "Status", "Views", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</td></tr>
            ) : content.length === 0 ? (
              <tr><td colSpan={10} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No content found. Upload your first movie or series!</td></tr>
            ) : content.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "10px 14px" }}>
                  {c.thumbnailUrl
                    ? <img src={c.thumbnailUrl} alt="" style={{ width: 44, height: 58, objectFit: "cover", borderRadius: 4 }} />
                    : <div style={{ width: 44, height: 58, borderRadius: 4, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}><Film size={18} color="#444" /></div>}
                </td>
                <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 500, maxWidth: 200 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</div>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: c.type === "movie" ? "#3b82f622" : "#8b5cf622", color: c.type === "movie" ? "#60a5fa" : "#a78bfa" }}>
                    {c.type === "movie" ? "Movie" : "Series"}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)" }}>{c.genre}</td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)" }}>{c.year}</td>
                <td style={{ padding: "10px 14px", color: "#f59e0b", fontWeight: 600 }}>⭐ {c.rating}</td>
                <td style={{ padding: "10px 14px" }}>
                  {c.badge !== "none" && <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 11, fontWeight: 700, background: c.badge === "VIP" ? "#f59e0b33" : "#3b82f633", color: c.badge === "VIP" ? "#fbbf24" : "#60a5fa" }}>{c.badge}</span>}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: c.status === "published" ? "#10b98122" : "#ef444422", color: c.status === "published" ? "#34d399" : "#f87171" }}>{c.status}</span>
                </td>
                <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)" }}>{c.views || 0}</td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setModal(c)} style={{ padding: "5px 8px", background: "#6366f122", border: "none", borderRadius: 6, color: "#818cf8", cursor: "pointer" }}><Edit size={13} /></button>
                    {c.type === "series" && (
                      <Link href={`/admin/content/${c.id}/episodes`}>
                        <button style={{ padding: "5px 8px", background: "#10b98122", border: "none", borderRadius: 6, color: "#34d399", cursor: "pointer" }}><List size={13} /></button>
                      </Link>
                    )}
                    <button onClick={() => del(c.id)} disabled={deleting === c.id} style={{ padding: "5px 8px", background: "#ef444422", border: "none", borderRadius: 6, color: "#f87171", cursor: "pointer" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === "create" ? "Upload New Content" : `Edit: ${modal.title}`} onClose={() => setModal(null)}>
          <ContentForm initial={modal === "create" ? null : modal} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
