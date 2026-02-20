import { useState, useRef, useEffect } from "react";
import { API } from "../Api/axios";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { HandleSuccess, HandleError } from "../utils/util";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function AddProduct() {
  const navigate = useNavigate();
  const editor = useRef(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    color: "",
    size: "",
    dimension: "",
    des: "",
  });

  const [image, setImages] = useState([]);
  const [imgPre, setImgPre] = useState([]);


  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      navigate("/productpage");
    }
  }, [navigate]);

  useEffect(() => {
    if (transcript) {
      setForm((prev) => ({
        ...prev,
        des: prev.des ? prev.des + " " + transcript : transcript,
      }));
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const preview = files.map((file) => URL.createObjectURL(file));
    setImgPre(preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price) {
      return HandleError("Title and Price are required");
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("color", form.color);
      formData.append("size", form.size);
      formData.append("dimension", form.dimension);
      formData.append("des", form.des);

      image.forEach((file) => {
        formData.append("images", file);
      });

      await API.post("/api1/cre", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      HandleSuccess("Product Successfully Added");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      console.error(err);
      HandleError("Failed to add product");
    }
  };

  const startVoice = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
    });
  };

  const stopVoice = () => {
    SpeechRecognition.stopListening();
  };



  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white max-w-3xl mx-auto p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add Product</h1>
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back to Admin
          </button>
        </div>

        {listening && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <span className="animate-pulse text-green-600">🟢</span>
            <span className="text-sm text-green-700">
              Listening for <strong>Description</strong> field...
            </span>
            <button
              type="button"
              onClick={stopVoice}
              className="ml-auto px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Stop
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Title :</label>
            <input
            type="title"
              placeholder="Title"
              className="w-full border p-3 rounded"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Price :</label>
            <input
              placeholder="Price"
              type="number"
              className="w-full border p-3 rounded"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Product Images :</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border p-3 rounded bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-400 file:text-white file:cursor-pointer"
            />
            {imgPre.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {imgPre.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`preview-${index}`}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-orange-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-5">
            <label className="block font-semibold mb-1">Colors :</label>
            <input
            type="color"
              placeholder="e.g. red, blue, green"
              className=" border p-3 rounded"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
            <div className="flex gap-2 ml-auto">
               <label className="block font-semibold mb-1">Size :</label>
            <input
            type="text"
              placeholder="e.g. S, M, L, XL"
              className=" border p-3 rounded"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
            />
            </div>
              
          </div>

          

          <div>
            <label className="block font-semibold mb-1">Dimension :</label>
            <input
            type="number"
              placeholder="e.g. 10, 20, 30"
              className="w-full border p-3 rounded"
              value={form.dimension}
              onChange={(e) => setForm({ ...form, dimension: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Description :
              <div className="inline-flex items-center gap-2 ml-2">
                <button
                  type="button"
                  onClick={() => (listening ? stopVoice() : startVoice())}
                  className={`px-3 py-1 rounded text-white text-sm transition ${listening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                  {listening ? " Stop" : " Voice"}
                </button>
                <button
                  type="button"
                  onClick={resetTranscript}
                  className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500 transition"
                >
                  Reset
                </button>
              </div>
            </label>

            <JoditEditor
              ref={editor}
              value={form.des}
              onChange={(newContent) =>
                setForm((prev) => ({
                  ...prev,
                  des: newContent,
                }))
              }
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-400 text-white rounded-lg font-bold text-lg hover:bg-orange-500 transition"
          >
            Save Product
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
