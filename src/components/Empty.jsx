import { FaceFrownIcon } from "@heroicons/react/24/outline";
import React from "react";

const Empty = () => {
  return (
    <div className="py-20 flex-col flex items-center justify-center">
      <div className="size-40 text-orange-500">
        <FaceFrownIcon />
      </div>
      <p className="text-2xl font-bold text-orange-500">No Data was found.</p>
    </div>
  );
};

export default Empty;
