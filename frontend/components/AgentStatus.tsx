import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AgentStatus() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-6">
      <div className="relative">
         <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin"></div>
         <ShieldCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-teal-400" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-200">Agent Swarm Active</p>
        <p className="text-sm text-teal-400 animate-pulse mt-1">Critic evaluating &rarr; Coder writing &rarr; Tester compiling</p>
      </div>
    </div>
  );
}