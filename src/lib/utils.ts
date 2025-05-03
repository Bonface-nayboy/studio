import React from 'react';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusStyle(status: string) {
    switch (status.toLowerCase()) {
        case 'pending':
            return { color: 'text-blue-600', icon: React.createElement(Clock, { className: 'h-5 w-5 inline align-middle mr-1 font-bold' }) };
        case 'completed':
            return { color: 'text-green-500', icon: React.createElement(CheckCircle, { className: 'h-5 w-5 mr-1 font-bold' }) };
        case 'cancelled':
            return { color: 'text-red-500', icon: React.createElement(XCircle, { className: 'h-5 w-5 mr-1 font-bold' }) };
        case 'processing':
            return { color: 'text-purple-500', icon: React.createElement(Clock, { className: 'h-5 w-5 mr-1' }) };
        default:
            return { color: 'text-gray-500', icon: null };
    }
}
