import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function GlassSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  const handleClickOutside = (e) => {
    if (selectRef.current && !selectRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange({ target: { name: "gender", value: val } });
    setOpen(false);
  };

  return (
    <div ref={selectRef} className="relative w-full">
      <div
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 flex justify-between items-center cursor-pointer transition-all duration-300 hover:border-pink-500 hover:shadow-[0_0_10px_#ff4dd4]"
        onClick={() => setOpen(!open)}
      >
        <span className={`${value ? "text-white" : "text-white/60"}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className="text-white" />
      </div>

      {open && (
        <ul className="absolute w-full mt-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl max-h-60 overflow-auto z-50">
          {options.map((opt) => (
            <li
              key={opt.value}
              className="px-4 py-2 cursor-pointer text-white hover:bg-white/20 transition"
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
