import { ChangeEvent, FC, FormEvent, useState } from "react";
import { uploadStoryWithBody } from "../services/UploadFileService";
import AnimatedBackground from "../components/AnimatedBackground";

interface CloudinaryWidget {
  open: () => void;
}

interface CloudinaryResult {
  event: string;
  info: { secure_url: string };
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: CloudinaryResult) => void,
      ) => CloudinaryWidget;
    };
  }
}

const UploadForm: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleCloudinaryUpload = () => {
    setError(null);
    if (!window.cloudinary) {
      setError("El widget de Cloudinary no está disponible.");
      return;
    }
    const cloudinaryWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "diauphrb6",
        uploadPreset: "main_upload",
        minImageWidth: 1600,
        minImageHeight: 900,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
      },
      (_error, result) => {
        if (result.event === "success") {
          setImageUrl(result.info.secure_url);
        }
      }
    );
    cloudinaryWidget.open();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!file) {
      setError("Selecciona un archivo con el contenido del cuento.");
      return;
    }
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    setLoading(true);
    try {
      await uploadStoryWithBody(title.trim(), description, imageUrl, file);
      setSuccess(true);
      window.dispatchEvent(new CustomEvent("stories-updated"));
    } catch {
      setError("Error al subir la historia. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg bg-custom-purple/95 border border-purple-700 shadow-2xl rounded-lg p-8"
      >
        <h1 className="font-creepster text-4xl text-amber-400 text-center mb-6">
          Subir Cuento
        </h1>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-400 text-center mb-4">
            Historia subida con éxito.
          </p>
        )}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="title">
            Título
          </label>
          <input
            type="text"
            id="title"
            placeholder="Título del cuento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-purple-800 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="description">
            Descripción
          </label>
          <textarea
            id="description"
            placeholder="Descripción breve"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-purple-800 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-400"
            rows={3}
          />
        </div>
        <button
          type="button"
          onClick={handleCloudinaryUpload}
          disabled={loading}
          className="w-full bg-gradient-to-br from-blue-600 to-blue-900 text-white px-4 py-2 rounded mb-4 hover:from-blue-700 hover:to-blue-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Subir imagen desde Cloudinary
        </button>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Seleccionada desde Cloudinary"
            className="mb-4 max-w-full h-auto rounded"
          />
        )}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="file">
            Archivo del cuento
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            disabled={loading}
            className="block w-full text-gray-300 file:mr-4 file:px-4 file:py-2 file:rounded file:border-0 file:bg-purple-700 file:text-amber-400 file:cursor-pointer hover:file:bg-purple-800 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-br from-purple-600 to-purple-900 text-amber-400 px-4 py-2 rounded hover:from-purple-700 hover:to-purple-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              Subiendo...
            </span>
          ) : (
            "Subir"
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
