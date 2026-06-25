import React from 'react'
import { Shield, Sun, Package, Eye } from 'lucide-react'

export default function CarVisualizer({
  toggles,
  activeHotspot,
  setActiveHotspot,
  selectedPaint = 'Glacier White',
  selectedWheel = '16" Classic',
  className = ''
}) {
  const getPaintFilter = (paint) => {
    switch (paint) {
      case 'Carbon Grey':
        return 'brightness(0.5) contrast(1.3) saturate(0)'
      case 'Deep Blue':
        return 'sepia(0.8) saturate(4.5) hue-rotate(185deg) brightness(0.55) contrast(1.1)'
      case 'Crimson Red':
        return 'sepia(0.8) saturate(6.5) hue-rotate(325deg) brightness(0.55) contrast(1.1)'
      default: // 'Glacier White'
        return 'brightness(1.3) contrast(0.9) saturate(0.5)'
    }
  }
  const hotspots = [
    {
      id: 'chassis',
      label: 'Chassis Safety',
      x: '14.7%',
      y: '58.6%',
      title: '🛡️ Safety Priority Match',
      content: 'Reinforced high-strength steel frame with 6 dual-stage airbags standard, earning a 5-Star NCAP crash test rating.',
      color: 'bg-[#6366F1]'
    },
    {
      id: 'door',
      label: 'Cabin Comfort',
      x: '48.3%',
      y: '51.0%',
      title: '☀️ Cabin Comfort Priority Match',
      content: '40 inches of best-in-class rear legroom paired with a panoramic skyroof and rear climate control.',
      color: 'bg-amber-500'
    },
    {
      id: 'trunk',
      label: 'Boot Capacity',
      x: '90.3%',
      y: '51.0%',
      title: '🎒 Boot Capacity Priority Match',
      content: 'Massive 580-liter expandable boot space. Perfect for carrying family strollers, luggage, and sports gear.',
      color: 'bg-emerald-500'
    }
  ]

  return (
    <div className={`relative w-full bg-white rounded-[12px] border border-[#EAECF0] p-6 flex flex-col justify-between ${className || 'h-[480px]'}`}>
      {/* Viewport Header */}
      <div className="flex justify-between items-center z-10 pb-4">
        <div>
          <h3 className="text-base font-bold text-[#101828]">3D Showroom</h3>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
              } else {
                const el = document.getElementById('showroom-viewport') || document.documentElement;
                el.requestFullscreen?.().catch(() => {});
              }
            }}
            className="px-3 py-1.5 bg-[#EEF2F6] hover:bg-[#E4EAF0] text-[#6366F1] rounded-[8px] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
            </svg>
            <span>Full screen</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div id="showroom-viewport" className="relative w-full flex-1 min-h-0 bg-[#18181B] rounded-[12px] border border-[#EAECF0] overflow-hidden transition-all duration-300">
          {/* Car Base Image */}
          <img
            src="/silver_audi.png"
            alt="3D Showroom Viewport"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
            style={{ filter: getPaintFilter(selectedPaint) }}
          />

          {/* SVG Overlay for Visualizer Modes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Boot Capacity Overlay */}
            {toggles.bootVisualizer && (
              <g className="transition-opacity duration-300">
                <path
                  d="M 77 34 L 92 38 L 94 68 L 77 68 Z"
                  fill="rgba(16, 185, 129, 0.18)"
                  stroke="#10B981"
                  strokeWidth="0.5"
                  strokeDasharray="2, 2"
                />
                <circle cx="85" cy="51" r="5" fill="#10B981" className="animate-ping opacity-25" />
                <text x="85" y="53" fill="#047857" fontSize="2.8" fontWeight="bold" textAnchor="middle">
                  580L
                </text>
              </g>
            )}

            {/* ISOFIX Child Seat Overlay */}
            {toggles.isofix && (
              <g className="transition-opacity duration-300">
                <circle cx="68" cy="54" r="4.5" fill="rgba(0, 102, 204, 0.2)" stroke="#0066CC" strokeWidth="0.5" />
                <circle cx="68" cy="54" r="7" stroke="#0066CC" strokeWidth="0.25" strokeDasharray="1, 1" />
                <text x="68" y="62" fill="#0066CC" fontSize="2.4" fontWeight="bold" textAnchor="middle">
                  ISOFIX anchors
                </text>
              </g>
            )}

            {/* Interactive Cabin Access Overlay */}
            {toggles.cabinAccess && (
              <g className="transition-opacity duration-300">
                <path
                  d="M 40 31 L 62 31"
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="2, 2"
                />
                <path
                  d="M 38 29 L 64 29"
                  stroke="#D97706"
                  strokeWidth="0.5"
                />
                <path
                  d="M 31 34 L 50 34 L 50 68 L 31 68 Z M 51 34 L 70 34 L 70 68 L 51 68 Z"
                  fill="rgba(99, 102, 241, 0.08)"
                  stroke="#6366F1"
                  strokeWidth="0.5"
                  strokeDasharray="1.5, 1.5"
                />
                <circle cx="40.5" cy="52" r="2.5" fill="#6366F1" className="animate-ping opacity-30" />
                <circle cx="60.5" cy="52" r="2.5" fill="#6366F1" className="animate-ping opacity-30" />
                <text x="51" y="27" fill="#D97706" fontSize="2.5" fontWeight="bold" textAnchor="middle">
                  Sunroof Open
                </text>
                <text x="50" y="52" fill="#4F46E5" fontSize="2.5" fontWeight="bold" textAnchor="middle">
                  Doors Accessible
                </text>
              </g>
            )}

            {/* Premium Audio & Infotainment Overlay */}
            {toggles.audioPack && (
              <g className="transition-opacity duration-300">
                <path
                  d="M 18 55 L 26 46 M 73 46 L 77 56"
                  stroke="#EC4899"
                  strokeWidth="1.2"
                  strokeDasharray="1, 1"
                />
                <path
                  d="M 36 51 C 40 47, 44 47, 48 51"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <path
                  d="M 52 51 C 56 47, 60 47, 64 51"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <text x="50" y="42" fill="#DB2777" fontSize="2.3" fontWeight="bold" textAnchor="middle">
                  Acoustic Soundproofing Active
                </text>
              </g>
            )}

            {/* All-Weather Wheel & Rim Styling Overlay */}
            {selectedWheel === '17" Sport Alloys' && (
              <g className="transition-opacity duration-300">
                <circle cx="20.4" cy="68.6" r="7.5" fill="rgba(99, 102, 241, 0.1)" stroke="#6366F1" strokeWidth="0.6" strokeDasharray="2, 2" />
                <circle cx="20.4" cy="68.6" r="4.5" fill="none" stroke="#6366F1" strokeWidth="0.4" />
                <circle cx="78.4" cy="68.6" r="7.5" fill="rgba(99, 102, 241, 0.1)" stroke="#6366F1" strokeWidth="0.6" strokeDasharray="2, 2" />
                <circle cx="78.4" cy="68.6" r="4.5" fill="none" stroke="#6366F1" strokeWidth="0.4" />
                <text x="49.4" y="82" fill="#4F46E5" fontSize="2.5" fontWeight="bold" textAnchor="middle">
                  High-Durability Rims (+15mm Clearance)
                </text>
              </g>
            )}
          </svg>

          {/* Hotspot Markers */}
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              style={{ left: spot.x, top: spot.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white focus:outline-none transition-all duration-300 active:scale-90 shadow-sm ${
                  activeHotspot === spot.id
                    ? 'bg-[#6366F1] ring-4 ring-indigo-100 scale-110'
                    : `${spot.color} hover:scale-110 animate-pulse-ring`
                }`}
                title={spot.label}
              >
                {activeHotspot === spot.id ? (
                  <span className="text-xs font-bold leading-none">×</span>
                ) : (
                  <span className="text-xs font-bold leading-none">+</span>
                )}
              </button>
            </div>
          ))}
        </div>

      {/* Floating Hotspot Details Dialog */}
      {activeHotspot && (
        <div className="absolute bottom-8 left-8 right-8 bg-white border border-[#EAECF0] rounded-[12px] p-4 transition-all duration-300 z-30 animate-in fade-in slide-in-from-bottom-2">
          {(() => {
            const spot = hotspots.find(h => h.id === activeHotspot)
            if (!spot) return null
            return (
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg text-white shrink-0 ${
                  spot.id === 'chassis' ? 'bg-[#6366F1]' : spot.id === 'door' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}>
                  {spot.id === 'chassis' ? <Shield size={14} /> : spot.id === 'door' ? <Sun size={14} /> : <Package size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-[#101828]">{spot.title}</h4>
                    <button 
                      onClick={() => setActiveHotspot(null)} 
                      className="text-[11px] text-[#475467] hover:text-[#101828] font-medium cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <p className="text-xs text-[#475467] mt-1.5 leading-relaxed">{spot.content}</p>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
