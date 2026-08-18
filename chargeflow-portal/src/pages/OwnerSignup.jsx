import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Stepper from '../components/ui/Stepper';
import { Building2, User, Mail, Phone, Building, ArrowRight, ArrowLeft } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';

export default function OwnerSignup() {
  const navigate = useNavigate();
  const { registerOwner } = useAuth();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: '',
    businessEmail: '',
    phone: '',
    companyName: '',
    gstNumber: '',
    businessAddress: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const steps = [
    { title: 'Owner Info', subtitle: 'Operator contact' },
    { title: 'Company Details', subtitle: 'Business & GST entity' },
    { title: 'Console Security', subtitle: 'Password & terms' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast({
        title: 'Password Mismatch',
        message: 'Passwords do not match. Please verify.',
        type: 'error',
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.ownerName,
        email: formData.businessEmail,
        phone: formData.phone,
        password: formData.password,
        company: {
          companyName: formData.companyName,
          gstNumber: formData.gstNumber || '29AAAAA0000A1Z5',
          businessAddress: formData.businessAddress || 'Bengaluru, Karnataka',
        },
      };

      const user = await registerOwner(payload);
      showToast({
        title: 'Owner Registration Successful!',
        message: `Welcome to ChargeFlow Console, ${user.name}!`,
        type: 'success',
      });

      navigate('/owner/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Owner registration failed.';
      showToast({
        title: 'Registration Error',
        message: errMsg,
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#141218] text-[#e6e0e9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#2D8CFF]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="w-full max-w-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-2xl bg-[#2D8CFF]/20 border border-[#2D8CFF]/40 text-[#36D8FF]">
                <Building2 className="w-8 h-8" />
              </div>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-white">Register Station Owner Account</h2>
            <p className="text-sm text-[#cbc4d2]">
              Onboard your station hardware into the ChargeFlow autonomous grid.
            </p>
          </div>

          <Card className="border-[#2D8CFF]/30">
            <Stepper steps={steps} currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              {/* STEP 1: Owner Details */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <Input
                    label="Station Operator / Owner Name"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Aarav Sharma"
                    icon={User}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Business Email"
                      type="email"
                      name="businessEmail"
                      value={formData.businessEmail}
                      onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                      placeholder="owner@chargeflow.io"
                      icon={Mail}
                      required
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+919876543210"
                      icon={Phone}
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Company Details */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <Input
                    label="Company / Operating Entity Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="GreenCharge Energy Pvt Ltd"
                    icon={Building}
                    required
                  />

                  <Input
                    label="GST Number (Optional)"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    placeholder="29AAAAA0000A1Z5"
                  />

                  <Input
                    label="Business Address"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                    placeholder="100 Feet Road, Indiranagar, Bengaluru, KA"
                    required
                  />
                </div>
              )}

              {/* STEP 3: Security */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <Input
                    label="Owner Console Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 8 characters"
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    required
                  />

                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer text-xs text-[#cbc4d2]">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        className="w-4 h-4 mt-0.5 rounded bg-[#1d1b20] border-[#494551] text-[#2D8CFF] focus:ring-[#36D8FF]"
                        required
                      />
                      <span className="leading-relaxed">
                        I agree to ChargeFlow Operator Terms and station Digital Twin hardware integration guidelines.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 gap-3">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                    icon={ArrowLeft}
                  >
                    Back
                  </Button>
                ) : <div />}

                <Button
                  type="submit"
                  variant="brand"
                  size="lg"
                  loading={submitting}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {currentStep === 3 ? 'Complete Owner Registration' : 'Continue to Next Step'}
                </Button>
              </div>
            </form>
          </Card>

          <p className="text-center text-xs text-[#948e9c]">
            Already an onboarded station owner?{' '}
            <Link to="/owner/login" className="text-[#36D8FF] font-semibold hover:text-white transition-colors">
              Access Owner Console
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
