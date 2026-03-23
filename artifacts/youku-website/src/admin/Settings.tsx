import { useState } from "react";
import { Save, Shield, Bell, Globe, Database, Key } from "lucide-react";

const inp = {
  width: "100%", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px",
  color: "#fff", fontSize: 13, outline: "none"
};

function Section({ title, icon: Icon, children }: any) {
  return (
    <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#6366f122", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color="#818cf8" />
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: any) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontWeight: 600 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4, margin: "4px 0 0" }}>{hint}</p>}
    </div>
  );
}

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "LUO FILM.SITE",
    siteDescription: "Premium streaming platform for Asian content",
    contactEmail: "admin@luofilm.site",
    supportPhone: "",
    currency: "USD",
    timezone: "UTC",
    maintenanceMode: false,
    userRegistration: true,
    emailVerification: false,
    freeTrialDays: 7,
    basicPrice: "4.99",
    standardPrice: "9.99",
    premiumPrice: "19.99",
    maxDevices: 3,
    watermarkEnabled: true,
    analyticsEnabled: true,
    adminPassword: "",
    confirmPassword: "",
    twoFactor: false,
  });

  const set = (k: string, v: any) => setSettings(s => ({ ...s, [k]: v }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Settings</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Configure platform settings and preferences</p>
        </div>
        <button onClick={save} style={{ padding: "9px 22px", background: saved ? "#10b981" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.3s" }}>
          <Save size={15} /> {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      <Section title="General" icon={Globe}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Site Name"><input style={inp} value={settings.siteName} onChange={e => set("siteName", e.target.value)} /></Field>
          <Field label="Contact Email"><input style={inp} type="email" value={settings.contactEmail} onChange={e => set("contactEmail", e.target.value)} /></Field>
          <Field label="Support Phone"><input style={inp} value={settings.supportPhone} onChange={e => set("supportPhone", e.target.value)} /></Field>
          <Field label="Currency">
            <select style={inp} value={settings.currency} onChange={e => set("currency", e.target.value)}>
              {["USD", "EUR", "GBP", "KES", "NGN", "GHS", "ZAR"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Timezone">
            <select style={inp} value={settings.timezone} onChange={e => set("timezone", e.target.value)}>
              {["UTC", "Africa/Nairobi", "Africa/Lagos", "Africa/Accra", "Europe/London", "America/New_York", "Asia/Shanghai"].map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </Field>
          <Field label="Site Description" >
            <input style={inp} value={settings.siteDescription} onChange={e => set("siteDescription", e.target.value)} />
          </Field>
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
          {[
            { key: "maintenanceMode", label: "Maintenance Mode", hint: "Block all users from accessing the site" },
            { key: "userRegistration", label: "Allow Registration", hint: "Allow new users to sign up" },
            { key: "emailVerification", label: "Email Verification", hint: "Require email verification" },
          ].map(({ key, label, hint }) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={(settings as any)[key]} onChange={e => set(key, e.target.checked)} />
              <span style={{ fontSize: 13, color: "#fff" }}>{label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Subscription Plans" icon={Database}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          <Field label="Free Trial (Days)"><input style={inp} type="number" value={settings.freeTrialDays} onChange={e => set("freeTrialDays", Number(e.target.value))} /></Field>
          <Field label="Basic Plan Price ($)"><input style={inp} type="number" step="0.01" value={settings.basicPrice} onChange={e => set("basicPrice", e.target.value)} /></Field>
          <Field label="Standard Plan Price ($)"><input style={inp} type="number" step="0.01" value={settings.standardPrice} onChange={e => set("standardPrice", e.target.value)} /></Field>
          <Field label="Premium Plan Price ($)"><input style={inp} type="number" step="0.01" value={settings.premiumPrice} onChange={e => set("premiumPrice", e.target.value)} /></Field>
        </div>
        <Field label="Max Devices per Account" hint="How many devices a single subscription can stream on simultaneously">
          <input style={{ ...inp, width: 120 }} type="number" value={settings.maxDevices} onChange={e => set("maxDevices", Number(e.target.value))} />
        </Field>
      </Section>

      <Section title="Content Settings" icon={Bell}>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { key: "watermarkEnabled", label: "Enable Watermark", hint: "Show platform watermark on videos" },
            { key: "analyticsEnabled", label: "Track Analytics", hint: "Track and record user activity" },
          ].map(({ key, label, hint }) => (
            <label key={key} style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" style={{ marginTop: 2 }} checked={(settings as any)[key]} onChange={e => set(key, e.target.checked)} />
              <div>
                <div style={{ fontSize: 13, color: "#fff" }}>{label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{hint}</div>
              </div>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Security" icon={Shield}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 500 }}>
          <Field label="New Admin Password" hint="Leave blank to keep current password">
            <input style={inp} type="password" value={settings.adminPassword} onChange={e => set("adminPassword", e.target.value)} placeholder="••••••••" />
          </Field>
          <Field label="Confirm Password">
            <input style={inp} type="password" value={settings.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} placeholder="••••••••" />
          </Field>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={settings.twoFactor} onChange={e => set("twoFactor", e.target.checked)} />
          <div>
            <div style={{ fontSize: 13, color: "#fff" }}>Two-Factor Authentication</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Add an extra layer of security to your admin account</div>
          </div>
        </label>
      </Section>
    </div>
  );
}
