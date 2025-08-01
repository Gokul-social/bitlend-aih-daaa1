import React, { useState } from 'react';
import { UserProfileDropdown } from '@/components/shared/UserProfileDropdown';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export function DesktopHeader() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Get page title based on location
  const getPageTitle = () => {
    switch (location) {
      case '/dashboard':
        return 'Dashboard';
      case '/loans':
        return 'My Loans';
      case '/marketplace':
        return 'Loan Marketplace';
      case '/transactions':
        return 'Transactions';
      case '/wallet':
        return 'Wallet';
      case '/settings':
        return 'Settings';
      default:
        return 'BitLend';
    }
  };

  return (
    <header className="hidden lg:block fixed top-4 left-[340px] right-6 z-30">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search loans, transactions..."
                className="glass-input w-96 pl-12 pr-4 py-3 text-white placeholder-white/70 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-lg"></i>
            </div>
            
            <button className="glass rounded-2xl p-3 relative hover:bg-white/10 transition-all duration-300">
              <i className="ri-notification-3-line text-xl text-white"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center pulse-animation">2</span>
            </button>
            
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}