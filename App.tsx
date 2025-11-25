import React, { useState } from 'react';
import { INDUSTRIES, DEPARTMENTS } from './types';
import MatrixCell from './components/MatrixCell';
import OpportunityModal from './components/OpportunityModal';
import ChatBot from './components/ChatBot';
import { LayoutGrid, Info } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<{ industry: string; department: string } | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
              <LayoutGrid className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                LeanAI Matrix
              </h1>
              <p className="text-xs text-slate-500 font-medium">Service-as-Software Opportunity Finder</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-500">
             <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
               Gemini 3.0 Pro Active
             </span>
             <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
             <a href="#" className="hover:text-blue-600 transition-colors">About</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Find the next <span className="text-blue-600">Unicorn</span> in the grid.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Explore the intersection of industries and job functions. Click any cell to let Gemini's 
            <span className="font-semibold text-slate-800"> Thinking Model</span> analyze high-cost, manual workflows 
            that can be transformed into autonomous software agents.
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-sm">
            <Info size={16} />
            <span>Select a cell below to generate a Service-as-Software concept.</span>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <main className="max-w-[95%] mx-auto px-4 overflow-x-auto pb-12">
        <div className="min-w-[1000px] border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
          {/* Header Row (Departments) */}
          <div className="grid" style={{ gridTemplateColumns: `150px repeat(${DEPARTMENTS.length}, 1fr)` }}>
            <div className="p-4 bg-slate-100 border-b border-r border-slate-200 flex items-end font-semibold text-slate-500 text-sm">
              Industry \ Dept
            </div>
            {DEPARTMENTS.map(dept => (
              <div key={dept} className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm text-center uppercase tracking-wide flex items-center justify-center">
                {dept}
              </div>
            ))}
          </div>

          {/* Matrix Body */}
          <div className="bg-white">
            {INDUSTRIES.map(industry => (
              <div key={industry} className="grid hover:bg-slate-50 transition-colors" style={{ gridTemplateColumns: `150px repeat(${DEPARTMENTS.length}, 1fr)` }}>
                {/* Row Header (Industry) */}
                <div className="p-4 border-r border-b border-slate-200 font-bold text-slate-700 text-sm flex items-center bg-slate-50/50">
                  {industry}
                </div>
                {/* Cells */}
                {DEPARTMENTS.map(dept => (
                  <div key={`${industry}-${dept}`} className="border-b border-slate-100 border-r last:border-r-0 relative">
                     <MatrixCell
                       industry={industry}
                       department={dept}
                       isActive={selectedCell?.industry === industry && selectedCell?.department === dept}
                       onClick={() => setSelectedCell({ industry, department: dept })}
                     />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      {selectedCell && (
        <OpportunityModal
          industry={selectedCell.industry}
          department={selectedCell.department}
          onClose={() => setSelectedCell(null)}
        />
      )}

      <ChatBot />
    </div>
  );
};

export default App;
