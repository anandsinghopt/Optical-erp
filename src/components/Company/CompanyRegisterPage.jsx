import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, app } from '../../firebase-config';

const db = getFirestore(app);

// Extracted country list for maintainability
const COUNTRY_LIST = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the",
  "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
  "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other"
];
export default function CompanyRegisterPage() {
  const [form, setForm] = useState({
    companyName: '',
    brandName: '',
    companyPhone: '',
    companyAddress: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    website: '',
    industry: '',
    gstNumber: '',
    licenseNumber: '',
    branches: '',
    services: '',
    language: 'en',
    currency: 'INR',
    timeZone: 'Asia/Kolkata',
    invoicePrefix: '',
    businessHours: '',
    multiBranch: false,
    plan: 'Free',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'error' or 'success'
  const navigate = useNavigate();

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

      await setDoc(doc(db, 'companies', user.uid), {
        ...form,
        adminEmail: form.email,
        createdAt: serverTimestamp(),
      });

      await sendEmailVerification(user);
      setMessage("Registration successful! Please check your email for verification.");
      setMessageType('success');
      navigate('/success');
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg space-y-8">
        <h2 className="text-4xl font-extrabold text-center text-blue-700">Register Your Company</h2>

        <form onSubmit={handleRegister} className="space-y-10">
          {/* Section: Company Information */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">🏢 Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="form-input" name="companyName" required placeholder="Legal Company Name" value={form.companyName} onChange={handleChange} />
              <input className="form-input" name="brandName" placeholder="Brand/Store Name" value={form.brandName} onChange={handleChange} />
              <input className="form-input" name="companyPhone" required placeholder="Company Phone" value={form.companyPhone} onChange={handleChange} />
              <input className="form-input" name="website" placeholder="Website" value={form.website} onChange={handleChange} />
              <input className="form-input" name="gstNumber" placeholder="GST Number" value={form.gstNumber} onChange={handleChange} />
              <input className="form-input" name="licenseNumber" placeholder="License Number" value={form.licenseNumber} onChange={handleChange} />
              <input className="form-input" name="companyAddress" placeholder="Address" value={form.companyAddress} onChange={handleChange} />
              <input className="form-input" name="city" placeholder="City" value={form.city} onChange={handleChange} />
              <input className="form-input" name="state" placeholder="State" value={form.state} onChange={handleChange} />
              <input className="form-input" name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} />
              {/* Country as dropdown */}
              <select className="form-select" name="country" required value={form.country} onChange={handleChange}>
                <option value="">Select Country</option>
                {COUNTRY_LIST.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <select className="form-select" name="industry" required value={form.industry} onChange={handleChange}>
                <option value="">Select Industry</option>
                <option value="optical">Optical</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail</option>
                <option value="other">Other</option>
              </select>
            </div>
          </section>

          {/* Section: Admin Details */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">👤 Admin Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="form-input" name="adminName" required placeholder="Admin Full Name" value={form.adminName} onChange={handleChange} />
              <input className="form-input" name="email" type="email" required placeholder="Admin Email" value={form.email} onChange={handleChange} />
              <input className="form-input" name="password" type="password" required placeholder="Password" value={form.password} onChange={handleChange} />
              <input className="form-input" name="confirmPassword" type="password" required placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} />
            </div>
          </section>

          {/* Section: ERP Configuration */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">⚙️ ERP Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="form-input" name="branches" type="number" placeholder="Number of Branches" value={form.branches} onChange={handleChange} />
              <div>
                <input className="form-input" name="services" placeholder="Services Offered (comma separated)" value={form.services} onChange={handleChange} />
                <small className="text-gray-500">Enter services separated by commas, e.g., "Eye Test, Lens Fitting, Frame Repair"</small>
              </div>
              <input className="form-input" name="invoicePrefix" placeholder="Invoice Prefix" value={form.invoicePrefix} onChange={handleChange} />
              <input className="form-input" name="businessHours" placeholder="Business Hours" value={form.businessHours} onChange={handleChange} />
              <select className="form-select" name="language" value={form.language} onChange={handleChange}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
              </select>
              <select className="form-select" name="currency" value={form.currency} onChange={handleChange}>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
              <select className="form-select" name="timeZone" value={form.timeZone} onChange={handleChange}>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
              </select>
              <select className="form-select" name="plan" value={form.plan} onChange={handleChange}>
                <option value="Free">Free</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <label className="flex items-center space-x-3 mt-2">
                <input type="checkbox" name="multiBranch" checked={form.multiBranch} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <span className="text-gray-700">Enable Multi-Branch</span>
              </label>
            </div>
          </section>

          {message && (
            <p
              className={`text-center text-sm ${
                messageType === 'error'
                  ? 'text-red-500'
                  : messageType === 'success'
                  ? 'text-green-500'
                  : ''
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
