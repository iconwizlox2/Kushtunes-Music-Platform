"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function DateRangePicker({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [start, setStart] = useState<string>(sp.get("start") || "");
  const [end, setEnd] = useState<string>(sp.get("end") || "");

  useEffect(() => {
    setStart(sp.get("start") || "");
    setEnd(sp.get("end") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString()]);

  function apply() {
    const params = new URLSearchParams(sp.toString());
    if (start) params.set("start", start); else params.delete("start");
    if (end) params.set("end", end); else params.delete("end");
    router.push(`?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams(sp.toString());
    params.delete("start");
    params.delete("end");
    setStart(""); setEnd("");
    router.push(`?${params.toString()}`);
  }

  const styleWrap: React.CSSProperties = compact ? { display:"flex", gap:8, alignItems:"center" } : { display:"flex", gap:12, alignItems:"center", margin:"8px 0 16px" };
  const inp: React.CSSProperties = { padding:"6px 10px" };
  const btn: React.CSSProperties = { padding:"6px 10px", cursor:"pointer" };

  return (
    <div style={styleWrap}>
      <label>From <input type="date" value={start} onChange={(e)=>setStart(e.target.value)} style={inp}/></label>
      <label>To <input type="date" value={end} onChange={(e)=>setEnd(e.target.value)} style={inp}/></label>
      <button onClick={apply} style={btn}>Apply</button>
      <button onClick={clearAll} style={{...btn, opacity:.8}}>Clear</button>
    </div>
  );
}
