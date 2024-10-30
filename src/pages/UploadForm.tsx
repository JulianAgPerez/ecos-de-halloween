import React, { useState } from "react";
import { uploadStoryWithBody } from "../services/UploadFileService";

declare global {
  interface Window {
    cloudinary: any;
  }
}

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleCloudinaryUpload = async () => {
    const cloudinaryWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "diauphrb6",
        uploadPreset: "main_upload",
      },
      (_error: any, result: any) => {
        if (result.event === "success") {
          setImageUrl(result.info.secure_url);
        }
      }
    );
    cloudinaryWidget.open();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !title) return;
    try {
      await uploadStoryWithBody(title, description, imageUrl, file);
      console.log("Historia cargada con éxito");
    } catch (error) {
      console.error("Error al cargar la historia", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Upload Story</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={handleCloudinaryUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Upload Image from Cloudinary
        </button>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Selected from Cloudinary"
            className="mb-4 max-w-full h-auto"
          />
        )}
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
