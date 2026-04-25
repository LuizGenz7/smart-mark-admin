import React, { useEffect, useState } from "react";

const SplashScreen = () => {
  const [stage, setStage] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const text = "Marking Made Better";
  const isTypingDone = textIndex >= text.length;

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1200);
    const t2 = setTimeout(() => setStage(2), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // TYPEWRITER EFFECT
  useEffect(() => {
    if (stage < 2) return;

    if (textIndex < text.length) {
      const t = setTimeout(() => {
        setTextIndex((prev) => prev + 1);
      }, 80);

      return () => clearTimeout(t);
    }
  }, [stage, textIndex]);

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col justify-between text-white overflow-hidden">
      {/* CENTER */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center gap-6">
          {/* LOGO */}
          <div
            className={`size-15 md:size-40 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center
              ${stage === 0 ? "animate-pulse scale-150" : ""}
              transition-all duration-500
            `}
          >
            <img
              src="/profile.webp"
              className="w-full h-full object-cover"
              alt="logo"
            />
          </div>

          {/* TEXT BLOCK */}
          <div>
            {isTypingDone && (
              <p className="text-orange-500 text-sm md:text-2xl font-semibold mt-2 opacity-0 animate-[fadeIn_0.8s_ease_forwards]">
                Smart Mark
              </p>
            )}
            {/* MAIN TYPEWRITER (NOW MAIN TITLE) */}
            <h1 className="text-base md:text-4xl font-extrabold tracking-tight">
              {text.slice(0, textIndex)}
              <span className={`${stage === 0 ? "hidden" : ""} text-orange-500 font-extralight `}>|</span>
            </h1>

            {/* SUBTITLE */}
            {isTypingDone && (
              <p className="text-slate-400 text-[7px] md:text-sm  md:mt-2 opacity-0 animate-[fadeIn_0.8s_ease_forwards]">
                Smart School Management System
              </p>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="pb-6 flex flex-col items-center text-center text-xs text-slate-500">
        {/* LINE 1 */}
        <div className="flex items-center gap-2">
          <span className="size-1 md:size-2 rounded-full bg-green-400 animate-pulse"></span>

          <p className="text-[10px] md:text-base">
            Built & Designed by{" "}
            <span className="text-orange-400 text-xs md:text-base font-semibold tracking-wide">
              LuizGenz
            </span>
          </p>
        </div>

        {/* LINE 2 */}
        <p className="mt-1 text-[8px] md:text-[10px] text-slate-600">
          Smart School Management System • Production Build
        </p>

        {/* LINE 3 */}
        <p className="mt-1 text-[8px] md:text-[10px] text-slate-600">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default SplashScreen;
