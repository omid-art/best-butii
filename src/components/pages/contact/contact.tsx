"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Silk from "@/components/Silk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Phone, MapPin, Home } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message sent:", formData);
    toast.success("پیام شما با موفقیت ارسال شد!");
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* بک‌گراند متحرک */}
      <Silk speed={5} scale={1} color="#d18893" noiseIntensity={1.5} rotation={0} />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="relative w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-xl">
          {/* دکمه بازگشت به خانه */}
          <button
            onClick={() => router.push("/")}
            className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/30 backdrop-blur-md text-white font-semibold py-2 px-4 rounded-xl hover:bg-red-600/50 transition-colors"
          >
            <Home size={20} />
            خانه
          </button>

          {/* فرم تماس */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-3xl text-white text-center font-bold mb-4">
              با ما در تماس باشید
            </h2>

            <input
              type="text"
              name="name"
              placeholder="نام شما"
              value={formData.name}
              onChange={handleChange}
              className="input-glass"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="ایمیل شما"
              value={formData.email}
              onChange={handleChange}
              className="input-glass"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="موضوع"
              value={formData.subject}
              onChange={handleChange}
              className="input-glass"
              required
            />
            <textarea
              name="message"
              placeholder="پیام شما"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="input-glass resize-none"
              required
            ></textarea>

            <button
              type="submit"
              className="bg-white/20 input-glass text-white py-3 rounded-3xl hover:bg-white/30 transition-colors font-semibold mt-2"
            >
              ارسال پیام
            </button>
            {submitted && (
              <p className="text-green-400 text-center mt-2 font-medium">
                پیام شما با موفقیت ارسال شد!
              </p>
            )}
          </form>

          {/* اطلاعات تماس */}
          <div className="flex flex-col justify-center space-y-6 text-white">
            <div className="flex items-center gap-4">
              <Mail className="text-pink-400" size={24} />
              <div>
                <p className="font-semibold">ایمیل</p>
                <p className="text-gray-200">contact@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-pink-400" size={24} />
              <div>
                <p className="font-semibold">تلفن</p>
                <p className="text-gray-200">+98 912 345 6789</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-pink-400" size={24} />
              <div>
                <p className="font-semibold">آدرس</p>
                <p className="text-gray-200">تهران، ایران</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
