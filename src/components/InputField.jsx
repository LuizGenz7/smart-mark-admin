import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const InputField = ({
  label,
  icon: Icon,
  onChange = () => {},
  value,
  type = "text",
  isSecure = false,
}) => {
  const [show, setShow] = useState(false);

  const inputType = isSecure ? (show ? "text" : "password") : type;

  return (
    <div className="space-y-1">
      <label className="text-xs ml-2 text-slate-500">{label}</label>

      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
        {Icon && <Icon className="size-6 text-slate-500" />}

        <input
          onChange={onChange}
          value={value}
          type={inputType}
          className="w-full flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500 text-slate-100"
          placeholder={label}
        />

        {isSecure && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="text-slate-400 hover:text-slate-200"
          >
            {show ? (
              <EyeSlashIcon className="size-6  text-slate-500" />
            ) : (
              <EyeIcon className="size-6  text-slate-500" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
