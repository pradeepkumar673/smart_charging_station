import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { Menu, X, Car, Building2, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#141218]/80 backdrop-blur-xl border-b border-[#494551]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#cbc4d2]">
          <Link
            to="/"
            className={`hover:text-white transition-colors ${
              isCurrent('/') ? 'text-[#cfbcff] font-semibold' : ''
            }`}
          >
            Home
          </Link>
          <a
            href="#features"
            className="hover:text-white transition-colors"
          >
            Network & Features
          </a>
          <a
            href="#owners"
            className="hover:text-white transition-colors"
          >
            Station Owners
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors"
          >
            Technology
          </a>
        </nav>

        {/* Auth CTA Action buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/driver/login">
            <Button variant="ghost" size="sm" icon={Car}>
              Driver Portal
            </Button>
          </Link>
          <Link to="/owner/login">
            <Button variant="brand" size="sm" icon={Building2}>
              Station Owner Console
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#cbc4d2] hover:text-white p-2 rounded-lg bg-[#211f24] border border-[#494551]/60"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1d1b20] border-b border-[#494551] px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#e6e0e9] hover:text-[#cfbcff]"
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#e6e0e9] hover:text-[#cfbcff]"
            >
              Features
            </a>
          </div>
          <div className="pt-4 border-t border-[#494551]/50 space-y-2">
            <Link to="/driver/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" fullWidth icon={Car}>
                Driver Sign In
              </Button>
            </Link>
            <Link to="/owner/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="brand" fullWidth icon={Building2}>
                Owner Console
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
