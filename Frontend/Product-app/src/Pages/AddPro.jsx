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
    color: "#000000",
    size: "",
    dimension: "",
    des: "",
  });

  const [image, setImages] = useState([]);
  const [imgPre, setImgPre] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [Sub, setSubm] = useState(false);
  const [Transcribing, setTranscribing] = useState(false);
  const audioInputRef = useRef(null);

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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) {
      setImages(files);
      setImgPre(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const removeImage = (index) => {
    const newImages = image.filter((_, i) => i !== index);
    const newPreviews = imgPre.filter((_, i) => i !== index);
    setImages(newImages);
    setImgPre(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price) {
      return HandleError("Title and Price are required");
    }

    setSubm(true);

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
    } finally {
      setSubm(false);
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


  const handleAudioTranscribe = async (e) => {
    const file = e.target.files[0];
    if (!file) return;


    const allowedTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/webm", "audio/m4a", "audio/mp4", "audio/ogg", "audio/flac"];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|webm|m4a|ogg|flac)$/i)) {
      HandleError("Please upload a valid audio file (MP3, WAV, WEBM, M4A, OGG, FLAC)");
      return;
    }

    setTranscribing(true);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const res = await API.post("/api1/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.text) {
        setForm((prev) => ({
          ...prev,
          des: prev.des ? prev.des + " " + res.data.text : res.data.text,
        }));
        HandleSuccess("Audio transcribed successfully!");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      HandleError(err.response?.data?.message || "Failed to transcribe audio");
    } finally {
      setTranscribing(false);

      if (audioInputRef.current) audioInputRef.current.value = "";
    }
  };


  const completedFields = [
    form.title,
    form.price,
    form.color && form.color !== "#000000",
    form.size,
    form.dimension,
    form.des,
    imgPre.length > 0,
  ].filter(Boolean).length;
  const totalFields = 7;
  const progressPercent = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="max-w-5xl mx-auto mb-6 md:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-all duration-200 shadow-sm"
              title="Back to Admin"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Add New Product
              </h1>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">
                Complete the form below to add a product to your catalog
              </p>
            </div>
          </div>


          <div className="hidden md:flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
              {completedFields}/{totalFields} fields
            </span>
          </div>
        </div>
      </div>


      {listening && (
        <div className="max-w-5xl mx-auto mb-6">
          <div className="p-4 rounded-xl border border-green-200 bg-green-50 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm text-green-700 font-medium">
              Listening for <strong>Description</strong> — speak now...
            </span>
            <button
              type="button"
              onClick={stopVoice}
              className="ml-auto px-4 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition"
            >
              Stop
            </button>
          </div>
        </div>
      )}


      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


            <div className="lg:col-span-8 space-y-6">


              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Basic Information
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Product Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Premium Wireless Headphones"
                      className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all duration-200 hover:border-gray-300"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Price <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-gray-50 border-r border-gray-200 rounded-l-xl">
                        <span className="text-sm font-bold text-gray-400">$</span>
                      </div>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full border border-gray-200 px-4 py-3 pl-14 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all duration-200 hover:border-gray-300"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Product Images
                  </h3>
                </div>
                <div className="p-6">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${dragActive
                      ? "border-orange-300 bg-orange-50/40"
                      : "border-gray-200 bg-gray-50/30 hover:border-gray-300 hover:bg-gray-50/60"
                      }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">
                      Drag & drop your images here, or{" "}
                      <span className="text-orange-400 font-bold cursor-pointer hover:text-orange-500">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      JPG, PNG or WEBP • Max 5 images
                    </p>
                  </div>

                  {imgPre.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        {imgPre.length} image{imgPre.length !== 1 ? "s" : ""} selected
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {imgPre.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm group-hover:border-orange-200 group-hover:shadow-md transition-all duration-200">
                              <img
                                src={preview}
                                alt={`preview-${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center shadow-md hover:bg-red-600 hover:scale-110"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Description
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => (listening ? stopVoice() : startVoice())}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-xs font-bold transition-all duration-200 ${listening
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-gray-700 hover:bg-gray-800"
                        }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      </svg>
                      {listening ? "Stop" : "Voice"}
                    </button>
                    {listening && (
                      <button
                        type="button"
                        onClick={resetTranscript}
                        className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
                      >
                        Reset
                      </button>
                    )}

                    <div className="w-px h-5 bg-gray-200" />

                    <input
                      type="file"
                      ref={audioInputRef}
                      accept="audio/*,.mp3,.wav,.webm,.m4a,.ogg,.flac"
                      onChange={handleAudioTranscribe}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      disabled={Transcribing}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${Transcribing
                        ? "bg-orange-100 text-orange-400 cursor-wait"
                        : "bg-orange-400 hover:bg-orange-500 text-white"
                        }`}
                    >
                      {Transcribing ? (
                        <>
                          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Audio
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-6">
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
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-8">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Product Attributes
                  </h3>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Color
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer p-0.5 hover:border-gray-300 transition-colors"
                          value={form.color || "#000000"}
                          onChange={(e) => setForm({ ...form, color: e.target.value })}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-mono font-bold text-gray-700">
                          {form.color || "#000000"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          Click to choose color
                        </div>
                      </div>
                    </div>
                    <div
                      className="mt-3 h-3 rounded-full transition-colors duration-500"
                      style={{ backgroundColor: form.color || "#000000" }}
                    />
                  </div>

                  <div className="border-t border-gray-100" />

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. S, M, L, XL"
                      className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all duration-200 hover:border-gray-300"
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                    />
                  </div>

                  <div className="border-t border-gray-100" />

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Dimension
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 10, 20, 30"
                      className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all duration-200 hover:border-gray-300"
                      value={form.dimension}
                      onChange={(e) => setForm({ ...form, dimension: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 space-y-3">
                  <button
                    type="submit"
                    disabled={Sub}
                    className={`w-full py-3.5 bg-orange-400 text-white rounded-xl font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${Sub
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-orange-500 hover:shadow-md active:scale-[0.98]"
                      }`}
                  >
                    {Sub ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Publish Product
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="w-full py-3 bg-gray-50 text-gray-500 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all duration-200 border border-gray-200"
                  >
                    Discard
                  </button>
                </div>
              </div>

             
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
