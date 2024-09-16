import React, { useState } from "react";
import { IoCopy } from "react-icons/io5";

function CopyableText({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const truncateId = (id) => `${id.slice(0, 10)}...`;

  return (
    <div className="group relative inline-block">
      <span
        className="cursor-pointer hover:text-blue-600"
        onClick={handleCopy}
      >
        {truncateId(text)}
      </span>
      <div
        className={`absolute bottom-3 left-0 bg-gray-700 dark:bg-zinc-600 text-white text-xs rounded-lg p-2 mb-2 w-auto shadow-lg z-10 items-center cursor-pointer ${
          copied ? "flex" : "hidden group-hover:flex"
        }`}
        onClick={handleCopy}
      >
        {copied ? (
          <p className="font-thin">Copied</p>
        ) : (
          <>
            <IoCopy className="text-md text-gray-300  hover:text-white mr-2" />
            <p className="font-thin">{text}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default CopyableText;
