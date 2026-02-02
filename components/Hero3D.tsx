import React, { useRef, useState } from 'react';
import { Smartphone, Zap, Shield, RotateCw } from 'lucide-react';

const Hero3D: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg rotation
    const rotateY = ((x - centerX) / centerX) * 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden perspective-1000">
        
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="z-10 text-center space-y-6 max-w-2xl px-4 pointer-events-none select-none">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-sm">
          TechNova
        </h1>
        <p className="text-xl text-slate-300 font-light tracking-wide">
          The Ecosystem of <span className="text-blue-400 font-medium">Repair</span> & <span className="text-purple-400 font-medium">Retail</span>
        </p>
      </div>

      {/* 3D Interactive Card Layer */}
      <div 
        className="absolute inset-0 z-20 flex items-center justify-center perspective-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={cardRef}
          className="relative w-72 h-[480px] md:w-80 md:h-[550px] rounded-[3rem] bg-slate-900 border-8 border-slate-700 shadow-2xl transition-transform duration-100 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1, 1, 1)`,
            boxShadow: `${-rotation.y * 2}px ${rotation.x * 2}px 50px rgba(0,0,0,0.5)`
          }}
        >
          {/* Screen Content */}
          <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-gradient-to-br from-slate-800 to-black relative border border-slate-600/50">
            {/* Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            
            {/* Floating Elements inside Screen */}
            <div className="absolute top-10 left-0 right-0 flex justify-center">
                <div className="w-24 h-6 bg-black rounded-full mb-4 z-20 relative">
                    {/* Dynamic Island */}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center h-full space-y-8 text-white/90">
                <div 
                    className="p-4 bg-blue-500/20 rounded-full backdrop-blur-md border border-blue-400/30 transform transition-transform"
                    style={{ transform: `translateX(${rotation.y * 0.5}px) translateY(${rotation.x * 0.5}px)` }}
                >
                    <Smartphone size={48} className="text-blue-400" />
                </div>
                
                <div className="space-y-4 w-full px-6">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm shadow-lg transform translate-z-10"
                         style={{ transform: `translateZ(20px)` }}
                    >
                        <Shield className="text-green-400" size={20} />
                        <span className="text-sm font-medium">Certified Repair</span>
                    </div>
                     <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm shadow-lg transform translate-z-10"
                          style={{ transform: `translateZ(30px)` }}
                    >
                        <Zap className="text-yellow-400" size={20} />
                        <span className="text-sm font-medium">Fast Turnaround</span>
                    </div>
                     <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm shadow-lg transform translate-z-10"
                          style={{ transform: `translateZ(40px)` }}
                    >
                        <RotateCw className="text-purple-400" size={20} />
                        <span className="text-sm font-medium">Part Sharing</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero3D;
