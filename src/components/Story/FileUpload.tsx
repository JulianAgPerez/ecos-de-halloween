import { ChangeEvent, FC, useState } from "react";
import { uploadFileService } from "../../services/UploadFileService";

const FileUpload: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const fileData = await uploadFileService(file);
      setFileContent(fileData);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload a Word File</h1>
      <input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Upload
      </button>
      {fileContent && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold">File Content:</h2>
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
