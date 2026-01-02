"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (isAdmin !== "true") {
      notFound();
    } else {
      setChecked(true);
    }
  }, []);

  if (!checked) return null; // یا لودر

  return <>{children}</>;
}
