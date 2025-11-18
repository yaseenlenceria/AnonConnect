'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Delete, User, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialerProps {
  onCall?: (number: string) => void;
  onRandomCall?: () => void;
  onClose?: () => void;
}

export function Dialer({ onCall, onRandomCall, onClose }: DialerProps) {
  const [dialedNumber, setDialedNumber] = useState('');

  const handleNumberPress = (num: string) => {
    setDialedNumber((prev) => prev + num);
    // Haptic feedback simulation
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleDelete = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (dialedNumber && onCall) {
      onCall(dialedNumber);
      setDialedNumber('');
    }
  };

  const handleRandomCall = () => {
    if (onRandomCall) {
      onRandomCall();
    }
  };

  const dialPadButtons = [
    { value: '1', label: '' },
    { value: '2', label: 'ABC' },
    { value: '3', label: 'DEF' },
    { value: '4', label: 'GHI' },
    { value: '5', label: 'JKL' },
    { value: '6', label: 'MNO' },
    { value: '7', label: 'PQRS' },
    { value: '8', label: 'TUV' },
    { value: '9', label: 'WXYZ' },
    { value: '*', label: '' },
    { value: '0', label: '+' },
    { value: '#', label: '' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Phone className="w-6 h-6 text-primary" />
            Dialer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Display Screen */}
          <div className="bg-muted/50 rounded-xl p-4 min-h-[60px] flex items-center justify-center border-2 border-primary/10">
            <AnimatePresence mode="popLayout">
              {dialedNumber ? (
                <motion.p
                  key={dialedNumber}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-3xl font-mono font-semibold tracking-wider"
                >
                  {dialedNumber}
                </motion.p>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg text-muted-foreground"
                >
                  Enter a number
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Dial Pad */}
          <div className="grid grid-cols-3 gap-3">
            {dialPadButtons.map((button, idx) => (
              <motion.div
                key={button.value}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleNumberPress(button.value)}
                  className={cn(
                    "w-full h-16 text-xl font-semibold rounded-xl",
                    "hover:bg-primary/10 hover:border-primary/40 hover:scale-105",
                    "active:scale-95 transition-all duration-150",
                    "flex flex-col items-center justify-center gap-0"
                  )}
                >
                  <span className="text-2xl">{button.value}</span>
                  {button.label && (
                    <span className="text-[10px] text-muted-foreground font-normal">
                      {button.label}
                    </span>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleRandomCall}
                className="w-full h-16 rounded-xl hover:bg-accent/50 hover:border-accent active:scale-95 transition-all"
              >
                <Shuffle className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Button
                size="lg"
                onClick={handleCall}
                disabled={!dialedNumber}
                className={cn(
                  "w-full h-16 rounded-xl",
                  "bg-gradient-to-r from-green-500 to-green-600",
                  "hover:from-green-600 hover:to-green-700",
                  "active:scale-95 transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Phone className="w-6 h-6" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleDelete}
                disabled={!dialedNumber}
                className="w-full h-16 rounded-xl hover:bg-destructive/10 hover:border-destructive/40 active:scale-95 transition-all disabled:opacity-50"
              >
                <Delete className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          {/* Helper Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-muted-foreground space-y-1"
          >
            <p className="flex items-center justify-center gap-2">
              <Shuffle className="w-4 h-4" />
              Tap shuffle for random stranger
            </p>
            <p className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              Or enter a user ID to call directly
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
