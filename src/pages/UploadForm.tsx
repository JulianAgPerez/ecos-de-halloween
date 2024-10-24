import React, { useState } from "react";
import axios from "axios";
import { url } from "../services/StoryService";

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [storyId, setStoryId] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("boton apretado");
    event.preventDefault();
    if (!file || !storyId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("storyId", storyId);

    try {
      const response = await axios.post(
        url + `/api/stories/upload-body/${storyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Upload Story Body</h2>
        <input
          type="text"
          placeholder="Story ID"
          value={storyId}
          onChange={(e) => setStoryId(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
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
