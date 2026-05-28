import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, HeartPulse, Loader2 } from "lucide-react";
import { useState } from "react";

type Tab = "login" | "register";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const validateLogin = () => {
    const errs: FormErrors = {};
    if (!loginForm.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginForm.email))
      errs.email = "Invalid email format";
    if (!loginForm.password) errs.password = "Password is required";
    return errs;
  };

  const validateRegister = () => {
    const errs: FormErrors = {};
    if (!registerForm.name) errs.name = "Full name is required";
    if (!registerForm.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(registerForm.email))
      errs.email = "Invalid email format";
    if (!registerForm.password) errs.password = "Password is required";
    else if (registerForm.password.length < 6)
      errs.password = "Minimum 6 characters";
    if (registerForm.password !== registerForm.confirm)
      errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = tab === "login" ? validateLogin() : validateRegister();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);

    // Save user name to localStorage
    if (tab === "register") {
      localStorage.setItem("ccx_user_name", registerForm.name);
    } else {
      // For login, use stored name or derive from email
      const storedName = localStorage.getItem("ccx_user_name");
      if (!storedName) {
        const derived = loginForm.email
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        localStorage.setItem("ccx_user_name", derived);
      }
    }

    setTimeout(() => navigate({ to: "/dashboard" }), 1200);
  };

  const inputClass =
    "w-full bg-[#1A2431] border border-[rgba(160,190,210,0.15)] rounded-xl px-4 py-3 text-sm text-[#ffffff] placeholder-[#888888] outline-none focus:border-[rgba(249,168,201,0.5)] transition-all";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #000000 0%, #0D1225 50%, #150B2E 100%)",
      }}
    >
      <div
        className="absolute top-1/4 -left-32 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #f9a8c9, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #f9a8c9, transparent)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #f9a8c9, transparent)" }}
      />

      <div
        className="glass-card w-full max-w-md p-8 animate-fadeInUp"
        style={{ border: "1px solid rgba(249,168,201,0.2)" }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9a8c9] to-[#f9a8c9] flex items-center justify-center">
            <HeartPulse size={20} className="text-[#0d0d0d]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#ffffff]">
              CareConnect <span className="text-[#f9a8c9]">X</span>
            </h1>
            <p className="text-[10px] text-[#888888]">
              Your Health, Reimagined
            </p>
          </div>
        </div>

        <div
          className="flex mb-6 rounded-xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(160,190,210,0.1)",
          }}
        >
          {(["login", "register"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              data-ocid={`auth.${t}.tab`}
              onClick={() => {
                setTab(t);
                setErrors({});
              }}
              className={`flex-1 py-2.5 text-sm font-medium transition-all capitalize ${
                tab === t
                  ? "bg-gradient-to-r from-[#f9a8c9] to-[#f9a8c9] text-[#0d0d0d]"
                  : "text-[#888888] hover:text-[#cccccc]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {tab === "register" && (
            <div>
              <input
                data-ocid="auth.name.input"
                type="text"
                placeholder="Full Name"
                className={inputClass}
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-xs text-[#FF4D5A] mt-1 pl-1">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <input
              data-ocid="auth.email.input"
              type="email"
              placeholder="Email Address"
              className={inputClass}
              value={tab === "login" ? loginForm.email : registerForm.email}
              onChange={(e) =>
                tab === "login"
                  ? setLoginForm({ ...loginForm, email: e.target.value })
                  : setRegisterForm({ ...registerForm, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-xs text-[#FF4D5A] mt-1 pl-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                data-ocid="auth.password.input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`${inputClass} pr-12`}
                value={
                  tab === "login" ? loginForm.password : registerForm.password
                }
                onChange={(e) =>
                  tab === "login"
                    ? setLoginForm({ ...loginForm, password: e.target.value })
                    : setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#cccccc]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-[#FF4D5A] mt-1 pl-1">
                {errors.password}
              </p>
            )}
          </div>

          {tab === "register" && (
            <div>
              <input
                data-ocid="auth.confirm.input"
                type="password"
                placeholder="Confirm Password"
                className={inputClass}
                value={registerForm.confirm}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, confirm: e.target.value })
                }
              />
              {errors.confirm && (
                <p className="text-xs text-[#FF4D5A] mt-1 pl-1">
                  {errors.confirm}
                </p>
              )}
            </div>
          )}

          {tab === "login" && (
            <div className="text-right">
              <button
                type="button"
                className="text-xs text-[#f9a8c9] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            data-ocid="auth.submit_button"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f9a8c9] to-[#f9a8c9] text-[#0d0d0d] font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 ripple-container"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>{tab === "login" ? "Sign In" : "Create Account"}</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#888888] mt-6">
          {tab === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            type="button"
            onClick={() => setTab(tab === "login" ? "register" : "login")}
            className="text-[#f9a8c9] hover:underline font-medium"
          >
            {tab === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
