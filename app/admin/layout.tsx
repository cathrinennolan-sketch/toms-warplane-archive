"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminGuard } from "@/components/AdminGuard";
import { signOutUser } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/admin/login");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <AdminGuard>
      <div className="admin-layout" style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)", fontFamily: "'Inter', sans-serif" }}>
        <aside className="admin-sidebar" style={{ width: "240px", backgroundColor: "var(--navy)", color: "var(--surface)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "2rem 1rem", borderBottom: "1px solid var(--navy-dark)" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", margin: 0, fontSize: "1.2rem", color: "var(--gold)" }}>Tom's Warplane Archive</h2>
            </Link>
            <p style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "0.5rem" }}>Admin Panel</p>
          </div>
          <nav style={{ flex: 1, padding: "1rem 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <Link href="/admin" className="admin-nav-item" style={{ display: "block", padding: "0.75rem 1.5rem", color: "var(--surface)", textDecoration: "none", backgroundColor: pathname === "/admin" ? "var(--navy-dark)" : "transparent", transition: "background-color 0.2s ease" }}>Dashboard</Link>
            <Link href="/admin/upload/photo" className="admin-nav-item" style={{ display: "block", padding: "0.75rem 1.5rem", color: "var(--surface)", textDecoration: "none", backgroundColor: pathname === "/admin/upload/photo" ? "var(--navy-dark)" : "transparent", transition: "background-color 0.2s ease" }}>Upload Photo</Link>
            <Link href="/admin/upload/person" className="admin-nav-item" style={{ display: "block", padding: "0.75rem 1.5rem", color: "var(--surface)", textDecoration: "none", backgroundColor: pathname === "/admin/upload/person" ? "var(--navy-dark)" : "transparent", transition: "background-color 0.2s ease" }}>Upload Person</Link>
            <Link href="/admin/upload/document" className="admin-nav-item" style={{ display: "block", padding: "0.75rem 1.5rem", color: "var(--surface)", textDecoration: "none", backgroundColor: pathname === "/admin/upload/document" ? "var(--navy-dark)" : "transparent", transition: "background-color 0.2s ease" }}>Upload Document</Link>
            <Link href="/admin/manage" className="admin-nav-item" style={{ display: "block", padding: "0.75rem 1.5rem", color: "var(--surface)", textDecoration: "none", backgroundColor: pathname.startsWith("/admin/manage") ? "var(--navy-dark)" : "transparent", transition: "background-color 0.2s ease" }}>Manage Content</Link>
            <Link href="/admin/users" className="admin-nav-item" style={{ display: "block", padding: "0.75rem 1.5rem", color: "var(--surface)", textDecoration: "none", backgroundColor: pathname === "/admin/users" ? "var(--navy-dark)" : "transparent", transition: "background-color 0.2s ease" }}>Manage Users</Link>
          </nav>
          <div style={{ padding: "1rem" }}>
            <button onClick={handleSignOut} style={{ width: "100%", padding: "0.75rem", backgroundColor: "transparent", border: "1px solid var(--border-strong)", color: "var(--surface)", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s ease" }}>Sign Out</button>
          </div>
        </aside>
        <main className="admin-main" style={{ flex: 1, padding: "2rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
