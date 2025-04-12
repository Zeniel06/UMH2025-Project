// TransactionTrackingComponent.jsx
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Clock, Download, Share2 } from 'lucide-react';

const TransactionTrackingComponent = ({ transactionId, onClose }) => {
  // In a real implementation, you would fetch this data from your backend
  // This is mock data for demonstration purposes
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch transaction details
    setTimeout(() => {
      setTransaction({
        id: transactionId,
        amount: 250,
        timestamp: new Date().toISOString(),
        cause: 'Flood Relief in Kelantan',
        recipient: 'Malaysian Red Crescent',
        status: 'confirmed',
        disbursements: [
          { 
            id: 'D1',
            amount: 175, 
            purpose: 'Emergency supplies distribution', 
            date: '2025-04-10T10:30:00', 
            status: 'completed',
            beneficiaries: 120
          },
          { 
            id: 'D2',
            amount: 75, 
            purpose: 'Clean water provision', 
            date: '2025-04-12T09:15:00', 
            status: 'pending',
            beneficiaries: 80
          }
        ]
      });
      setLoading(false);
    }, 1500);
  }, [transactionId]);
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading transaction details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!transaction) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="text-center py-8">
            <p className="text-red-600 font-medium">Transaction not found</p>
            <button 
              onClick={onClose} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-orange-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Donation Tracking</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">Transaction ID</div>
            <div className="font-mono bg-gray-50 p-2 rounded border border-gray-200 text-sm">{transaction.id}</div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Donation Amount</div>
              <div className="text-2xl font-bold">RM {transaction.amount}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Status</div>
              <div className="flex items-center">
                <div className={`${getStatusColor(transaction.status)} px-3 py-1 rounded-full text-sm flex items-center`}>
                  {getStatusIcon(transaction.status)}
                  <span className="ml-1 capitalize">{transaction.status}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Donated To</div>
              <div className="font-medium">{transaction.cause}</div>
              <div className="text-sm text-gray-500 mt-1">Managed by {transaction.recipient}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Donation Date</div>
              <div>{formatDate(transaction.timestamp)}</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3">Fund Utilization</h3>
            <div className="space-y-4">
              {transaction.disbursements.map((disbursement) => (
                <div key={disbursement.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium">{disbursement.purpose}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(disbursement.date)}
                      </div>
                    </div>
                    <div className={`${getStatusColor(disbursement.status)} px-3 py-1 rounded-full text-sm flex items-center`}>
                      {getStatusIcon(disbursement.status)}
                      <span className="ml-1 capitalize">{disbursement.status}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Amount</div>
                      <div className="font-medium">RM {disbursement.amount}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Beneficiaries</div>
                      <div className="font-medium">{disbursement.beneficiaries} people</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-800 mb-2">Impact Summary</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                <span>Your donation has helped {transaction.disbursements.reduce((total, d) => total + d.beneficiaries, 0)} people in need.</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                <span>{Math.round((transaction.disbursements.filter(d => d.status === 'completed').reduce((total, d) => total + d.amount, 0) / transaction.amount) * 100)}% of your donation has been utilized so far.</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium flex items-center">
              <Download size={16} className="mr-2" />
              Download Receipt
            </button>
            <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium flex items-center">
              <Share2 size={16} className="mr-2" />
              Share Impact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTrackingComponent;