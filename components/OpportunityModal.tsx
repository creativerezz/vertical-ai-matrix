import React, { useState, useEffect } from 'react';
import { X, Search, ExternalLink, Loader2, BrainCircuit, Share2, Check } from 'lucide-react';
import { OpportunityData, MarketResearchData } from '../types';
import { generateStartupOpportunity, conductMarketResearch } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface OpportunityModalProps {
  industry: string;
  department: string;
  onClose: () => void;
}

const OpportunityModal: React.FC<OpportunityModalProps> = ({ industry, department, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OpportunityData | null>(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchData, setResearchData] = useState<MarketResearchData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await generateStartupOpportunity(industry, department);
        if (mounted) setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [industry, department]);

  const handleMarketResearch = async () => {
    if (!data) return;
    setResearchLoading(true);
    try {
      const query = `Startups or companies doing "${data.opportunityTitle}" or "${data.agentSolution}" in ${industry}`;
      const result = await conductMarketResearch(query);
      setResearchData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setResearchLoading(false);
    }
  };

  const handleShare = async () => {
    if (!data) return;

    const shareText = `🚀 New Startup Opportunity: ${data.opportunityTitle}\n\n🔴 Pain Point: ${data.painPoint}\n\n✨ Solution: ${data.agentSolution}\n\n#LeanAI #Startup #GenAI`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: data.opportunityTitle,
          text: shareText,
        });
      } catch (err) {
        console.log('Share failed or canceled:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              {loading ? 'Analyzing Matrix...' : (data?.opportunityTitle || 'Opportunity Analysis')}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Intersection: <span className="font-semibold text-blue-600">{industry}</span> x <span className="font-semibold text-blue-600">{department}</span></p>
          </div>
          <div className="flex items-center gap-2">
            {!loading && data && (
              <button 
                onClick={handleShare}
                className={`p-2 rounded-full transition-colors flex items-center gap-1 ${
                  copied ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-200 text-slate-500 hover:text-blue-600'
                }`}
                title="Share Opportunity"
              >
                {copied ? <Check size={20} /> : <Share2 size={20} />}
                {copied && <span className="text-xs font-medium pr-1">Copied</span>}
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 animate-pulse rounded-full"></div>
                <BrainCircuit size={64} className="text-blue-600 animate-pulse relative z-10" />
              </div>
              <p className="text-slate-500 font-medium">Gemini is thinking deeply...</p>
              <p className="text-slate-400 text-sm">Identifying high-cost, manual workflows suitable for AI agents.</p>
            </div>
          ) : data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              {/* Left Column: The Problem & Solution */}
              <div className="space-y-6">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
                    🚫 The Manual Pain Point
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{data.painPoint}</p>
                </div>

                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                  <h3 className="text-emerald-800 font-semibold mb-2 flex items-center gap-2">
                    ✨ The Agent Solution
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{data.agentSolution}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-slate-800 font-semibold mb-2">💰 Business Impact</h3>
                  <p className="text-slate-600">{data.impact}</p>
                </div>
              </div>

              {/* Right Column: Target & Why Now + Research */}
              <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-slate-800 font-semibold mb-2">🎯 Target User</h3>
                  <p className="text-slate-600">{data.targetUser}</p>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-blue-800 font-semibold mb-2">🚀 Why Now?</h3>
                  <p className="text-slate-700">{data.whyNow}</p>
                </div>

                {/* Market Research Section */}
                <div className="pt-4 border-t border-slate-100">
                  {!researchData ? (
                    <button
                      onClick={handleMarketResearch}
                      disabled={researchLoading}
                      className="w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group"
                    >
                      {researchLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                      {researchLoading ? 'Searching Web...' : 'Validate with Google Search'}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Search size={18} className="text-blue-500" />
                        Market Validation
                      </h3>
                      <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <ReactMarkdown className="prose prose-sm max-w-none text-slate-600">
                          {researchData.text || ''}
                        </ReactMarkdown>
                      </div>
                      {researchData.sources && researchData.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {researchData.sources.map((source: any, idx: number) => (
                             source.web?.uri && (
                                <a 
                                  key={idx} 
                                  href={source.web.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors truncate max-w-[200px]"
                                >
                                  <ExternalLink size={10} />
                                  {source.web.title || new URL(source.web.uri).hostname}
                                </a>
                             )
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500">Failed to load data. Please try again.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityModal;