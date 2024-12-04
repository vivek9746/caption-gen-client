import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "./CaptionGenerator.module.css";
import LoadingDots from "../LoadingDots/LoadingDots";
import GeneratedCaption from "../GeneratedCaption/GeneratedCaption";

const CaptionGenerator = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState("");
  const [regenerate, setRegenerate] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [theme, setTheme] = useState("Funny"); // Default theme
  const fileInputRef = useRef(null);

  const themes = [
    "Romantic",
    "Inspiring",
    "Spiritual",
    "Motivational",
    "Humorous",
    "Educational",
    "Informative",
    "Emotional",
    "Travel",
    "Food",
    "Fitness",
    "Fashion",
    "Lifestyle",
    "Business",
    "Technology",
    "Health",
    "Entertainment",
    "News",
    "Personal",
    "Adventure",
  ];

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setSelectedImage(event.dataTransfer.files[0]);
  };

  const handleFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleGenerateCaption = useCallback(async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("theme", theme);
      formData.append("context", context);
      formData.append("regenerate", regenerate);
      const response = await axios.post(
        "http://localhost:3000/generate-caption",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCaption(response.data);
      setRegenerate(false);
      setLoading(false);
    } catch (error) {
      console.error("Error generating caption:", error);
    }
  }, [selectedImage, theme, regenerate, context]);

  const handleRegenerate = () => {
    setCaption(""); // Clear the caption to allow regeneration
    setRegenerate(() => true);
  };

  useEffect(() => {
    if (regenerate) {
      // Call the next function here
      handleGenerateCaption();
    }
  }, [regenerate, handleGenerateCaption]);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopySuccess(true)
    setTimeout(() => {
        setCopySuccess(false);
    }, 3000)
  };

  return (
    <div className="app-container">
      <div className={styles.wrapper}>
        <div className={styles.captionAppWapper}>
            <h1>Instagram Caption Generator</h1>
          <div className={styles.imageDropAreaWrapper}>
            <div
              className={styles.imageDropArea}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()} // Simulate click on hidden file input
            >
              {selectedImage ? (
                <img
                  className="selected-image"
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                />
              ) : (
                <p>Drag and drop an image here, or click to select one</p>
              )}
              <input
                type="file"
                accept={["image/png", "image/jpeg"]}
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }} // Hide the default file input
              />
            </div>
            <div className={styles.actionWrapper}>
            <p>Select theme:</p>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                {themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
              <div className={styles.innerActionWrapper}>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Tell us a little bit about this picture to set the context (optional)"
                />
                <button
                  className={styles.generateCaptionButton}
                  onClick={handleGenerateCaption}
                >
                  Generate Caption ⊹₊⟡⋆
                </button>
              </div>
            </div>
          </div>
          <div className={styles.captionAreaWrapper}>
            <div className={styles.captionArea}>
              {!loading ? (
                <div className="caption-container">
                  <p><GeneratedCaption caption={caption || ''} /></p>
                  {caption ? (
                    <div className={styles.captionActionButtons}>
                      <button onClick={handleRegenerate}>Regenerate</button>
                      <button onClick={handleCopyCaption}>{`${copySuccess ? 'Copied': 'Copy'}`}</button>
                    </div>
                  ) : (
                    "Generated Caption"
                  )}
                </div>
              ) : (
                <LoadingDots />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionGenerator;
