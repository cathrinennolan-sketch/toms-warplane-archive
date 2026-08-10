"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { createDocument, updateDocument, getDocument, getPhotos, getPersons } from "@/lib/firestore";
import { uploadDocument } from "@/lib/storage";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { ArchiveDocument } from "@/lib/types";

export default function DocumentUploadPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ArchiveDocument["category"]>("Other");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [availablePhotos, setAvailablePhotos] = useState<any[]>([]);
  const [availablePersons, setAvailablePersons] = useState<any[]>([]);
  const [photoSearch, setPhotoSearch] = useState("");
  const [personSearch, setPersonSearch] = useState("");
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [photos, persons] = await Promise.all([getPhotos(), getPersons()]);
        setAvailablePhotos(photos);
        setAvailablePersons(persons);

        if (editId) {
          const docData = await getDocument(editId);
          if (docData) {
            setTitle(docData.title || "");
            setCategory(docData.category || "Other");
            setYear(docData.year?.toString() || "");
            setDescription(docData.description || "");
            setTags(docData.tags || []);
            setSelectedPhotoIds(docData.relatedPhotoIds || []);
            setSelectedPersonIds(docData.relatedPersonIds || []);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data", error);
      }
    };
    fetchInitial();
  }, [editId]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const toggleSelection = (id: string, type: "photo" | "person") => {
    if (type === "photo") {
      if (selectedPhotoIds.includes(id)) setSelectedPhotoIds(selectedPhotoIds.filter(pid => pid !== id));
      else setSelectedPhotoIds([...selectedPhotoIds, id]);
    } else {
      if (selectedPersonIds.includes(id)) setSelectedPersonIds(selectedPersonIds.filter(pid => pid !== id));
      else setSelectedPersonIds([...selectedPersonIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }
    if (!editId && !file) {
      toast.error("PDF file is required");
      return;
    }

    setLoading(true);
    try {
      let fileUrl = undefined;
      
      if (file) {
        fileUrl = await uploadDocument(file, title, (progress) => {
          setUploadProgress(progress);
        });
      }

      const docData: Partial<ArchiveDocument> = {
        title,
        category,
        year: year ? parseInt(year, 10) : undefined,
        description,
        tags,
        relatedPhotoIds: selectedPhotoIds,
        relatedPersonIds: selectedPersonIds,
      };

      if (fileUrl) {
        docData.fileUrl = fileUrl;
      }

      if (editId) {
        await updateDocument(editId, docData);
        toast.success("Document updated successfully");
      } else {
        await createDocument(docData as Omit<ArchiveDocument, "id" | "uploadedAt" | "uploadedBy">);
        toast.success("Document uploaded successfully");
        
        // Reset form
        setFile(null);
        setTitle("");
        setCategory("Other");
        setYear("");
        setDescription("");
        setTags([]);
        setSelectedPhotoIds([]);
        setSelectedPersonIds([]);
        setUploadProgress(0);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "0.95rem" };
  const labelStyle = { display: "block", marginBottom: "0.25rem", fontWeight: 500, fontSize: "0.9rem", color: "var(--text)" };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: "1.5rem" }}>
        {editId ? "Edit Document" : "Upload Document"}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>PDF File</h2>
          <div 
            {...getRootProps()} 
            style={{ 
              border: `2px dashed ${isDragActive ? "var(--navy)" : "var(--border-strong)"}`, 
              borderRadius: "8px", 
              padding: "2rem", 
              textAlign: "center", 
              cursor: "pointer",
              backgroundColor: isDragActive ? "var(--bg-alt)" : "transparent",
              transition: "all 0.2s ease"
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <div>
                <p style={{ color: "var(--navy)", fontWeight: 600, fontSize: "1.1rem" }}>{file.name}</p>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>Click or drag to replace file</p>
              </div>
            ) : (
              <div>
                <p style={{ color: "var(--navy)", fontWeight: 500, margin: "0 0 0.5rem 0" }}>Drag & drop a PDF here, or click to select</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>Only PDF files are supported</p>
              </div>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={{ marginTop: "1rem", height: "4px", backgroundColor: "var(--bg-alt)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", backgroundColor: "var(--navy)", width: `${uploadProgress}%`, transition: "width 0.2s" }} />
            </div>
          )}
        </div>

        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Document Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as any)} style={inputStyle}>
                <option value="Manual">Manual</option>
                <option value="Orders">Orders</option>
                <option value="Certificate">Certificate</option>
                <option value="Map">Map</option>
                <option value="Letter">Letter</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input type="number" value={year} onChange={e => setYear(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Tags</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {tags.map((tag, idx) => (
                  <span key={idx} style={{ backgroundColor: "var(--bg-alt)", padding: "0.25rem 0.5rem", borderRadius: "12px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {tag}
                    <button type="button" onClick={() => removeTag(idx)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>&times;</button>
                  </span>
                ))}
              </div>
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Type tag & press Enter" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Related Content</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            
            <div>
              <label style={labelStyle}>Related Persons</label>
              <input type="text" value={personSearch} onChange={e => setPersonSearch(e.target.value)} placeholder="Search persons..." style={{ ...inputStyle, marginBottom: "0.5rem" }} />
              <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.5rem" }}>
                {availablePersons.filter(p => p.fullName.toLowerCase().includes(personSearch.toLowerCase())).map(person => (
                  <div key={person.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0" }}>
                    <input type="checkbox" id={`person-${person.id}`} checked={selectedPersonIds.includes(person.id)} onChange={() => toggleSelection(person.id, "person")} />
                    <label htmlFor={`person-${person.id}`} style={{ fontSize: "0.9rem", cursor: "pointer" }}>{person.fullName}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Related Photos</label>
              <input type="text" value={photoSearch} onChange={e => setPhotoSearch(e.target.value)} placeholder="Search photos..." style={{ ...inputStyle, marginBottom: "0.5rem" }} />
              <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.5rem" }}>
                {availablePhotos.filter(p => p.title.toLowerCase().includes(photoSearch.toLowerCase())).map(photo => (
                  <div key={photo.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0" }}>
                    <input type="checkbox" id={`photo-${photo.id}`} checked={selectedPhotoIds.includes(photo.id)} onChange={() => toggleSelection(photo.id, "photo")} />
                    <label htmlFor={`photo-${photo.id}`} style={{ fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {photo.thumbnailUrl && <img src={photo.thumbnailUrl} alt="" style={{ width: "24px", height: "24px", objectFit: "cover", borderRadius: "2px" }} />}
                      {photo.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <button type="button" onClick={() => router.push("/admin")} style={{ padding: "0.75rem 1.5rem", backgroundColor: "transparent", border: "1px solid var(--border-strong)", borderRadius: "4px", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--navy)", color: "var(--surface)", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 500 }}>
            {loading ? "Saving..." : editId ? "Update Document" : "Upload Document"}
          </button>
        </div>
      </form>
    </div>
  );
}
