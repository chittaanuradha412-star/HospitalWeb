
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { supabase } from "./supabase";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) throw error;

      setSuccess("Login successful!");

      if (onLogin) {
        await onLogin(data.session);
      }
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) throw error;

      setSuccess("Password reset instructions have been sent if the account is eligible.");
    } catch (err) {
      setError(err.message || "Could not send the reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-background" aria-hidden="true" />

      <div className="login-overlay" aria-hidden="true" />

      <div className="floating-medical medical-one" aria-hidden="true">
        <HeartPulse size={42} />
      </div>

      <div className="floating-medical medical-two" aria-hidden="true">
        <Activity size={36} />
      </div>

      <div className="floating-medical medical-three" aria-hidden="true">
        <ShieldCheck size={38} />
      </div>

      <header className="login-brand">
        <div className="brand-icon">
          <HeartPulse size={35} />
        </div>

        <div>
          <h1>Smart<span>Care</span></h1>
          <p>SMART QUEUE · BETTER CARE</p>
        </div>
      </header>

      <section className="login-content">
        <div className="login-welcome">
          <span className="welcome-label">
            <Activity size={16} />
            SMART HEALTHCARE MANAGEMENT
          </span>

          <h2>
            Better care.
            <br />
            <span>One patient at a time.</span>
          </h2>

          <p>
            Manage patient queues, prioritize emergencies, and
            help your healthcare team deliver care efficiently.
          </p>

          <div className="welcome-features">
            <div>
              <span className="feature-icon">
                <HeartPulse size={21} />
              </span>
              <span>
                <strong>Patient First</strong>
                <small>Care that matters</small>
              </span>
            </div>

            <div>
              <span className="feature-icon">
                <Users size={21} />
              </span>
              <span>
                <strong>Smart Queue</strong>
                <small>Organized patient flow</small>
              </span>
            </div>

            <div>
              <span className="feature-icon">
                <ShieldCheck size={21} />
              </span>
              <span>
                <strong>Secure Access</strong>
                <small>Staff authentication</small>
              </span>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-heading">
            <div className="login-shield">
              <ShieldCheck size={31} />
            </div>

            <h2>Welcome back</h2>
            <p>Sign in to access your staff dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="staff-email">Email address</label>

            <div className="login-input">
              <Mail size={19} />
              <input
                id="staff-email"
                type="email"
                placeholder="Enter your email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label htmlFor="staff-password">Password</label>

            <div className="login-input">
              <LockKeyhole size={19} />
              <input
                id="staff-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-link"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="login-message error-message" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="login-message success-message" role="status">
                {success}
              </div>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "Please wait..." : "Sign In"}</span>
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="login-security">
            <div className="security-line" />
            <span>SECURE STAFF LOGIN</span>
            <div className="security-line" />
          </div>

          <p className="login-footer">
            <LockKeyhole size={14} />
            Your connection is protected by Supabase authentication.
          </p>
        </div>
      </section>

      <footer className="login-bottom">
        <span>© {new Date().getFullYear()} SmartCare</span>
        <span>Healthcare made smarter.</span>
      </footer>
    </main>
  );
}
