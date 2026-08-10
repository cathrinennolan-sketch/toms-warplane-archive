"use client";
import React, { useState, useEffect } from "react";
import { getAllAdmins, deactivateAdmin, reactivateAdmin, createAdminRecord } from "@/lib/firestore";
import { Admin } from "@/lib/types";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "super_admin">("admin");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAllAdmins();
      setAdmins(data);
    } catch (error) {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    setInviting(true);
    try {
      // NOTE: We assume the current user is a super_admin. In a real app we'd verify server-side.
      await createAdminRecord({
        email: inviteEmail,
        displayName: inviteName,
        role: inviteRole,
        active: true
      });
      toast.success("Admin invited successfully!");
      setInviteEmail("");
      setInviteName("");
      setInviteRole("admin");
      fetchAdmins();
    } catch (error: any) {
      toast.error(error.message || "Failed to invite admin");
    } finally {
      setInviting(false);
    }
  };

  const handleToggleStatus = async (admin: Admin) => {
    try {
      if (admin.active) {
        // Prevent deactivating oneself in a real app, but simplified here
        await deactivateAdmin(admin.uid);
        toast.success("Admin deactivated");
      } else {
        await reactivateAdmin(admin.uid);
        toast.success("Admin reactivated");
      }
      fetchAdmins();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const inputStyle = { width: "100%", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "0.95rem" };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: "0.5rem" }}>Manage Users</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>User management is restricted to Super Administrators.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", maxWidth: "1200px" }}>
        
        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Invite New Administrator</h2>
          <form onSubmit={handleInvite} style={{ display: "flex", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: 500 }}>Email Address</label>
              <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: 500 }}>Display Name</label>
              <input type="text" value={inviteName} onChange={e => setInviteName(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: 500 }}>Role</label>
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value as any)} style={inputStyle}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <button type="submit" disabled={inviting} style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--navy)", color: "var(--surface)", border: "none", borderRadius: "4px", fontWeight: 500, cursor: inviting ? "not-allowed" : "pointer" }}>
              {inviting ? "Inviting..." : "Send Invite"}
            </button>
          </form>
          <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "var(--bg-alt)", borderRadius: "4px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            <strong>Note:</strong> The invited person should go to <code>/admin/login</code> and use the "Forgot password?" link with their email to set their initial password and log in.
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Administrators</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div style={{ backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead style={{ backgroundColor: "var(--bg-alt)", borderBottom: "1px solid var(--border)" }}>
                  <tr>
                    <th style={{ padding: "1rem" }}>Name</th>
                    <th style={{ padding: "1rem" }}>Email</th>
                    <th style={{ padding: "1rem" }}>Role</th>
                    <th style={{ padding: "1rem" }}>Status</th>
                    <th style={{ padding: "1rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.uid} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "1rem", fontWeight: 500 }}>{admin.displayName}</td>
                      <td style={{ padding: "1rem" }}>{admin.email}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ 
                          padding: "0.25rem 0.5rem", 
                          borderRadius: "12px", 
                          fontSize: "0.8rem", 
                          backgroundColor: admin.role === 'super_admin' ? "var(--gold-light)" : "var(--navy-light)",
                          color: admin.role === 'super_admin' ? "var(--gold)" : "var(--navy)",
                          fontWeight: 500
                        }}>
                          {admin.role === 'super_admin' ? "Super Admin" : "Admin"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ 
                          padding: "0.25rem 0.5rem", 
                          borderRadius: "12px", 
                          fontSize: "0.8rem", 
                          backgroundColor: admin.active ? "#dcfce7" : "#fee2e2",
                          color: admin.active ? "#166534" : "#991b1b",
                          fontWeight: 500
                        }}>
                          {admin.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <button 
                          onClick={() => handleToggleStatus(admin)}
                          style={{ 
                            padding: "0.25rem 0.75rem", 
                            borderRadius: "4px", 
                            border: "none", 
                            cursor: "pointer", 
                            fontSize: "0.85rem",
                            backgroundColor: admin.active ? "#fee2e2" : "#dcfce7",
                            color: admin.active ? "#991b1b" : "#166534",
                          }}
                        >
                          {admin.active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No administrators found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
