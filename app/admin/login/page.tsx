"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, onAuthStateChanged, isUserAdmin } from "@/lib/auth";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Automatically proceed to admin area where AdminGuard validates access
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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "85vh", backgroundColor: "var(--bg)", padding: "1.5rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: "480px", padding: "3rem 2.5rem", backgroundColor: "#FFFFFF", borderRadius: "10px", boxShadow: "0 6px 20px rgba(0,0,0,0.05)", border: "1px solid #D2D7E0" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#5C6470", marginBottom: "8px" }}>
            MANAGEMENT CONSOLE
          </p>
          <h1 style={{ fontFamily: "var(--font-heading)", color: "#121417", margin: "0 0 0.5rem 0", fontSize: "1.85rem", fontWeight: 700 }}>
            Tom&apos;s Warplane Archive
          </h1>
          <h2 style={{ fontFamily: "var(--font-body)", color: "#5C6470", fontSize: "0.95rem", margin: 0, fontWeight: 500 }}>
            Administrator Login
          </h2>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="form-label" style={{ fontWeight: 600, color: "#121417", fontSize: "0.85rem" }}>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="admin@example.com"
              style={{ padding: "0.75rem 1rem", border: "1px solid #C4CBD6", borderRadius: "6px", fontSize: "0.95rem", outline: "none" }}
            />
          </div>
          <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="form-label" style={{ fontWeight: 600, color: "#121417", fontSize: "0.85rem" }}>Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••••••"
              style={{ padding: "0.75rem 1rem", border: "1px solid #C4CBD6", borderRadius: "6px", fontSize: "0.95rem", outline: "none" }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ padding: "0.85rem", backgroundColor: "#121417", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "0.95rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: "0.5rem" }}
          >
            {loading ? "Signing in..." : "Sign In to Admin Panel"}
          </button>
        </form>
        
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button 
            type="button" 
            onClick={handleResetPassword}
            style={{ background: "none", border: "none", color: "#4F5866", cursor: "pointer", textDecoration: "underline", fontSize: "0.85rem", fontWeight: 500 }}
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
