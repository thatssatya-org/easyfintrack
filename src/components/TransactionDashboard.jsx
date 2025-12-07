import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { API_RESPONSE } from '../data/mockData';
import SplitModal from './SplitModal';
import TransactionRow from './TransactionRow';

const TransactionDashboard = () => {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);

    // Helper to calculate totals
    const calculateTotals = () => {
        let credit = 0;
        let debit = 0;
        API_RESPONSE.contents.forEach(item => {
            const amt = item.content.amount;
            if (item.content.type === 'credit') credit += amt;
            else debit += amt;
        });
        return { credit, debit, balance: credit - debit };
    };

    const totals = calculateTotals();

    const handleOpenSplit = (txn) => {
        setSelectedTransaction(txn);
        setIsSplitModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <Wallet size={20} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">FinTrack</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Analytics</button>
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">SR</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Summary Card */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white mb-8 shadow-lg">
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Net Flow</p>
                    <h2 className="text-3xl font-bold">₹ {totals.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                    <div className="mt-4 flex gap-6">
                        <div className="flex items-center gap-2 text-green-400">
                            <div className="bg-white/10 p-1 rounded"><ArrowDownLeft size={16}/></div>
                            <span className="text-sm font-medium">In: ₹{totals.credit.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-300">
                            <div className="bg-white/10 p-1 rounded"><ArrowUpRight size={16}/></div>
                            <span className="text-sm font-medium">Out: ₹{totals.debit.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {API_RESPONSE.contents.map((item) => (
                            <TransactionRow
                                key={item.rowReferenceId}
                                data={item.content}
                                onSplit={() => handleOpenSplit(item)}
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* Split Modal */}
            {isSplitModalOpen && selectedTransaction && (
                <SplitModal
                    transaction={selectedTransaction}
                    onClose={() => setIsSplitModalOpen(false)}
                />
            )}
        </div>
    );
};

export default TransactionDashboard;