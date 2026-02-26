import React from "react";
// import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative flex flex-col min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
        "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Main Content (Centered) */}
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl dark:bg-gray-900">
          {children}
        </div>
      </div>

      {/* Footer - Always at Bottom */}
      {/* <footer className="relative z-10 py-4 text-center text-sm text-white/80 border-t border-white/20 backdrop-blur-sm">
        <p className="tracking-wide">
          © {new Date().getFullYear()} StayNThrill. All Rights Reserved.
          <span className="mx-2">|</span>
          Designed & Developed by{" "}
          <a href="#" className="font-semibold text-white">
            Prajwal Ingole
          </a>
        </p>
      </footer> */}
    </div>
  );
}
