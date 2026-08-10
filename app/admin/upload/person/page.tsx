"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { createPerson, updatePerson, getPerson, getPhotos, getDocuments } from "@/lib/firestore";
import { uploadPortraitPhoto } from "@/lib/storage";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { Person } from "@/lib/types";

export default function PersonUploadPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [fullName, setFullName] = useState("");
  const [rank, setRank] = useState("");
  const [branch, setBranch] = useState("");
  const [unit, setUnit] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [biography, setBiography] = useState("");
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [availablePhotos, setAvailablePhotos] = useState<any[]>([]);
  const [availableDocs, setAvailableDocs] = useState<any[]>([]);
  const [photoSearch, setPhotoSearch] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [photos, docs] = await Promise.all([getPhotos(), getDocuments()]);
        setAvailablePhotos(photos);
        setAvailableDocs(docs);

        if (editId) {
          const personData = await getPerson(editId);
          if (personData) {
            setFullName(personData.fullName || "");
            setRank(personData.rank || "");
            setBranch(personData.branch || "");
            setUnit(personData.unit || "");
            setBirthYear(personData.birthYear?.toString() || "");
            setDeathYear(personData.deathYear?.toString() || "");
            setBiography(personData.biography || "");
            setTags(personData.tags || []);
            setSelectedPhotoIds(personData.relatedPhotoIds || []);
            setSelectedDocIds(personData.relatedDocIds || []);
            if (personData.portraitUrl) setPreview(personData.portraitUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchInitial();
  }, [editId]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
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

  const toggleSelection = (id: string, type: "photo" | "doc") => {
    if (type === "photo") {
      if (selectedPhotoIds.includes(id)) setSelectedPhotoIds(selectedPhotoIds.filter(pid => pid !== id));
      else setSelectedPhotoIds([...selectedPhotoIds, id]);
    } else {
      if (selectedDocIds.includes(id)) setSelectedDocIds(selectedDocIds.filter(did => did !== id));
      else setSelectedDocIds([...selectedDocIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      toast.error("Full Name is required");
      return;
    }

    setLoading(true);
    try {
      let portraitUrl = preview && !file ? preview : undefined;
      
      if (file) {
        const url = await uploadPortraitPhoto(file, fullName, (progress) => {
          setUploadProgress(progress);
        });
        portraitUrl = url;
      }

      const personData: Partial<Person> = {
        fullName,
        rank,
        branch,
        unit,
        birthYear: birthYear ? parseInt(birthYear, 10) : undefined,
        deathYear: deathYear ? parseInt(deathYear, 10) : undefined,
        biography,
        tags,
        relatedPhotoIds: selectedPhotoIds,
        relatedDocIds: selectedDocIds,
      };

      if (portraitUrl) {
        personData.portraitUrl = portraitUrl;
      }

      if (editId) {
        await updatePerson(editId, personData);
        toast.success("Person profile updated");
      } else {
        await createPerson(personData as Omit<Person, "id" | "uploadedAt" | "uploadedBy">);
        toast.success("Person profile created");
        
        // Reset form
        setFile(null);
        setPreview("");
        setFullName("");
        setRank("");
        setBranch("");
        setUnit("");
        setBirthYear("");
        setDeathYear("");
        setBiography("");
        setTags([]);
        setSelectedPhotoIds([]);
        setSelectedDocIds([]);
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
        {editId ? "Edit Person Profile" : "Create Person Profile"}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Portrait Photo (Optional)</h2>
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
            {preview ? (
              <div>
                <img src={preview} alt="Preview" style={{ maxHeight: "150px", maxWidth: "150px", borderRadius: "50%", objectFit: "cover", marginBottom: "1rem" }} />
                <p style={{ color: "var(--text-muted)", margin: 0 }}>Click or drag to replace photo</p>
              </div>
            ) : (
              <div>
                <p style={{ color: "var(--navy)", fontWeight: 500, margin: "0 0 0.5rem 0" }}>Drag & drop a portrait here, or click to select</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>Supports JPG, JPEG, PNG</p>
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
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Personal Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Rank</label>
              <input type="text" value={rank} onChange={e => setRank(e.target.value)} style={inputStyle} placeholder="e.g. Captain" />
            </div>
            <div>
              <label style={labelStyle}>Branch</label>
              <input type="text" value={branch} onChange={e => setBranch(e.target.value)} style={inputStyle} placeholder="e.g. USAAF" />
            </div>
            <div>
              <label style={labelStyle}>Unit</label>
              <input type="text" value={unit} onChange={e => setUnit(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Birth Year</label>
              <input type="number" value={birthYear} onChange={e => setBirthYear(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Death Year</label>
              <input type="number" value={deathYear} onChange={e => setDeathYear(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Biography & Tags</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Biography (Markdown supported)</label>
              <textarea value={biography} onChange={e => setBiography(e.target.value)} style={{ ...inputStyle, minHeight: "150px", resize: "vertical" }} />
            </div>
            <div>
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

            <div>
              <label style={labelStyle}>Related Documents</label>
              <input type="text" value={docSearch} onChange={e => setDocSearch(e.target.value)} placeholder="Search documents..." style={{ ...inputStyle, marginBottom: "0.5rem" }} />
              <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.5rem" }}>
                {availableDocs.filter(d => d.title.toLowerCase().includes(docSearch.toLowerCase())).map(doc => (
                  <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0" }}>
                    <input type="checkbox" id={`doc-${doc.id}`} checked={selectedDocIds.includes(doc.id)} onChange={() => toggleSelection(doc.id, "doc")} />
                    <label htmlFor={`doc-${doc.id}`} style={{ fontSize: "0.9rem", cursor: "pointer" }}>{doc.title}</label>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <button type="button" onClick={() => router.push("/admin")} style={{ padding: "0.75rem 1.5rem", backgroundColor: "transparent", border: "1px solid var(--border-strong)", borderRadius: "4px", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--navy)", color: "var(--surface)", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 500 }}>
            {loading ? "Saving..." : editId ? "Update Person" : "Create Person"}
          </button>
        </div>
      </form>
    </div>
  );
}
