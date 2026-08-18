import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { KeyRound, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6750a4]/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-2xl bg-[#6750a4]/20 border border-[#6750a4]/40 text-[#cfbcff]">
                <KeyRound className="w-8 h-8" />
              </div>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-white">Reset Password</h2>
            <p className="text-sm text-[#cbc4d2]">
              Enter your email or phone to receive a 6-digit verification code.
            </p>
          </div>

          <Card glow>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Registered Email or Mobile"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or +1 555-0192"
                  icon={Mail}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Send Verification Code
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2 animate-fadeIn">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-12 h-12 text-[#22C55E]" />
                </div>
                <h3 className="font-headline font-bold text-xl text-white">Verification Code Sent</h3>
                <p className="text-xs text-[#cbc4d2] leading-relaxed">
                  We've sent a 6-digit verification code to <span className="text-[#cfbcff] font-semibold">{identifier || 'your email/phone'}</span>.
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/otp-verify')}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Proceed to OTP Verification
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <div className="text-center">
            <Link
              to="/driver/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#cfbcff] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
