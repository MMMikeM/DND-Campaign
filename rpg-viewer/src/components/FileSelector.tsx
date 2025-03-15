"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";

type FileSelectorProps = {
  onFileSelect: (filename: string) => void;
  currentFile?: string | null;
};

export default function FileSelector({
  onFileSelect,
  currentFile,
}: FileSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Use tRPC query to fetch file list
  const { data, isLoading, error } = trpc.yaml.getFileList.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const files = data?.files || [];

  // Filter files based on search term
  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="text-center p-4 dark:text-gray-300">Loading files...</div>
    );
  if (error) return <div className="text-red-500 p-4">{error.message}</div>;
  if (files.length === 0)
    return <div className="p-4 dark:text-gray-300">No YAML files found.</div>;

  return (
    <div className="border rounded-lg p-4 mb-6 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
        Select a file to view
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {filteredFiles.map((file) => (
          <li key={file}>
            <button
              onClick={() => onFileSelect(file)}
              className={`w-full text-left p-3 rounded-md transition flex justify-between items-center ${
                currentFile === file
                  ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
                  : "hover:bg-slate-100 dark:hover:bg-gray-800 border-l-4 border-transparent"
              }`}
            >
              <span
                className={`font-medium truncate ${
                  currentFile === file
                    ? "text-blue-700 dark:text-blue-400"
                    : "dark:text-gray-300"
                }`}
              >
                {file}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0 ml-2">
                {file}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
