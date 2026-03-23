import { useState } from "react";
import { X } from "lucide-react";

type Tab = "login" | "register";
type Step = "main" | "google-phone";
type Gender = "female" | "male";
type AgeGroup = "adult" | "child";

interface AuthModalProps {
  onClose: () => void;
  onAuth: (user: { name: string; phone: string; email: string; avatar: string }) => void;
}

function getDiceBearUrl(name: string, gender: Gender, ageGroup: AgeGroup): string {
  const seed = encodeURIComponent(name || "User");
  const bgColor =
    gender === "female"
      ? ageGroup === "child"
        ? "ffc8d6,ffaec0,ffe0e9"
        : "f9a8d4,fbcfe8,fce7f3"
      : ageGroup === "child"
      ? "93c5fd,bfdbfe,dbeafe"
      : "7dd3fc,bae6fd,e0f2fe";
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=${bgColor}&backgroundType=gradientLinear`;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function AuthModal({ onClose, onAuth }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [step, setStep] = useState<Step>("main");

  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [gender, setGender] = useState<Gender>("female");

  const [googlePhone, setGooglePhone] = useState("");
  const [googleGender, setGoogleGender] = useState<Gender>("female");
  const [googleAgeGroup, setGoogleAgeGroup] = useState<AgeGroup>("adult");
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string } | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!loginPhone.trim() || !loginPassword.trim()) {
      setError("Please enter your phone number and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const avatar = getDiceBearUrl("User", "female", "adult");
      onAuth({ name: "User", phone: loginPhone, email: "", avatar });
      onClose();
    }, 800);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const name = `${firstName} ${lastName}`;
      const avatar = getDiceBearUrl(name, gender, "adult");
      onAuth({ name, phone: regPhone, email: regEmail, avatar });
      onClose();
    }, 800);
  }

  function handleGoogleLogin() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (tab === "register") {
        setGoogleUser({ name: "Google User", email: "user@gmail.com" });
        setStep("google-phone");
      } else {
        const avatar = getDiceBearUrl("Google User", "female", "adult");
        onAuth({ name: "Google User", phone: "", email: "user@gmail.com", avatar });
        onClose();
      }
    }, 800);
  }

  function handleGooglePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!googlePhone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (googleUser) {
        const avatar = getDiceBearUrl(googleUser.name, googleGender, googleAgeGroup);
        onAuth({ name: googleUser.name, phone: googlePhone, email: googleUser.email, avatar });
      }
      onClose();
    }, 700);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "0.06em",
    marginBottom: 5,
    display: "block",
    textTransform: "uppercase",
  };

  const primaryBtn: React.CSSProperties = {
    width: "100%",
    padding: "11px",
    borderRadius: 8,
    background: "linear-gradient(90deg,#00a9f5,#0076d6)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    letterSpacing: "0.06em",
    opacity: loading ? 0.7 : 1,
    transition: "opacity 0.2s, filter 0.2s",
  };

  const googleBtn: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 500,
    cursor: loading ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "background 0.2s",
  };

  function GenderSelect({
    value,
    onChange,
  }: {
    value: Gender;
    onChange: (g: Gender) => void;
  }) {
    return (
      <div>
        <label style={labelStyle}>I am a</label>
        <div style={{ display: "flex", gap: 8 }}>
          {(
            [
              { value: "female", label: "Girl / Woman", emoji: "👩" },
              { value: "male", label: "Boy / Man", emoji: "👨" },
            ] as { value: Gender; label: string; emoji: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1,
                padding: "9px 8px",
                borderRadius: 8,
                border:
                  value === opt.value
                    ? `1.5px solid ${opt.value === "female" ? "#f472b6" : "#60a5fa"}`
                    : "1px solid rgba(255,255,255,0.1)",
                background:
                  value === opt.value
                    ? opt.value === "female"
                      ? "rgba(244,114,182,0.1)"
                      : "rgba(96,165,250,0.1)"
                    : "rgba(255,255,255,0.04)",
                color:
                  value === opt.value
                    ? opt.value === "female"
                      ? "#f9a8d4"
                      : "#93c5fd"
                    : "rgba(255,255,255,0.45)",
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 20 }}>{opt.emoji}</span>
              <span style={{ fontWeight: value === opt.value ? 600 : 400 }}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function AgeGroupSelect({
    value,
    onChange,
  }: {
    value: AgeGroup;
    onChange: (a: AgeGroup) => void;
  }) {
    return (
      <div>
        <label style={labelStyle}>Age Group</label>
        <div style={{ display: "flex", gap: 8 }}>
          {(
            [
              { value: "adult", label: "Adult", emoji: "🧑" },
              { value: "child", label: "Child", emoji: "🧒" },
            ] as { value: AgeGroup; label: string; emoji: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1,
                padding: "9px 8px",
                borderRadius: 8,
                border:
                  value === opt.value
                    ? "1.5px solid #00a9f5"
                    : "1px solid rgba(255,255,255,0.1)",
                background:
                  value === opt.value
                    ? "rgba(0,169,245,0.1)"
                    : "rgba(255,255,255,0.04)",
                color:
                  value === opt.value ? "#7dd3fc" : "rgba(255,255,255,0.45)",
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 20 }}>{opt.emoji}</span>
              <span style={{ fontWeight: value === opt.value ? 600 : 400 }}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const avatarPreviewUrl =
    step === "google-phone"
      ? getDiceBearUrl(googleUser?.name || "User", googleGender, googleAgeGroup)
      : tab === "register"
      ? getDiceBearUrl(firstName ? `${firstName} ${lastName}` : "User", gender, "adult")
      : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        paddingTop: 68,
        paddingRight: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          width: 370,
          maxHeight: "calc(100vh - 90px)",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
          animation: "slideDown 0.18s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .auth-input:focus { border-color: rgba(0,169,245,0.6) !important; }
          .auth-google-btn:hover { background: rgba(255,255,255,0.09) !important; }
          .auth-modal-scroll::-webkit-scrollbar { width: 4px; }
          .auth-modal-scroll::-webkit-scrollbar-track { background: transparent; }
          .auth-modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        `}</style>

        {/* Header */}
        <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {step === "google-phone" ? (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Almost there!</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
                Help us personalise your avatar
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 0 }}>
              {(["login", "register"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); }}
                  style={{
                    padding: "0 16px 12px",
                    fontSize: 15,
                    fontWeight: tab === t ? 700 : 400,
                    color: tab === t ? "#fff" : "rgba(255,255,255,0.35)",
                    background: "transparent",
                    border: "none",
                    borderBottom: tab === t ? "2px solid #00a9f5" : "2px solid transparent",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    letterSpacing: "0.02em",
                    transition: "all 0.15s",
                  }}
                >
                  {t === "login" ? "Log In" : "Register"}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "none",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: "16px 20px 24px" }}>
          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 7,
              padding: "8px 12px",
              fontSize: 12,
              color: "#fca5a5",
              marginBottom: 14,
            }}>
              {error}
            </div>
          )}

          {/* Avatar preview for register / google-phone */}
          {avatarPreviewUrl && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ position: "relative" }}>
                <img
                  src={avatarPreviewUrl}
                  alt="Your avatar preview"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    border: "2px solid rgba(0,169,245,0.4)",
                    background: "#1a1a1a",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "#00a9f5",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    border: "2px solid #161616",
                  }}
                >
                  ✨
                </div>
              </div>
            </div>
          )}

          {/* Google Phone Step */}
          {step === "google-phone" && (
            <form onSubmit={handleGooglePhoneSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 8,
              }}>
                <GoogleIcon />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{googleUser?.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{googleUser?.email}</div>
                </div>
              </div>

              <GenderSelect value={googleGender} onChange={setGoogleGender} />
              <AgeGroupSelect value={googleAgeGroup} onChange={setGoogleAgeGroup} />

              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  className="auth-input"
                  style={inputStyle}
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={googlePhone}
                  onChange={(e) => setGooglePhone(e.target.value)}
                />
              </div>
              <button type="submit" style={primaryBtn} disabled={loading}>
                {loading ? "Saving..." : "Complete Registration"}
              </button>
            </form>
          )}

          {/* Login Form */}
          {step === "main" && tab === "login" && (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input className="auth-input" style={inputStyle} type="tel" placeholder="+1 234 567 8900" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} autoFocus />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input className="auth-input" style={inputStyle} type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
              <div style={{ textAlign: "right", marginTop: -6 }}>
                <button type="button" style={{ background: "none", border: "none", color: "#00a9f5", fontSize: 12, cursor: "pointer", padding: 0 }}>
                  Forgot password?
                </button>
              </div>
              <button type="submit" style={primaryBtn} disabled={loading}>
                {loading ? "Signing in..." : "SIGN IN"}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                OR
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              </div>
              <button type="button" className="auth-google-btn" style={googleBtn} onClick={handleGoogleLogin} disabled={loading}>
                <GoogleIcon />
                Continue with Google
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                Don't have an account?{" "}
                <button type="button" onClick={() => { setTab("register"); setError(""); }} style={{ background: "none", border: "none", color: "#00a9f5", cursor: "pointer", fontSize: 12, padding: 0 }}>
                  Register now
                </button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {step === "main" && tab === "register" && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <GenderSelect value={gender} onChange={setGender} />
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>First Name</label>
                  <input className="auth-input" style={inputStyle} type="text" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoFocus />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Last Name</label>
                  <input className="auth-input" style={inputStyle} type="text" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input className="auth-input" style={inputStyle} type="tel" placeholder="+1 234 567 8900" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input className="auth-input" style={inputStyle} type="email" placeholder="you@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input className="auth-input" style={inputStyle} type="password" placeholder="••••••••" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
              </div>
              <button type="submit" style={{ ...primaryBtn, marginTop: 4 }} disabled={loading}>
                {loading ? "Creating account..." : "CREATE ACCOUNT"}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                OR
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              </div>
              <button type="button" className="auth-google-btn" style={googleBtn} onClick={handleGoogleLogin} disabled={loading}>
                <GoogleIcon />
                Sign up with Google
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                Already have an account?{" "}
                <button type="button" onClick={() => { setTab("login"); setError(""); }} style={{ background: "none", border: "none", color: "#00a9f5", cursor: "pointer", fontSize: 12, padding: 0 }}>
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
