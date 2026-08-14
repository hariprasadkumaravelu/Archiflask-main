"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const COOKIE_NAME = "af_bridge";
// const APP_ORIGIN = "http://localhost:3001";
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
  "exP",
  "firstAppLoad",
  "mail",
  "notificationsCount",
  "parentId",
  "phone",
  "plT",
  "plan",
  "planAdditionalLicenses",
  "planEndDate",
  "planGBAvailable",
  "planGBUsed",
  "planIsBlocked",
  "planLastPaymentDate",
  "planStartDate",
  "userRole",
  "verified",
  "blseq",
  "exblseq",
  "purO",
  "wrkO",
  "tsa",
  "adP",
  "adE",
  "renewalData",
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
  let hasData = false;

  STORAGE_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      data[key] = value;
      hasData = true;
    }
  });

  return hasData ? data : null;
}

function clearLocalStorageKeys() {
  STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
}

interface Props {
  mode: "root" | "passthrough";
}

export default function AuthBridgeRedirect({ mode }: Props) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [redirecting, setRedirecting] = useState(mode === "passthrough");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      const session = readLocalSession();
      if (mode === "root") {
        if (!session) {
          return;
        }
      }

      // For passthrough mode: always redirect (with or without session)
      // Store session in cookie if it exists
      if (session) {
        setCookie(COOKIE_NAME, JSON.stringify(session), 60 * 60 * 24 * 7); 
        // Clear localStorage after saving to cookie
        clearLocalStorageKeys();
      }

      setRedirecting(true);

      // Build the redirect URL with the same path
      const query = searchParams?.toString();
      const targetPath = pathname || ""; // Keep the current path
      const redirectUrl = `${APP_ORIGIN}${targetPath}${query ? `?${query}` : ""}`;

      // Use replace to avoid history issues
      window.location.replace(redirectUrl);
    } catch (err) {
      console.error("AuthBridgeRedirect failed:", err);
      if (mode === "passthrough") {
        const redirectUrl = `${APP_ORIGIN}${pathname}`;
        window.location.replace(redirectUrl);
      }
    }
  }, [isClient, pathname, searchParams, mode]);

  if (!isClient || !redirecting) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <style>{`
        @keyframes rail-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* signature element: a hairline rail with a sweeping highlight */}
      <div
        style={{
          position: "relative",
          width: 120,
          height: 1,
          background: "rgba(255,255,255,0.14)",
          overflow: "hidden",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "40%",
            background:
              "linear-gradient(90deg, transparent, #fff, transparent)",
            animation: "rail-sweep 1.6s ease-in-out infinite",
          }}
        />
      </div>

      <div
        style={{
          color: "#fff",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          animation: "fade-up 0.5s ease both",
        }}
      >
        Redirecting
      </div>

      <div
        style={{
          marginTop: 10,
          color: "rgba(255,255,255,0.4)",
          fontSize: 12,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          letterSpacing: "0.02em",
          animation: "fade-up 0.5s ease 0.1s both",
        }}
      >
        {pathname}
      </div>
    </div>
  );
}
