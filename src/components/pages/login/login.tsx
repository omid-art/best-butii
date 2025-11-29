"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Silk from "@/components/Silk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlassSelect from "./glassy-option";

export default function LoginPage() {
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    phone: "",
    otp: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    location: "",
    age: "",
    gender: "",
    username: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "birthDate") {
      value = value
        .replace(/\D/g, "")
        .replace(/^(\d{0,4})(\d{0,2})?(\d{0,2})?$/, (_, y, m, d) =>
          [y, m, d].filter(Boolean).join("/")
        );
    }

    setRegisterData({ ...registerData, [e.target.name]: value });
  };

  const handleToggleForm = () => {
    setIsRegistering(!isRegistering);
    setStep(1);
  };

  // ------------------------------ LOGIN ------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/users");
      const users = await res.json();

      const user = users.find(
        (u) =>
          u.username === loginData.username && u.password === loginData.password
      );

      if (user) {
        toast.success("ورود موفقیت‌آمیز!");

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", user.isAdmin ? "true" : "false");
        localStorage.setItem("username", user.username);
        setTimeout(() => router.push("/"), 1200);
      } else {
        toast.error("کاربری یافت نشد!");
      }
    } catch (err) {
      toast.error("خطا در اتصال به سرور!");
    }
  };

  // ------------------------------ REGISTER ------------------------------
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (registerData.phone.length < 10) {
        toast.error("شماره تماس معتبر نیست!");
        return;
      }

      toast.success("کد تایید ارسال شد (کد تست: 12345)");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (registerData.otp !== "12345") {
        toast.error("کد تایید اشتباه است!");
        return;
      }

      toast.success("کد صحیح است!");
      setStep(3);
      return;
    }

    if (step === 3) {
      setStep(4);
      return;
    }

    if (step === 4) {
      // ✔️ پسورد باید دقیقا ۸ رقم عددی باشد
      if (!/^[0-9]{8}$/.test(registerData.password)) {
        toast.error("پسورد باید دقیقا ۸ رقم و فقط عدد باشد!");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/users");
        const users = await res.json();

        const usernameExists = users.some(
          (u) => u.username === registerData.username
        );

        if (usernameExists) {
          toast.error("این نام کاربری قبلاً استفاده شده است!");
          return;
        }

        const passwordExists = users.some(
          (u) => u.password === registerData.password
        );

        if (passwordExists) {
          toast.error("این پسورد قبلاً استفاده شده است!");
          return;
        }

        // ------------------------------------------------------
        // ✔️ تشخیص ادمین بودن: اگر 5 رقم اول پسورد 00000 باشد
        // ------------------------------------------------------
        const isAdmin = registerData.password.startsWith("00000");

        // ساخت یوزر جدید
        const newUser = {
          id: Date.now(),
          ...registerData,
          isAdmin: isAdmin, // ✔️ فیلد جدید
          isLoggedIn: true,
        };

        const response = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) throw new Error("خطا");

        toast.success("ثبت‌نام موفقیت‌آمیز!");

        localStorage.setItem("isLoggedIn", "true");
        if (registerData.password.startsWith("00000")) {
          localStorage.setItem("isAdmin", "true");
        }
        localStorage.setItem("username", registerData.username);

        setTimeout(() => router.push("/"), 1200);
      } catch (err) {
        toast.error("خطا در ثبت کاربر!");
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Silk
        speed={5}
        scale={1}
        color="#d18893"
        noiseIntensity={1.5}
        rotation={0}
      />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl relative">
          {!isRegistering ? (
            // ---------------- LOGIN
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
              <h2 className="text-3xl text-white text-center">ورود به حساب</h2>

              <input
                name="username"
                placeholder="نام کاربری"
                value={loginData.username}
                onChange={handleLoginChange}
                className="input-glass"
              />

              <input
                name="password"
                type="password"
                placeholder="پسورد"
                value={loginData.password}
                onChange={handleLoginChange}
                className="input-glass"
              />

              <button className="bg-black text-white py-3 rounded-3xl">
                ورود
              </button>

              <button
                type="button"
                onClick={handleToggleForm}
                className="text-pink-300 underline"
              >
                ثبت‌ نام
              </button>
            </form>
          ) : (
            // ---------------- REGISTER
            <form
              onSubmit={handleRegisterSubmit}
              className="flex flex-col gap-5"
            >
              <h2 className="text-3xl text-white text-center">ثبت‌نام</h2>

              {step === 1 && (
                <>
                  <input
                    name="phone"
                    placeholder="شماره تماس"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    className="input-glass"
                  />
                  <button className="bg-black text-white py-3 rounded-3xl">
                    ارسال کد
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <input
                    name="otp"
                    placeholder="کد تایید (12345)"
                    value={registerData.otp}
                    onChange={handleRegisterChange}
                    className="input-glass"
                  />
                  <button className="bg-black text-white py-3 rounded-3xl">
                    تایید کد
                  </button>
                </>
              )}

              {step === 3 && (
                <>
                  <input
                    name="firstName"
                    placeholder="نام"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    className="input-glass"
                  />

                  <input
                    name="lastName"
                    placeholder="نام خانوادگی"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    className="input-glass"
                  />

                  <input
                    name="birthDate"
                    placeholder="تاریخ تولد"
                    value={registerData.birthDate}
                    onChange={handleRegisterChange}
                    className="input-glass"
                  />

                  <input
                    name="location"
                    placeholder="محل سکونت"
                    value={registerData.location}
                    onChange={handleRegisterChange}
                    className="input-glass"
                  />

                  <input
                    name="age"
                    placeholder="سن"
                    value={registerData.age}
                    onChange={handleRegisterChange}
                    className="input-glass"
                  />

                  <GlassSelect
                    options={[
                      { label: "مرد", value: "male" },
                      { label: "زن", value: "female" },
                      { label: "سایر", value: "other" },
                    ]}
                    value={registerData.gender}
                    onChange={handleRegisterChange}
                    placeholder="جنسیت"
                  />

                  <button className="bg-black text-white py-3 rounded-3xl">
                    ادامه
                  </button>
                </>
              )}

              {step === 4 && (
                <>
                  <input
                    name="username"
                    placeholder="نام کاربری"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    className="input-glass"
                  />

                  <input
                    name="password"
                    placeholder="پسورد"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="input-glass"
                  />

                  <button className="bg-black text-white py-3 rounded-3xl">
                    ثبت‌نام
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handleToggleForm}
                className="text-pink-300 underline text-sm mt-2"
              >
                بازگشت به ورود
              </button>
            </form>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
