import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, X, Maximize2, Search, Play, ShieldCheck, Flame, Zap, LayoutGrid, Trophy, Clock, Dices, Globe, Share2, Copy, Check } from 'lucide-react';
import gamesData from './games.json';
import SnakeGame from './components/SnakeGame.jsx';
import Game2048 from './components/Game2048.jsx';
import FlappyGame from './components/FlappyGame.jsx';
import DinoGame from './components/DinoGame.jsx';
import BreakoutGame from './components/BreakoutGame.jsx';
import MinesweeperGame from './components/MinesweeperGame.jsx';
import SudokuGame from './components/SudokuGame.jsx';
import TetrisGame from './components/TetrisGame.jsx';
import ChessGame from './components/ChessGame.jsx';
import EducationalCloak from './components/EducationalCloak.jsx';

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [useProxy, setUseProxy] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [safeMode, setSafeMode] = useState(false);
  const [isCloaked, setIsCloaked] = useState(true); // Default to cloaked for safety
  const [activeView, setActiveView] = useState('Games'); // 'Games', 'Browser', 'Shortener'
  const [cloakTheme, setCloakTheme] = useState('Davidson'); // 'Davidson', 'Classroom'
  const [customLinks, setCustomLinks] = useState(() => {
    const saved = localStorage.getItem('hub_custom_links');
    return saved ? JSON.parse(saved) : [];
  });
  const [browserUrl, setBrowserUrl] = useState('');
  const [shortenInput, setShortenInput] = useState('');
  const [isShortening, setIsShortening] = useState(false);

  const appUrl = "https://ais-pre-wejmk45zrg3xm4vllvsn5s-108790857818.us-east1.run.app";

  useEffect(() => {
    localStorage.setItem('hub_custom_links', JSON.stringify(customLinks));
  }, [customLinks]);

  const handleShorten = async (e, customUrl = null) => {
    if (e) e.preventDefault();
    const urlToShorten = customUrl || shortenInput;
    if (!urlToShorten) return;

    setIsShortening(true);
    try {
      // Using TinyURL's simple API
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlToShorten)}`);
      if (response.ok) {
        const shortUrl = await response.text();
        const newLink = {
          id: Math.random().toString(36).substr(2, 5),
          url: urlToShorten,
          shortUrl: shortUrl,
          title: new URL(urlToShorten).hostname,
          date: new Date().toLocaleDateString()
        };
        setCustomLinks([newLink, ...customLinks]);
        setShortenInput('');
        return shortUrl;
      }
    } catch (error) {
      console.error("Shortening failed:", error);
      // Fallback to local ID if API fails
      const localId = Math.random().toString(36).substr(2, 5);
      const newLink = {
        id: localId,
        url: urlToShorten,
        shortUrl: `hub.io/s/${localId}`,
        title: new URL(urlToShorten).hostname,
        date: new Date().toLocaleDateString()
      };
      setCustomLinks([newLink, ...customLinks]);
    } finally {
      setIsShortening(false);
    }
  };

  const shareHub = async () => {
    const short = await handleShorten(null, appUrl);
    if (short) {
      navigator.clipboard.writeText(short);
      alert(`Short link copied to clipboard: ${short}\n\nThis link is much safer to share!`);
    }
  };

  useEffect(() => {
    setGames(gamesData);
    
    const handleKeyDown = (e) => {
      // Panic Key: Backquote (`) to toggle cloak instantly
      if (e.code === 'Backquote') {
        e.preventDefault();
        setIsCloaked(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Dynamic Title and Favicon for Stealth
    if (isCloaked) {
      if (cloakTheme === 'Classroom') {
        document.title = "Classes";
        const link = document.querySelector("link[rel~='icon']");
        if (link) link.href = "https://www.gstatic.com/classroom/favicon.png";
      } else {
        document.title = "Davidson Academy | Excellence in Education";
        const link = document.querySelector("link[rel~='icon']");
        if (link) link.href = "https://www.google.com/s2/favicons?domain=davidsonacademy.unr.edu&sz=64";
      }
    } else {
      document.title = "Creative Hub | Unblocked Games";
      const link = document.querySelector("link[rel~='icon']");
      if (link) link.href = "https://www.google.com/s2/favicons?domain=google.com&sz=64";
    }
  }, [isCloaked, cloakTheme]);

  const deleteLink = (id) => {
    setCustomLinks(customLinks.filter(l => l.id !== id));
  };

  if (isCloaked) {
    return (
      <div className="relative group/cloak">
        {cloakTheme === 'Classroom' ? (
          <div className="min-h-screen bg-white font-sans">
            <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center text-white">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xl text-gray-600">Google Classroom</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
              </div>
            </header>
            <main className="max-w-5xl mx-auto py-8 px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['English 101', 'World History', 'Algebra II'].map(course => (
                  <div key={course} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="h-24 bg-emerald-700 p-4 text-white">
                      <h3 className="text-xl font-medium">{course}</h3>
                      <p className="text-sm opacity-80">Period 3</p>
                    </div>
                    <div className="p-4 h-32 bg-white flex items-end justify-end">
                      <div className="w-12 h-12 bg-gray-100 rounded-full border-2 border-white -mb-6 mr-2" />
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        ) : (
          <EducationalCloak />
        )}
        {/* Secret entry button: hidden in the footer or a corner */}
        <button 
          onClick={() => setIsCloaked(false)}
          className="fixed bottom-2 right-2 w-4 h-4 bg-transparent hover:bg-slate-200/10 rounded-full transition-colors z-[9999] cursor-default"
          title="Access Portal"
        />
      </div>
    );
  }

  const categories = ['All', ...new Set(gamesData.map(g => g.category))];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
    const matchesSafeMode = safeMode ? game.type === 'builtin' : true;
    return matchesSearch && matchesCategory && matchesSafeMode;
  });

  const getProxyUrl = (url) => {
    if (!url) return '';
    let decodedUrl = url;
    try {
      // Check if it looks like base64 (starts with 'aHR0c')
      if (url.startsWith('aHR0c')) {
        decodedUrl = atob(url);
      }
    } catch (e) {
      decodedUrl = url;
    }
    
    if (!useProxy) return decodedUrl;
    return `/api/proxy?url=${encodeURIComponent(decodedUrl)}`;
  };

  const launchRandom = () => {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    setSelectedGame(randomGame);
  };

  const launchStealth = (game) => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Please allow popups to use Stealth Mode');
      return;
    }
    
    win.document.title = cloakTheme === 'Classroom' ? 'Classes' : 'Davidson Academy';
    const icon = win.document.createElement('link');
    icon.rel = 'icon';
    icon.href = cloakTheme === 'Classroom' 
      ? 'https://www.gstatic.com/classroom/favicon.png'
      : 'https://www.google.com/s2/favicons?domain=davidsonacademy.unr.edu&sz=64';
    win.document.head.appendChild(icon);

    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    win.document.body.style.overflow = 'hidden';
    win.document.body.style.backgroundColor = '#000';

    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    
    const gameUrl = game.type === 'builtin' 
      ? window.location.origin + '?game=' + game.id 
      : getProxyUrl(game.iframeUrl);
      
    iframe.src = gameUrl;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    
    win.document.body.appendChild(iframe);
  };

  const renderGameContent = (game) => {
    if (game.type === 'builtin') {
      if (game.id === 'snake-builtin') return <SnakeGame />;
      if (game.id === '2048-builtin') return <Game2048 />;
      if (game.id === 'flappy-builtin') return <FlappyGame />;
      if (game.id === 'dino-builtin') return <DinoGame />;
      if (game.id === 'breakout-builtin') return <BreakoutGame />;
      if (game.id === 'minesweeper-builtin') return <MinesweeperGame />;
      if (game.id === 'sudoku-builtin') return <SudokuGame />;
      if (game.id === 'tetris-builtin') return <TetrisGame />;
      if (game.id === 'chess-builtin') return <ChessGame />;
      return <div className="flex items-center justify-center h-full text-slate-500">Game coming soon...</div>;
    }
    return (
      <iframe
        src={getProxyUrl(game.iframeUrl)}
        className="w-full h-full border-none"
        title={game.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="no-referrer"
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f0f12]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
                CREATIVE <span className="text-indigo-500">HUB</span>
              </h1>
              <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase tracking-widest leading-none">
                <ShieldCheck className="w-2.5 h-2.5" />
                Bypass Active
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search 100+ unblocked games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="hidden md:flex items-center gap-3 cursor-pointer group/safe bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/safe:text-slate-300 transition-colors">
                Safe Mode {safeMode ? 'ON' : 'OFF'}
              </span>
              <div 
                onClick={() => setSafeMode(!safeMode)}
                className={`w-10 h-5 rounded-full relative transition-all ${safeMode ? 'bg-emerald-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${safeMode ? 'left-6' : 'left-1'}`} />
              </div>
            </label>
            <button 
              onClick={launchRandom}
              className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all"
            >
              <Dices className="w-4 h-4 text-indigo-400" />
              Random
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex min-h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0f0f12]/50 p-6 gap-8">
          <nav className="flex flex-col gap-1">
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 px-3">Navigation</div>
            <button
              onClick={() => setActiveView('Games')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeView === 'Games' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Games Hub
            </button>
            <button
              onClick={() => setActiveView('Browser')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeView === 'Browser' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4" />
              Stealth Browser
            </button>
            <button
              onClick={() => setActiveView('Shortener')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeView === 'Shortener' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4" />
              Link Shortener
            </button>
          </nav>

          {activeView === 'Games' && (
            <nav className="flex flex-col gap-1">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 px-3">Categories</div>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeCategory === cat 
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {cat === 'All' ? <LayoutGrid className="w-4 h-4" /> : 
                     cat === 'Classic' ? <Clock className="w-4 h-4" /> :
                     cat === 'Action' ? <Zap className="w-4 h-4" /> :
                     cat === 'Shooter' ? <Trophy className="w-4 h-4" /> :
                     <Gamepad2 className="w-4 h-4" />}
                    {cat}
                  </div>
                </button>
              ))}
            </nav>
          )}

          <div className="mt-auto space-y-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Cloak Theme</div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setCloakTheme('Davidson')}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all ${cloakTheme === 'Davidson' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}
                >
                  Academy
                </button>
                <button 
                  onClick={() => setCloakTheme('Classroom')}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all ${cloakTheme === 'Classroom' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400'}`}
                >
                  Classroom
                </button>
              </div>
            </div>

            <button
              onClick={shareHub}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-indigo-400 hover:bg-indigo-400/10 transition-all border border-indigo-500/20"
            >
              <Share2 className="w-4 h-4" />
              Share Hub
            </button>

            <button
              onClick={() => setIsCloaked(true)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all border border-dashed border-white/10"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Activate Cloak
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeView === 'Games' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
                    {activeCategory} <span className="text-indigo-500">Games</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">Showing {filteredGames.length} unblocked titles</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 text-white">Popular</button>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-300">New</button>
                </div>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      layoutId={game.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative bg-[#141418] rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xl"
                      onClick={() => setSelectedGame(game)}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
                        
                        {game.isHot && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider shadow-lg">
                            <Flame className="w-3 h-3" />
                            Hot
                          </div>
                        )}

                        {game.type === 'builtin' && (
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider shadow-lg">
                            <ShieldCheck className="w-3 h-3" />
                            Safe
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-indigo-600/20 backdrop-blur-[2px]">
                          <div className="bg-white text-indigo-600 p-3 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                            <Play className="w-6 h-6 fill-current" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors truncate">
                          {game.title}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{game.category}</span>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-indigo-500/30" />)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 opacity-50">
                  <Search className="w-12 h-12 mb-4 text-slate-700" />
                  <h3 className="text-xl font-bold">No games found</h3>
                  <p className="text-sm">Try a different search or category</p>
                </div>
              )}
            </>
          )}

          {activeView === 'Browser' && (
            <div className="h-full flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
                    Stealth <span className="text-indigo-500">Browser</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">Browse any site through our encrypted proxy</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    value={browserUrl}
                    onChange={(e) => setBrowserUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setBrowserUrl(e.target.value)}
                    placeholder="Enter URL (e.g., https://google.com)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <button 
                  onClick={() => setBrowserUrl(browserUrl)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-bold transition-all"
                >
                  Go
                </button>
              </div>

              <div className="flex-1 bg-[#1a1a1e] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative min-h-[500px]">
                {browserUrl ? (
                  <iframe 
                    src={`/api/proxy?url=${encodeURIComponent(browserUrl.startsWith('http') ? browserUrl : 'https://' + browserUrl)}`}
                    className="w-full h-full border-none"
                    title="Stealth Browser"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 p-8 text-center">
                    <Globe className="w-16 h-16 mb-4 opacity-20" />
                    <h3 className="text-xl font-bold text-slate-400 mb-2">Ready to Browse</h3>
                    <p className="max-w-md mb-8">Type a URL above to start browsing securely. All traffic is routed through our stealth proxy to bypass school filters.</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
                      {[
                        { name: 'Google', url: 'https://www.google.com' },
                        { name: 'YouTube', url: 'https://www.youtube.com' },
                        { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
                        { name: 'GitHub', url: 'https://www.github.com' },
                        { name: 'Reddit', url: 'https://www.reddit.com' },
                        { name: 'Twitch', url: 'https://www.twitch.tv' },
                        { name: 'Discord', url: 'https://www.discord.com' },
                        { name: 'Chess.com', url: 'https://www.chess.com' }
                      ].map(site => (
                        <button
                          key={site.name}
                          onClick={() => setBrowserUrl(site.url)}
                          className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl transition-all flex flex-col items-center gap-2 group"
                        >
                          <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                            <Globe className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{site.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'Shortener' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-black text-white tracking-tight uppercase italic mb-2">
                  Link <span className="text-indigo-500">Shortener</span>
                </h2>
                <p className="text-slate-500">Create stealth shortcuts for your favorite external sites</p>
              </div>

              <form onSubmit={handleShorten} className="flex gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
                <input 
                  type="url"
                  value={shortenInput}
                  onChange={(e) => setShortenInput(e.target.value)}
                  placeholder="Paste long URL here..."
                  className="flex-1 bg-transparent px-4 py-3 text-white focus:outline-none"
                  required
                />
                <button 
                  type="submit"
                  disabled={isShortening}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  {isShortening ? <Clock className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {isShortening ? 'Shortening...' : 'Shorten'}
                </button>
              </form>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Your Stealth Links</h3>
                {customLinks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {customLinks.map(link => (
                      <div key={link.id} className="group bg-[#1a1a1e] p-4 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 font-mono font-bold">
                            {link.id.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{link.title}</h4>
                            <p className="text-[10px] text-slate-500 truncate max-w-[200px] sm:max-w-md">{link.shortUrl}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(link.shortUrl);
                              alert('Link copied to clipboard!');
                            }}
                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                            title="Copy Short Link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setBrowserUrl(link.url);
                              setActiveView('Browser');
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
                            title="Open in Browser"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteLink(link.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-2xl p-12 border border-dashed border-white/10 text-center">
                    <Zap className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">No custom links yet. Add one above!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-8 bg-black/95 backdrop-blur-md"
          >
            <motion.div
              layoutId={selectedGame.id}
              className="relative w-full h-full max-w-6xl bg-[#0f0f12] rounded-none sm:rounded-[32px] overflow-hidden border border-white/10 flex flex-col shadow-[0_0_100px_rgba(79,70,229,0.2)]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-600 rounded-xl">
                    <Gamepad2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase italic tracking-tight">{selectedGame.title}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedGame.category} • Unblocked</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-all text-slate-400 hover:text-white border border-white/5"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Game Content */}
              <div className="flex-1 bg-black relative group/iframe">
                {renderGameContent(selectedGame)}
                
                {/* Overlay Troubleshooting */}
                {selectedGame.type !== 'builtin' && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 group-hover/iframe:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-[#0f0f12]/95 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl text-xs text-slate-300 shadow-2xl pointer-events-auto flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Traffic is being proxied for your safety.</span>
                      <button 
                        onClick={() => launchStealth(selectedGame)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg font-bold transition-all"
                      >
                        Stealth Mode
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-[#0f0f12] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Server: US-EAST
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Ping: 24ms
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  {selectedGame.type !== 'builtin' && (
                    <label className="flex items-center gap-3 cursor-pointer group/toggle bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/toggle:text-slate-300 transition-colors">
                        Proxy {useProxy ? 'ON' : 'OFF'}
                      </span>
                      <div 
                        onClick={() => setUseProxy(!useProxy)}
                        className={`w-10 h-5 rounded-full relative transition-all ${useProxy ? 'bg-indigo-600' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${useProxy ? 'left-6' : 'left-1'}`} />
                      </div>
                    </label>
                  )}
                  <button
                    onClick={() => launchStealth(selectedGame)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 px-8 py-3 rounded-2xl font-bold transition-all border border-white/10"
                  >
                    <Search className="w-4 h-4 text-indigo-400" />
                    Stealth Launch
                  </button>
                  <button
                    onClick={() => window.open(selectedGame.iframeUrl, '_blank')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/30"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Fullscreen
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-[1600px] mx-auto px-8 py-12 border-t border-white/5 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-xl border border-white/10">
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              © 2026 Creative Hub. The ultimate unblocked experience.
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-400 transition-colors">DMCA</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Discord</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
