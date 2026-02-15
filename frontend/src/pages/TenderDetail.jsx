import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  IndianRupee,
  FileText,
  ExternalLink,
  Share2,
  Bookmark
} from 'lucide-react';

const TenderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock tender data - in real app, fetch by ID
  const tender = {
    id: 1,
    title: 'Supply of Laboratory Equipment for Chemistry Lab',
    description: 'The Kerala University invites bids for the supply and installation of laboratory equipment for the Chemistry Department. The equipment includes spectrophotometers, centrifuges, pH meters, and other essential lab instruments. The vendor must provide installation, training, and one-year maintenance support.',
    organization: {
      name: 'Kerala University',
      department: 'Department of Chemistry',
      address: 'Palayam, Thiruvananthapuram, Kerala 695034',
      contact: '0471-2305738',
      email: 'purchase@keralauniversity.ac.in'
    },
    location: {
      state: 'Kerala',
      district: 'Thiruvananthapuram',
      city: 'Thiruvananthapuram'
    },
    category: {
      primary: 'Laboratory Equipment',
      subcategory: 'Scientific Instruments',
      tags: ['chemistry', 'spectrophotometer', 'centrifuge', 'lab equipment']
    },
    financial: {
      estimatedValue: 500000,
      emdAmount: 25000,
      currency: 'INR'
    },
    dates: {
      publishedDate: '2024-02-15',
      bidOpeningDate: '2024-03-16',
      bidClosingDate: '2024-03-15',
      preBidMeeting: '2024-03-01'
    },
    documents: [
      { name: 'Tender Notice.pdf', size: '245 KB' },
      { name: 'Technical Specifications.pdf', size: '1.2 MB' },
      { name: 'Terms and Conditions.pdf', size: '580 KB' }
    ],
    eligibility: {
      experience: 'Minimum 3 years in supply of lab equipment',
      turnover: 'Minimum ₹10 Lakhs per year',
      registration: ['GST Registered', 'MSME Certified']
    },
    source: {
      website: 'https://etenders.kerala.gov.in',
      url: 'https://etenders.kerala.gov.in/tender/12345'
    }
  };

  const daysLeft = Math.ceil((new Date(tender.dates.bidClosingDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/tenders')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tender Details</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  daysLeft > 7 
                    ? 'bg-green-100 text-green-800' 
                    : daysLeft > 0 
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}
                </span>
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                  {tender.category.primary}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {tender.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {tender.organization.name}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {tender.location.city}, {tender.location.state}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {tender.description}
              </p>
            </div>

            {/* Key Dates */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Dates</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500">Published Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{tender.dates.publishedDate}</p>
                </div>
                <div className={`p-4 rounded-lg ${daysLeft <= 7 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
                  <p className="text-sm text-gray-500">Bid Closing</p>
                  <p className={`font-medium ${daysLeft <= 7 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                    {tender.dates.bidClosingDate}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500">Bid Opening</p>
                  <p className="font-medium text-gray-900 dark:text-white">{tender.dates.bidOpeningDate}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500">Pre-Bid Meeting</p>
                  <p className="font-medium text-gray-900 dark:text-white">{tender.dates.preBidMeeting}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h2>
              <div className="space-y-3">
                {tender.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{doc.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Financial Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Estimated Value</p>
                  <p className="text-2xl font-bold text-primary-600 flex items-center gap-1">
                    <IndianRupee className="w-6 h-6" />
                    {(tender.financial.estimatedValue / 100000).toFixed(2)}L
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">EMD Amount</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{(tender.financial.emdAmount / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organization</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">{tender.organization.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-700 dark:text-gray-300">{tender.organization.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="text-gray-700 dark:text-gray-300">{tender.organization.contact}</p>
                </div>
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Eligibility</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Experience Required</p>
                  <p className="text-gray-700 dark:text-gray-300">{tender.eligibility.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Annual Turnover</p>
                  <p className="text-gray-700 dark:text-gray-300">{tender.eligibility.turnover}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Required Registrations</p>
                  <div className="flex flex-wrap gap-2">
                    {tender.eligibility.registration.map((reg, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Source */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Source</h2>
              <a 
                href={tender.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                Visit Original
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-xs text-gray-500 mt-2">{tender.source.website}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TenderDetail;