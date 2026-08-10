"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { createPhoto, updatePhoto, getPhoto, getPersons } from "@/lib/firestore";
import { uploadPhotoImage } from "@/lib/storage";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";

export default function PhotoUploadPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [dateApprox, setDateApprox] = useState("");
  const [unit, setUnit] = useState("");
  const [planeType, setPlaneType] = useState("");
  const [planeSerial, setPlaneSerial] = useState("");
  const [pilotName, setPilotName] = useState("");
  const [photographer, setPhotographer] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  
  const [peopleInPhoto, setPeopleInPhoto] = useState<string[]>([]);
  const [peopleInput, setPeopleInput] = useState("");
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [availablePersons, setAvailablePersons] = useState<any[]>([]);
  const [personSearch, setPersonSearch] = useState("");
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const persons = await getPersons();
        setAvailablePersons(persons);

        if (editId) {
          const photoData = await getPhoto(editId);
          if (photoData) {
            setTitle(photoData.title || "");
            setYear(photoData.year?.toString() || "");
            setDateApprox(photoData.dateApprox || "");
            setUnit(photoData.unit || "");
            setPlaneType(photoData.planeType || "");
            setPlaneSerial(photoData.planeSerial || "");
            setPilotName(photoData.pilotName || "");
            setPhotographer(photoData.photographer || "");
            setSource(photoData.source || "");
            setDescription(photoData.description || "");
            setPeopleInPhoto(photoData.peopleInPhoto || []);
            setTags(photoData.tags || []);
            setSelectedPersonIds(photoData.personIds || []);
            if (photoData.imageUrl) setPreview(photoData.imageUrl);
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

  const handleAddTag = (e: React.KeyboardEvent, type: "tag" | "person") => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "tag" && tagInput.trim()) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      } else if (type === "person" && peopleInput.trim()) {
        setPeopleInPhoto([...peopleInPhoto, peopleInput.trim()]);
        setPeopleInput("");
      }
    }
  };

  const removeTag = (idx: number, type: "tag" | "person") => {
    if (type === "tag") {
      setTags(tags.filter((_, i) => i !== idx));
    } else {
      setPeopleInPhoto(peopleInPhoto.filter((_, i) => i !== idx));
    }
  };

  const togglePersonLink = (personId: string) => {
    if (selectedPersonIds.includes(personId)) {
      setSelectedPersonIds(selectedPersonIds.filter(id => id !== personId));
    } else {
      setSelectedPersonIds([...selectedPersonIds, personId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }
    if (!editId && !file) {
      toast.error("Image file is required");
      return;
    }

    setLoading(true);
    try {
      let imageUrls = null;
      if (file) {
        imageUrls = await uploadPhotoImage(file, title, (progress) => {
          setUploadProgress(progress);
        });
      }

      const photoData: Partial<Photo> = {
        title,
        year: year ? parseInt(year, 10) : undefined,
        dateApprox,
        unit,
        planeType,
        planeSerial,
        pilotName,
        photographer,
        source,
        description,
        peopleInPhoto,
        tags,
        personIds: selectedPersonIds,
      };

      if (imageUrls) {
        photoData.imageUrl = imageUrls.url;
        photoData.imageCleanUrl = imageUrls.url; // Simplified for now
        photoData.thumbnailUrl = imageUrls.url; // Simplified
      }

      if (editId) {
        await updatePhoto(editId, photoData);
        toast.success("Photo updated successfully");
      } else {
        await createPhoto(photoData as Omit<Photo, "id" | "uploadedAt" | "uploadedBy" | "downloadCount">);
        toast.success("Photo uploaded successfully");
        
        // Reset form
        setFile(null);
        setPreview("");
        setTitle("");
        setYear("");
        setDateApprox("");
        setUnit("");
        setPlaneType("");
        setPlaneSerial("");
        setPilotName("");
        setPhotographer("");
        setSource("");
        setDescription("");
        setPeopleInPhoto([]);
        setTags([]);
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
        {editId ? "Edit Photo" : "Upload Photo"}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Image File</h2>
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
                <img src={preview} alt="Preview" style={{ maxHeight: "200px", maxWidth: "100%", objectFit: "contain", marginBottom: "1rem" }} />
                <p style={{ color: "var(--text-muted)", margin: 0 }}>Click or drag to replace image</p>
              </div>
            ) : (
              <div>
                <p style={{ color: "var(--navy)", fontWeight: 500, margin: "0 0 0.5rem 0" }}>Drag & drop an image here, or click to select</p>
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
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Basic Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Year (1930-1960)</label>
              <input type="number" min="1930" max="1960" value={year} onChange={e => setYear(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Approximate Date (e.g., Summer 1944)</label>
              <input type="text" value={dateApprox} onChange={e => setDateApprox(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Unit</label>
              <input type="text" value={unit} onChange={e => setUnit(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Aircraft & Crew Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Plane Type</label>
              <input type="text" value={planeType} onChange={e => setPlaneType(e.target.value)} style={inputStyle} placeholder="e.g. B-17G Flying Fortress" />
            </div>
            <div>
              <label style={labelStyle}>Plane Serial</label>
              <input type="text" value={planeSerial} onChange={e => setPlaneSerial(e.target.value)} style={{ ...inputStyle, fontFamily: "'Source Code Pro', monospace" }} />
            </div>
            <div>
              <label style={labelStyle}>Pilot Name</label>
              <input type="text" value={pilotName} onChange={e => setPilotName(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Context & Description</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Photographer</label>
                <input type="text" value={photographer} onChange={e => setPhotographer(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Source / Credits</label>
                <input type="text" value={source} onChange={e => setSource(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--navy)" }}>Metadata & Linking</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            
            <div>
              <label style={labelStyle}>People in Photo (Text Tags)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {peopleInPhoto.map((person, idx) => (
                  <span key={idx} style={{ backgroundColor: "var(--bg-alt)", padding: "0.25rem 0.5rem", borderRadius: "12px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {person}
                    <button type="button" onClick={() => removeTag(idx, "person")} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>&times;</button>
                  </span>
                ))}
              </div>
              <input type="text" value={peopleInput} onChange={e => setPeopleInput(e.target.value)} onKeyDown={e => handleAddTag(e, "person")} placeholder="Type name & press Enter" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Tags</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {tags.map((tag, idx) => (
                  <span key={idx} style={{ backgroundColor: "var(--bg-alt)", padding: "0.25rem 0.5rem", borderRadius: "12px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {tag}
                    <button type="button" onClick={() => removeTag(idx, "tag")} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>&times;</button>
                  </span>
                ))}
              </div>
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => handleAddTag(e, "tag")} placeholder="Type tag & press Enter" style={inputStyle} />
            </div>
            
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Link to Person Profiles</label>
              <input type="text" value={personSearch} onChange={e => setPersonSearch(e.target.value)} placeholder="Search persons..." style={{ ...inputStyle, marginBottom: "0.5rem" }} />
              
              <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.5rem" }}>
                {availablePersons.filter(p => p.fullName.toLowerCase().includes(personSearch.toLowerCase())).map(person => (
                  <div key={person.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0" }}>
                    <input type="checkbox" id={`person-${person.id}`} checked={selectedPersonIds.includes(person.id)} onChange={() => togglePersonLink(person.id)} />
                    <label htmlFor={`person-${person.id}`} style={{ fontSize: "0.9rem", cursor: "pointer" }}>{person.fullName}</label>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <button type="button" onClick={() => router.push("/admin")} style={{ padding: "0.75rem 1.5rem", backgroundColor: "transparent", border: "1px solid var(--border-strong)", borderRadius: "4px", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--navy)", color: "var(--surface)", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 500 }}>
            {loading ? "Saving..." : editId ? "Update Photo" : "Upload Photo"}
          </button>
        </div>
      </form>
    </div>
  );
}
