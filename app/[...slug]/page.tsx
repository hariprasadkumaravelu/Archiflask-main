// app/[...slug]/page.tsx
import { Suspense } from "react";
import AuthBridgeRedirect from "@/components/LandingAuthBridge";

export default function CatchAllPage() {
  return (
    <main className="relative z-[2]">
      <Suspense fallback={null}>
        <AuthBridgeRedirect mode="root" />
      </Suspense>
      {/* You can also show a loading or fallback UI */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: '#fff',
        background: '#0d0b18'
      }}>
        <p>Redirecting to app...</p>
      </div>
    </main>
  );
}