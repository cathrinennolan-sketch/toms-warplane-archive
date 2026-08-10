"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/admin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "var(--bg)", padding: "1rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: "500px", padding: "3rem 2rem", backgroundColor: "var(--surface)", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", textAlign: "center", color: "var(--navy)", margin: "0 0 0.5rem 0", fontSize: "2rem" }}>Tom's Warplane Archive</h1>
        <h2 style={{ fontFamily: "'Inter', sans-serif", textAlign: "center", color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "2.5rem", fontWeight: 400 }}>Administrator Login</h2>
        
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="form-label" style={{ fontWeight: 500, color: "var(--text)", fontSize: "0.95rem" }}>Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "1rem", outline: "none", transition: "border-color 0.2s ease" }}
            />
          </div>
          <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="form-label" style={{ fontWeight: 500, color: "var(--text)", fontSize: "0.95rem" }}>Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "1rem", outline: "none", transition: "border-color 0.2s ease" }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ padding: "0.875rem", backgroundColor: "var(--navy)", color: "var(--surface)", border: "none", borderRadius: "4px", fontSize: "1rem", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", marginTop: "1rem", transition: "background-color 0.2s ease" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button 
            type="button" 
            onClick={handleResetPassword}
            style={{ background: "none", border: "none", color: "var(--navy)", cursor: "pointer", textDecoration: "underline", fontSize: "0.9rem" }}
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
