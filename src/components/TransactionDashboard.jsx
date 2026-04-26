import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet, RefreshCw, AlertCircle, UploadCloud, X } from 'lucide-react';
import { fetchTransactions } from '../services/api';
import SplitModal from './SplitModal';
import TransactionRow from './TransactionRow';
import FileUpload from './FileUpload';

const TransactionDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
        } finally {
            setLoading(false);
        }
    };

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
        <div className="min-h-screen font-body pb-16">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-carbon-800/60 bg-carbon-950/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-400 p-2 rounded-lg shadow-lg shadow-amber-400/20">
                            <Wallet size={18} className="text-carbon-950" />
                        </div>
                        <h1 className="font-display text-xl tracking-tight text-carbon-50">FinTrack</h1>
                    </div>
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 text-sm font-medium btn-ghost"
                        >
                            <UploadCloud size={16} />
                            <span className="hidden sm:inline">Upload</span>
                        </button>
                        <button
                            onClick={loadData}
                            className="p-2 text-carbon-400 hover:text-amber-400 transition-colors rounded-lg hover:bg-carbon-800"
                            title="Refresh"
                        >
                            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                        </button>
                        <div className="h-8 w-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-xs font-bold text-carbon-950 ring-2 ring-carbon-800">
                            SR
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-5 sm:px-8 py-10">

                {/* Summary Card */}
                <div className="card rounded-3xl p-8 mb-10 relative overflow-hidden animate-fade-up">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-400/3 rounded-full blur-3xl -ml-16 -mb-16" />

                    <div className="relative z-10">
                        <p className="text-carbon-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Total Balance</p>
                        <h2 className="font-display text-5xl tracking-tight text-carbon-50 mb-8">
                            <span className="text-carbon-400 text-3xl mr-1">{totals.balance < 0 ? '-' : ''}&#8377;</span>
                            {Math.abs(totals.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </h2>

                        <div className="accent-line mb-8" />

                        <div className="grid grid-cols-2 gap-5">
                            <div className="bg-carbon-800/50 border border-carbon-700/30 rounded-xl p-5">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="bg-sage-400/15 p-1.5 rounded-lg">
                                        <ArrowDownLeft size={14} className="text-sage-400" />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-carbon-400">Income</span>
                                </div>
                                <span className="text-2xl font-semibold text-sage-400">
                                    &#8377;{totals.credit.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="bg-carbon-800/50 border border-carbon-700/30 rounded-xl p-5">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="bg-coral-400/15 p-1.5 rounded-lg">
                                        <ArrowUpRight size={14} className="text-coral-400" />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-carbon-400">Expenses</span>
                                </div>
                                <span className="text-2xl font-semibold text-coral-400">
                                    &#8377;{totals.debit.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-8 p-4 bg-coral-400/10 border border-coral-400/20 text-coral-400 flex items-center gap-3 rounded-xl animate-fade-in">
                        <AlertCircle size={18} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Transactions List */}
                <div>
                    <div className="flex items-end justify-between mb-6">
                        <h3 className="font-display text-2xl text-carbon-100">Recent Transactions</h3>
                        <span className="text-xs font-semibold text-carbon-500 uppercase tracking-wider">{transactions.length} records</span>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="card rounded-xl h-20 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {transactions.map((item, index) => (
                                <TransactionRow
                                    key={item.rowReferenceId}
                                    data={item.content}
                                    onSplit={() => handleOpenSplit(item)}
                                    index={index}
                                />
                            ))}
                            {transactions.length === 0 && !error && (
                                <div className="text-center py-16 text-carbon-500">
                                    <p className="font-display text-xl text-carbon-400 mb-2">No transactions yet</p>
                                    <p className="text-sm">Upload a statement to get started.</p>
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

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80 backdrop-blur-md animate-fade-in">
                    <div className="card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-carbon-700/50 animate-fade-up">
                        <div className="flex items-center justify-between p-5 border-b border-carbon-800">
                            <h3 className="font-display text-lg text-carbon-100">Upload Statement</h3>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="p-2 text-carbon-400 hover:text-coral-400 hover:bg-coral-400/10 rounded-lg transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            <FileUpload onUploadSuccess={() => {
                                loadData();
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionDashboard;