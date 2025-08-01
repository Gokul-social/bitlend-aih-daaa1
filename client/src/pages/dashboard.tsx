import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatBTC } from '@/lib/utils';
import { MetricCard } from '@/components/shared/MetricCard';
import { LoanTable } from '@/components/shared/LoanTable';
import { TransactionItem } from '@/components/shared/TransactionItem';
import { MarketplaceLoanCard } from '@/components/shared/MarketplaceLoanCard';
import { useToast } from '@/hooks/use-toast';
import { Loan } from '@shared/schema';
import { useUserWallet } from '@/hooks/use-wallet';
import { DashboardLoading } from '@/components/shared/LoadingStates';
import { QuickTips, OnboardingTour } from '@/components/shared/ContextualHelp';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { wallet } = useUserWallet();
  const [showTour, setShowTour] = useState(false);
  
  // Query user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/user/stats'],
  });
  
  // Query active loans
  const { data: activeLoans, isLoading: loansLoading } = useQuery({
    queryKey: ['/api/loans/active'],
  });
  
  // Query recent transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions'],
  });
  
  // Query marketplace loans
  const { data: marketplaceLoans, isLoading: marketplaceLoading } = useQuery({
    queryKey: ['/api/loans/marketplace'],
  });

  const handleViewLoanDetails = (loan: Loan) => {
    setLocation(`/loans/${loan.id}`);
  };

  const handleAcceptLoan = (loan: Loan) => {
    toast({
      title: 'Coming Soon',
      description: 'This feature is under development',
    });
  };

  const recentTransactions = transactions?.slice(0, 3) || [];
  const highlightedMarketplaceLoans = marketplaceLoans?.slice(0, 4) || [];

  // First-time user tour - must be before any conditional returns
  React.useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 2000);
    }
  }, []);

  const tourSteps = [
    {
      target: '.portfolio-overview',
      title: 'Portfolio Overview',
      content: 'Here you can see your lending and borrowing statistics at a glance.',
      position: 'bottom' as const,
    },
    {
      target: '.active-loans',
      title: 'Active Loans',
      content: 'Monitor your current loans and their status here.',
      position: 'top' as const,
    },
    {
      target: '.marketplace-opportunities',
      title: 'Marketplace',
      content: 'Discover new lending and borrowing opportunities.',
      position: 'top' as const,
    },
  ];

  // Show loading state
  if (statsLoading && loansLoading && transactionsLoading && marketplaceLoading) {
    return <DashboardLoading />;
  }

  const handleTourClose = () => {
    setShowTour(false);
    localStorage.setItem('hasSeenDashboardTour', 'true');
  };
  
  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="relative z-10">
        {/* Hero Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="glass-card glass-card-glow p-8 hero-gradient relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                  <span className="text-white">Welcome to BitLend</span>
                </h1>
                <p className="text-xl max-w-2xl leading-relaxed text-white/90">
                  The future of decentralized Bitcoin lending. Secure, transparent, and powered by blockchain technology.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/marketplace">
                    <button className="glass-button text-lg px-8 py-4 w-[220px] h-[60px] flex items-center justify-center micro-bounce text-white font-semibold">
                      <i className="ri-store-2-line mr-3"></i>
                      Explore Marketplace
                    </button>
                  </Link>
                  <Link href="/wallet">
                    <button className="btn-secondary text-lg px-8 py-4 w-[220px] h-[60px] flex items-center justify-center text-white font-semibold">
                      <i className="ri-wallet-3-line mr-3"></i>
                      {wallet.isConnected ? 'Manage Wallet' : 'Connect Wallet'}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Overview */}
        <motion.div
          className="mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <h2 className="text-3xl font-bold mb-4 lg:mb-0 text-white">Portfolio Overview</h2>
            <div className="glass rounded-full px-6 py-3 text-sm portfolio-overview">
              <span className="font-medium flex items-center text-white">
                <i className="ri-time-line mr-2"></i> 
                Last updated: Just now
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeIn}>
              <div className="glass-card glass-card-glow p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="glass rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                    <i className="ri-arrow-down-line text-2xl text-blue-400"></i>
                  </div>
                  <div className="text-right">
                    <div className="glass rounded-full px-3 py-1 text-xs font-medium inline-flex items-center text-green-400">
                      <i className="ri-arrow-up-line mr-1"></i> 12.3%
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="font-medium text-sm text-white/60 mb-1">Total Borrowed</h3>
                  <span className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : formatBTC(stats?.totalBorrowed || 0)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">vs last month</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <div className="glass-card glass-card-glow p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="glass rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                    <i className="ri-arrow-up-line text-2xl text-purple-400"></i>
                  </div>
                  <div className="text-right">
                    <div className="glass rounded-full px-3 py-1 text-xs font-medium inline-flex items-center text-green-400">
                      <i className="ri-arrow-up-line mr-1"></i> 8.7%
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="font-medium text-sm text-white/60 mb-1">Total Lent</h3>
                  <span className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : formatBTC(stats?.totalLent || 0)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">vs last month</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <div className="glass-card glass-card-glow p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="glass rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                    <i className="ri-time-line text-2xl text-green-400"></i>
                  </div>
                  <div className="text-right">
                    <div className="glass rounded-full px-3 py-1 text-xs font-medium inline-flex items-center text-green-400">
                      <i className="ri-add-line mr-1"></i> 2
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="font-medium text-sm text-white/60 mb-1">Active Loans</h3>
                  <span className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : stats?.activeLoans || 0}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">new this week</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <div className="glass-card glass-card-glow p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="glass rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                    <i className="ri-percent-line text-2xl text-yellow-400"></i>
                  </div>
                  <div className="text-right">
                    <div className="glass rounded-full px-3 py-1 text-xs font-medium inline-flex items-center text-green-400">
                      <i className="ri-arrow-up-line mr-1"></i> 5.2%
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="font-medium text-sm text-white/60 mb-1">Interest Earned</h3>
                  <span className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : formatBTC(stats?.interestEarned || 0)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">vs last month</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Active Loans Section */}
        <motion.div 
          className="mb-12 active-loans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-3xl font-bold mb-4 lg:mb-0 text-white">Active Loans</h2>
            <Link href="/loans">
              <button className="btn-secondary px-6 py-3 flex items-center text-white font-semibold">
                View All Loans <i className="ri-arrow-right-line ml-2"></i>
              </button>
            </Link>
          </div>
          
          <div className="glass-card glass-card-glow p-8">
            {loansLoading ? (
              <div className="py-16 text-center">
                <div className="loading-spinner mx-auto mb-6"></div>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Loading your active loans...</p>
              </div>
            ) : activeLoans && activeLoans.length === 0 ? (
              <div className="empty-state">
                <div className="glass rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6 micro-bounce text-white/70">
                  <i className="ri-inbox-line text-4xl"></i>
                </div>
                <h3 className="text-white text-xl font-bold mb-3">No active loans</h3>
                <p className="text-white/80 mb-6">Your journey starts here — explore the marketplace to find lending opportunities and start building your portfolio.</p>
                <Link href="/marketplace">
                  <button className="glass-button text-lg px-8 py-4 text-white font-semibold">
                    Browse Marketplace
                  </button>
                </Link>
              </div>
            ) : (
              <LoanTable 
                loans={activeLoans || []} 
                onViewDetails={handleViewLoanDetails} 
              />
            )}
          </div>
        </motion.div>
        
        {/* Recent Activity Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 marketplace-opportunities"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5
              }
            }
          }}
        >
          {/* Recent Transactions */}
          <motion.div className="lg:col-span-1" variants={fadeIn}>
            <div className="glass-card glass-card-glow p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="glass rounded-xl p-2 mr-3">
                    <i className="ri-exchange-funds-line text-xl text-blue-400"></i>
                  </div>
                  <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                </div>
                <Link href="/transactions">
                  <button className="btn-secondary px-4 py-2 text-sm flex items-center text-white font-semibold">
                    View All <i className="ri-arrow-right-line ml-1"></i>
                  </button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {transactionsLoading ? (
                  <div className="text-center py-12">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Loading transactions...</p>
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="glass rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <i className="ri-file-list-line text-2xl text-white/70"></i>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-white">No transactions yet</h3>
                    <p className="text-sm text-white/70">Your transaction history will appear here</p>
                  </div>
                ) : (
                  recentTransactions.map(transaction => (
                    <div key={transaction.id} className="glass rounded-2xl p-4 transition-all duration-300 hover:bg-white/5">
                      <TransactionItem transaction={transaction} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Marketplace Opportunities */}
          <motion.div className="lg:col-span-2" variants={fadeIn}>
            <div className="glass-card glass-card-glow p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="glass rounded-xl p-2 mr-3">
                    <i className="ri-store-2-line text-xl text-purple-400"></i>
                  </div>
                  <h2 className="text-xl font-bold text-white">Marketplace Opportunities</h2>
                </div>
                <Link href="/marketplace">
                  <button className="btn-secondary px-4 py-2 text-sm flex items-center text-white font-semibold">
                    Browse All <i className="ri-arrow-right-line ml-1"></i>
                  </button>
                </Link>
              </div>
              
              {marketplaceLoading ? (
                <div className="text-center py-20">
                  <div className="loading-spinner mx-auto mb-6"></div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Loading marketplace opportunities...</p>
                </div>
              ) : highlightedMarketplaceLoans.length === 0 ? (
                <div className="empty-state">
                  <div className="glass rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <i className="ri-store-2-line text-4xl text-white/70"></i>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3">No loans available</h3>
                  <p className="text-white/80 mb-6">New opportunities are added daily — check back soon or create your own loan request to get started.</p>
                  <Link href="/marketplace">
                    <button className="glass-button text-lg px-8 py-4 text-white font-semibold">
                      Visit Marketplace
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {highlightedMarketplaceLoans.map(loan => (
                    <div key={loan.id} className="marketplace-card-hover">
                      <MarketplaceLoanCard 
                        loan={loan}
                        rating={4.5}
                        onAccept={handleAcceptLoan}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
      </div>
      
      <QuickTips />
      
      <OnboardingTour
        isOpen={showTour}
        onClose={handleTourClose}
        steps={tourSteps}
      />
    </div>
  );
}