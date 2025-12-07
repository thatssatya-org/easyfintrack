import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchTransactions } from '../services/api';
import SplitModal from './SplitModal';
import TransactionRow from './TransactionRow';

const TransactionDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTransactions();
            setTransactions(data.contents || []);
        } catch (err) {
            console.error("Error loading transactions", err);
            setError("Failed to load transactions. Please try again.");
            // Optional: fallback to mock data if needed for demo
            // import { API_RESPONSE } from '../data/mockData';
            // setTransactions(API_RESPONSE.contents);
        } finally {
            setLoading(false);
        }
    };

    // Helper to calculate totals
    const calculateTotals = () => {
        let credit = 0;
        let debit = 0;
        transactions.forEach(item => {
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
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
            {/* Header */}
            <header className="glass sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-primary p-2 rounded-lg text-white shadow-lg">
                            <Wallet size={20} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">FinTrack</h1>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button onClick={loadData} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Refresh">
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                        <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md border-2 border-white">SR</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Summary Card */}
                <div className="bg-gradient-dark rounded-3xl p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -ml-12 -mb-12"></div>

                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Balance</p>
                        <h2 className="text-4xl font-bold tracking-tight mb-6">₹ {totals.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                    <div className="bg-emerald-400/20 p-1.5 rounded-lg"><ArrowDownLeft size={14} /></div>
                                    <span className="text-xs font-medium uppercase tracking-wide opacity-80">Income</span>
                                </div>
                                <span className="text-xl font-semibold text-white">₹{totals.credit.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 text-rose-400 mb-1">
                                    <div className="bg-rose-400/20 p-1.5 rounded-lg"><ArrowUpRight size={14} /></div>
                                    <span className="text-xs font-medium uppercase tracking-wide opacity-80">Expenses</span>
                                </div>
                                <span className="text-xl font-semibold text-white">₹{totals.debit.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-lg">
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                {/* Transactions List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                        <span className="text-sm text-slate-500">{transactions.length} records</span>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl p-4 h-20 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((item, index) => (
                                <TransactionRow
                                    key={item.rowReferenceId}
                                    data={item.content}
                                    onSplit={() => handleOpenSplit(item)}
                                    index={index}
                                />
                            ))}
                            {transactions.length === 0 && !error && (
                                <div className="text-center py-12 text-slate-500">
                                    No transactions found.
                                </div>
                            )}
                        </div>
                    )}
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