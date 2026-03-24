import { useState, useEffect } from "react";
import { Save, Shield, Globe, Database, Bell, Loader } from "lucide-react";
import { api } from "./api";
import { auth } from "../lib/firebase";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const CURRENCIES = [
  { code: "UGX", symbol: "UGX", name: "Ugandan Shilling" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "KES", symbol: "KES", name: "Kenyan Shilling" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "TZS", symbol: "TZS", name: "Tanzanian Shilling" },
  { code: "RWF", symbol: "RWF", name: "Rwandan Franc" },
];

const TIMEZONES = [
  "UTC",
  "Africa/Kampala",
  "Africa/Nairobi",
  "Africa/Lagos",
  "Africa/Accra",
  "Africa/Dar_es_Salaam",
  "Africa/Kigali",
  "Europe/London",
  "America/New_York",
  "Asia/Shanghai",
];

const DEFAULT_SETTINGS = {
  siteName: "LUO FILM.SITE",
  siteDescription: "Premium streaming platform for Asian content",
  contactEmail: "admin@luofilm.site",
  supportPhone: "",
  currency: "UGX",
  timezone: "Africa/Kampala",
  maintenanceMode: false,
  userRegistration: true,
  emailVerification: false,
  freeTrialDays: 7,
  basicPrice: "2500",
  standardPrice: "5000",
  premiumPrice: "10000",
  maxDevices: 3,
  watermarkEnabled: true,
  analyticsEnabled: true,
  twoFactor: false,
};

const inp: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding: "8px 12px",
  color: "#fff",
  fontSize: 13,
  outline: "none",
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
      {hint && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "4px 0 0" }}>{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }: any) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", userSelect: "none" as const }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          marginTop: 2,
          width: 38,
          height: 22,
          borderRadius: 11,
          background: checked ? "#6366f1" : "rgba(255,255,255,0.12)",
          position: "relative",
          flexShrink: 0,
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        <div style={{
          position: "absolute",
          top: 3,
          left: checked ? 19 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, lineHeight: 1.4 }}>{hint}</div>}
      </div>
    </label>
  );
}

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwStatus, setPwStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    api.settings.get().then((data: any) => {
      if (data) {
        setSettings(s => ({ ...s, ...data }));
      }
    }).finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: any) => setSettings(s => ({ ...s, [k]: v }));

  const currencyInfo = CURRENCIES.find(c => c.code === settings.currency) || CURRENCIES[0];

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const { ...toSave } = settings as any;
      await api.settings.save(toSave);
      setStatus("saved");
      setStatusMsg("Settings saved successfully!");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e: any) {
      setStatus("error");
      setStatusMsg("Failed to save: " + (e.message || "Unknown error"));
      setTimeout(() => setStatus("idle"), 4000);
    }
    setSaving(false);
  };

  const changePassword = async () => {
    if (!pwForm.newPw || pwForm.newPw !== pwForm.confirm) {
      setPwStatus("error");
      setPwMsg("Passwords do not match.");
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwStatus("error");
      setPwMsg("Password must be at least 6 characters.");
      return;
    }
    const user = auth.currentUser;
    if (!user || !user.email) {
      setPwStatus("error");
      setPwMsg("No authenticated admin user found.");
      return;
    }
    setPwStatus("saving");
    try {
      const credential = EmailAuthProvider.credential(user.email, pwForm.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, pwForm.newPw);
      setPwStatus("saved");
      setPwMsg("Password updated successfully!");
      setPwForm({ current: "", newPw: "", confirm: "" });
      setTimeout(() => setPwStatus("idle"), 3000);
    } catch (e: any) {
      setPwStatus("error");
      setPwMsg(
        e.code === "auth/wrong-password"
          ? "Current password is incorrect."
          : e.code === "auth/too-many-requests"
          ? "Too many attempts. Try again later."
          : "Failed: " + (e.message || "Unknown error")
      );
      setTimeout(() => setPwStatus("idle"), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, gap: 12 }}>
        <Loader size={20} color="#818cf8" style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading settings...</span>
      </div>
    );
  }

  return (
    <div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Settings</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Configure platform settings and preferences</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "9px 22px",
            background: status === "saved" ? "#10b981" : status === "error" ? "#ef4444" : "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: saving ? 0.7 : 1,
            transition: "background 0.3s",
          }}
        >
          {saving ? <Loader size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={15} />}
          {saving ? "Saving..." : status === "saved" ? "Saved!" : status === "error" ? "Error!" : "Save Settings"}
        </button>
      </div>

      {statusMsg && status !== "idle" && (
        <div style={{
          padding: "10px 16px",
          borderRadius: 8,
          marginBottom: 18,
          background: status === "saved" ? "#10b98122" : "#ef444422",
          border: `1px solid ${status === "saved" ? "#10b981" : "#ef4444"}44`,
          color: status === "saved" ? "#10b981" : "#f87171",
          fontSize: 13,
        }}>
          {statusMsg}
        </div>
      )}

      <Section title="General" icon={Globe}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Site Name">
            <input style={inp} value={settings.siteName} onChange={e => set("siteName", e.target.value)} />
          </Field>
          <Field label="Contact Email">
            <input style={inp} type="email" value={settings.contactEmail} onChange={e => set("contactEmail", e.target.value)} />
          </Field>
          <Field label="Support Phone">
            <input style={inp} value={settings.supportPhone} onChange={e => set("supportPhone", e.target.value)} placeholder="+256 700 000000" />
          </Field>
          <Field label="Currency">
            <select style={inp} value={settings.currency} onChange={e => set("currency", e.target.value)}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Timezone">
            <select style={inp} value={settings.timezone} onChange={e => set("timezone", e.target.value)}>
              {TIMEZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </Field>
          <Field label="Site Description">
            <input style={inp} value={settings.siteDescription} onChange={e => set("siteDescription", e.target.value)} />
          </Field>
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: 12, flexWrap: "wrap" as const }}>
          <Toggle
            checked={settings.maintenanceMode}
            onChange={(v: boolean) => set("maintenanceMode", v)}
            label="Maintenance Mode"
            hint="Block all users from accessing the site"
          />
          <Toggle
            checked={settings.userRegistration}
            onChange={(v: boolean) => set("userRegistration", v)}
            label="Allow Registration"
            hint="Allow new users to sign up"
          />
          <Toggle
            checked={settings.emailVerification}
            onChange={(v: boolean) => set("emailVerification", v)}
            label="Email Verification"
            hint="Require email verification on signup"
          />
        </div>
      </Section>

      <Section title="Subscription Plans" icon={Database}>
        <div style={{ marginBottom: 12, padding: "8px 12px", background: "rgba(99,102,241,0.1)", borderRadius: 8, border: "1px solid rgba(99,102,241,0.25)" }}>
          <span style={{ fontSize: 12, color: "#818cf8" }}>
            Currency: <strong>{currencyInfo.code} ({currencyInfo.name})</strong> — all prices shown in {currencyInfo.code}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          <Field label="Free Trial (Days)">
            <input style={inp} type="number" value={settings.freeTrialDays} onChange={e => set("freeTrialDays", Number(e.target.value))} />
          </Field>
          <Field label={`Basic Plan (${currencyInfo.code})`}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {currencyInfo.symbol}
              </span>
              <input
                style={{ ...inp, paddingLeft: currencyInfo.symbol.length > 1 ? 40 : 24 }}
                type="number"
                step={settings.currency === "UGX" || settings.currency === "KES" || settings.currency === "TZS" || settings.currency === "RWF" ? "100" : "0.01"}
                value={settings.basicPrice}
                onChange={e => set("basicPrice", e.target.value)}
              />
            </div>
          </Field>
          <Field label={`Standard Plan (${currencyInfo.code})`}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {currencyInfo.symbol}
              </span>
              <input
                style={{ ...inp, paddingLeft: currencyInfo.symbol.length > 1 ? 40 : 24 }}
                type="number"
                step={settings.currency === "UGX" || settings.currency === "KES" || settings.currency === "TZS" || settings.currency === "RWF" ? "100" : "0.01"}
                value={settings.standardPrice}
                onChange={e => set("standardPrice", e.target.value)}
              />
            </div>
          </Field>
          <Field label={`Premium Plan (${currencyInfo.code})`}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {currencyInfo.symbol}
              </span>
              <input
                style={{ ...inp, paddingLeft: currencyInfo.symbol.length > 1 ? 40 : 24 }}
                type="number"
                step={settings.currency === "UGX" || settings.currency === "KES" || settings.currency === "TZS" || settings.currency === "RWF" ? "100" : "0.01"}
                value={settings.premiumPrice}
                onChange={e => set("premiumPrice", e.target.value)}
              />
            </div>
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Max Devices per Account" hint="How many devices a single subscription can stream on simultaneously">
            <input style={{ ...inp, width: 120 }} type="number" value={settings.maxDevices} onChange={e => set("maxDevices", Number(e.target.value))} />
          </Field>
        </div>

        <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 600 }}>Plan Price Preview</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
            {[
              { name: "Basic", price: settings.basicPrice },
              { name: "Standard", price: settings.standardPrice },
              { name: "Premium", price: settings.premiumPrice },
            ].map(p => (
              <div key={p.name} style={{ background: "rgba(99,102,241,0.08)", borderRadius: 8, padding: "8px 16px", textAlign: "center" as const }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{p.name}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  {currencyInfo.symbol} {Number(p.price).toLocaleString()}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{currencyInfo.code}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Content Settings" icon={Bell}>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" as const }}>
          <Toggle
            checked={settings.watermarkEnabled}
            onChange={(v: boolean) => set("watermarkEnabled", v)}
            label="Enable Watermark"
            hint="Show platform watermark on videos"
          />
          <Toggle
            checked={settings.analyticsEnabled}
            onChange={(v: boolean) => set("analyticsEnabled", v)}
            label="Track Analytics"
            hint="Track and record user activity"
          />
        </div>
      </Section>

      <Section title="Security" icon={Shield}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>Change Admin Password</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, maxWidth: 620 }}>
            <Field label="Current Password">
              <input
                style={inp}
                type="password"
                value={pwForm.current}
                onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                placeholder="••••••••"
              />
            </Field>
            <Field label="New Password">
              <input
                style={inp}
                type="password"
                value={pwForm.newPw}
                onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))}
                placeholder="••••••••"
              />
            </Field>
            <Field label="Confirm New Password" hint="Leave blank to keep current password">
              <input
                style={inp}
                type="password"
                value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="••••••••"
              />
            </Field>
          </div>
          {pwMsg && pwStatus !== "idle" && (
            <div style={{
              padding: "8px 12px",
              borderRadius: 6,
              marginBottom: 10,
              background: pwStatus === "saved" ? "#10b98122" : "#ef444422",
              border: `1px solid ${pwStatus === "saved" ? "#10b981" : "#ef4444"}44`,
              color: pwStatus === "saved" ? "#10b981" : "#f87171",
              fontSize: 12,
              maxWidth: 620,
            }}>
              {pwMsg}
            </div>
          )}
          <button
            onClick={changePassword}
            disabled={pwStatus === "saving" || (!pwForm.current && !pwForm.newPw)}
            style={{
              padding: "8px 18px",
              background: pwStatus === "saved" ? "#10b981" : pwStatus === "error" ? "#ef4444" : "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: pwStatus === "saving" ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: (!pwForm.current && !pwForm.newPw) ? 0.4 : 1,
            }}
          >
            {pwStatus === "saving" ? <Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> : null}
            {pwStatus === "saving" ? "Updating..." : pwStatus === "saved" ? "Updated!" : "Update Password"}
          </button>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, marginTop: 4 }}>
          <Toggle
            checked={settings.twoFactor}
            onChange={(v: boolean) => set("twoFactor", v)}
            label="Two-Factor Authentication"
            hint="Add an extra layer of security to your admin account"
          />
        </div>
      </Section>
    </div>
  );
}
