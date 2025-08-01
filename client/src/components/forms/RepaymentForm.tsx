import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loan } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatBTC, calculateRepaymentAmount } from '@/lib/utils';
import { useUserWallet } from '@/hooks/use-wallet';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  amount: z.number().min(0.001, {
    message: "Amount must be at least 0.001 BTC",
  }),
});

interface RepaymentFormProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RepaymentForm({ loan, isOpen, onClose, onSuccess }: RepaymentFormProps) {
  const { toast } = useToast();
  const { wallet } = useUserWallet();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate remaining to be paid (in a real app this would come from the backend)
  const totalToBePaid = calculateRepaymentAmount(loan.amount, loan.interest, loan.durationMonths);
  
  // For demo purposes, assume 50% has been paid already if the loan is active
  const alreadyPaid = loan.status === 'active' ? totalToBePaid * 0.5 : 0;
  const remainingAmount = totalToBePaid - alreadyPaid;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: Number(remainingAmount.toFixed(4)),
    },
  });

  const userBalance = wallet.isConnected && wallet.balance 
    ? parseFloat(wallet.balance) 
    : user?.btcBalance || 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.amount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough BTC to make this repayment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', `/api/loans/${loan.id}/repay`, { amount: values.amount });
      
      toast({
        title: "Repayment Successful",
        description: `You have successfully repaid ${formatBTC(values.amount)}.`,
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process the repayment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] glass-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold">Loan Repayment</DialogTitle>
          <DialogDescription className="text-gray-700">
            Make a repayment for your {formatBTC(loan.amount)} loan.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total to be paid:</span>
                <span className="font-medium text-gray-900">{formatBTC(totalToBePaid)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Already paid:</span>
                <span className="font-medium text-gray-900">{formatBTC(alreadyPaid)}</span>
              </div>
              
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-900">Remaining balance:</span>
                <span className="text-gray-900">{formatBTC(remainingAmount)}</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
              <span className="text-sm text-gray-600">Your wallet balance:</span>
              <span className="font-medium text-gray-900">{formatBTC(userBalance)}</span>
            </div>
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-medium">Repayment Amount (BTC)</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      className="w-full p-3 glass-input-dark rounded-md"
                      step={0.001}
                      min={0.001}
                      max={userBalance}
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-600">
                    Enter the amount you want to repay
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-3 justify-end">
              <Button type="button" onClick={onClose} className="glass-button-outline">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="glass-button-primary"
                disabled={isSubmitting || form.watch('amount') > userBalance}
              >
                {isSubmitting ? "Processing..." : "Make Repayment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
