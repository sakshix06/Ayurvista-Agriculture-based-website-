
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="w-full bg-green-600 text-white py-10 mt-12">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start px-6 gap-8">
      <div className="text-center md:text-left flex-1">
        <div className="font-bold text-lg mb-2">AYUSH Virtual Herbal Garden</div>
        <div className="text-sm opacity-90">
          Explore the healing power of traditional medicine.
        </div>
      </div>
      <div className="text-center flex-1">
        <div className="font-bold text-lg mb-2">Quick Links</div>
        <ul className="flex flex-col items-center md:items-start gap-1 text-sm">
          <li>
            <Link to="/dashboard" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/virtual-tour" className="hover:underline">Virtual Tour</Link>
          </li>
          <li>
            <Link to="/advanced-search" className="hover:underline">Advanced Search</Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline">About Our Team</Link>
          </li>
        </ul>
      </div>
      <div className="text-center md:text-right flex-1">
        <div className="font-bold text-lg mb-2">Contact Us</div>
        <div className="text-sm opacity-90">
          Email: sihwinners@gmail.com
        </div>
        <div className="text-sm mt-1 opacity-70">
          Phone: Still in progress
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
