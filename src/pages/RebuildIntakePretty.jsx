import React, { useEffect } from "react";

export default function RebuildIntakePretty() {
  useEffect(() => { window.location.href = "/rebuildintake"; }, []);
  return <div>Loading…</div>;
}