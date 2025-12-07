import React from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Share2 } from 'lucide-react';

const TransactionRow = ({ data, onSplit }) => {
    const isCredit = data.type === 'credit';
    const date = parseISO(data.transaction_date_iso);

    return (
        <div className="group flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
            <div className="flex items-center gap-4">
                {/* Icon based on category */}
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>

                <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate pr-2">{data.merchant_name_normalized}</p>
                    <p className="text-xs text-gray-500">{format(date, 'MMM dd, yyyy')} • {data.category_inferred}</p>
                </div>
            </div>

            <div className="flex items-center gap-6 pl-2 shrink-0">
        <span className={`font-mono font-medium whitespace-nowrap ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
          {isCredit ? '+' : '-'}₹{data.amount.toLocaleString('en-IN')}
        </span>

                {/* Action Buttons - Visible on Hover */}
                <button
                    onClick={onSplit}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                >
                    <Share2 size={12} /> Split
                </button>
            </div>
        </div>
    );
};

export default TransactionRow;