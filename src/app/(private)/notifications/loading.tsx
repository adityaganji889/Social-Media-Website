import Spinner from "@/components/Spinner";
import React from "react";

function Loading() {
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}

export default Loading;