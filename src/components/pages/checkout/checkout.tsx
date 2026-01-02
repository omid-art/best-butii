"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type PaymentData = {
  items: { id: string; title: string; price: number; quantity: number }[];
  totalPrice: number;
  tax: number;
  finalPrice: number;
  merchant?: string;
  orderId?: string;
};

function toEnglishDigits(input: string) {
  const mapFrom = "۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩";
  const mapTo = "01234567890123456789";
  return input.replace(/[۰-۹٠-٩]/g, (d) => mapTo[mapFrom.indexOf(d)]);
}

function formatCardNumber(raw: string) {
  const only = toEnglishDigits(raw).replace(/\D/g, "").slice(0, 16);
  return only.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(raw: string) {
  const only = toEnglishDigits(raw).replace(/\D/g, "").slice(0, 4);
  if (only.length <= 2) return only;
  return `${only.slice(0, 2)}/${only.slice(2)}`;
}

function luhnCheck(card: string) {
  const num = card.replace(/\s/g, "");
  if (num.length < 12) return false;
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = parseInt(num[i], 10);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

const BANK_BINS = [
  { bin: "603799", name: "ملی" },
  { bin: "627412", name: "اقتصاد نوین" },
  { bin: "621986", name: "سامان" },
  { bin: "627488", name: "کارآفرین" },
  { bin: "589463", name: "رفاه" },
];

export default function PaymentPage({
  paymentData,
}: {
  paymentData: PaymentData;
}) {
  const router = useRouter();

  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv2, setCvv2] = useState("");
  const [pin2, setPin2] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [mobile, setMobile] = useState("");
  const [agree, setAgree] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [timer, setTimer] = useState(9 * 60 + 59);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [generatedCaptcha, setGeneratedCaptcha] = useState<string>(() =>
    Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  useEffect(() => {
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const timeText = useMemo(() => {
    const m = Math.floor(timer / 60)
      .toString()
      .padStart(2, "0");
    const s = (timer % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [timer]);

  const merchant = paymentData?.merchant || "NextShop";
  const amount = paymentData?.finalPrice || 0;
  const orderId =
    paymentData?.orderId ||
    "NS-" +
      Math.floor(Math.random() * 1e6)
        .toString()
        .padStart(6, "0");

  const bankName = useMemo(() => {
    const digits = card.replace(/\s/g, "");
    const found = BANK_BINS.find((b) => digits.startsWith(b.bin));
    return found?.name || "نامشخص";
  }, [card]);

  const cardRaw = card.replace(/\s/g, "");
  const cardValid = luhnCheck(card);
  const expiryValid = (() => {
    const [mm, yy] = expiry.split("/");
    if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return false;
    const m = Number(mm);
    const y = Number("20" + yy);
    if (isNaN(m) || isNaN(y)) return false;
    if (m < 1 || m > 12) return false;
    const now = new Date();
    const exp = new Date(y, m - 1, 1);
    return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
  })();
  const cvvValid = /^\d{3,4}$/.test(toEnglishDigits(cvv2));
  const captchaValid = captcha.trim().toUpperCase() === generatedCaptcha;
  const mobileValid = /^09\d{9}$/.test(toEnglishDigits(mobile));
  const pin2Valid = pin2.trim().length >= 4;
  const canSubmit =
    cardValid &&
    expiryValid &&
    cvvValid &&
    captchaValid &&
    mobileValid &&
    pin2Valid &&
    agree &&
    timer > 0;

  function refreshCaptcha() {
    setGeneratedCaptcha(Math.random().toString(36).slice(2, 8).toUpperCase());
  }

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOtpOpen(true);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }, 800);
  }

  function handleCardChange(v: string) {
    setCard(formatCardNumber(v));
  }

  function handleExpiryChange(v: string) {
    setExpiry(formatExpiry(v));
  }

  function handleOtpChange(idx: number, val: string) {
    const ch = toEnglishDigits(val).replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[idx] = ch;
    setOtp(next);
    if (ch && idx < otpRefs.current.length - 1)
      otpRefs.current[idx + 1]?.focus();
  }

  const otpReady = otp.join("").length === 6;

  function submitOtp() {
    if (!otpReady) return;
    const code = otp.join("");
    const ok = code === "123456" || Math.random() > 0.15;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOtpOpen(false);
      if (ok) router.push(`/checkout/success`);
      else router.push(`/checkout/unsuccess`);
    }, 900);
  }

  function maskCard(c: string) {
    const d = c.replace(/\s/g, "");
    if (d.length < 8) return "****-****-****-****";
    return `${d.slice(0, 4)}-${d.slice(4, 6)}**-****-${d.slice(-4)}`;
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">اطلاعات پرداخت معتبر نیست.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <span className="text-purple-700 font-bold">₪</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">درگاه پرداخت امن</div>
              <div className="font-bold text-gray-800">{merchant}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">زمان باقیمانده</div>
            <div
              className={`font-mono text-lg px-3 py-1 rounded-md ${
                timer > 60
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {timeText}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-600 text-sm">
              شماره سفارش:{" "}
              <span className="font-semibold text-gray-800">{orderId}</span>
            </div>
            <div className="text-xl font-extrabold text-purple-700">
              {amount.toLocaleString()} تومان
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <form onSubmit={handlePay} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">
                    شماره کارت — بانک:{" "}
                    <span className="font-semibold">{bankName}</span>
                  </label>
                  <input
                    inputMode="numeric"
                    value={card}
                    onChange={(e) => handleCardChange(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {!cardValid && cardRaw.length > 0 && (
                    <div className="text-xs text-red-500 mt-1">
                      شماره کارت نامعتبر است.
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1 text-gray-700">
                      تاریخ انقضا (MM/YY)
                    </label>
                    <input
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full border rounded-md px-3 py-2"
                    />
                    {!expiryValid && expiry.length > 0 && (
                      <div className="text-xs text-red-500 mt-1">
                        تاریخ نامعتبر
                      </div>
                    )}
                  </div>

                  <div style={{ width: 120 }}>
                    <label className="block text-sm mb-1 text-gray-700">
                      CVV2
                    </label>
                    <input
                      inputMode="numeric"
                      value={cvv2}
                      onChange={(e) =>
                        setCvv2(toEnglishDigits(e.target.value).slice(0, 4))
                      }
                      placeholder="۳ یا ۴ رقم"
                      className="w-full border rounded-md px-3 py-2"
                    />
                    {!cvvValid && cvv2.length > 0 && (
                      <div className="text-xs text-red-500 mt-1">نا معتبر</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">
                      رمز دوم (اینترنتی)
                    </label>
                    <input
                      value={pin2}
                      onChange={(e) => setPin2(e.target.value.slice(0, 10))}
                      placeholder="رمز دوم/OTP"
                      className="w-full border rounded-md px-3 py-2"
                    />
                    {!pin2Valid && pin2.length > 0 && (
                      <div className="text-xs text-red-500 mt-1">
                        حداقل ۴ کاراکتر
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-gray-700">
                      شماره موبایل
                    </label>
                    <input
                      value={mobile}
                      onChange={(e) =>
                        setMobile(toEnglishDigits(e.target.value).slice(0, 11))
                      }
                      placeholder="09xxxxxxxxx"
                      className="w-full border rounded-md px-3 py-2"
                    />
                    {!mobileValid && mobile.length > 0 && (
                      <div className="text-xs text-red-500 mt-1">
                        فرمت: 09xxxxxxxxx
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1 text-gray-700">
                      کد امنیتی
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={captcha}
                        onChange={(e) =>
                          setCaptcha(e.target.value.toUpperCase())
                        }
                        placeholder="کد را وارد کنید"
                        className="flex-1 border rounded-md px-3 py-2"
                      />
                      <div className="px-3 py-2 bg-gray-100 rounded-md font-mono text-sm flex items-center">
                        {generatedCaptcha}
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="text-sm text-purple-700"
                      >
                        تغییر
                      </button>
                    </div>
                    {!captchaValid && captcha.length > 0 && (
                      <div className="text-xs text-red-500 mt-1">
                        کد درست نیست
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agree}
                    onChange={() => setAgree(!agree)}
                  />
                  <label htmlFor="agree" className="text-sm text-gray-700">
                    شرایط و قوانین پرداخت را می‌پذیرم
                  </label>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className={`px-4 py-2 rounded-md text-white font-semibold ${
                      submitting || !canSubmit
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {submitting
                      ? "در حال ارسال..."
                      : `پرداخت ${amount.toLocaleString()} تومان`}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-3 py-2 rounded-md border text-sm"
                  >
                    بازگشت
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border">
              <div className="text-sm text-gray-600 mb-2">خلاصه پرداخت</div>
              <div className="mb-3">
                <div className="text-xs text-gray-500">فروشگاه</div>
                <div className="font-semibold">{merchant}</div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-500">شماره سفارش</div>
                <div className="font-mono text-sm">{orderId}</div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-500">مبلغ</div>
                <div className="text-lg font-extrabold text-purple-700">
                  {amount.toLocaleString()} تومان
                </div>
              </div>
              <div className="text-xs text-gray-500">
                کارت هدف:{" "}
                <span className="font-semibold">{maskCard(cardRaw)}</span>
              </div>
            </div>
          </div>
        </div>

        {otpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOtpOpen(false)}
            />
            <div className="relative bg-white rounded-lg p-6 w-full max-w-md z-10 shadow-lg">
              <h3 className="text-lg font-bold mb-2">ارسال کد تأیید</h3>
              <p className="text-sm text-gray-600 mb-4">
                کد ۶ رقمی به شماره {mobile || "09xxxxxxxxx"} ارسال شد. (برای
                تست: 123456)
              </p>
              <div className="flex gap-2 mb-4">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    value={v}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-12 text-center border rounded-md text-lg"
                    inputMode="numeric"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={submitOtp}
                  disabled={!otpReady || submitting}
                  className={`px-4 py-2 rounded-md text-white ${
                    !otpReady || submitting
                      ? "bg-gray-400"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {submitting ? "در حال بررسی..." : "تأیید و ادامه"}
                </button>
                <button
                  onClick={() => {
                    setOtp(["", "", "", "", "", ""]);
                    otpRefs.current[0]?.focus();
                  }}
                  className="px-3 py-2 rounded-md border"
                >
                  پاک کردن
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
