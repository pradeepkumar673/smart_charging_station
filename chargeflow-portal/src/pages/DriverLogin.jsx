import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Car, Mail, Lock, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';

export default function DriverLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = await login(formData.identifier, formData.password);
      showToast({
        title: 'Welcome back!',
        message: `Logged in successfully as ${user.name}`,
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
                label="Email Address"
                type="email"
                name="identifier"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="driver1@chargeflow.io"
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
                loading={submitting}
                icon={ArrowRight}
                iconPosition="right"
              >
                Sign In to ChargeFlow
              </Button>
            </form>
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
