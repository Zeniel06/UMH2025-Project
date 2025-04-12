// DonationComponent.jsx
import { useState } from 'react';
import { X, Check, AlertTriangle, ArrowRight } from 'lucide-react';

const DonationComponent = ({ need, onClose }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('e-wallet');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
  // Hardcoded payment methods for demonstration
  const paymentMethods = [
    { id: 'e-wallet', name: 'E-Wallet', description: 'Touch n Go, Boost, GrabPay', icon: '💳' },
    { id: 'islamic-bank', name: 'Islamic Bank', description: 'Bank Islam, Maybank Islamic', icon: '🏦' },
    { id: 'duitnow', name: 'DuitNow', description: 'Transfer via DuitNow', icon: '📱' },
    { id: 'zakat', name: 'Zakat Portal', description: 'Official Zakat channels', icon: '🕌' }
  ];
  
  const handleDonate = () => {
    // In a real implementation, this would connect to a payment gateway
    // For demo purposes, we're just simulating a successful payment
    
    // Generate a mock transaction ID
    const mockTxId = 'TX' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setTransactionId(mockTxId);
    setShowConfirmation(true);
    
    // In a real application, you would:
    // 1. Connect to a payment gateway API
    // 2. Process the payment
    // 3. Store transaction details
    // 4. Update the funding status of the need
  };
  
  // Display Shariah compliance badge
  const ShariahBadge = () => (
    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
      <Check size={12} />
      <span>Shariah Certified</span>
    </div>
  );
  
  // Confirmation screen after successful donation
  const ConfirmationScreen = () => (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check size={30} />
      </div>
      
      <h3 className="text-xl font-medium mb-2">Thank You For Your Donation!</h3>
      <p className="text-gray-600 mb-4">Your contribution of RM {amount} to "{need.title}" has been received.</p>
      
      <div className="bg-gray-50 p-3 rounded-lg mb-4 text-left">
        <div className="text-sm text-gray-500 mb-1">Transaction ID</div>
        <div className="font-mono text-sm">{transactionId}</div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button 
          onClick={() => window.open(`mailto:?subject=I just donated to ${need.title}&body=I donated to help with "${need.title}". You can contribute too at https://humanitarian-insight.my/need/${need.id}`)}
          className="bg-blue-50 text-blue-600 border border-blue-200 py-2 rounded-md text-sm font-medium flex items-center justify-center"
        >
          Share with others
        </button>
        <button 
          onClick={onClose}
          className="bg-gray-50 text-gray-600 py-2 rounded-md text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Donate to {need.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        {!showConfirmation ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium">
                  Donation Amount (MYR)
                </label>
                <ShariahBadge />
              </div>
              
              <div className="flex gap-2 mb-3">
                {[50, 100, 250, 500].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className={`flex-1 py-2 rounded-md text-sm ${
                      amount === preset.toString() 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    RM {preset}
                  </button>
                ))}
              </div>
              
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter custom amount"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Payment Method
              </label>
              <div className="space-y-2">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    className={`w-full p-3 border rounded-md flex items-center ${
                      paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="text-2xl mr-3">{method.icon}</div>
                    <div className="text-left">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-xs text-gray-500">{method.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={() => setIsRecurring(!isRecurring)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700">
                  Make this a monthly donation
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Donate anonymously
                </label>
              </div>
              
              <div className="flex items-center bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                <span>Your donation is tax-deductible and will receive a receipt.</span>
              </div>
            </div>
            
            <div className="mb-6 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span>Donation amount:</span>
                <span className="font-medium">RM {amount || '0'}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Processing fee:</span>
                <span className="font-medium">RM 0 (Waived)</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200 mt-2">
                <span>Total:</span>
                <span>RM {amount || '0'}</span>
              </div>
            </div>
            
            <button 
              onClick={handleDonate}
              disabled={!amount}
              className={`w-full py-3 rounded-md font-medium flex items-center justify-center ${
                amount ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Complete Donation <ArrowRight size={16} className="ml-2" />
            </button>
            
            <div className="mt-4 text-xs text-center text-gray-500">
              By donating, you agree to our Terms of Service and Privacy Policy.
              <br />
              All donations will be tracked transparently with unique IDs.
            </div>
          </div>
        ) : (
          <ConfirmationScreen />
        )}
      </div>
    </div>
  );
};

export default DonationComponent;