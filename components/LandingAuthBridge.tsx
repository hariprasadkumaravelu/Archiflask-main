"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const COOKIE_NAME = "af_bridge";
const APP_ORIGIN = process.env.APP_ORIGIN || "https://app.archiflask.com";
const COOKIE_DOMAIN = ".archiflask.com";

const STORAGE_KEYS = [
  "AID",
  "GDK",
  "GSS",
  "PDK",
  "UName",
  "alP",
  "boQ",
  "company",
  "expP",
  "firstAppLoad",
  "mail",
  "notificationsCount",
  "parentId",
  "phone",
  "pIT",
  "plan",
  "planAdditionalLicenses",
  "planEndDate",
  "planGBAvailable",
  "planGBUsed",
  "planIsBlocked",
  "planLastPaymentDate",
  "planStartDate",
  "userRole",
  "verified"
];

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${maxAgeSeconds}`,
    `Path=/`,
    `Domain=${COOKIE_DOMAIN}`,
    `SameSite=Lax`,
    isSecure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function readLocalSession(): Record<string, string> | null {
  const data: Record<string, string> = {};
  STORAGE_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) data[key] = value;
  });
  return data.AID ? data : null; 
}

interface Props {
  /** "root": only redirect when a session exists, otherwise stay on the marketing page.
   *  "passthrough": always redirect to the same path on app.archiflask.com, session or not. */
  mode: "root" | "passthrough";
}

export default function AuthBridgeRedirect({ mode }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [redirecting, setRedirecting] = useState(mode === "passthrough");

  useEffect(() => {
    try {
      const session = readLocalSession();

      if (mode === "root" && !session) {
        return; // stay on the landing/marketing page
      }

      if (session) {
        setCookie(COOKIE_NAME, JSON.stringify(session), 60);
        STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
      }

      setRedirecting(true);

      const query = searchParams?.toString();
      const path = mode === "root" ? "" : pathname; 
      window.location.href = `${APP_ORIGIN}${path}${query ? `?${query}` : ""}`;
    } catch (err) {
      console.error("AuthBridgeRedirect failed:", err);
      if (mode === "passthrough") {
        window.location.href = `${APP_ORIGIN}${pathname}`;
      }
    }
  }, []);

  if (!redirecting) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0d0b18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ color: "#fff", fontFamily: "sans-serif", fontSize: 14 }}>
        Redirecting…
      </div>
    </div>
  );
}
