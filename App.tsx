
import React, { useState, useCallback } from 'react';
import { PoemConfig, PoemMood } from './types';
import { generatePoemStream } from './services/geminiService';
import Snowfall from './components/Snowfall';

const App: React.FC = () => {
  const [config, setConfig] = useState<PoemConfig>({
    mood: PoemMood.PURE,
    length: 'medium',
  });
  const [poem, setPoem] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setPoem('');
    setError(null);
    
    try {
      await generatePoemStream(config, (chunk) => {
        setPoem(prev => prev + chunk);
      });
    } catch (err) {
      setError('无法唤醒诗神，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden">
      <Snowfall />
      
      <header className="z-10 text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-cyan-100 drop-shadow-lg">
          冬之赞歌 <span className="text-2xl font-light italic">Winter Muse</span>
        </h1>
        <p className="text-blue-200 text-lg max-w-xl mx-auto opacity-80">
          在这银装素裹的世界里，让AI为您捕捉每一片飘落的诗意。
        </p>
      </header>

      <main className="z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Controls Section */}
        <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <i className="fas fa-sliders-h text-cyan-400"></i> 定制诗篇
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">诗歌基调</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PoemMood).map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setConfig({ ...config, mood })}
                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 border ${
                      config.mood === mood 
                        ? 'bg-cyan-500/50 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' 
                        : 'bg-white/5 border-white/10 text-blue-200 hover:bg-white/10'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">诗歌长度</label>
              <select
                value={config.length}
                onChange={(e) => setConfig({ ...config, length: e.target.value as any })}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="short">短小精悍 (绝句/短诗)</option>
                <option value="medium">意蕴悠长 (中篇)</option>
                <option value="long">宏大篇章 (长诗)</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading 
                ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-cyan-400/40'
              }`}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-snowflake animate-spin"></i>
                  正在雕琢...
                </>
              ) : (
                <>
                  <i className="fas fa-pen-nib"></i>
                  创作赞歌
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display Section */}
        <div className="lg:col-span-2 min-h-[400px] flex flex-col">
          <div className="flex-grow bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 shadow-inner relative overflow-hidden flex flex-col items-center justify-center">
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/20 rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/20 rounded-br-3xl"></div>

            {error && (
              <div className="text-red-400 flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            {!poem && !isLoading && !error && (
              <div className="text-center">
                <i className="fas fa-feather-alt text-6xl text-white/10 mb-6"></i>
                <p className="text-blue-100/30 italic">点击按钮，开启冬日的灵感之门...</p>
              </div>
            )}

            {poem && (
              <div className="w-full max-w-prose">
                <div className="poem-content whitespace-pre-wrap text-xl md:text-2xl text-blue-50 text-center animate-fade-in font-medium">
                  {poem}
                </div>
              </div>
            )}
            
            {isLoading && poem.length === 0 && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <p className="text-cyan-400/70 animate-pulse text-sm">正在雪地中寻找词句...</p>
              </div>
            )}
          </div>
          
          {poem && !isLoading && (
            <div className="mt-4 flex justify-end gap-3">
              <button 
                onClick={() => navigator.clipboard.writeText(poem)}
                className="text-xs text-blue-300/60 hover:text-blue-100 transition-colors flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full"
              >
                <i className="fas fa-copy"></i> 复制全文
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="z-10 mt-16 text-blue-400/40 text-sm flex items-center gap-4">
        <span>© 2024 Winter Muse</span>
        <span className="w-1 h-1 bg-blue-400/20 rounded-full"></span>
        <span>Powered by Gemini 3.0</span>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
