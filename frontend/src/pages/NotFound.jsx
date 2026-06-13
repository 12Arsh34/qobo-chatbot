import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl relative z-10 text-center border border-slate-800/40">
        <div className="h-12 w-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mx-auto mb-6 shadow-lg shadow-brand-500/5">
          <HelpCircle size={24} />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">404</h1>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 font-medium">The request page was not located inside the application.</p>

        <Link to="/" className="inline-block">
          <Button variant="primary" className="px-6 py-2.5 rounded-xl font-semibold cursor-pointer">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
