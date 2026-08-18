import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Building2, Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';

export default function OwnerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    businessEmail: '',
    password: '',
    rememberDevice: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = await login(formData.businessEmail, formData.password);
      showToast({
        title: 'Console Access Granted',
        message: `Welcome back, ${user.name}! Redirecting to Owner Console...`,
        type: 'success',
      });

      if (user.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/driver/dashboard');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      showToast({
        title: 'Authentication Error',
        message: errMsg,
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative">
        {/* Cyan Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2D8CFF]/15 rounded-full blur-[110px] pointer-events-none -z-10" />

        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-2xl bg-[#2D8CFF]/20 border border-[#2D8CFF]/40 text-[#36D8FF]">
                <Building2 className="w-8 h-8" />
              </div>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-white">Owner Console Sign In</h2>
            <p className="text-sm text-[#cbc4d2]">
              Manage station telemetry, slot availability, and dynamic pricing yield.
            </p>
          </div>

          <Card className="border-[#2D8CFF]/30 shadow-[#2D8CFF]/10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Business Email"
                type="email"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                placeholder="owner1@chargeflow.io"
                icon={Mail}
                required
              />

              <Input
                label="Console Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter console password"
                icon={Lock}
                required
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#cbc4d2]">
                  <input
                    type="checkbox"
                    checked={formData.rememberDevice}
                    onChange={(e) => setFormData({ ...formData, rememberDevice: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#1d1b20] border-[#494551] text-[#2D8CFF] focus:ring-[#36D8FF]"
                  />
                  <span>Trust this console device</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="font-medium text-[#36D8FF] hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="brand"
                fullWidth
                size="lg"
                loading={submitting}
                icon={ArrowRight}
                iconPosition="right"
              >
                Sign In to Owner Console
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#494551]/40 flex items-center justify-between text-xs text-[#948e9c]">
              <div className="flex items-center gap-1.5 text-[#36D8FF]">
                <Activity className="w-4 h-4" />
                <span>Station Digital Twin v2.4</span>
              </div>
              <span>SOC2 Type II Certified</span>
            </div>
          </Card>

          <p className="text-center text-xs text-[#948e9c]">
            Want to register a new charging station?{' '}
            <Link to="/owner/signup" className="text-[#36D8FF] font-semibold hover:text-white transition-colors">
              Onboard your station
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
