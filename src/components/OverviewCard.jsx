import React from "react";
import { useNavigate } from "react-router-dom";

const OverviewCard = ({ text, sub, icon: Icon, action = () => {} }) => {
  const navigate = useNavigate();
  return (
    <button
    onClick={() => navigate(action)}
      className="
        relative w-full flex flex-col items-start px-6 pt-6 pb-20
        bg-slate-900 rounded-xl outline-none
        cursor-pointer
        border
        border-slate-900
        transition-transform duration-300 ease-out
        hover:scale-101
        hover:border-orange-500
        active:scale-95
      "
    >
      <p className="text-xl md:text-3xl font-bold text-orange-500">{text}</p>
      <p className="text-xs md:text-xl text-slate-500 font-bold">{sub}</p>

      <Icon className="absolute bottom bottom-0 right-4 md:right-0 size-30 md:size-36 text-slate-500 opacity-70" />
    </button>
  );
};

export default OverviewCard;