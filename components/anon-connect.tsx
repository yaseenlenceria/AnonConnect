'use client';

import { useAnonConnect } from '@/hooks/use-anon-connect';
import type { Message } from '@/hooks/use-anon-connect';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFormState, useFormStatus } from 'react-dom';
import { submitFeedback } from '@/app/actions';
import { useEffect, useRef, FormEvent } from 'react';
import { countries } from '@/lib/countries';
import { AnonConnectLogo } from '@/components/icons';
import { Globe, Send, SkipForward, PhoneOff, Loader2, Sparkles, MessageCircle } from 'lucide-react';

export function AnonConnectUI() {
  const {
    connectionState,
    messages,
    remoteStream,
    country,
    startSearch,
    endCall,
    sendMessage,
    next,
    setCountry,
    setConnectionState,
  } = useAnonConnect();

  const renderContent = () => {
    switch (connectionState) {
      case 'searching':
        return <SearchingView country={country} />;
      case 'connecting':
        return <SearchingView country={country} isConnecting={true} />;
      case 'connected':
        return (
          <ConnectedView
            messages={messages}
            remoteStream={remoteStream}
            onSendMessage={sendMessage}
            onNext={next}
            onEnd={() => endCall('feedback')}
          />
        );
      case 'feedback':
        return <FeedbackView onFinish={() => setConnectionState('idle')} />;
      case 'error':
        return <ErrorView onTryAgain={() => setConnectionState('idle')} />;
      case 'idle':
      default:
        return (
          <IdleView
            country={country}
            onCountryChange={setCountry}
            onStart={startSearch}
          />
        );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl shadow-primary/10">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <AnonConnectLogo className="w-10 h-10 text-primary" />
          <CardTitle className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
            AnonConnect
          </CardTitle>
        </div>
        <CardDescription>
          Connect with random strangers through voice and chat.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

function IdleView({ country, onCountryChange, onStart }: { country: string; onCountryChange: (c: string) => void; onStart: (c: string) => void; }) {
  return (
    <div className="flex flex-col gap-4">
      <Select value={country} onValueChange={onCountryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a matching region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="global">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> Global
            </div>
          </SelectItem>
          {countries.map(c => (
            <SelectItem key={c.code} value={c.code}>
              <div className="flex items-center gap-2">
                <span>{c.flag}</span> {c.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="lg" onClick={() => onStart(country)} className="w-full">
        Start Connecting
      </Button>
    </div>
  );
}

function SearchingView({ country, isConnecting = false }: { country: string; isConnecting?: boolean; }) {
  const selectedCountry = countries.find(c => c.code === country);
  return (
    <div className="text-center flex flex-col items-center justify-center gap-4 h-64">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="font-semibold text-lg">{isConnecting ? 'Connecting to peer...' : 'Searching for a partner...'}</p>
      <div className="flex items-center gap-2 text-muted-foreground">
        {country === 'global' ? <Globe className="w-4 h-4" /> : <span>{selectedCountry?.flag}</span>}
        <span>{country === 'global' ? 'Global' : selectedCountry?.name}</span>
      </div>
    </div>
  );
}

function ConnectedView({ messages, remoteStream, onSendMessage, onNext, onEnd }: { messages: Message[], remoteStream: MediaStream | null, onSendMessage: (t: string) => void, onNext: () => void, onEnd: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (remoteStream && audioRef.current) {
      audioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  
  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
    if (input.value.trim()) {
      onSendMessage(input.value.trim());
      input.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-4 h-[50vh] max-h-[600px]">
       <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-center gap-3">
          <MessageCircle className="w-6 h-6 text-primary" />
          <p className="font-semibold">You are now connected.</p>
        </div>
      <ScrollArea className="flex-grow p-4 border rounded-md bg-muted/20">
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-3 py-2 max-w-[80%] ${msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSend} className="flex gap-2">
        <Input name="message" placeholder="Type a message..." autoComplete='off' />
        <Button type="submit" size="icon" variant="ghost"><Send /></Button>
      </form>
      <div className="flex justify-center gap-2">
        <Button onClick={onEnd} variant="destructive" className="flex-1"><PhoneOff /> End</Button>
        <Button onClick={onNext} variant="outline" className="flex-1"><SkipForward /> Next</Button>
      </div>
      <audio ref={audioRef} autoPlay playsInline />
    </div>
  );
}

function FeedbackView({ onFinish }: { onFinish: () => void }) {
  const [state, formAction] = useFormState(submitFeedback, null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state) {
      toast({
        title: "💡 Feedback Analysis",
        description: (
          <div>
            <p className="font-semibold">Summary:</p>
            <p className="mb-2">{state.summary}</p>
            <p className="font-semibold">Suggestions:</p>
            <p>{state.suggestedImprovements}</p>
          </div>
        ),
        duration: 20000,
      });
      onFinish();
    }
  }, [state, toast, onFinish]);

  const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" /> Analyze & Submit</>}
      </Button>
    );
  };

  return (
    <div className="flex flex-col gap-4 text-center">
      <h3 className="font-semibold text-lg">Call Ended</h3>
      <p className="text-muted-foreground">How was your experience? Your feedback helps us improve.</p>
      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        <Textarea name="feedback" placeholder="e.g., The connection was choppy, or I couldn't find anyone in my selected country." />
        <SubmitButton />
      </form>
       <Button onClick={onFinish} variant="ghost">Skip</Button>
    </div>
  );
}

function ErrorView({ onTryAgain }: { onTryAgain: () => void }) {
  return (
    <div className="text-center flex flex-col items-center justify-center gap-4 h-64">
      <p className="font-semibold text-lg text-destructive">Connection Error</p>
      <p className="text-muted-foreground">Could not access your microphone. Please check your browser permissions and try again.</p>
      <Button onClick={onTryAgain} variant="outline">Try Again</Button>
    </div>
  );
}
