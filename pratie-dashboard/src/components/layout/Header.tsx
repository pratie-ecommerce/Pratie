'use client';

import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-[#0f1013] border-b border-white/10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold">
          Atelier System Admin
        </span>
        <span className="text-gray-500">•</span>
        <span className="text-xs text-gray-400">Node REST API Connected (Port 5001)</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <ShieldCheck size={14} className="text-green-400" />
          <span>RBAC: Superadmin Access</span>
        </div>

        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <div className="w-8 h-8 rounded-full bg-[#c5a059] text-black font-bold flex items-center justify-center text-xs">
            AS
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-white block">Aarav Singhania</span>
            <span className="text-[10px] text-gray-400 block">Lead Director</span>
          </div>
        </div>
      </div>
    </header>
  );
};
