"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SESSION_COOKIE = "AF_SESSION";
const MIGRATION_COOKIE = "AF_MIGRATION";
const COOKIE_DOMAIN = ".archiflask.com";

const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN;

const MIGRATION_MAX_AGE = 60 * 5; // 5 minutes

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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

function deleteCookie(name: string) {
  // Domain/Path must match what set it, or the browser silently no-ops.
  document.cookie = [
    `${name}=`,
    `Max-Age=0`,
    `Path=/`,
    `Domain=${COOKIE_DOMAIN}`,
    `SameSite=Lax`,
  ].join("; ");
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
  const ranRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || ranRef.current) return;
    ranRef.current = true;

    const query = searchParams?.toString();
    const targetPath = pathname || "";
    const redirectUrl = `${APP_ORIGIN}${targetPath}${query ? `?${query}` : ""}`;

    const goToApp = () => {
      setRedirecting(true);
      window.location.replace(redirectUrl);
    };

    if (mode === "passthrough") {
      // Explicit navigation (e.g. "Get Started") — always redirect, no auth check.
      goToApp();
      return;
    }

    // mode === "root"
    try {
      const sessionMarker = getCookie(SESSION_COOKIE);
      console.log("sessionMarker", sessionMarker);
      if (sessionMarker && sessionMarker.startsWith("loggedin:")) {
        // Marker cookie present — no backend call needed, just redirect.
        goToApp();
        return;
      }

      // No session marker — check for pre-existing localStorage session to migrate
      const session = readLocalSession();
      console.log('session',session)
       if (session) {
        setCookie(MIGRATION_COOKIE, JSON.stringify(session), MIGRATION_MAX_AGE);
        clearLocalStorageKeys();
        goToApp();
        return;
       }

     
    } catch (err) {
      console.error("AuthBridgeRedirect failed:", err);
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
