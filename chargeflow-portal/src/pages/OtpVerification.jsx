import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ShieldCheck, ArrowRight, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OtpVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5].focus();
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setStatus(null);
    inputRefs.current[0].focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      setStatus('error');
      return;
    }

    // Success simulation
    setStatus('success');
    setTimeout(() => {
      navigate('/');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2D8CFF]/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-2xl bg-[#2D8CFF]/20 border border-[#2D8CFF]/40 text-[#36D8FF]">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-white">Verify It's You</h2>
            <p className="text-sm text-[#cbc4d2]">
              We sent a 6-digit security code to <span className="text-[#36D8FF] font-semibold">user@chargeflow.io</span>
            </p>
          </div>

          <Card glow className="text-center">
            {status === 'success' ? (
              <div className="py-6 space-y-3 animate-fadeIn">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-16 h-16 text-[#22C55E] animate-bounce" />
                </div>
                <h3 className="font-headline font-bold text-2xl text-white">Verification Successful!</h3>
                <p className="text-xs text-[#cbc4d2]">
                  Authenticating session with ChargeFlow Grid... Redirecting to portal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 6 Digit Inputs */}
                <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-headline font-extrabold rounded-xl bg-[#1d1b20] border transition-all duration-200 focus:outline-none ${
                        digit
                          ? 'border-[#36D8FF] text-white bg-[#211f24] shadow-md shadow-[#36D8FF]/20'
                          : 'border-[#494551] text-[#e6e0e9] focus:border-[#cfbcff] focus:ring-2 focus:ring-[#cfbcff]/20'
                      } ${status === 'error' ? 'border-[#ffb4ab]' : ''}`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {status === 'error' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-[#ffb4ab]">
                    <AlertCircle className="w-4 h-4" />
                    <span>Please enter all 6 digits of the verification code.</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-[#948e9c]">
                  <span>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-[#36D8FF] font-semibold hover:underline flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Resend Code</span>
                      </button>
                    ) : (
                      <span>Resend code in <strong className="text-white">{timer}s</strong></span>
                    )}
                  </span>

                  <Link to="/forgot-password" className="text-[#cfbcff] hover:underline">
                    Use different contact
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="brand"
                  fullWidth
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Verify and Continue
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
