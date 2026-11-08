'use client';
import { useState } from 'react';
import { Play, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import AgentStatus from '@/components/AgentStatus';
import { optimizeCode } from '@/services/api';

export default function DevTeamDashboard() {
  const [code, setCode] = useState<string>('# Write your Python code here with some bugs\ndef divide_numbers(a, b):\n    return a / b\n\nprint(divide_numbers(10, 0))');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleOptimize = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await optimizeCode(code, language);
      setResult(data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to DevTeam Backend.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 font-sans">
      <header className="mb-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
           <ShieldCheck size={28} />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
          Autonomous DevTeam
        </h1>
        <p className="text-gray-400 mt-2 max-w-xl">
          Multi-agent AI workflow. Critic reviews, Coder fixes, and Tester executes your code continuously until it passes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Code Input Section */}
        <div className="glass-panel overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-white/10 bg-slate-800/50">
            <h2 className="font-semibold text-gray-200">Workspace</h2>
            <select 
              className="bg-slate-900 border border-slate-700 rounded-md px-3 py-1 text-sm outline-none text-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <CodeEditor code={code} onChange={setCode} language={language} height="400px" />
          <div className="p-4 bg-slate-800/30">
            <button 
              onClick={handleOptimize}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={20} />
              {loading ? 'Agents Deploying...' : 'Deploy DevTeam'}
            </button>
          </div>
        </div>

        {/* AI Output Section */}
        <div className="glass-panel p-6 overflow-y-auto h-[530px] custom-scrollbar">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p>Waiting for code submission...</p>
            </div>
          )}

          {loading && <AgentStatus />}

          {result && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-400" />
                  <span className="font-medium text-emerald-100">Workflow Complete</span>
                </div>
                <span className="text-sm text-gray-400">Iterations: {result.iterations}</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Optimized Code</h3>
                <div className="rounded-lg overflow-hidden border border-slate-700 shadow-xl">
                  <CodeEditor code={result.optimized_code} onChange={()=>{}} language={language} readOnly={true} height="200px" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                     <AlertTriangle size={16}/> Critic's Review
                  </h3>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                    {result.feedback}
                  </pre>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-semibold text-teal-400 mb-2">Terminal Output (Tester)</h3>
                  <pre className={`text-xs whitespace-pre-wrap font-mono ${result.logs.includes('ERROR') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {result.logs}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}