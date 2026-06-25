import React, { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  Shield, 
  Sun, 
  Package, 
  Users, 
  Share2, 
  Calendar, 
  Clock, 
  Check, 
  Sparkles,
  MessageSquare,
  User,
  Plus,
  ArrowLeft,
  X,
  Sparkle,
  Wifi,
  WifiOff,
  Building2,
  ChevronDown,
  Mic,
  Send
} from 'lucide-react'
import AudioWaveform from './components/AudioWaveform'
import CarVisualizer from './components/CarVisualizer'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('concierge') // 'concierge' | 'showroom' | 'checkout'
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Slider states
  const [sliders, setSliders] = useState({
    budget: 90, // Target: 90% default (Raj)
    safety: 100, // Target: 100% default (Priya)
    comfort: 75  // Target: 75% default (Aarav)
  })
  const [budgetCeiling, setBudgetCeiling] = useState(15)
  const [additionalReq, setAdditionalReq] = useState('')
  const [submittedRequirement, setSubmittedRequirement] = useState('')

  // Showroom checkbox toggles
  const [toggles, setToggles] = useState({
    bootVisualizer: false,
    isofix: false,
    cabinAccess: false,
    audioPack: false
  })

  const [selectedPaint, setSelectedPaint] = useState('Glacier White')
  const [selectedWheel, setSelectedWheel] = useState('16" Classic')

  // Restructured left sidebar local states
  const [localPaint, setLocalPaint] = useState('Glacier White')
  const [localCabin, setLocalCabin] = useState('All Closed')
  const [localAcoustic, setLocalAcoustic] = useState({ ambient: false, speakers: true })
  const [localWheel, setLocalWheel] = useState('16" Classic')

  // Active hotspot in Screen 2
  const [activeHotspot, setActiveHotspot] = useState(null)
  
  // Simulated WebSockets Sync Mode
  const [socketSyncEnabled, setSocketSyncEnabled] = useState(true)

  // Multiplayer Activity feed
  const [activityLog, setActivityLog] = useState([
    { id: 1, user: 'Priya (Safety Expert)', text: 'Joined the showroom session via magic link.', time: '2 mins ago', color: 'bg-pink-100 text-pink-700' },
    { id: 2, user: 'Aarav (Legroom Inspector)', text: 'Joined as Guest with QR Code.', time: '1 min ago', color: 'bg-emerald-100 text-emerald-700' },
  ])

  // Booking Scheduler State
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  // Math variables based on sliders and toggles
  const ceilingNum = typeof budgetCeiling === 'number' ? budgetCeiling : parseFloat(budgetCeiling) || 15
  const maxBudget = ceilingNum
  
  const safetyCost = (sliders.safety / 100) * 0.70
  const comfortCost = (sliders.comfort / 100) * 0.30
  const bootCost = toggles.bootVisualizer ? 0.35 : 0
  const isofixCost = toggles.isofix ? 0.15 : 0
  const cabinCost = toggles.cabinAccess ? 0.25 : 0
  const audioCost = toggles.audioPack ? 0.40 : 0
  const wheelCost = selectedWheel === '17" Sport Alloys' ? 0.50 : 0
  
  const currentSpecPrice = 13.20 + safetyCost + comfortCost + bootCost + isofixCost + cabinCost + audioCost + wheelCost
  const budgetDifference = maxBudget - currentSpecPrice



  // Handles auto-transition after AI analysis completes
  useEffect(() => {
    if (isAnalyzing) {
      const timer = setTimeout(() => {
        setIsAnalyzing(false)
        setCurrentScreen('showroom')
        setActivityLog(prev => [
          { 
            id: Date.now(), 
            user: 'DaveAI Assistant', 
            text: 'Initialized multiplayer showroom workspace.', 
            time: 'Just now', 
            color: 'bg-blue-100 text-blue-700' 
          },
          ...prev
        ])
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isAnalyzing])

  // Handle range slider updates (Local Mutations)
  const handleSliderChange = (name, value) => {
    const val = parseFloat(value)
    setSliders(prev => ({
      ...prev,
      [name]: val
    }))

    // In a real system, this pushes a mutation to WebSockets
    if (socketSyncEnabled) {
      // Simulate socket push log
      const owner = name === 'budget' ? 'Raj (Budget Host)' : name === 'safety' ? 'Priya (Safety)' : 'Aarav (Comfort)'
      console.log(`[WebSocket Output] Broadcaster: ${owner} mutated ${name} to ${val}%`)
    }
  }

  // Handle showroom toggles with dynamic activity log logging
  const handleToggleChange = (key, label) => {
    const nextVal = !toggles[key]
    setToggles(prev => ({ ...prev, [key]: nextVal }))
    
    const logUser = key === 'bootVisualizer' ? 'Aarav (Legroom Inspector)' : 'Priya (Safety Expert)'
    const userColor = key === 'bootVisualizer' ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-pink-700'
    const actionText = nextVal ? `activated ${label}.` : `deactivated ${label}.`

    setActivityLog(prev => [
      {
        id: Date.now(),
        user: logUser,
        text: actionText,
        time: 'Just now',
        color: userColor
      },
      ...prev
    ])

    if (socketSyncEnabled) {
      triggerToast(`⚡ WebSocket Sync: Synced visualizer state for "${label}"`)
    }
  }

  const handlePaintChange = (paintName) => {
    setSelectedPaint(paintName)
    
    setActivityLog(prev => [
      {
        id: Date.now(),
        user: 'Raj (Budget Host)',
        text: `changed the exterior paint to ${paintName}.`,
        time: 'Just now',
        color: 'bg-blue-100 text-blue-700'
      },
      ...prev
    ])

    if (socketSyncEnabled) {
      triggerToast(`⚡ WebSocket Sync: Synced paint color to "${paintName}"`)
    }
  }

  const handleWheelChange = (wheelOption) => {
    setSelectedWheel(wheelOption)
    
    setActivityLog(prev => [
      {
        id: Date.now(),
        user: 'Raj (Budget Host)',
        text: `updated the wheel profile to ${wheelOption}.`,
        time: 'Just now',
        color: 'bg-blue-100 text-blue-700'
      },
      ...prev
    ])

    if (socketSyncEnabled) {
      triggerToast(`⚡ WebSocket Sync: Synced wheel profile to "${wheelOption}"`)
    }
  }

  const handleSendRequirement = () => {
    if (additionalReq.trim() !== '') {
      setSubmittedRequirement(additionalReq);
      setAdditionalReq('');
      triggerToast("Requirement sent to DaveAI concierge.");
    }
  }

  // Trigger Toast Notification
  const triggerToast = (msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }

  // Copy Room Code simulation
  const handleInviteFamily = () => {
    triggerToast("Magic Link copied! Send QR / Link to family members for registration-free Guest access.")
  }

  // Share PDF summary simulation
  const handleShareSummary = (e) => {
    e.preventDefault()
    triggerToast("Summary PDF successfully shared to your Family WhatsApp Group!")
  }

  // Dynamic feedback microcopy text for Screen 1
  const getFeedbackMicrocopy = () => {
    if (sliders.budget < 60) {
      return "🤖 Got it. Focusing heavily on budget limits. Prioritizing highly-rated compact trims with essential safety systems."
    }
    if (sliders.safety > 85 && sliders.comfort > 80) {
      return "🤖 Got it. Filtering for ultra-safe, spacious family SUVs keeping within your comfortable budget threshold."
    }
    if (sliders.safety > 90) {
      return "🤖 Safety prioritized. Highlighting models with robust chassis cages, 6+ airbags, and ADAS active assists."
    }
    if (sliders.comfort > 80) {
      return "🤖 Comfort focus. Elevating rear legroom configurations, sun-roof options, and soft-ride shock absorbers."
    }
    return "🤖 Balancing budget, crash performance, and cabin volume. Loading optimized combinations."
  }

  // Percentages for progressive fill on sliders
  const budgetPercent = ((sliders.budget - 10) / 110) * 100
  const safetyPercent = ((sliders.safety - 20) / 80) * 100
  const comfortPercent = ((sliders.comfort - 30) / 70) * 100

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

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans relative antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#101828] text-white text-xs px-4 py-2.5 rounded-full shadow-lg z-50 flex items-center gap-2.5 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkle size={12} className="text-indigo-400 fill-indigo-400 animate-spin" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Screen Header/Nav */}
      <header className="bg-white border-b border-[#EAECF0] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#6366F1] text-white p-1.5 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="fill-white/20" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-[#101828]">DaveAI Automotive</h1>
                <span className="text-[10px] bg-[#EEF2F6] text-[#364152] px-2 py-1 rounded-[6px] border border-[#EAECF0] font-medium flex items-center gap-1">
                  <Building2 size={8} /> B2B OEM License
                </span>
              </div>
              <p className="text-[10px] text-[#475467] font-medium mt-0.5">Multiplayer Family Showroom Demo</p>
            </div>
          </div>
          
          {/* Navigation Action Area */}
          <div className="flex items-center gap-2.5">
            {currentScreen === 'showroom' && (
              <div className="flex items-center gap-3.5 pl-2 border-l border-[#EAECF0] flex items-center">
                <span className="text-[11px] bg-[#EEF2F6] text-[#364152] px-2 py-1 rounded-[6px] border border-[#EAECF0] font-medium mr-2">
                  Room Code: <span className="font-semibold text-[#6366F1] font-mono">RAJ-9401</span>
                </span>
                <div className="flex -space-x-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#6366F1]" title="Raj (You)">R</span>
                  <span className="w-6 h-6 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-pink-600" title="Priya (Wife - Guest)">P</span>
                  <span className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-600" title="Aarav (Son - Guest)">A</span>
                </div>
              </div>
            )}

            {/* Invite Family Button */}
            {currentScreen !== 'checkout' && (
              <button
                onClick={() => setIsInviteOpen(true)}
                className="text-xs bg-white hover:bg-gray-50 border border-[#D0D5DD] text-[#344054] font-semibold py-2 px-4 rounded-[12px] transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-3xs"
              >
                <span>+ Invite Family</span>
              </button>
            )}

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => triggerToast("Language toggled to demo Hindi / English translation.")}
                className="text-xs bg-white hover:bg-gray-50 border border-[#D0D5DD] text-[#344054] font-semibold py-2 px-4 rounded-[12px] transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-3xs"
              >
                <span>EN / अ</span>
                <span className="text-[8px] text-[#666666]">▼</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col justify-center">
        
        {/* Screen 1: The AI Concierge */}
        {currentScreen === 'concierge' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto w-full">
            
            {/* Left Column: Visual AI Avatar */}
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-[#EAECF0] rounded-[12px] relative overflow-hidden min-h-[380px]">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-5 rounded-full p-0.5 border border-[#EAECF0] bg-white">
                  <img 
                    src="/daveai_human_avatar.png" 
                    alt="DaveAI Assistant Avatar" 
                    className="w-full h-full object-cover rounded-full bg-white"
                  />
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
                </div>
                <h3 className="text-base font-semibold text-[#101828]">DaveAI Assistant</h3>
                <p className="text-xs text-[#475467] max-w-[260px] mt-1.5 leading-relaxed">
                  Real-time active listening session. Balancing family constraints in the background.
                </p>
              </div>

              {/* Animating Waveform Component Container */}
              <div className="w-full mt-8 z-10">
                <div className="flex justify-between items-center text-[9px] text-[#475467] mb-1.5 px-0.5 uppercase tracking-wider font-semibold">
                  <span>Voice Status</span>
                  <span className="flex items-center gap-1 text-[#6366F1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-ping"></span>
                    Active Loop
                  </span>
                </div>
                <div className="bg-[#F8F9FA] rounded-[12px] p-3.5 border border-[#EAECF0]">
                  <AudioWaveform />
                </div>
              </div>
            </div>

            {/* Right Column: Controls & Sliders */}
            <div className="bg-white border border-[#EAECF0] rounded-[12px] p-8 flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="text-base font-semibold text-[#101828] leading-snug">
                    Hi Raj! Welcome to your family's virtual garage.
                  </h2>
                </div>
                <p className="text-xs text-[#475467] mt-2 leading-relaxed">
                  Let’s find a car that makes everyone happy. How should we balance your family’s priorities?
                </p>

                {/* Range Sliders Form */}
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-in fade-in duration-300">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-12 h-12 rounded-full border-2 border-[#6366F1]/10 animate-ping"></span>
                      <span className="absolute w-8 h-8 rounded-full border-2 border-[#6366F1]/20 animate-pulse"></span>
                      <div className="w-6 h-6 rounded-full border-2 border-t-[#6366F1] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    </div>
                    <div className="text-center max-w-[280px]">
                      <p className="text-xs font-semibold text-[#101828] tracking-tight">AI is optimizing your garage...</p>
                      <p className="text-[10px] text-[#475467] leading-relaxed mt-2.5">
                        {submittedRequirement.trim() !== ''
                          ? `AI is optimizing your garage... Balancing budget, safety, and comfort metrics while incorporating your custom request: "${submittedRequirement}"`
                          : "Balancing Raj's budget, Priya's safety metrics, and Aarav's cabin comfort preferences."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 mt-6">
                  
                  {/* Slider 1: Budget */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <label className="text-xs font-medium text-[#344054] flex items-center gap-1.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-indigo-50 text-[#6366F1] text-[9px] font-bold flex items-center justify-center">R</span>
                        Budget
                      </label>
                      <span className="flex items-center gap-0.5 bg-[#F2F4F7] text-[#364152] px-2.5 py-1 rounded-[6px] text-[11px] font-medium border border-transparent focus-within:border-[#6366F1]/30">
                        <span>Max ₹</span>
                        <input 
                          type="number"
                          step="any"
                          value={budgetCeiling}
                          placeholder="15"
                          onChange={(e) => {
                            const val = e.target.value;
                            setBudgetCeiling(val === '' ? '' : parseFloat(val));
                          }}
                          onFocus={(e) => e.target.select()}
                          className="w-12 bg-transparent border-none p-0 text-center focus:ring-0 focus:outline-none font-medium text-[#364152] placeholder-[#364152]/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span>Lakhs</span>
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="120"
                      value={sliders.budget}
                      onChange={(e) => handleSliderChange('budget', e.target.value)}
                      style={{
                        background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${budgetPercent}%, #F2F4F7 ${budgetPercent}%, #F2F4F7 100%)`
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-[#475467] gap-4">
                      <span className="flex-1">
                        {sliders.budget > 75
                          ? `Strictly prioritizing models well below your ₹${maxBudget} Lakh ceiling.`
                          : sliders.budget >= 40
                          ? `Balancing value and options around the ₹${maxBudget} Lakh range.`
                          : `Treating ₹${maxBudget} Lakh as a flexible limit to favor safety or comfort matches.`}
                      </span>
                      <span className="shrink-0">Priority weight: {sliders.budget}%</span>
                    </div>
                  </div>

                  {/* Slider 2: Safety Rating */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <label className="text-xs font-medium text-[#344054] flex items-center gap-1.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-pink-100 text-pink-600 text-[9px] font-bold flex items-center justify-center">P</span>
                        Safety Rating
                      </label>
                      <span className="text-[11px] font-medium text-[#364152] bg-[#EEF2F6] px-2 py-1 rounded-[6px]">
                        {sliders.safety === 100 ? '5-Star NCAP' : `${Math.round(sliders.safety / 20)} Star Target`}
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="20"
                      max="100"
                      step="20"
                      value={sliders.safety}
                      onChange={(e) => handleSliderChange('safety', e.target.value)}
                      style={{
                        background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${safetyPercent}%, #F2F4F7 ${safetyPercent}%, #F2F4F7 100%)`
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-[#475467]">
                      <span>Focus: 5-Star Crash Test</span>
                      <span>Priority weight: {sliders.safety}%</span>
                    </div>
                  </div>

                  {/* Slider 3: Cabin Comfort */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <label className="text-xs font-medium text-[#344054] flex items-center gap-1.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-600 text-[9px] font-bold flex items-center justify-center">A</span>
                        Cabin Comfort
                      </label>
                      <span className="text-[11px] font-medium text-[#364152] bg-[#EEF2F6] px-2 py-1 rounded-[6px]">
                        Score: {sliders.comfort}%
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="30"
                      max="100"
                      value={sliders.comfort}
                      onChange={(e) => handleSliderChange('comfort', e.target.value)}
                      style={{
                        background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${comfortPercent}%, #F2F4F7 ${comfortPercent}%, #F2F4F7 100%)`
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-[#475467]">
                      <span>Focus: Rear Legroom & Sunroof</span>
                      <span>Satisfaction: {sliders.comfort}%</span>
                    </div>
                  </div>

                  {/* Additional Considerations Text Input Group */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-medium text-[#344054]">
                      Additional Considerations
                    </label>
                    <div className="relative flex flex-col bg-white border border-[#EAECF0] rounded-[12px] shadow-3xs p-3 min-h-[96px] justify-between">
                      
                      {/* Message Thread */}
                      {submittedRequirement && (
                        <div className="w-full mb-3 space-y-3.5 border-b border-[#EAECF0] pb-3 animate-in fade-in duration-200">
                          {/* Raj's Message */}
                          <div className="flex flex-col items-end space-y-1">
                            <div className="bg-[#F2F4F7] text-[#344054] px-3 py-1.5 rounded-[12px] rounded-tr-none text-xs max-w-[85%] text-left font-medium">
                              {submittedRequirement}
                            </div>
                            <span className="text-[9px] text-[#98A2B3] font-medium mr-1">Raj</span>
                          </div>
                          
                          {/* DaveAI Response */}
                          <div className="flex flex-col items-start space-y-1">
                            <div className="bg-indigo-50/50 text-[#6366F1] border border-indigo-100/30 px-3 py-1.5 rounded-[12px] rounded-tl-none text-xs max-w-[85%] font-medium">
                              Requirement logged. I will filter the 3D showroom to prioritize models matching your request.
                            </div>
                            <span className="text-[9px] text-[#98A2B3] font-medium ml-1">DaveAI Assistant</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start">
                        <textarea 
                          rows={3}
                          value={additionalReq}
                          onChange={(e) => setAdditionalReq(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendRequirement();
                            }
                          }}
                          placeholder="Type or say any other specific requirements... (e.g., Electric only, high ground clearance, automatic transmission)"
                          className="w-full bg-transparent border-none p-0 text-xs text-[#344054] placeholder-[#98A2B3] focus:ring-0 focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex justify-end items-center gap-3 mt-1">
                        <button 
                          type="button"
                          onClick={() => triggerToast("Voice input simulated! Tap to speak requirement.")}
                          className="text-[#475467] hover:text-[#6366F1] transition-colors cursor-pointer shrink-0"
                          title="Simulate Voice Input"
                        >
                          <Mic size={16} />
                        </button>
                        <button 
                          type="button"
                          onClick={handleSendRequirement}
                          className="text-[#6366F1] hover:text-[#4f46e5] transition-colors cursor-pointer shrink-0"
                          title="Send requirement"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
                )}
              </div>

              {/* Action Button Area */}
              <div className="mt-8 pt-4 border-t border-[#EAECF0] space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-[10px] text-[#475467] font-semibold">
                      {socketSyncEnabled ? 'Synced with Priya & Aarav' : 'Offline Co-Browsing Mode'}
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsAnalyzing(true)}
                    disabled={isAnalyzing}
                    className="bg-[#101828] hover:bg-[#1f2937] disabled:bg-gray-400 text-white text-xs font-semibold py-2 px-4 rounded-[12px] flex items-center gap-1.5 group transition-all duration-200 active:scale-95 shadow-3xs disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isAnalyzing ? 'Optimizing...' : 'Launch 3D Showroom'}
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Screen 2: The Co-Browsing 3D Showroom */}
        {currentScreen === 'showroom' && (
          <div className="flex flex-col gap-6">
            
            {/* Back Button */}
            <div className="flex">
              <button 
                onClick={() => setCurrentScreen('concierge')}
                className="text-xs text-[#666666] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors font-medium"
              >
                <ArrowLeft size={12} /> Back to Mixer
              </button>
            </div>

            {/* 3-Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Sidebar (3 Columns / span-3) */}
              <div className="lg:col-span-3">
                <div className="bg-white border border-[#EAECF0] rounded-[12px] p-5 h-[480px] flex flex-col space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-[#101828]">Showroom Spec Toggles</h3>
                    <p className="text-[11px] text-[#475467] mt-1.5 leading-relaxed font-medium">
                      Configure specifications using custom control elements.
                    </p>
                  </div>
                  
                  <div className="space-y-5">
                    
                    {/* Block 1: Exterior Color Preset */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-[#344054] flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-[#475467] shrink-0">
                          <path d="m19 11-8-8-8.15 8.15a2 2 0 0 0 0 2.83L10.5 21.65a2 2 0 0 0 2.83 0L19 16" />
                          <path d="m5 15 3 3" />
                          <path d="M2 13h20" />
                          <path d="M22 17v-4" />
                        </svg>
                        <span>Exterior Color Preset</span>
                      </h4>
                      <div className="flex items-center gap-3 py-1 pl-[26px]">
                        {[
                          { name: 'Glacier White', hex: '#FFFFFF' },
                          { name: 'Carbon Grey', hex: '#4B5563' },
                          { name: 'Deep Blue', hex: '#1D4ED8' },
                          { name: 'Crimson Red', hex: '#B91C1C' }
                        ].map((paint) => (
                          <button
                            key={paint.name}
                            type="button"
                            onClick={() => setLocalPaint(paint.name)}
                            className={`w-6 h-6 rounded-full transition-all duration-200 cursor-pointer focus:outline-none ${
                              localPaint === paint.name
                                ? 'ring-2 ring-offset-2 ring-[#6366F1] scale-110'
                                : 'hover:scale-105'
                            }`}
                            style={{
                              backgroundColor: paint.hex,
                              border: paint.name === 'Glacier White' ? '1px solid #D0D5DD' : 'none'
                            }}
                            title={paint.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Block 2: Interactive Cabin Access */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-[#344054] flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-[#475467] shrink-0">
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M12 3v18" />
                          <circle cx="9" cy="12" r="1" />
                          <circle cx="15" cy="12" r="1" />
                        </svg>
                        <span>Interactive Cabin Access</span>
                      </h4>
                      <div className="pl-[26px]">
                        <div className="flex bg-[#F2F4F7] rounded-lg p-1 w-full relative">
                          <button
                            type="button"
                            onClick={() => setLocalCabin('Doors Open')}
                            className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all duration-200 z-10 cursor-pointer ${
                              localCabin === 'Doors Open'
                                ? 'bg-white text-[#101828] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                : 'text-[#475467] hover:text-[#101828]'
                            }`}
                          >
                            Doors Open
                          </button>
                          <button
                            type="button"
                            onClick={() => setLocalCabin('All Closed')}
                            className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all duration-200 z-10 cursor-pointer ${
                              localCabin === 'All Closed'
                                ? 'bg-white text-[#101828] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                : 'text-[#475467] hover:text-[#101828]'
                            }`}
                          >
                            All Closed
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Block 3: Acoustic & Infotainment Package */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-[#344054] flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-[#475467] shrink-0">
                          <path d="M9 18V5l12-2v13" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="16" r="3" />
                        </svg>
                        <span>Acoustic & Infotainment Package</span>
                      </h4>
                      <div className="flex gap-2.5 pl-[26px] py-1">
                        <button
                          type="button"
                          onClick={() => setLocalAcoustic(prev => ({ ...prev, ambient: !prev.ambient }))}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${
                            localAcoustic.ambient
                              ? 'bg-[#EEF2F6] border-[#6366F1] text-[#6366F1] shadow-3xs'
                              : 'bg-white border-[#D0D5DD] text-[#344054] hover:bg-gray-50'
                          }`}
                        >
                          Ambient Lighting
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocalAcoustic(prev => ({ ...prev, speakers: !prev.speakers }))}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${
                            localAcoustic.speakers
                              ? 'bg-[#EEF2F6] border-[#6366F1] text-[#6366F1] shadow-3xs'
                              : 'bg-white border-[#D0D5DD] text-[#344054] hover:bg-gray-50'
                          }`}
                        >
                          Premium Speakers
                        </button>
                      </div>
                    </div>

                    {/* Block 4: Alloy Wheel & Tire Package */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-[#344054] flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-[#475467] shrink-0">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 2v7" />
                          <path d="M12 15v7" />
                          <path d="M2 12h7" />
                          <path d="M15 12h7" />
                          <path d="m5.8 5.8 5 5" />
                          <path d="m13.2 13.2 5 5" />
                          <path d="m18.2 5.8-5 5" />
                          <path d="m10.8 13.2-5 5" />
                        </svg>
                        <span>Alloy Wheel & Tire Package</span>
                      </h4>
                      <div className="pl-[26px]">
                        <div className="flex bg-[#F2F4F7] rounded-lg p-1 w-full relative">
                          <button
                            type="button"
                            onClick={() => setLocalWheel('16" Classic')}
                            className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all duration-200 z-10 cursor-pointer ${
                              localWheel === '16" Classic'
                                ? 'bg-white text-[#101828] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                : 'text-[#475467] hover:text-[#101828]'
                            }`}
                          >
                            16" Classic
                          </button>
                          <button
                            type="button"
                            onClick={() => setLocalWheel('17" Sport Alloys')}
                            className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all duration-200 z-10 cursor-pointer ${
                              localWheel === '17" Sport Alloys'
                                ? 'bg-white text-[#101828] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                : 'text-[#475467] hover:text-[#101828]'
                            }`}
                          >
                            17" Sport Alloys
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Center 3D Viewport (6 Columns / span-6) */}
              <div className="lg:col-span-6 flex flex-col h-[480px] justify-between">
                <CarVisualizer 
                  toggles={toggles}
                  activeHotspot={activeHotspot}
                  setActiveHotspot={setActiveHotspot}
                  selectedPaint={selectedPaint}
                  selectedWheel={selectedWheel}
                  className="flex-1"
                />
                
                {/* Tip box placed below the 3D viewport */}
                <div className="bg-indigo-50/50 rounded-[12px] p-3.5 border border-indigo-100/50 text-[10px] text-indigo-700 leading-relaxed font-medium mt-4 shrink-0">
                  💡 <strong>Tip:</strong> Tap on the pulsing blue, amber, and green circular markers (<code>+</code>) overlaying the car frame to read custom specs configured by the family.
                </div>
              </div>

              {/* Right Activity Sidebar (3 Columns / span-3) */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="bg-white border border-[#EAECF0] rounded-[12px] p-5 h-[480px] flex flex-col justify-between">
                  
                  {/* Activity Feed */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <h3 className="text-xs font-semibold text-[#101828] mb-3 flex items-center gap-1.5">
                      <Users size={12} /> Family Activity Log
                    </h3>
                    <div className="flex-1 overflow-y-auto max-h-[240px] space-y-3 pr-1">
                      {activityLog.map((log) => (
                        <div key={log.id} className="p-2.5 rounded-[12px] bg-white border border-[#EAECF0] flex gap-2 items-start text-left">
                          <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium ${log.color || 'bg-blue-100 text-blue-700'}`}>
                            {log.user.charAt(0)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-[#101828] leading-tight">{log.user}</p>
                            <p className="text-[10px] text-[#475467] mt-0.5 leading-snug">{log.text}</p>
                            <span className="text-[8px] text-[#999999] block mt-1">{log.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wallet container pinned to bottom */}
                  <div className="bg-white border-t border-[#EAECF0] pt-4 mt-auto space-y-3 shrink-0 z-10 mx-[-20px] px-5">
                    <div className="bg-[#F8F9FA] border border-[#EAECF0] rounded-[12px] p-3.5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-semibold text-[#475467] uppercase">Current Spec</span>
                        <span className="text-sm font-bold text-[#101828]">₹{currentSpecPrice.toFixed(2)} Lakhs</span>
                      </div>
                      
                      <div className="mt-1.5 flex justify-between items-center text-[9px]">
                        <span className="text-[#475467]">Max Budget Goal:</span>
                        <span className="font-semibold text-[#101828]">₹{maxBudget.toFixed(2)} Lakhs</span>
                      </div>

                      <div className="mt-2.5 pt-2.5 border-t border-[#EAECF0] text-[10px]">
                        {budgetDifference >= 0 ? (
                          <span className="text-[#027A48] font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#027A48]"></span>
                            Good news, Raj! You are ₹{Math.round(budgetDifference * 100000).toLocaleString()} under your max budget target.
                          </span>
                        ) : (
                          <span className="text-[#B42318] font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B42318]"></span>
                            Attention, Raj! You are ₹{Math.round(-budgetDifference * 100000).toLocaleString()} over your max budget target.
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => setCurrentScreen('checkout')}
                      className="w-full bg-[#101828] hover:bg-[#1f2937] text-white text-xs font-semibold py-2 px-4 rounded-[12px] flex items-center justify-center gap-1.5 group transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs"
                    >
                      Finalize & Book Drive
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {/* Screen 3: The Family Consensus & Action */}
        {currentScreen === 'checkout' && (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            
            {/* Back Button */}
            <div className="flex">
              <button 
                onClick={() => setCurrentScreen('showroom')}
                className="text-xs text-[#475467] hover:text-[#101828] flex items-center gap-1 transition-colors font-medium cursor-pointer"
              >
                <ArrowLeft size={12} /> Back to Showroom
              </button>
            </div>

            {/* 50/50 Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Left Column: Car Showcase */}
              <div className="bg-white border border-[#EAECF0] rounded-[12px] p-6 flex flex-col justify-between relative overflow-hidden min-h-[350px]">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
                
                {/* Consensus Badge */}
                <div className="self-start bg-[#D1FADF] text-[#027A48] px-2.5 py-1 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 border border-[#A3F3C0] z-10">
                  <Check size={14} className="stroke-[3px]" />
                  <span>✓ 100% Family Consensus Reached</span>
                </div>

                {/* SUV Showcase Frame */}
                <div className="my-6 flex items-center justify-center flex-1">
                  <img 
                    src="/silver_audi.png" 
                    alt="Configured Family SUV" 
                    className="w-full max-w-[420px] object-contain rounded-[12px]"
                    style={{ filter: getPaintFilter(selectedPaint) }}
                  />
                </div>

                {/* Configuration Summary Badges */}
                <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#EAECF0] text-center z-10">
                  <div className="bg-[#F8F9FA] rounded-[12px] p-2.5 border border-[#EAECF0]">
                    <span className="text-[9px] uppercase tracking-wider text-[#475467] block font-medium">Specs Price</span>
                    <span className="text-xs font-bold text-[#101828] block mt-0.5">₹{currentSpecPrice.toFixed(2)}L</span>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-[12px] p-2.5 border border-[#EAECF0]">
                    <span className="text-[9px] uppercase tracking-wider text-[#475467] block font-medium">Safety rating</span>
                    <span className="text-xs font-bold text-[#101828] block mt-0.5">5-Star NCAP</span>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-[12px] p-2.5 border border-[#EAECF0]">
                    <span className="text-[9px] uppercase tracking-wider text-[#475467] block font-medium">Legroom</span>
                    <span className="text-xs font-bold text-[#101828] block mt-0.5">40 Inches</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Summary & Conversion Box */}
              <div className="bg-white border border-[#EAECF0] rounded-[12px] p-8 flex flex-col justify-between min-h-[350px]">
                
                <div>
                  <h2 className="text-base font-semibold text-[#101828] leading-snug">
                    Your Custom Family Spec
                  </h2>
                  <p className="text-xs text-[#475467] mt-1.5 font-medium">
                    Configured collectively by Raj, Priya, and Aarav.
                  </p>

                  {/* Specification summary details */}
                  <div className="mt-5 space-y-3.5">
                    
                    <div className="flex justify-between items-center py-2 border-b border-[#EAECF0] text-xs font-medium">
                      <span className="text-[#475467]">Finance Plan Estimation</span>
                      <span className="font-semibold text-[#101828]">
                        ₹{Math.round((currentSpecPrice / 14.20) * 24500).toLocaleString()}/month
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#EAECF0] text-xs font-medium">
                      <span className="text-[#475467]">Safety Architecture</span>
                      <span className="font-semibold text-[#101828] flex items-center gap-1">
                        <Shield size={12} className="text-[#6366F1]" />
                        5-Star NCAP + ADAS Level 2
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#EAECF0] text-xs font-medium">
                      <span className="text-[#475467]">Cabin Comfort Package</span>
                      <span className="font-semibold text-[#101828] flex items-center gap-1">
                        <Sun size={12} className="text-amber-500" />
                        Premium Tech Pack with Rear AC
                      </span>
                    </div>

                  </div>
                </div>

                {/* Conversion Widget Scheduler */}
                <div className="mt-8 pt-4 border-t border-[#EAECF0] space-y-4">
                  
                  {bookingConfirmed ? (
                    <div className="bg-[#ECFDF5] border border-[#D1FADF] rounded-[12px] p-4 text-center space-y-2 animate-in zoom-in-95 duration-200">
                      <div className="w-8 h-8 rounded-full bg-[#027A48] text-white flex items-center justify-center mx-auto shadow-sm">
                        <Check size={16} className="stroke-[3px]" />
                      </div>
                      <h4 className="text-xs font-semibold text-[#027A48]">Booking Confirmed!</h4>
                      <p className="text-[11px] text-[#027A48] leading-relaxed">
                        A DaveAI driver will bring the spec-configured SUV to your doorstep on <strong className="font-semibold">{selectedDate}</strong> at <strong className="font-semibold">{selectedTime}</strong> for a family experience.
                      </p>
                      <button 
                        onClick={() => {
                          setBookingConfirmed(false)
                          setSelectedDate('')
                          setSelectedTime('')
                        }}
                        className="text-[10px] text-[#027A48] hover:text-[#065f46] underline font-semibold mt-1 cursor-pointer"
                      >
                        Reschedule Test Drive
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="text-xs font-semibold text-[#101828]">Experience It Together</h4>
                        <p className="text-[11px] text-[#475467] mt-0.5 font-medium">
                          Select a date and time slot for a complimentary doorstep test drive of your custom configuration.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Select Date Dropdown */}
                        <div className="relative">
                          <select 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-white border border-[#D0D5DD] rounded-lg text-xs py-2.5 px-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] font-medium text-[#344054] shadow-3xs cursor-pointer"
                          >
                            <option value="">Select Date</option>
                            <option value="Tomorrow, June 25">Tomorrow, June 25</option>
                            <option value="Friday, June 26">Friday, June 26</option>
                            <option value="Saturday, June 27">Saturday, June 27</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-2.5 top-3 text-[#475467] pointer-events-none" />
                        </div>

                        {/* Select Time Dropdown */}
                        <div className="relative">
                          <select 
                            value={selectedTime} 
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full bg-white border border-[#D0D5DD] rounded-lg text-xs py-2.5 px-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] font-medium text-[#344054] shadow-3xs cursor-pointer"
                          >
                            <option value="">Select Time Slot</option>
                            <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                            <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                            <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-2.5 top-3 text-[#475467] pointer-events-none" />
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          if (!selectedDate || !selectedTime) {
                            triggerToast("Please select a date and time slot first.")
                            return
                          }
                          setBookingConfirmed(true)
                          triggerToast("Doorstep Test Drive Booked!")
                        }}
                        className="w-full bg-[#6366F1] hover:bg-[#4f46e5] text-white text-xs font-semibold py-2 px-4 rounded-[12px] flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
                      >
                        <Calendar size={14} />
                        Book Family Doorstep Test Drive
                      </button>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <a 
                      href="#" 
                      onClick={handleShareSummary}
                      className="text-[10px] text-[#475467] hover:text-[#6366F1] font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Share2 size={10} />
                      Share PDF summary to family WhatsApp group
                    </a>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Screen Footer */}
      <footer className="bg-white border-t border-black/5 px-6 py-4 text-center text-[10px] text-[#666666] mt-auto font-medium">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} DaveAI Automotive. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-[#1A1A1A] cursor-pointer">Security Protocol v1.4</span>
            <span className="hover:text-[#1A1A1A] cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Invite Modal Overlay */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-[#EAECF0] rounded-[12px] p-6 max-w-sm w-full mx-4 shadow-xl relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-4 right-4 text-[#475467] hover:text-[#101828] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-[#6366F1] flex items-center justify-center mx-auto">
                <Users size={20} className="stroke-[2.5px]" />
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-[#101828]">Invite Family Members</h3>
                <p className="text-xs text-[#475467] mt-1.5 leading-relaxed font-medium">
                  Share this room code or magic link to invite other family members into the live co-browsing session.
                </p>
              </div>

              {/* Room Code Display */}
              <div className="bg-[#F8F9FA] rounded-[12px] p-3 border border-[#EAECF0] flex flex-col items-center justify-center gap-1">
                <span className="text-[10px] text-[#475467] uppercase tracking-wider font-semibold">Active Room Code</span>
                <span className="text-lg font-mono font-semibold text-[#6366F1] tracking-wider">RAJ-9401</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("http://localhost:5173/?room=RAJ-9401")
                    triggerToast("Magic invitation link copied to clipboard!")
                    setIsInviteOpen(false)
                  }}
                  className="w-full bg-[#6366F1] hover:bg-[#4f46e5] text-white text-xs font-semibold py-2 px-4 rounded-[12px] transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  Copy Magic Link
                </button>
                <button
                  onClick={() => setIsInviteOpen(false)}
                  className="w-full bg-white hover:bg-gray-50 border border-[#D0D5DD] text-xs font-semibold py-2 px-4 rounded-[12px] text-[#344054] transition-all active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
