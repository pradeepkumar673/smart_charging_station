import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Stepper from '../components/ui/Stepper';
import { Car, User, Mail, Phone, MapPin, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';

export default function DriverSignup() {
  const navigate = useNavigate();
  const { registerDriver } = useAuth();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    vehicleBrand: 'Tesla',
    vehicleModel: 'Model Y',
    batteryCapacity: '75',
    connectorType: 'CCS2',
    registrationNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const steps = [
    { title: 'Personal Info', subtitle: 'Driver profile details' },
    { title: 'Vehicle Specs', subtitle: 'EV hardware & battery' },
    { title: 'Security', subtitle: 'Password & terms' },
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
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        vehicle: {
          make: formData.vehicleBrand,
          model: formData.vehicleModel,
          regNumber: formData.registrationNumber,
          connectorType: formData.connectorType,
          batteryCapacityKWh: Number(formData.batteryCapacity) || 60,
        },
      };

      const user = await registerDriver(payload);
      showToast({
        title: 'Account Created!',
        message: `Welcome to ChargeFlow, ${user.name}!`,
        type: 'success',
      });

      navigate('/driver/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Driver registration failed.';
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6750a4]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="w-full max-w-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-2xl bg-[#6750a4]/20 border border-[#6750a4]/40 text-[#cfbcff]">
                <Car className="w-8 h-8" />
              </div>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-white">Create Driver Account</h2>
            <p className="text-sm text-[#cbc4d2]">
              Join the ChargeFlow autonomous grid for instant charging reservations.
            </p>
          </div>

          <Card glow>
            <Stepper steps={steps} currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              {/* STEP 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Karan Verma"
                    icon={User}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="driver@example.com"
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

                  <Input
                    label="City / Region"
                    name="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Bengaluru, KA"
                    icon={MapPin}
                    required
                  />
                </div>
              )}

              {/* STEP 2: Vehicle Specs */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#cbc4d2]">
                        EV Brand *
                      </label>
                      <select
                        value={formData.vehicleBrand}
                        onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                        className="w-full rounded-xl bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] text-sm px-4 py-3 focus:outline-none focus:border-[#cfbcff] focus:ring-2 focus:ring-[#cfbcff]/20"
                      >
                        <option value="Tesla">Tesla</option>
                        <option value="Tata">Tata Motors</option>
                        <option value="MG">MG Motors</option>
                        <option value="Hyundai">Hyundai / Genesis</option>
                        <option value="Kia">Kia</option>
                        <option value="BMW">BMW</option>
                        <option value="BYD">BYD</option>
                      </select>
                    </div>

                    <Input
                      label="EV Model"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      placeholder="Nexon EV Max / Model Y"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Battery Capacity (kWh)"
                      type="number"
                      name="batteryCapacity"
                      value={formData.batteryCapacity}
                      onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                      placeholder="77.4"
                      icon={Zap}
                      required
                    />

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#cbc4d2]">
                        Preferred Connector *
                      </label>
                      <select
                        value={formData.connectorType}
                        onChange={(e) => setFormData({ ...formData, connectorType: e.target.value })}
                        className="w-full rounded-xl bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] text-sm px-4 py-3 focus:outline-none focus:border-[#cfbcff] focus:ring-2 focus:ring-[#cfbcff]/20"
                      >
                        <option value="CCS2">CCS2 Ultra-Fast</option>
                        <option value="NACS">NACS Standard</option>
                        <option value="Type2">Type 2 AC</option>
                        <option value="CHAdeMO">CHAdeMO</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Vehicle License / Registration"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="KA01EV1234"
                    required
                  />
                </div>
              )}

              {/* STEP 3: Security & Terms */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <Input
                    label="Account Password"
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
                        className="w-4 h-4 mt-0.5 rounded bg-[#1d1b20] border-[#494551] text-[#6750a4] focus:ring-[#cfbcff]"
                        required
                      />
                      <span className="leading-relaxed">
                        I agree to ChargeFlow's <a href="#" className="text-[#cfbcff] underline">Terms of Service</a> and <a href="#" className="text-[#cfbcff] underline">Privacy Policy</a>.
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
                  variant="primary"
                  size="lg"
                  loading={submitting}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {currentStep === 3 ? 'Complete Driver Registration' : 'Continue to Next Step'}
                </Button>
              </div>
            </form>
          </Card>

          <p className="text-center text-xs text-[#948e9c]">
            Already registered?{' '}
            <Link to="/driver/login" className="text-[#cfbcff] font-semibold hover:text-white transition-colors">
              Sign in to Driver Portal
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
