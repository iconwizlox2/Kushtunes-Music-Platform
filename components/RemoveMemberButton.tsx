"use client";

import { useTransition, useState } from "react";

export default function RemoveMemberButton({ artistId, artistName }: { artistId: string; artistName: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    const ok = confirm(`Remove "${artistName}" from the roster?`);
    if (!ok) return;

    setError(null);
    start(async () => {
      try {
        const res = await fetch(`/api/label/roster/${artistId}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Request failed (${res.status})`);
        }
        // Optimistic UI: remove row from DOM without full refresh
        const row = document.querySelector<HTMLTableRowElement>(`tr[data-artist="${artistId}"]`);
        if (row) row.remove();

        // If you prefer a full refresh:
        // window.location.reload();
      } catch (e: any) {
        setError(e.message || "Failed to remove");
      }
    });
  }

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 6 }}>
      <button onClick={remove} disabled={pending} style={{ padding: "6px 10px", cursor: pending ? "not-allowed" : "pointer" }}>
        {pending ? "Removing…" : "Remove"}
      </button>
      {error && <span style={{ color: "#c00", fontSize: 12 }}>{error}</span>}
    </div>
  );
}
