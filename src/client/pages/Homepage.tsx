import { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

function HomePage() {
  const headings = [
    "Discover Premium Stays",
    "Book Thrilling Adventures",
    "Explore. Stay. Experience.",
  ];

  const [text, setText] = useState("");
  const [headingIndex, setHeadingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [navbarBg, setNavbarBg] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ================= COMING SOON HANDLER =================
  const handleComingSoon = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toast("🚀 This feature is coming soon!", {
      style: {
        background: "#000",
        color: "#fff",
        borderRadius: "14px",
        padding: "12px 18px",
      },
    });
  };

  // ================= TYPING EFFECT =================
  useEffect(() => {
    const current = headings[headingIndex];
    const speed = isDeleting ? 50 : 90;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1));
        if (text === current) {
          setTimeout(() => setIsDeleting(true), 1200);
        }
      } else {
        setText(current.substring(0, text.length - 1));
        if (text === "") {
          setIsDeleting(false);
          setHeadingIndex((prev) => (prev + 1) % headings.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, headingIndex]);

  // ================= NAVBAR SCROLL BG =================
  useEffect(() => {
    const handleScroll = () => {
      setNavbarBg(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ================= CLOSE DROPDOWN =================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    
    <div className="bg-white">
      <Toaster position="top-center" />

      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          navbarBg ? "bg-black shadow-lg" : "bg-transparent"
        } text-white`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 py-4">
          {/* Logo */}
          <div className="text-2xl md:text-3xl font-semibold tracking-wide cursor-pointer">
            <span>Stay</span>
            <span className="mx-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 bg-clip-text text-transparent font-extrabold">
              N
            </span>
            <span>Thrill</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center font-medium">
            <a href="/" className="hover:text-yellow-400 transition">
              Home
            </a>

            <a
              href="#"
              onClick={handleComingSoon}
              className="hover:text-yellow-400 transition"
            >
              Explore Stays
            </a>

            <a
              href="#"
              onClick={handleComingSoon}
              className="hover:text-yellow-400 transition"
            >
              Explore Adventures
            </a>

            <a
              href="#how-it-works"
              className="hover:text-yellow-400 transition"
            >
              How It Works
            </a>

            <a
              href="#"
              onClick={handleComingSoon}
              className="hover:text-yellow-400 transition"
            >
              Support
            </a>

            <a
              href="#"
              onClick={handleComingSoon}
              className="hover:text-yellow-400 transition"
            >
              Become a Vendor
            </a>

            {/* Login Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 transition"
              >
                Login <FiChevronDown />
              </button>

              {openDropdown && (
                <div className="absolute right-0 mt-3 w-44 bg-white text-black rounded-xl shadow-xl overflow-hidden">
                  <a
                    href="#"
                    onClick={handleComingSoon}
                    className="block px-4 py-3 hover:bg-gray-100 transition"
                  >
                    User Login
                  </a>
                  <a
                    href="#"
                    onClick={handleComingSoon}
                    className="block px-4 py-3 hover:bg-gray-100 transition"
                  >
                    Vendor Login
                  </a>
                  <a
                    href="/admin-login"
                    className="block px-4 py-3 hover:bg-gray-100 transition"
                  >
                    Admin Login
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-black px-6 py-6 space-y-4">
            <a href="/" className="block hover:text-yellow-400">
              Home
            </a>

            <a
              href="#"
              onClick={handleComingSoon}
              className="block hover:text-yellow-400"
            >
              Explore Stays
            </a>

            <a
              href="#"
              onClick={handleComingSoon}
              className="block hover:text-yellow-400"
            >
              Explore Adventures
            </a>

            <a
              href="#how-it-works"
              className="block hover:text-yellow-400"
            >
              How It Works
            </a>

            <a
              href="#"
              onClick={handleComingSoon}
              className="block hover:text-yellow-400"
            >
              Support
            </a>

            <a
              href="#"
              onClick={handleComingSoon}
              className="block hover:text-yellow-400"
            >
              Become a Vendor
            </a>

            <a
              href="#"
              onClick={handleComingSoon}
              className="block hover:text-yellow-400"
            >
              User Login
            </a>

            <a
              href="#"
              onClick={handleComingSoon}
              className="block hover:text-yellow-400"
            >
              Vendor Login
            </a>

            <a href="/admin-login" className="block hover:text-yellow-400">
              Admin Login
            </a>
          </div>
        )}
      </nav>

     {/* ================= HERO SECTION ================= */}
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://gotrip-reactjs.ibthemespro.com/img/masthead/1/bg.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 min-h-[80px]">
            {text}
            <span className="border-r-2 border-yellow-400 ml-2 animate-pulse"></span>
          </h1>

          <p className="text-lg md:text-xl opacity-90 mb-10">
            Book verified stays and curated adventure experiences across
            premium destinations.
          </p>

          {/* Transparent Glass Search Bar */}
          <div
            className="bg-white/10 backdrop-blur-lg border border-white/20
                      rounded-2xl shadow-2xl p-4 md:p-6
                      grid md:grid-cols-4 gap-4 text-white"
          >
            {/* Location */}
            <div
              className="flex items-center gap-2 bg-white/10
                        border border-white/30 rounded-lg px-3 py-2"
            >
              <FiMapPin className="text-white" />
              <input
                type="text"
                placeholder="Location"
                className="bg-transparent outline-none w-full
                          placeholder-white/70 text-white"
              />
            </div>

            {/* Date */}
            <div
              className="flex items-center gap-2 bg-white/10
                        border border-white/30 rounded-lg px-3 py-2"
            >
              <FiCalendar className="text-white" />
              <input
                type="date"
                className="bg-transparent outline-none w-full text-white"
              />
            </div>

            {/* Category */}
            <div
              className="flex items-center gap-2 bg-white/10
                        border border-white/30 rounded-lg px-3 py-2"
            >
              <FiUser className="text-white" />
              <select className="bg-transparent outline-none w-full text-white">
                <option className="text-black">Category</option>
                <option className="text-black">Stays</option>
                <option className="text-black">Adventures</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              className="bg-yellow-500 hover:bg-yellow-600
                        text-white rounded-lg px-6 py-3
                        flex items-center justify-center gap-2
                        font-semibold transition duration-300"
            >
              <FiSearch /> Search
            </button>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-20 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-14">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-yellow-500 mb-3">1</div>
            <p>Search stays or adventures</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-500 mb-3">2</div>
            <p>Select available dates or slots</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-500 mb-3">3</div>
            <p>Securely complete payment</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-500 mb-3">4</div>
            <p>Enjoy your experience</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>
            © {new Date().getFullYear()} StayNThrill. All Rights Reserved.
          </p>

          <p>
            Designed & Developed by{" "}
            <a
              href="#"
              target="_blank"
              className="text-yellow-400 font-medium"
            >
              Prajwal I
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;