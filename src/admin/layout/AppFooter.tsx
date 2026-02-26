import React from "react";

const AppFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-(--breakpoint-2xl) mx-auto px-4 py-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        
        {/* Left Side */}
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} StayNThrill. All rights reserved.
        </p>

        {/* Right Side */}
        <p className="mt-2 md:mt-0 text-center md:text-right">
          Designed and Developed by <a href="#" target="_blank" className="font-semibold text-gray-900">Prajwal I</a>
        </p>

      </div>
    </footer>
  );
};

export default AppFooter;