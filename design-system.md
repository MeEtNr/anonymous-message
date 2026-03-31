# 🎨 AnonMessage — Design System Reference

> Single source of truth for UI consistency across all pages.  
> All patterns extracted directly from the landing page (`src/app/(app)/page.tsx`).

---

## 1. Color Palette

### Brand Colors (Primary)
| Token | Hex | Usage |
|---|---|---|
| Violet 700 | `#7c3aed` | Primary CTA background, orbs, step boxes |
| Indigo 600 | `#4f46e5` | CTA gradient mid-stop |
| Sky 500 | `#0ea5e9` | CTA gradient end, cyan orb, step 2 |
| Violet 500 | `#8b5cf6` | Orb fill, border glows |
| Violet 400 | `#a78bfa` | Shimmer gradient, stat numbers |
| Indigo 400 | `#818cf8` | Shimmer gradient mid |
| Sky 400 | `#38bdf8` | Shimmer gradient end, stat numbers |
| Violet 300 | `#c4b5fd` | Badge pill text, card titles |

### Semantic Text Colors
| Role | Value | Tailwind class |
|---|---|---|
| Primary text | White | `text-white` |
| Secondary text | `#94a3b8` (slate-400) | `text-slate-400` |
| Muted text | `#64748b` (slate-500) | `text-slate-500` |
| Accent inline text | `#a78bfa` (violet-400) | `text-violet-400` |
| Accent badge text | `#c4b5fd` (violet-300) | `text-violet-300` |

### Background Values
| Layer | Value |
|---|---|
| Base page color | `#080810` |
| Page gradient | `radial-gradient(ellipse at 20% 0%, rgba(124,58,237,0.15), transparent 60%), radial-gradient(ellipse at 80% 0%, rgba(14,165,233,0.1), transparent 50%), #080810` |
| Glass card bg | `rgba(255,255,255,0.03)` |
| Glass card hover bg | `rgba(255,255,255,0.06)` |
| Message card bg | `rgba(15,15,30,0.8)` |
| CTA banner bg | `linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(79,70,229,0.2) 50%, rgba(14,165,233,0.2) 100%)` |

### Feature Card Accent Color Pairs
| Color | Gradient (Tailwind) | Border class |
|---|---|---|
| Violet | `from-violet-500/20 to-purple-500/10` | `border-violet-500/30` |
| Sky | `from-sky-500/20 to-cyan-500/10` | `border-sky-500/30` |
| Emerald | `from-emerald-500/20 to-teal-500/10` | `border-emerald-500/30` |
| Pink | `from-pink-500/20 to-rose-500/10` | `border-pink-500/30` |
| Amber | `from-amber-500/20 to-orange-500/10` | `border-amber-500/30` |
| Indigo | `from-indigo-500/20 to-blue-500/10` | `border-indigo-500/30` |

---

## 2. Typography

### Scale
| Role | Tailwind classes |
|---|---|
| Page H1 (hero) | `text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter` |
| Section H2 | `text-3xl sm:text-4xl md:text-5xl font-black text-white` |
| Card H3 | `text-lg font-bold text-white` |
| Section eyebrow | `text-xs sm:text-sm font-semibold tracking-[0.3em] text-violet-400 uppercase` |
| Body / sub-headline | `text-base sm:text-lg md:text-xl text-slate-400 font-light leading-relaxed` |
| Body paragraph | `text-sm sm:text-base text-slate-400 leading-relaxed` |
| Micro / label | `text-xs text-slate-500` |
| Stat number | `text-4xl sm:text-5xl font-black` (gradient text) |
| Stat label | `text-sm sm:text-base font-medium text-slate-400 tracking-wide uppercase` |
| Badge text | `text-xs sm:text-sm font-medium text-violet-300 tracking-wide` |

### Shimmer Gradient Text
Wrap any keyword in `<span className="shimmer-text">` — the CSS class handles the animation.

```css
.shimmer-text {
  background: linear-gradient(90deg,
    #a78bfa 0%, #818cf8 25%, #38bdf8 50%, #818cf8 75%, #a78bfa 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
```

### Gradient Number Text (Stats)
```tsx
<div
  className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent"
  style={{ backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #38bdf8 100%)" }}
>
  {value}
</div>
```

---

## 3. Spacing & Layout

### Section Padding
| Section type | Padding |
|---|---|
| Hero | `min-h-screen` (full viewport) |
| Standard section | `py-24 px-6` |
| Stats section | `py-16 px-6` |
| Carousel section | `py-20 px-4` |

### Max Width Containers
| Container | Tailwind |
|---|---|
| Wide (features grid) | `max-w-6xl mx-auto` |
| Medium (how-it-works) | `max-w-5xl mx-auto` |
| Narrow (stats, CTA) | `max-w-4xl mx-auto` |
| Card (carousel) | `max-w-xl mx-auto` |
| Text (sub-headline) | `max-w-2xl` / `max-w-xl` / `max-w-lg` |

### Grid Layouts
| Use case | Classes |
|---|---|
| Features (3 col) | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` |
| How-it-works (3 col) | `grid grid-cols-1 md:grid-cols-3 gap-8` |

---

## 4. Background Layers (apply to every page)

### 4a. Page gradient (on `<main>` inline style)
```tsx
style={{
  background: "radial-gradient(ellipse at 20% 0%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 0%, rgba(14,165,233,0.1) 0%, transparent 50%), #080810"
}}
```

### 4b. Dot grid (fixed, z-0)
```tsx
<div className="fixed inset-0 grid-bg pointer-events-none z-0" />
```

### 4c. Noise overlay (fixed, z-0)
```tsx
<div className="fixed inset-0 noise-overlay pointer-events-none z-0" />
```

### 4d. Floating orbs (fixed, z-0)
```tsx
<div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
  <div className="absolute rounded-full blur-3xl opacity-20" style={{ width:600, height:600, background:"radial-gradient(circle,#7c3aed,#4f46e5)", top:"-15%", left:"-10%", animation:"floatOrb 8s 0s ease-in-out infinite alternate" }} />
  <div className="absolute rounded-full blur-3xl opacity-20" style={{ width:500, height:500, background:"radial-gradient(circle,#0ea5e9,#06b6d4)", top:"10%",  left:"70%", animation:"floatOrb 10s 2s ease-in-out infinite alternate" }} />
  <div className="absolute rounded-full blur-3xl opacity-20" style={{ width:400, height:400, background:"radial-gradient(circle,#8b5cf6,#a78bfa)", top:"60%", left:"80%", animation:"floatOrb 12s 4s ease-in-out infinite alternate" }} />
  <div className="absolute rounded-full blur-3xl opacity-20" style={{ width:350, height:350, background:"radial-gradient(circle,#ec4899,#f43f5e)", top:"70%", left:"-5%", animation:"floatOrb 9s 1s ease-in-out infinite alternate" }} />
</div>
```

> **Tip:** Inner pages can use 1–2 lighter orbs. Always `fixed` and `z-0`.

---

## 5. CSS Keyframes & Utility Classes

Add this `<style>` block to any page:

```css
@keyframes floatOrb {
  0%   { transform: translateY(0px) scale(1); }
  100% { transform: translateY(-40px) scale(1.1); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

/* Entrance animations — apply to top-of-page elements */
.hero-title    { animation: slideUp 0.8s 0.2s ease both; }
.hero-subtitle { animation: slideUp 0.8s 0.4s ease both; }
.hero-cta      { animation: slideUp 0.8s 0.6s ease both; }
.hero-carousel { animation: fadeInScale 0.9s 0.8s ease both; }

/* Shimmer gradient text */
.shimmer-text {
  background: linear-gradient(90deg,#a78bfa 0%,#818cf8 25%,#38bdf8 50%,#818cf8 75%,#a78bfa 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}

/* Glass card surface */
.glass-card {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
}
.glass-card:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(139,92,246,0.4);
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(139,92,246,0.15), 0 0 0 1px rgba(139,92,246,0.1);
}

/* Primary CTA button */
.cta-btn {
  background: linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#0ea5e9 100%);
  background-size: 200% auto;
  transition: all 0.4s ease;
  position: relative; overflow: hidden;
}
.cta-btn::after {
  content:''; position:absolute; inset:0;
  background: linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%);
  opacity:0; transition:opacity 0.3s ease;
}
.cta-btn:hover {
  background-position: right center;
  box-shadow: 0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(14,165,233,0.2);
  transform: translateY(-2px) scale(1.02);
}
.cta-btn:hover::after { opacity:1; }

/* Message/feedback card */
.message-card {
  background: rgba(15,15,30,0.8);
  border: 1px solid rgba(139,92,246,0.2);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}
.message-card:hover {
  border-color: rgba(139,92,246,0.5);
  box-shadow: 0 0 30px rgba(139,92,246,0.1);
}

/* Feature card (extends glass-card) */
.feature-card { transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94); }
.feature-card:hover { transform: translateY(-8px) scale(1.02); }

/* Badge / pill */
.badge-pill {
  background: rgba(139,92,246,0.15);
  border: 1px solid rgba(139,92,246,0.35);
  backdrop-filter: blur(10px);
}

/* Stat column divider */
.stat-divider {
  height:60px; width:1px;
  background: linear-gradient(to bottom,transparent,rgba(139,92,246,0.5),transparent);
}

/* Grid dot background */
.grid-bg {
  background-image:
    linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),
    linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);
  background-size: 60px 60px;
}

/* Film noise overlay */
.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.03;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .shimmer-text { animation: none; }
  .cta-btn:hover, .glass-card:hover, .feature-card:hover { transform: none; }
}
```

---

## 6. Reusable Component Snippets

### Section Heading (standard pattern)
```tsx
<div className="text-center mb-16">
  <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4">
    Eyebrow Label
  </p>
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
    Heading with <span className="shimmer-text">shimmer</span>
  </h2>
  <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
    Supporting description.
  </p>
</div>
```

### Primary CTA Button
```tsx
<button className="cta-btn text-white font-semibold px-8 py-4 rounded-2xl text-base sm:text-lg tracking-wide shadow-2xl">
  Action Label →
</button>
```

### Secondary (Glass) Button
```tsx
<button className="glass-card px-8 py-4 rounded-2xl text-base sm:text-lg font-semibold text-slate-200 tracking-wide hover:text-white">
  Secondary Action
</button>
```

### Badge Pill
```tsx
<div className="badge-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-violet-300 tracking-wide">
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
  </span>
  Label Text
</div>
```

### Glass Card
```tsx
<div className="glass-card rounded-3xl p-7">
  {/* content */}
</div>
```

### Feature Card (with icon box)
```tsx
<div className="feature-card glass-card rounded-3xl p-7 shadow-xl">
  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30 flex items-center justify-center text-2xl mb-5">
    🔗
  </div>
  <h3 className="text-lg font-bold text-white mb-3">Feature Title</h3>
  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">Description.</p>
</div>
```

### CTA Banner Panel
```tsx
<div
  className="rounded-[2.5rem] p-12 sm:p-16 text-center relative overflow-hidden"
  style={{
    background: "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(79,70,229,0.2) 50%, rgba(14,165,233,0.2) 100%)",
    border: "1px solid rgba(139,92,246,0.4)",
    boxShadow: "0 0 80px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
  }}
>
  <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
    style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.2) 0%, transparent 70%)" }}
  />
  <div className="relative z-10">
    {/* Heading, description, CTA button */}
  </div>
</div>
```

### Anonymous Avatar
```tsx
<div
  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
  style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
>
  ?
</div>
```

### Social Proof Avatar Cluster
```tsx
<div className="flex items-center gap-3">
  <div className="flex -space-x-2">
    {["#7c3aed","#0ea5e9","#10b981","#f59e0b"].map((c, i) => (
      <div key={i}
        className="w-8 h-8 rounded-full border-2 border-[#080810] flex items-center justify-center text-xs font-bold text-white"
        style={{ background: `linear-gradient(135deg,${c},${c}99)` }}
      >
        {["A","B","C","D"][i]}
      </div>
    ))}
  </div>
  <p className="text-slate-400 text-sm">
    <span className="text-white font-semibold">18,000+</span> links generated
  </p>
</div>
```

### Scroll Indicator
```tsx
<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
  <span className="text-xs text-slate-500 tracking-widest uppercase">Scroll</span>
  <div className="w-[1px] h-12 bg-gradient-to-b from-violet-500 to-transparent animate-pulse" />
</div>
```

### Stat Divider (between stat columns)
```tsx
<div className="stat-divider hidden sm:block" />
```

### Section Connector Line (between step boxes)
```tsx
<div
  className="hidden md:block absolute top-12 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-[1px]"
  style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.5),transparent)" }}
/>
```

---

## 7. Border Radius Reference
| Element | Class |
|---|---|
| Badges / pills | `rounded-full` |
| Buttons / icon boxes | `rounded-2xl` |
| Cards / panels | `rounded-3xl` |
| CTA banner | `rounded-[2.5rem]` |

---

## 8. Z-Index Stack
| Layer | z-index |
|---|---|
| Background (grid, orbs, noise) | `z-0` (fixed) |
| Page content (sections) | `z-10` (relative) |
| Inner card overlays | z-10 within parent |
