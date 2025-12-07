import React, { useState } from 'react';

const SplitModal = ({ transaction, onClose }) => {
    const [splitType, setSplitType] = useState('equal'); // 'equal' or 'percentage'
    const [loading, setLoading] = useState(false);

    const handleSplitSubmit = async () => {
        setLoading(true);

        // Simulate API call to your split backend
        console.log("Splitting Transaction:", transaction.rowReferenceId);

        setTimeout(() => {
            setLoading(false);
            onClose();
            alert("Split successfully added!");
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Split Expense</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {transaction.content.merchant_name_normalized} • ₹{transaction.content.amount.toLocaleString('en-IN')}
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Third Party Integration Badge */}
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm border border-green-100">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        Syncing with Splitwise enabled
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Split Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSplitType('equal')}
                                className={`p-3 rounded-lg text-sm font-medium border transition-all ${splitType === 'equal' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                            >
                                Equally (=)
                            </button>
                            <button
                                onClick={() => setSplitType('percentage')}
                                className={`p-3 rounded-lg text-sm font-medium border transition-all ${splitType === 'percentage' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                            >
                                By Percentage (%)
                            </button>
                        </div>
                    </div>

                    {/* Mock Participants UI */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Participants</label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">ME</div>
                                <span className="text-sm font-medium">You</span>
                            </div>
                            <span className="text-sm text-gray-500">₹{(transaction.content.amount / 2).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">JD</div>
                                <span className="text-sm font-medium">John Doe</span>
                            </div>
                            <span className="text-sm text-gray-500">₹{(transaction.content.amount / 2).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSplitSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {loading ? 'Syncing...' : 'Confirm Split'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SplitModal;