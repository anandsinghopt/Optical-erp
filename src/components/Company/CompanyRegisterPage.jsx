import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, app } from '../../firebase-config';

const db = getFirestore(app);

// Extracted country list for maintainability
const COUNTRY_LIST = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Zambia", "Zimbabwe", "Other"
];

export default function CompanyRegisterPage() {
  const [form, setForm] = useState({
    companyName: '', brandName: '', companyPhone: '', companyAddress: '', city: '',
    state: '', zip: '', country: '', website: '', industry: '', gstNumber: '',
    licenseNumber: '', branches: '', services: '', language: 'en', currency: 'INR',
    timeZone: 'Asia/Kolkata', invoicePrefix: '', businessHours: '', multiBranch: false,
    plan: 'Free', adminName: '', email: '', password: '', confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

    const handleRegister = async (e) => {
      e.preventDefault();
      setMessage('');
      setMessageType('');
      if (form.password !== form.confirmPassword) {
        setMessage("Passwords do not match");
        setMessageType('error');
        return;
      }
      try {
        setLoading(true);
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;
        const { password, confirmPassword, ...companyData } = form;
        await setDoc(doc(db, 'companies', user.uid), {
          ...companyData,
          adminEmail: form.email,
          createdAt: serverTimestamp(),
        });
        await sendEmailVerification(user);
        setMessage("Registration successful! Please check your email for verification.");
        setMessageType('success');
      } catch (error) {
        setMessage(error.message);
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div>
        <div className="absolute top-6 Left-6">
          <img src={require('../../small.jpg')} alt="Logo" className="w-52 h-20 object-contain" />
        </div>
        {/* Outer Container */}
        <div className="flex justify-end min-h-screen items-center bg-gray-100">
          <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-6xl">
            <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">Company Registration</h1>
            {/* Form Container */}
            <form onSubmit={handleRegister}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <h2 className="text-lg font-bold text-blue-600 border-b pb-1 mb-4">🏢 Company Info</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-1">Legal Company Name</label>
                      <input name="companyName" value={form.companyName} onChange={handleChange} className="form-input-custom" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Brand/Store Name</label>
                      <input name="brandName" value={form.brandName} onChange={handleChange} className="form-input-custom" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Company Phone</label>
                      <input name="companyPhone" value={form.companyPhone} onChange={handleChange} className="form-input-custom" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Website</label>
                      <input name="website" value={form.website} onChange={handleChange} className="form-input-custom" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">GST Number</label>
                      <input name="gstNumber" value={form.gstNumber} onChange={handleChange} className="form-input-custom" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">License Number</label>
                      <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} className="form-input-custom" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Address</label>
                      <input name="companyAddress" value={form.companyAddress} onChange={handleChange} className="form-input-custom" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">City</label>
                      <input name="city" value={form.city} onChange={handleChange} className="form-input-custom" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">State</label>
                      <input name="state" value={form.state} onChange={handleChange} className="form-input-custom" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">ZIP Code</label>
                      <input name="zip" value={form.zip} onChange={handleChange} className="form-input-custom" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Country</label>
                      <select name="country" value={form.country} onChange={handleChange} className="form-input-custom" required>
                        <option value="">Select Country</option>
                        {COUNTRY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Industry</label>
                      <select name="industry" value={form.industry} onChange={handleChange} className="form-input-custom" required>
                        <option value="">Select Industry</option>
                        <option value="optical">Optical</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="retail">Retail</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Number of Branches</label>
                      <input name="branches" value={form.branches} onChange={handleChange} className="form-input-custom" type="number" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Services Offered (comma separated)</label>
                      <input name="services" value={form.services} onChange={handleChange} className="form-input-custom" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Invoice Prefix</label>
                      <input name="invoicePrefix" value={form.invoicePrefix} onChange={handleChange} className="form-input-custom" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Business Hours</label>
                      <input name="businessHours" value={form.businessHours} onChange={handleChange} className="form-input-custom" />
                    </div>
                  </div>
                </div>
                {/* Right Column */}
                <div>
                  <h2 className="text-lg font-bold text-blue-600 border-b pb-1 mb-4">👤 Admin & Config</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-1">Admin Full Name</label>
                      <input name="adminName" value={form.adminName} onChange={handleChange} className="form-input-custom" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Admin Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input-custom" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Password</label>
                      <input name="password" type="password" value={form.password} onChange={handleChange} className="form-input-custom" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Confirm Password</label>
                      <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="form-input-custom" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Language</label>
                      <select name="language" value={form.language} onChange={handleChange} className="form-input-custom">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Currency</label>
                      <select name="currency" value={form.currency} onChange={handleChange} className="form-input-custom">
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Time Zone</label>
                      <select name="timeZone" value={form.timeZone} onChange={handleChange} className="form-input-custom">
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="Asia/Dubai">Asia/Dubai</option>
                        <option value="Asia/Singapore">Asia/Singapore</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Plan</label>
                      <select name="plan" value={form.plan} onChange={handleChange} className="form-input-custom">
                        <option value="Free">Free</option>
                        <option value="Basic">Basic</option>
                        <option value="Pro">Pro</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" name="multiBranch" checked={form.multiBranch} onChange={handleChange} className="h-5 w-5 text-blue-600" />
                        <span>Enable Multi-Branch</span>
                      </label>
                    </div>
                    {message && <p className={`text-sm font-semibold ${messageType === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
                    <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold">
                      {loading ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <style>{`
          .form-input-custom {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            border: 1.5px solid #cbd5e1;
            background: #f8fafc;
            font-size: 1rem;
            margin-bottom: 0.25rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .form-input-custom:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 2px #93c5fd66;
            background: #fff;
          }
          `}</style>
          </div>
        </div>
      </div>
    );
  }