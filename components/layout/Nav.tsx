"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/content";

const SIGNUP_URL = process.env.NEXT_PUBLIC_SIGNUP_URL || "/get-started";
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/50";

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  // close the mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <nav
      id="af-nav"
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-[300] flex items-center justify-between border-b border-black/[0.08] bg-white/[0.72] px-4 py-[15px] [backdrop-filter:saturate(180%)_blur(20px)] md:px-10 md:py-[18px]"
    >
      <Link
        href="/"
        aria-label="ArchiFlask home"
        className={`flex items-center rounded-md ${focusRing}`}
      >
        <img
          src="/archiflask-logo.png"
          alt="ArchiFlask Logo"
          className="h-14 w-auto object-contain rounded-md"
        />
      </Link>

      {/* desktop links */}
      <div className="hidden items-center gap-0.5 text-[14.5px] font-medium md:flex">
        {NAV_LINKS.map((l) => {
          const on = path === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={on ? "page" : undefined}
              className={`rounded-pill px-3.5 py-2 transition-colors hover:bg-surface hover:text-ink ${focusRing} ${on ? "bg-surface font-bold text-ink" : "font-medium text-gray"
                }`}
            >
              {l.label}
            </Link>
          );
        })}
        <Link
          href="/book-demo"
          className={`ml-1.5 rounded-pill border border-black/[0.14] bg-white px-4 py-2 text-ink transition-colors hover:bg-surface ${focusRing}`}
        >
          Book a Demo
        </Link>
        <a
          href={SIGNUP_URL}
          className={`ml-1 rounded-pill bg-[image:var(--grad-dark)] px-5 py-[9px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.2)] transition-opacity hover:opacity-90 ${focusRing}`}
        >
          Get Started
        </a>
      </div>

      {/* mobile burger */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="af-mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-[42px] w-[42px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl border border-black/[0.12] bg-white md:hidden ${focusRing}`}
      >
        <span
          aria-hidden="true"
          className={`h-0.5 w-[18px] rounded-sm bg-ink transition-transform duration-[250ms] ${open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
        />
        <span
          aria-hidden="true"
          className={`h-0.5 w-[18px] rounded-sm bg-ink transition-transform duration-[250ms] ${open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
        />
      </button>

      {/* mobile dropdown panel */}
      {open && (
        <div
          id="af-mobile-menu"
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-black/[0.08] bg-white/[0.98] px-4 pb-[18px] pt-2.5 [backdrop-filter:saturate(180%)_blur(24px)] md:hidden"
        >
          {NAV_LINKS.map((l) => {
            const on = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={on ? "page" : undefined}
                className={`rounded-[14px] px-3.5 py-3 text-[17px] ${on ? "bg-surface font-bold text-ink" : "font-medium text-ink-2"
                  }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/book-demo"
            className="mt-2 rounded-[14px] border border-black/[0.14] bg-white p-3.5 text-center text-[16px] font-semibold text-ink"
          >
            Book a Demo
          </Link>
          <a
            href={SIGNUP_URL}
            className="mt-1 rounded-[14px] bg-[image:var(--grad-dark)] p-3.5 text-center text-[16px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.2)]"
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
