import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { Car, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DriverLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login redirect or OTP flow
    navigate('/otp-verify');
  };

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6750a4]/15 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-2xl bg-[#6750a4]/20 border border-[#6750a4]/40 text-[#cfbcff]">
                <Car className="w-8 h-8" />
              </div>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-white">Driver Portal Sign In</h2>
            <p className="text-sm text-[#cbc4d2]">
              Access your autonomous charging reservations and battery telemetry.
            </p>
          </div>

          <Card glow>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email or Mobile Number"
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="name@example.com or +1 555-0192"
                icon={Mail}
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                icon={Lock}
                required
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#cbc4d2]">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#1d1b20] border-[#494551] text-[#6750a4] focus:ring-[#cfbcff]"
                  />
                  <span>Remember this device</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="font-medium text-[#cfbcff] hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
              >
                Sign In to ChargeFlow
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#494551]/60" />
              <span className="text-xs font-semibold text-[#948e9c] uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-[#494551]/60" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9c-.4-.7-.6-1.5-.6-2.3z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                </svg>
                Google
              </Button>

              <Button variant="secondary" size="md">
                <svg className="w-4 h-4 mr-2 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.1-.98.04-2.18.66-2.88 1.48-.62.72-1.16 1.88-.99 3 1.09.08 2.22-.55 2.88-1.38z"/>
                </svg>
                Apple
              </Button>
            </div>
          </Card>

          <p className="text-center text-xs text-[#948e9c]">
            Don't have a driver account?{' '}
            <Link to="/driver/signup" className="text-[#cfbcff] font-semibold hover:text-white transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
