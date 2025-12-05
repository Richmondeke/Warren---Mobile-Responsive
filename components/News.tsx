import React from 'react';
import { ExternalLink, Calendar, Tag } from 'lucide-react';
import { MOCK_NEWS } from '../constants';

const News: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Market Intelligence</h2>
        <p className="text-slate-500 mt-1">Recent deals, market activity, and ecosystem news.</p>
      </header>

      <div className="grid gap-6">
        {MOCK_NEWS.map((item) => (
          <article key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-1">
                   <span className="font-semibold text-blue-600">{item.source}</span>
                   <span>•</span>
                   <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                   </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.summary}</p>
                
                <div className="pt-3 flex flex-wrap gap-2">
                   {item.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                         <Tag className="w-3 h-3 mr-1" />
                         {tag}
                      </span>
                   ))}
                </div>
              </div>
              <div className="flex-shrink-0">
                 <a href={item.url} className="inline-flex items-center justify-center p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                 </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default News;