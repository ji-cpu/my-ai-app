
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Power, 
  Wind, 
  Thermometer, 
  Settings, 
  Moon, 
  Sun, 
  Droplets, 
  Maximize, 
  ChevronUp, 
  ChevronDown,
  Activity,
  Lightbulb,
  Zap,
  Cpu,
  RefreshCw,
  MessageCircle
} from 'lucide-react';
import { ACState, ACMode, FanSpeed, IRProtocol } from './types';
import { getSmartRecommendation } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ACState>({
    power: false,
    temperature: 26,
    mode: ACMode.COOL,
    fanSpeed: FanSpeed.AUTO,
    swingVertical: false,
    swingHorizontal: false,
    health: false,
    light: true,
    sleep: false,
    energySaving: false,
    protocol: IRProtocol.GREE_YB1F2
  });

  const [showSettings, setShowSettings] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const togglePower = () => {
    setState(prev => ({ ...prev, power: !prev.power }));
    setToast(state.power ? "已关机" : "已开机");
  };

  const adjustTemp = (delta: number) => {
    if (!state.power) return;
    setState(prev => ({
      ...prev,
      temperature: Math.min(30, Math.max(16, prev.temperature + delta))
    }));
  };

  const cycleMode = () => {
    if (!state.power) return;
    const modes = Object.values(ACMode);
    const currentIndex = modes.indexOf(state.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setState(prev => ({ ...prev, mode: modes[nextIndex] }));
  };

  const cycleFan = () => {
    if (!state.power) return;
    const speeds = Object.values(FanSpeed);
    const currentIndex = speeds.indexOf(state.fanSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setState(prev => ({ ...prev, fanSpeed: speeds[nextIndex] }));
  };

  const handleAIRequest = async () => {
    if (!aiInput.trim()) return;
    setIsAIThinking(true);
    const result = await getSmartRecommendation(aiInput, state);
    if (result) {
      setState(prev => ({
        ...prev,
        power: true,
        mode: result.recommendedMode as ACMode,
        temperature: result.recommendedTemp
      }));
      setToast(`AI建议: ${result.explanation}`);
      setAiInput("");
    } else {
      setToast("AI 暂时开小差了");
    }
    setIsAIThinking(false);
  };

  const getModeIcon = (mode: ACMode) => {
    switch (mode) {
      case ACMode.COOL: return <Sun className="w-6 h-6 text-blue-500" />;
      case ACMode.HEAT: return <Zap className="w-6 h-6 text-orange-500" />;
      case ACMode.DRY: return <Droplets className="w-6 h-6 text-cyan-500" />;
      case ACMode.FAN: return <Wind className="w-6 h-6 text-gray-500" />;
      default: return <RefreshCw className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-6 py-3 rounded-full text-sm font-medium animate-bounce shadow-xl">
          {toast}
        </div>
      )}

      {/* Main Remote Container */}
      <div className="remote-body w-full max-w-[340px] rounded-[3rem] p-6 flex flex-col gap-6 relative border-4 border-white/50">
        
        {/* LCD Screen Display */}
        <div className={`lcd-screen w-full h-44 rounded-2xl p-4 flex flex-col justify-between transition-opacity duration-300 ${state.power ? 'opacity-100' : 'opacity-20'}`}>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-800/60 uppercase tracking-widest">Mode</span>
              <div className="flex items-center gap-2">
                {getModeIcon(state.mode)}
                <span className="text-xl font-bold text-gray-800">{state.mode}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-800/60 uppercase tracking-widest">Fan</span>
              <div className="text-lg font-bold text-gray-800">{state.fanSpeed}</div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-1">
            <span className="text-7xl font-bold text-gray-900 tracking-tighter">{state.temperature}</span>
            <span className="text-2xl font-bold text-gray-700 mt-6">°C</span>
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-gray-800/70 uppercase">
            <div className="flex gap-2">
              {state.health && <span>Health</span>}
              {state.sleep && <span>Sleep</span>}
              {state.energySaving && <span>E-Saving</span>}
            </div>
            <span>{state.protocol.split(' ')[1]}</span>
          </div>
        </div>

        {/* Brand & Indicators */}
        <div className="flex justify-between items-center px-4">
          <div className="text-2xl font-black text-gray-300 tracking-wider">GREE 格力</div>
          <div className={`w-3 h-3 rounded-full ${state.power ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-gray-300'}`}></div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-3 gap-4 pb-4">
          
          {/* Main Power Button */}
          <button 
            onClick={togglePower}
            className={`col-span-1 h-20 rounded-full flex flex-col items-center justify-center transition-all btn-active shadow-lg
              ${state.power ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            <Power className="w-8 h-8" />
            <span className="text-[10px] mt-1 font-bold">电源</span>
          </button>

          {/* Temperature Controls */}
          <div className="col-span-1 flex flex-col gap-2">
            <button 
              onClick={() => adjustTemp(1)}
              className="h-12 bg-white rounded-t-3xl flex items-center justify-center text-gray-700 shadow-md btn-active"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <button 
              onClick={() => adjustTemp(-1)}
              className="h-12 bg-white rounded-b-3xl flex items-center justify-center text-gray-700 shadow-md btn-active"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          {/* Mode Switch */}
          <button 
            onClick={cycleMode}
            className="h-20 bg-blue-50 text-blue-600 rounded-full flex flex-col items-center justify-center shadow-lg btn-active border border-blue-100"
          >
            <RefreshCw className="w-7 h-7" />
            <span className="text-[10px] mt-1 font-bold">模式</span>
          </button>

          {/* Fan Speed */}
          <button 
            onClick={cycleFan}
            className="h-16 bg-gray-50 text-gray-700 rounded-2xl flex flex-col items-center justify-center shadow-md btn-active"
          >
            <Wind className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-bold">风速</span>
          </button>

          {/* Vertical Swing */}
          <button 
            onClick={() => state.power && setState(p => ({...p, swingVertical: !p.swingVertical}))}
            className={`h-16 rounded-2xl flex flex-col items-center justify-center shadow-md btn-active transition-colors
              ${state.swingVertical ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-700'}`}
          >
            <Maximize className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-bold">上下扫风</span>
          </button>

          {/* Turbo/Health */}
          <button 
            onClick={() => state.power && setState(p => ({...p, health: !p.health}))}
            className={`h-16 rounded-2xl flex flex-col items-center justify-center shadow-md btn-active transition-colors
              ${state.health ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-700'}`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-bold">健康</span>
          </button>

          {/* Sleep */}
          <button 
            onClick={() => state.power && setState(p => ({...p, sleep: !p.sleep}))}
            className={`h-16 rounded-2xl flex flex-col items-center justify-center shadow-md btn-active transition-colors
              ${state.sleep ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-700'}`}
          >
            <Moon className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-bold">睡眠</span>
          </button>

          {/* Energy Saving */}
          <button 
            onClick={() => state.power && setState(p => ({...p, energySaving: !p.energySaving}))}
            className={`h-16 rounded-2xl flex flex-col items-center justify-center shadow-md btn-active transition-colors
              ${state.energySaving ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-50 text-gray-700'}`}
          >
            <Zap className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-bold">节能</span>
          </button>

          {/* Settings / Protocol */}
          <button 
            onClick={() => setShowSettings(true)}
            className="h-16 bg-gray-800 text-white rounded-2xl flex flex-col items-center justify-center shadow-md btn-active"
          >
            <Settings className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-bold">设置</span>
          </button>
        </div>

        {/* AI Assistant Drawer Mini */}
        <div className="mt-4 p-4 bg-white/50 rounded-3xl border border-white">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-gray-600 uppercase">AI 智能辅助</span>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="我想睡觉了..."
              className="flex-1 bg-white rounded-xl px-3 py-2 text-sm outline-none shadow-inner"
            />
            <button 
              onClick={handleAIRequest}
              disabled={isAIThinking}
              className="bg-indigo-500 text-white p-2 rounded-xl shadow-lg btn-active disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Protocol Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-500" />
              协议选择
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              请根据您的空调出厂年份选择对应的红外遥控协议。品悦系列通常使用 YB1F2 协议。
            </p>
            <div className="flex flex-col gap-3">
              {Object.values(IRProtocol).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setState(prev => ({ ...prev, protocol: p }));
                    setShowSettings(false);
                    setToast(`协议已切换为: ${p}`);
                  }}
                  className={`w-full p-4 rounded-2xl text-left font-bold transition-all border-2
                    ${state.protocol === p 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                      : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowSettings(false)}
              className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
