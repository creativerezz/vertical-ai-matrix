import React from 'react';
import { Sparkles } from 'lucide-react';

interface MatrixCellProps {
  industry: string;
  department: string;
  onClick: () => void;
  isActive: boolean;
}

const MatrixCell: React.FC<MatrixCellProps> = ({ industry, department, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full h-32 p-4 border border-slate-200 transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center text-center gap-2
        hover:scale-[1.02] hover:shadow-lg hover:z-10 hover:border-blue-400
        ${isActive ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200 z-20 shadow-xl scale-[1.05]' : 'bg-white hover:bg-slate-50'}
      `}
    >
      <div className={`
        p-2 rounded-full transition-colors duration-300
        ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}
      `}>
        <Sparkles size={16} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{department}</span>
        <span className="text-xs text-slate-400">in {industry}</span>
      </div>
    </button>
  );
};

export default MatrixCell;
