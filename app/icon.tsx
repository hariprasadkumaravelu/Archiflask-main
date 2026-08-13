import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Generated favicon + brand mark. Also referenced as the Organization logo in
// JSON-LD (served at /icon). 256px so it doubles as a structured-data logo
// (Google wants >=112px) while browsers downscale it for the tab.
export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
  const logo = readFileSync(join(process.cwd(), "public", "ArchiFlask.jpg"));
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 56,
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={256}
          height={256}
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    { ...size },
  );
}
