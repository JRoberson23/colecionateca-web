"use client";

import { useState } from "react";
import { FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaMapMarkedAlt } from "react-icons/fa";
import { HiShare } from "react-icons/hi";

export default function SocialSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="fixed bottom-6 left-1 z-50 flex items-center"
      onMouseEnter={() => setIsOpen(false)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Ícone principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600/60 text-white p-5 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
      >
        <HiShare className="text-xl" />
      </button>

      {/* Ícones das redes sociais (expansíveis) */}
      <div
        className={`flex items-center gap-3 ml-3 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-600 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        <a
          href="https://www.instagram.com/colecionateca/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pink-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        >
          <FaInstagram className="text-lg" />
        </a>
        <a
          href="https://www.youtube.com/@Colecionateca"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        >
          <FaYoutube className="text-lg" />
        </a>
        <a
          href="https://wa.me/554784697625"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        >
          <FaWhatsapp className="text-lg" />
        </a>
        <a
          href="mailto:colecionateca@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        >
          <FaEnvelope className="text-lg" />
        </a>
        <a
          href="https://www.google.com/maps/place/Santa+Catarina"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-yellow-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        >
          <FaMapMarkedAlt className="text-lg" />
        </a>
      </div>
    </div>
  );
}