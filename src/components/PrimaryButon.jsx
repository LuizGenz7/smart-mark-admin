import React from "react";

const PrimaryButon = ({
  text = "Button",
  className = "py-2 rounded-xl font-semibold text-xl",
  colors = "bg-orange-500 hover:bg-orange-400 active:bg-orange-400",
  extra = '',
  action = () => {}
}) => {
  return (
    <button onClick={action} className={`w-full cursor-pointer ${colors} ${className} ${extra} outline-none`}>
      {text}
    </button>
  );
};

export default PrimaryButon;
