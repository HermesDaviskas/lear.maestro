// src/app/app_components/serviceTool/Controls.tsx
"use client";

import React from "react";

interface Props {
  loading: boolean;
  canCheck: boolean;
  canUpdate: boolean;
  onCheck: () => void;
  onUpdate: () => void;
  onDelete?: () => void;
}

export default function Controls({
  loading,
  canCheck,
  canUpdate,
  onCheck,
  onUpdate,
  onDelete,
}: Props) {
  return (
    <div className="flex flex-col gap-4 w-full h-full justify-start">
      <section className="flex gap-4 justify-between">
        <button
          onClick={onCheck}
          disabled={!canCheck}
          className="bg-blue-900 w-full h-9 p-2 rounded-md border text-sm tracking-wide uppercase font-semibold"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </section>

      <section className="flex gap-4 justify-between">
        <button
          onClick={onUpdate}
          disabled={!canUpdate}
          className="bg-green-700 w-full h-9 p-2 rounded-md border text-sm tracking-wide uppercase font-semibold"
        >
          Update
        </button>
        <button
          onClick={onDelete}
          disabled={loading}
          className="bg-red-700 w-full h-9p-2 rounded-md border text-sm tracking-wide uppercase font-semibold"
        >
          Delete
        </button>
      </section>
    </div>
  );
}
