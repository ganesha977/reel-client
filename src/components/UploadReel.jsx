import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, CheckCircle, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UploadReel = () => {
  const [caption, setCaption] = useState("");
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const uploadReel = async (e) => {
    e.preventDefault();
    if (!caption || !video) return toast.error("Caption & video required");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("video", video);

    try {
      setUploading(true);
      const res = await axios.post("https://reel-server.onrender.com/api/v1/reel/add", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      toast.success(res.data.message);
      setCaption("");
      setVideo(null);
      setPreview("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-white p-4">
      <form
        onSubmit={uploadReel}
        className="w-full max-w-md p-6 rounded-xl border border-gray-200 shadow-sm bg-white space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-black">
          Upload Reel
        </h2>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-black transition"
          onClick={() => document.getElementById("videoInput").click()}
        >
          {!preview ? (
            <div className="flex flex-col items-center space-y-2 text-gray-500">
              <Upload size={32} />
              <p>Drag & Drop or Click to Select Video</p>
              <input
                id="videoInput"
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <motion.video
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={preview}
              controls
              className="w-full rounded-lg shadow-sm max-h-72 object-cover"
            />
          )}
        </div>

        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
        />

        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="bg-black h-full"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Uploading...
            </>
          ) : (
            "Upload Reel"
          )}
        </button>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-2 justify-center text-green-600 font-semibold"
            >
              <CheckCircle className="w-5 h-5" /> Upload Successful!
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default UploadReel;
