import React, { useState } from 'react';
import { X } from 'lucide-react';

const SplitModal = ({ transaction, onClose }) => {
    const [splitType, setSplitType] = useState('equal');
    const [loading, setLoading] = useState(false);

    const handleSplitSubmit = async () => {
        setLoading(true);
        console.log("Splitting Transaction:", transaction.rowReferenceId);

        setTimeout(() => {
            setLoading(false);
            onClose();
            alert("Split successfully added!");
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-carbon-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-carbon-700/50 animate-fade-up">
                <div className="p-6 border-b border-carbon-800 flex items-center justify-between">
                    <div>
                        <h3 className="font-display text-lg text-carbon-100">Split Expense</h3>
                        <p className="text-sm text-carbon-400 mt-1">
                            {transaction.content.merchant_name_normalized} <span className="text-carbon-600 mx-1">/</span> {'₹'}{transaction.content.amount.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-carbon-400 hover:text-coral-400 hover:bg-coral-400/10 rounded-lg transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-2 bg-sage-400/10 text-sage-400 px-4 py-2.5 rounded-xl text-sm border border-sage-400/15 font-medium">
                        <div className="h-2 w-2 bg-sage-400 rounded-full animate-pulse" />
                        Syncing with Splitwise enabled
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-carbon-400 uppercase tracking-wider mb-3">Split Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSplitType('equal')}
                                className={`p-3.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                                    splitType === 'equal'
                                        ? 'border-amber-400/50 bg-amber-400/10 text-amber-400'
                                        : 'border-carbon-700 hover:border-carbon-600 text-carbon-300'
                                }`}
                            >
                                Equally (=)
                            </button>
                            <button
                                onClick={() => setSplitType('percentage')}
                                className={`p-3.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                                    splitType === 'percentage'
                                        ? 'border-amber-400/50 bg-amber-400/10 text-amber-400'
                                        : 'border-carbon-700 hover:border-carbon-600 text-carbon-300'
                                }`}
                            >
                                By Percentage (%)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label className="block text-xs font-semibold text-carbon-400 uppercase tracking-wider">Participants</label>
                        <div className="flex items-center justify-between p-4 bg-carbon-800/60 rounded-xl border border-carbon-700/40">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-amber-400/15 flex items-center justify-center text-amber-400 text-xs font-bold border border-amber-400/20">ME</div>
                                <span className="text-sm font-medium text-carbon-200">You</span>
                            </div>
                            <span className="text-sm font-mono text-carbon-400">{'₹'}{(transaction.content.amount / 2).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-carbon-800/60 rounded-xl border border-carbon-700/40">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-carbon-700 flex items-center justify-center text-carbon-300 text-xs font-bold border border-carbon-600/50">JD</div>
                                <span className="text-sm font-medium text-carbon-200">John Doe</span>
                            </div>
                            <span className="text-sm font-mono text-carbon-400">{'₹'}{(transaction.content.amount / 2).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-carbon-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="btn-ghost text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSplitSubmit}
                        disabled={loading}
                        className="btn-primary text-sm disabled:opacity-50"
                    >
                        {loading ? 'Syncing...' : 'Confirm Split'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SplitModal;