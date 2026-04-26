import React from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowDownLeft, Share2, ShoppingBag, Utensils, Smartphone, CreditCard, Coffee } from 'lucide-react';

const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('food') || cat.includes('dining')) return <Utensils size={18} />;
    if (cat.includes('shopping')) return <ShoppingBag size={18} />;
    if (cat.includes('digital') || cat.includes('services')) return <Smartphone size={18} />;
    if (cat.includes('payment')) return <CreditCard size={18} />;
    return <Coffee size={18} />;
};

const TransactionRow = ({ data, onSplit, index }) => {
    const isCredit = data.type === 'credit';
    const date = parseISO(data.transaction_date_iso);

    return (
        <div
            className="group flex items-center justify-between p-4 card-hover rounded-xl opacity-0 animate-fade-up cursor-default"
            style={{ animationDelay: `${80 + index * 60}ms` }}
        >
            <div className="flex items-center gap-4">
                <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${
                    isCredit
                        ? 'bg-sage-400/10 text-sage-400 border border-sage-400/20'
                        : 'bg-carbon-800 text-carbon-300 border border-carbon-700/50'
                }`}>
                    {isCredit ? <ArrowDownLeft size={20} /> : getCategoryIcon(data.category_inferred)}
                </div>

                <div className="min-w-0">
                    <p className="font-semibold text-carbon-100 truncate pr-2 text-[15px]">{data.merchant_name_normalized}</p>
                    <p className="text-xs font-medium text-carbon-500 tracking-wide mt-0.5">
                        {format(date, 'MMM dd')} <span className="text-carbon-700 mx-1">/</span> {data.category_inferred}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-5 pl-2 shrink-0">
                <span className={`font-mono font-semibold text-base whitespace-nowrap tracking-tight ${
                    isCredit ? 'text-sage-400' : 'text-carbon-200'
                }`}>
                    {isCredit ? '+' : '-'}{'₹'}{data.amount.toLocaleString('en-IN')}
                </span>

                <button
                    onClick={(e) => { e.stopPropagation(); onSplit(); }}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 btn-primary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-none"
                >
                    <Share2 size={12} /> Split
                </button>
            </div>
        </div>
    );
};

export default TransactionRow;