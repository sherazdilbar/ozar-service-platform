'use client';

import { DollarSign, Info } from 'lucide-react';

interface PriceBreakdownProps {
  servicePrice: number;
  platformFee: number;
  total: number;
  currency: string;
}

export default function PriceBreakdown({ servicePrice, platformFee, total, currency }: PriceBreakdownProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-teal-600" />
        Price Breakdown
      </h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Service Price</span>
          <span className="font-medium">{currency} {servicePrice.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span className="flex items-center gap-1">
            Platform Fee
            <Info className="w-4 h-4 text-gray-400" />
          </span>
          <span className="font-medium">{currency} {platformFee.toLocaleString()}</span>
        </div>
        
        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>{currency} {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <span>Platform fee helps us maintain and improve our services</span>
      </div>
    </div>
  );
}
