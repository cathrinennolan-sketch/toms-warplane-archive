"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getPhotos, getPersons, getDocuments, getAllAdmins } from "@/lib/firestore";
import { Photo, Person, ArchiveDocument, Admin } from "@/lib/types";
import { auth } from "@/lib/firebase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ photos: 0, persons: 0, documents: 0, admins: 0 });
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photos, persons, docs, admins] = await Promise.all([
          getPhotos(),
          getPersons(),
          getDocuments(),
          getAllAdmins()
        ]);
        
        setStats({
          photos: photos.length,
          persons: persons.length,
          documents: docs.length,
          admins: admins.length
        });

        // Combine and sort by date for recent
        const allItems = [
          ...photos.map(p => ({ id: p.id, title: p.title, type: "Photo", date: p.uploadedAt?.toDate?.() || new Date() })),
          ...persons.map(p => ({ id: p.id, title: p.fullName, type: "Person", date: p.uploadedAt?.toDate?.() || new Date() })),
          ...docs.map(d => ({ id: d.id, title: d.title, type: "Document", date: d.uploadedAt?.toDate?.() || new Date() }))
        ];

        allItems.sort((a, b) => b.date.getTime() - a.date.getTime());
        setRecentUploads(allItems.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardStyle = {
    padding: "1.5rem",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem"
  };

  const btnStyle = {
    padding: "0.75rem 1.5rem",
    backgroundColor: "var(--navy)",
    color: "var(--surface)",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: 500,
    textAlign: "center" as const
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: "0.5rem" }}>Dashboard</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Welcome, {auth.currentUser?.email || "Administrator"}
      </p>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
            <div style={cardStyle}>
              <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0, fontWeight: 500 }}>Total Photos</h3>
              <p style={{ fontSize: "2rem", color: "var(--navy)", margin: 0, fontWeight: 600 }}>{stats.photos}</p>
            </div>
            <div style={cardStyle}>
              <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0, fontWeight: 500 }}>Total Persons</h3>
              <p style={{ fontSize: "2rem", color: "var(--navy)", margin: 0, fontWeight: 600 }}>{stats.persons}</p>
            </div>
            <div style={cardStyle}>
              <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0, fontWeight: 500 }}>Total Documents</h3>
              <p style={{ fontSize: "2rem", color: "var(--navy)", margin: 0, fontWeight: 600 }}>{stats.documents}</p>
            </div>
            <div style={cardStyle}>
              <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0, fontWeight: 500 }}>Total Admins</h3>
              <p style={{ fontSize: "2rem", color: "var(--navy)", margin: 0, fontWeight: 600 }}>{stats.admins}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: "1rem" }}>Quick Actions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Link href="/admin/upload/photo" style={btnStyle}>Upload Photo</Link>
                <Link href="/admin/upload/person" style={btnStyle}>Upload Person</Link>
                <Link href="/admin/upload/document" style={btnStyle}>Upload Document</Link>
                <Link href="/admin/manage" style={{ ...btnStyle, backgroundColor: "var(--surface)", color: "var(--navy)", border: "1px solid var(--navy)" }}>Manage Content</Link>
              </div>
            </div>

            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: "1rem" }}>Recent Uploads</h2>
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead style={{ backgroundColor: "var(--bg-alt)", borderBottom: "1px solid var(--border)" }}>
                    <tr>
                      <th style={{ padding: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>Title / Name</th>
                      <th style={{ padding: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>Type</th>
                      <th style={{ padding: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUploads.length > 0 ? recentUploads.map((item, idx) => (
                      <tr key={`${item.id}-${idx}`} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "1rem", fontWeight: 500, color: "var(--text)" }}>{item.title}</td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{ padding: "0.25rem 0.5rem", borderRadius: "12px", fontSize: "0.8rem", backgroundColor: "var(--bg-alt)", color: "var(--navy)" }}>
                            {item.type}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>{item.date.toLocaleDateString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No recent uploads found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
