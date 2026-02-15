import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Building2, 
  ArrowLeft,
  LogOut
} from 'lucide-react';

const Tenders = () => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Mock data for now - replace with API call later
    const mockTenders = [
      {
        id: 1,
        title: 'Supply of Laboratory Equipment for Chemistry Lab',
        organization: 'Kerala University',
        location: 'Thiruvananthapuram, Kerala',
        category: 'Laboratory Equipment',
        value: '₹5,00,000',
        closingDate: '2024-03-15',
        status: 'active'
      },
      {
        id: 2,
        title: 'Purchase of Chemicals and Reagents',
        organization: 'Government Medical College',
        location: 'Kochi, Kerala',
        category: 'Chemicals',
        value: '₹2,50,000',
        closingDate: '2024-03-20',
        status: 'active'
      },
      {
        id: 3,
        title: 'Scientific Instruments for Research Center',
        organization: 'IIT Madras',
        location: 'Chennai, Tamil Nadu',
        category: 'Scientific Equipment',
        value: '₹15,00,000',
        closingDate: '2024-03-10',
        status: 'closing_soon'
      }
    ];
    
    setTimeout(() => {
      setTenders(mockTenders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredTenders = tenders.filter(tender => 
    tender.title.toLowerCase().includes(search.toLowerCase()) ||
    tender.organization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tenders</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
            />
          </div>
          <button className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{tenders.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{tenders.filter(t => t.status === 'active').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Closing Soon</p>
            <p className="text-2xl font-bold text-amber-600">{tenders.filter(t => t.status === 'closing_soon').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Kerala</p>
            <p className="text-2xl font-bold text-purple-600">{tenders.filter(t => t.location.includes('Kerala')).length}</p>
          </div>
        </div>

        {/* Tenders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tenders...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTenders.map((tender) => (
              <div 
  key={tender.id}
  onClick={() => navigate(`/tenders/${tender.id}`)}
  className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tender.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tender.status === 'active' ? 'Active' : 'Closing Soon'}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {tender.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {tender.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {tender.organization}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {tender.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Closes: {tender.closingDate}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">{tender.value}</p>
                    <p className="text-xs text-gray-500">Estimated Value</p>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredTenders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No tenders found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tenders;