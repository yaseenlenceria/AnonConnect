'use client';

import { AnonConnectUI } from '@/components/anon-connect';
import { motion } from 'framer-motion';
import { Sparkles, Phone, MessageCircle, Globe, Shield } from 'lucide-react';

export default function Home() {
  const getViewportDimensions = () => {
    if (typeof window === 'undefined') {
      return {width: 1920, height: 1080};
    }
    return {width: window.innerWidth, height: window.innerHeight};
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const {width, height} = getViewportDimensions();
          const initialX = Math.random() * width;
          const initialY = Math.random() * height;

          return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{
              x: initialX,
              y: initialY,
            }}
            animate={{
              y: [null, Math.random() * -100 - 100],
              x: [null, Math.random() * 100 - 50],
              opacity: [0.2, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
          );
        })}
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 space-y-4 max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block"
        >
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(var(--primary), 0.3)',
                  '0 0 40px rgba(var(--primary), 0.5)',
                  '0 0 20px rgba(var(--primary), 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full blur-xl"
            />
            <h1 className="relative text-5xl sm:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
              AnonConnect
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl sm:text-2xl text-muted-foreground font-medium"
        >
          Connect with strangers worldwide through voice & chat
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mt-6"
        >
          {[
            { icon: Phone, text: 'Voice Calls' },
            { icon: MessageCircle, text: 'Live Chat' },
            { icon: Globe, text: 'Global Match' },
            { icon: Shield, text: 'Anonymous' },
          ].map((feature, idx) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
            >
              <feature.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Main Card with Enhanced Animations */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-2xl blur-xl opacity-30 animate-pulse" />
        <AnonConnectUI />
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center text-sm text-muted-foreground space-y-2"
      >
        <p className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Powered by WebRTC for real-time communication</span>
        </p>
        <p className="text-xs">Your privacy matters. All connections are peer-to-peer and anonymous.</p>
      </motion.div>
    </main>
  );
}
