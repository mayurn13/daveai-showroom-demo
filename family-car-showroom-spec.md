# Project Specification: Family Co-Browsing 3D Showroom (DaveAI Intern Assignment)

## 1. System Overview & Business Architecture
A lightweight, high-craft, single-page React application simulating an immersive, multiplayer car discovery experience for families. It solves a deep UX friction point: balancing competing family needs (Budget vs. Safety vs. Comfort) inside a collaborative conversational and spatial 3D interface.

### Monetization & Access Model
*   **For the Family:** 100% free consumer utility. Session-based structure eliminates onboarding friction—the host authenticates, while family members join instantly via a magic link/QR code as 'Guests' with zero account registration.
*   **For the Enterprise:** B2B SaaS (Software as a Service) subscription model paid by the Automotive OEM or Dealership Group to DaveAI. The platform acts as a digital agent layer driving sales conversions, qualifying leads, and optimizing cross-selling.

### Design Principles
*   **Aesthetic:** High-craft minimalist light-mode signature.
*   **Color Palette:** Primary background `#F9F9F9`, cards `#FFFFFF`, text `#1A1A1A`, secondary text `#666666`, accents `#0066CC`.
*   **Typography:** Clear, geometric system sans-serif hierarchy with generous whitespace.

---

## 2. Technical & State Synchronization Architecture
To achieve multiplayer coordination without technical bloat, state synchronization mimics a collaborative canvas platform (e.g., Figma or Google Docs):
*   **Real-Time Data Layer:** Driven conceptually by a stateful server architecture utilizing WebSockets. 
*   **Bidirectional Sync:** When any active participant (Host or Guest) adjusts a slider value or toggles a viewport overlay, the mutation instantly pushes to all socket instances within the specific room code block, updating the local UI state uniformly for every device.

---

## 3. Component & Screen Architecture

### Screen 1: The AI Concierge (`<AIConcierge />`)
*   **Layout:** 50/50 vertical split view layout.
*   **Left Column (Visual):** Displays a placeholder or high-quality illustration framework for the DaveAI Virtual Assistant avatar. Includes an animating canvas-based horizontal audio waveform indicating an "active listening" state.
*   **Right Column (Controls):** 
    *   Header: "Hi Raj! Welcome to your family's virtual garage. Let’s find a car that makes everyone happy. How should we balance your family’s priorities?"
    *   **The Family Mixer Component:** Three synchronous range slider inputs tracking core family values:
        1.  *Budget (Raj):* Target: Under ₹15 Lakhs (Default state: 90%).
        2.  *Safety Rating (Priya):* Focus: 5-Star NCAP Crash Test (Default state: 100%).
        3.  *Cabin Comfort (Aarav):* Focus: Rear Legroom & Sunroof (Default state: 75%).
    *   **Dynamic Feedback Box:** A light grey status container (`#F1F1F1`) showing updating microcopy: "🤖 Safety prioritized. Highlighting models with robust chassis cages, 6+ airbags, and ADAS active assists."
    *   **Action Area:** Includes an active sync status indicator ("Synced with Priya & Aarav") alongside the bottom-right anchored primary button: `Launch 3D Showroom →`.

### Component Layer: The Invite Modal (`<InviteModal />`)
*   **Trigger:** Click event on the `Room Code: RAJ-9401` action badge or an added explicit `[+ Invite]` utility action next to it.
*   **Aesthetic:** Centered modal container (`#FFFFFF`), rounded corners (12px), subtle backdrop overlay blur (`backdrop-blur-sm`, 40% black opacity).
*   **Content Layout:**
    *   **Title:** "Bring the Family In" with subtext: "Share this link or QR code. Anyone who joins will sync instantly with your workspace."
    *   **The Magic Link Input Box:** A read-only text input containing `https://iamdave.ai/room/RAJ-9401` with a clean, icon-only `[Copy]` button attached to the right edge.
    *   **Quick Share Actions:** A prominent secondary button styled for immediate use: `[Icon] Share to WhatsApp Group`.

### Screen 2: The Co-Browsing 3D Showroom (`<Showroom3D />`)
*   **Layout:** Fixed top navigation bar + 3-column main application body workspace.
*   **Top Navigation Bar:**
    *   Left side: Brand identifier `DaveAI Automotive` and active `Room Code: RAJ-9401`.
    *   Right side: Interactive multiplayer avatar stack containing initials `R` (Blue), `P` (Pink), and `A` (Green) plus a clean button element `[ + Invite Family ]`.
*   **Main Application Body Layout:**
    *   *Left Control Sidebar (3 Columns):* Floating glassmorphic panel with two interactive checkbox toggles: "Boot Capacity Visualizer" and "ISOFIX Child Seat Placement".
    *   *Center 3D Viewport (6 Columns):* Clean background workspace showcasing a centralized car profile canvas. Includes three distinct interactive spatial hotspot markers (`+` pulsing buttons) overlaying the front chassis, rear door, and trunk zones.
    *   *Right Activity Sidebar (3 Columns):* Floating live session activity feed container detailing mock family inputs (e.g., "Priya added Electronic Stability Control") and a real-time running total wallet calculation pinned to the bottom: `Current Spec: ₹14.20 Lakhs` with subtext `Good news, Raj! You are ₹80,000 under your max budget target.`
*   **Hotspot Interaction State:** Clicking any hotspot pops open a sleek contextual microcopy modal:
    *   *Chassis:* "🛡️ Priya's Priority Match: Reinforced high-strength steel frame with 6 dual-stage airbags standard."
    *   *Rear Door:* "☀️ Kids' Priority Match: 40 inches of best-in-class legroom paired with a panoramic skyroof."
*   **Action Button:** Bottom-right floating primary button: `Finalize & Book Drive →`.

### Screen 3: The Family Consensus & Action (`<ConsensusCheckout />`)
*   **Layout:** 50/50 balanced layout grid.
*   **Left Column (Car Showcase):** Displays a large hero shot frame of the chosen car with a stylized accent badge overlay reading `✓ 100% Family Consensus Reached`.
*   **Right Column (Summary & Conversion Box):**
    *   Header: "Your Custom Family Spec" with subtitle "Configured collectively by Raj, Priya, and Aarav."
    *   Specification summary details: Finance Plan (₹24,500/month), Safety Suite (5-Star NCAP + ADAS Level 2), and Interior Option (Premium Tech Pack with Rear AC).
    *   **The Conversion Widget:** An elevated scheduler interface containing an option title "Experience It Together", microcopy detailing a doorstep test drive, two clean dropdown selectors (`[ Select Date ]`, `[ Select Time Slot ]`), and a high-contrast primary CTA button `Book Family Doorstep Test Drive`.
    *   Secondary foot link microcopy: `Share PDF summary to family WhatsApp group`.

---

## 4. State Management Flow
*   `currentScreen`: Manages view transitions (`'concierge'`, `'showroom'`, `'checkout'`).
*   `isInviteOpen`: Boolean toggle for managing overlay visibility of the co-browsing connection modal.
*   `sliders`: Tracks synchronous slider values across all connected guest nodes.
*   `activeHotspot`: Handles active popup context indices on the 3D canvas viewport (`null`, `'chassis'`, `'door'`).
*   `toggles`: Dictionary flags managing active visibility states for the Boot and Child Seat configuration modifiers.