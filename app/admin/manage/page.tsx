"use client";
import React, { useState, useEffect } from "react";
import { getPhotos, getPersons, getDocuments, deletePhoto, deletePerson, deleteDocument } from "@/lib/firestore";
import { Photo, Person, ArchiveDocument } from "@/lib/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ManageContentPage() {
  const [activeTab, setActiveTab] = useState<"Photos" | "Persons" | "Documents">("Photos");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedPhotos, fetchedPersons, fetchedDocs] = await Promise.all([
        getPhotos(),
        getPersons(),
        getDocuments()
      ]);
      setPhotos(fetchedPhotos);
      setPersons(fetchedPersons);
      setDocuments(fetchedDocs);
    } catch (error) {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: "Photo" | "Person" | "Document") => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      if (type === "Photo") {
        await deletePhoto(id);
        setPhotos(photos.filter(p => p.id !== id));
      } else if (type === "Person") {
        await deletePerson(id);
        setPersons(persons.filter(p => p.id !== id));
      } else {
        await deleteDocument(id);
        setDocuments(documents.filter(d => d.id !== id));
      }
      toast.success(`${type} deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const handleEdit = (id: string, type: "Photo" | "Person" | "Document") => {
    if (type === "Photo") router.push(`/admin/upload/photo?edit=${id}`);
    else if (type === "Person") router.push(`/admin/upload/person?edit=${id}`);
    else router.push(`/admin/upload/document?edit=${id}`);
  };

  const tabStyle = (isActive: boolean) => ({
    padding: "0.75rem 1.5rem",
    backgroundColor: isActive ? "var(--surface)" : "transparent",
    border: "none",
    borderBottom: isActive ? "2px solid var(--navy)" : "2px solid transparent",
    color: isActive ? "var(--navy)" : "var(--text-muted)",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "1rem"
  });

  const btnStyle = { padding: "0.25rem 0.75rem", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "0.85rem" };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: "1.5rem" }}>Manage Content</h1>

      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
        <button style={tabStyle(activeTab === "Photos")} onClick={() => setActiveTab("Photos")}>Photos</button>
        <button style={tabStyle(activeTab === "Persons")} onClick={() => setActiveTab("Persons")}>Persons</button>
        <button style={tabStyle(activeTab === "Documents")} onClick={() => setActiveTab("Documents")}>Documents</button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input 
          type="text" 
          placeholder={`Search ${activeTab}...`} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", maxWidth: "400px", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "4px" }}
        />
      </div>

      {loading ? (
        <p>Loading content...</p>
      ) : (
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "var(--bg-alt)", borderBottom: "1px solid var(--border)" }}>
              {activeTab === "Photos" && (
                <tr>
                  <th style={{ padding: "1rem" }}>Title</th>
                  <th style={{ padding: "1rem" }}>Year</th>
                  <th style={{ padding: "1rem" }}>Unit</th>
                  <th style={{ padding: "1rem" }}>Date</th>
                  <th style={{ padding: "1rem" }}>Actions</th>
                </tr>
              )}
              {activeTab === "Persons" && (
                <tr>
                  <th style={{ padding: "1rem" }}>Name</th>
                  <th style={{ padding: "1rem" }}>Rank</th>
                  <th style={{ padding: "1rem" }}>Unit</th>
                  <th style={{ padding: "1rem" }}>Date</th>
                  <th style={{ padding: "1rem" }}>Actions</th>
                </tr>
              )}
              {activeTab === "Documents" && (
                <tr>
                  <th style={{ padding: "1rem" }}>Title</th>
                  <th style={{ padding: "1rem" }}>Category</th>
                  <th style={{ padding: "1rem" }}>Year</th>
                  <th style={{ padding: "1rem" }}>Date</th>
                  <th style={{ padding: "1rem" }}>Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
              {activeTab === "Photos" && photos.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(photo => (
                <tr key={photo.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem" }}>{photo.title}</td>
                  <td style={{ padding: "1rem" }}>{photo.year || "-"}</td>
                  <td style={{ padding: "1rem" }}>{photo.unit || "-"}</td>
                  <td style={{ padding: "1rem" }}>{photo.uploadedAt?.toDate?.().toLocaleDateString() || "-"}</td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => handleEdit(photo.id, "Photo")} style={{ ...btnStyle, backgroundColor: "var(--bg-alt)", color: "var(--navy)" }}>Edit</button>
                      <button onClick={() => handleDelete(photo.id, "Photo")} style={{ ...btnStyle, backgroundColor: "#fee2e2", color: "#b91c1c" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {activeTab === "Persons" && persons.filter(p => p.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map(person => (
                <tr key={person.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem" }}>{person.fullName}</td>
                  <td style={{ padding: "1rem" }}>{person.rank || "-"}</td>
                  <td style={{ padding: "1rem" }}>{person.unit || "-"}</td>
                  <td style={{ padding: "1rem" }}>{person.uploadedAt?.toDate?.().toLocaleDateString() || "-"}</td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => handleEdit(person.id, "Person")} style={{ ...btnStyle, backgroundColor: "var(--bg-alt)", color: "var(--navy)" }}>Edit</button>
                      <button onClick={() => handleDelete(person.id, "Person")} style={{ ...btnStyle, backgroundColor: "#fee2e2", color: "#b91c1c" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === "Documents" && documents.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase())).map(doc => (
                <tr key={doc.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem" }}>{doc.title}</td>
                  <td style={{ padding: "1rem" }}>{doc.category}</td>
                  <td style={{ padding: "1rem" }}>{doc.year || "-"}</td>
                  <td style={{ padding: "1rem" }}>{doc.uploadedAt?.toDate?.().toLocaleDateString() || "-"}</td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => handleEdit(doc.id, "Document")} style={{ ...btnStyle, backgroundColor: "var(--bg-alt)", color: "var(--navy)" }}>Edit</button>
                      <button onClick={() => handleDelete(doc.id, "Document")} style={{ ...btnStyle, backgroundColor: "#fee2e2", color: "#b91c1c" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
