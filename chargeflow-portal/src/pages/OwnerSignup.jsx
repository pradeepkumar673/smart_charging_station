import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Stepper from '../components/ui/Stepper';
import { Building2, User, Mail, Phone, Building, MapPin, Zap, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';

export default function OwnerSignup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    ownerName: '',
    businessEmail: '',
    phone: '',
    companyName: '',
    stationName: '',
    address: '',
    slotsCount: '4',
    chargerType: 'DC_FAST_150KW',
    basePrice: '0.35',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const steps = [
    { title: 'Owner Info', subtitle: 'Operator contact & company' },
    { title: 'Station Hardware', subtitle: 'Location & charger specs' },
    { title: 'Console Security', subtitle: 'Password & terms' },
  ];

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/otp-verify');
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
            <h2 className="font-headline text-3xl font-extrabold text-white">Register Charging Station</h2>
            <p className="text-sm text-[#cbc4d2]">
              Onboard your station hardware into the ChargeFlow autonomous grid.
            </p>
          </div>

          <Card className="border-[#2D8CFF]/30">
            <Stepper steps={steps} currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

            <form onSubmit={handleNext} className="space-y-5 pt-2">
              {/* STEP 1: Owner Details */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <Input
                    label="Station Operator / Owner Name"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Marcus Vance"
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
                      placeholder="mvance@powergrid.io"
                      icon={Mail}
                      required
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 987-6543"
                      icon={Phone}
                      required
                    />
                  </div>

                  <Input
                    label="Company / Operating Entity Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="VoltCharge Networks LLC"
                    icon={Building}
                    required
                  />
                </div>
              )}

              {/* STEP 2: First Station Details */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <Input
                    label="Primary Station Name"
                    name="stationName"
                    value={formData.stationName}
                    onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                    placeholder="ChargeFlow Hub - Downtown Tech Park"
                    required
                  />

                  <Input
                    label="Full Address / Location"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="450 Innovation Way, Suite 100, San Jose, CA"
                    icon={MapPin}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Charging Slots"
                      type="number"
                      name="slotsCount"
                      value={formData.slotsCount}
                      onChange={(e) => setFormData({ ...formData, slotsCount: e.target.value })}
                      placeholder="4"
                      required
                    />

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#cbc4d2]">
                        Hardware Charger Type *
                      </label>
                      <select
                        value={formData.chargerType}
                        onChange={(e) => setFormData({ ...formData, chargerType: e.target.value })}
                        className="w-full rounded-xl bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] text-sm px-4 py-3 focus:outline-none focus:border-[#36D8FF] focus:ring-2 focus:ring-[#36D8FF]/20"
                      >
                        <option value="DC_FAST_150KW">DC Ultra-Fast (150kW - 350kW)</option>
                        <option value="CCS2_COMBO">CCS2 Dual Connector</option>
                        <option value="NACS_SUPERCHARGER">NACS Compatible Bay</option>
                        <option value="AC_LEVEL_2">AC Level 2 (22kW)</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Base Energy Rate ($/kWh)"
                    type="number"
                    step="0.01"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    placeholder="0.35"
                    icon={DollarSign}
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
                        I agree to ChargeFlow Operator Terms, automated revenue settlement agreement, and station Digital Twin hardware integration guidelines.
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
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {currentStep === 3 ? 'Onboard Station' : 'Continue to Station Specs'}
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
