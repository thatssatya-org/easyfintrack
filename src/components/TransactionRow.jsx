import React from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Share2, ShoppingBag, Coffee, Utensils, Smartphone, CreditCard } from 'lucide-react';

const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('food') || cat.includes('dining')) return <Utensils size={20} />;
    if (cat.includes('shopping')) return <ShoppingBag size={20} />;
    if (cat.includes('digital') || cat.includes('services')) return <Smartphone size={20} />;
    if (cat.includes('payment')) return <CreditCard size={20} />;
    return <Coffee size={20} />;
};

const TransactionRow = ({ data, onSplit, index }) => {
    const isCredit = data.type === 'credit';
    const date = parseISO(data.transaction_date_iso);

    return (
        <div
            className="group flex items-center justify-between p-4 glass-card rounded-xl hover:bg-white/80 transition-all cursor-default"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center gap-4">
                {/* Icon based on category */}
                <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${isCredit ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {isCredit ? <ArrowDownLeft size={24} /> : getCategoryIcon(data.category_inferred)}
                </div>

                <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate pr-2 text-base">{data.merchant_name_normalized}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{format(date, 'MMM dd')} • {data.category_inferred}</p>
                </div>
            </div>

            <div className="flex items-center gap-6 pl-2 shrink-0">
                <span className={`font-mono font-bold text-lg whitespace-nowrap ${isCredit ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {isCredit ? '+' : '-'}₹{data.amount.toLocaleString('en-IN')}
                </span>

                {/* Action Buttons - Visible on Hover */}
                <button
                    onClick={(e) => { e.stopPropagation(); onSplit(); }}
                    className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-md active:scale-95 flex items-center gap-2"
                >
                    <Share2 size={14} /> Split
                </button>
            </div>
        </div>
    );
};

export default TransactionRow;