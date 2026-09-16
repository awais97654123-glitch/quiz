'use client';

import React from 'react';

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10"
    >
      {/* 1. Deep Navy-to-Black Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070b14] via-[#080d18] to-[#070b14]" />

      {/* 2. Developer Coordinate Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 217, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 217, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 3. Ambient Cyan & Deep Blue Radial Glows */}
      {/* Right ambient light behind the integrated laptop visual */}
      <div
        className="absolute top-1/4 right-[-5%] w-[650px] lg:w-[850px] h-[550px] lg:h-[650px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(0, 217, 255, 0.35) 0%, rgba(2, 132, 199, 0.2) 45%, transparent 70%)',
        }}
      />
      {/* Left subtle ambient fill behind the headline */}
      <div
        className="absolute top-1/3 left-[-5%] w-[500px] h-[450px] rounded-full blur-[130px] opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(0, 217, 255, 0.3) 0%, rgba(30, 58, 138, 0.15) 50%, transparent 70%)',
        }}
      />

      {/* 4. INTEGRATED ISOMETRIC DEVELOPER VISUAL (Blended Seamlessly Into Background) */}
      <div
        className="hidden md:block absolute top-8 right-0 lg:right-6 xl:right-12 w-[620px] lg:w-[720px] xl:w-[820px] h-[580px] lg:h-[640px] opacity-90 transition-opacity duration-700"
        style={{
          // Radical fade mask so this scene dissolves completely into the dark background on all edges
          maskImage:
            'radial-gradient(ellipse 75% 70% at 65% 45%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 70%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 70% at 65% 45%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 70%, transparent 100%)',
        }}
      >
        <svg
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform scale-100 origin-center"
        >
          <defs>
            {/* Screen Gradient */}
            <linearGradient id="screenBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#040810"/>
              <stop offset="100%" stop-color="#0b1329"/>
            </linearGradient>

            {/* Cyan Accent Gradient */}
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#00d9ff"/>
              <stop offset="100%" stop-color="#38bdf8"/>
            </linearGradient>

            {/* Plinth Shadow / Surface Gradients */}
            <linearGradient id="plinthTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0e172a"/>
              <stop offset="100%" stop-color="#090f1d"/>
            </linearGradient>
            <linearGradient id="plinthSide" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#090f1d"/>
              <stop offset="100%" stop-color="#04070e"/>
            </linearGradient>

            {/* Soft Glow Filter */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          {/* ── A. DARK ISOMETRIC DESK PLINTH ── */}
          <polygon
            points="140,430 490,260 760,380 410,550"
            fill="url(#plinthTop)"
            stroke="rgba(0, 217, 255, 0.15)"
            strokeWidth="1.2"
          />
          <polygon
            points="140,430 410,550 410,572 140,452"
            fill="url(#plinthSide)"
          />
          <polygon
            points="410,550 760,380 760,402 410,572"
            fill="url(#plinthSide)"
          />

          {/* Plinth Neon Edge Sheen */}
          <line
            x1="140"
            y1="430"
            x2="410"
            y2="550"
            stroke="url(#cyanGrad)"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* ── B. LAPTOP BASE (KEYBOARD CHASSIS) ── */}
          <polygon
            points="230,420 500,285 660,355 390,490"
            fill="#0f172a"
            stroke="rgba(0, 217, 255, 0.3)"
            strokeWidth="1.2"
          />
          {/* Keyboard Well */}
          <polygon
            points="270,410 490,300 610,355 390,465"
            fill="#070c18"
            stroke="rgba(255,255,255,0.06)"
          />
          {/* Trackpad */}
          <polygon
            points="370,470 430,440 455,452 395,482"
            fill="#0c1322"
            stroke="rgba(0, 217, 255, 0.2)"
          />

          {/* Keyboard Keys (Illuminated Matrix Grid) */}
          <g stroke="rgba(0, 217, 255, 0.25)" strokeWidth="0.8" opacity="0.65">
            <line x1="290" y1="395" x2="480" y2="300" />
            <line x1="310" y1="410" x2="505" y2="315" />
            <line x1="335" y1="428" x2="530" y2="330" />
            <line x1="360" y1="445" x2="560" y2="345" />

            <line x1="315" y1="380" x2="385" y2="465" />
            <line x1="355" y1="360" x2="425" y2="445" />
            <line x1="395" y1="340" x2="465" y2="425" />
            <line x1="435" y1="320" x2="505" y2="405" />
            <line x1="475" y1="305" x2="545" y2="390" />
          </g>

          {/* ── C. LAPTOP DISPLAY (OPEN SCREEN) ── */}
          {/* Screen Outer Bezel */}
          <polygon
            points="290,140 580,85 580,285 290,340"
            fill="#070c18"
            stroke="rgba(0, 217, 255, 0.45)"
            strokeWidth="1.8"
            filter="url(#cyanGlow)"
          />

          {/* Screen Glass Display Area */}
          <polygon
            points="298,148 572,96 572,278 298,330"
            fill="url(#screenBg)"
          />

          {/* Top Bar of Quiz Screen */}
          <g opacity="0.9">
            {/* Tag / Question Counter */}
            <rect x="312" y="162" width="72" height="14" rx="7" fill="rgba(0, 217, 255, 0.15)" stroke="rgba(0, 217, 255, 0.4)" strokeWidth="0.8"/>
            <text x="320" y="172" fill="#00d9ff" fontSize="8" fontFamily="monospace" fontWeight="bold">
              Question 3/10
            </text>

            {/* Language Pill */}
            <rect x="390" y="162" width="54" height="14" rx="7" fill="rgba(14, 165, 233, 0.2)" stroke="rgba(14, 165, 233, 0.35)" strokeWidth="0.8"/>
            <text x="396" y="172" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
              JavaScript
            </text>

            {/* Timer Clock */}
            <text x="525" y="172" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              ⏱ 00:42
            </text>
          </g>

          {/* Code Question Prompt */}
          <text x="312" y="196" fill="#f8fafc" fontSize="9.5" fontFamily="sans-serif" fontWeight="bold">
            What will be the output of this code?
          </text>

          {/* Code Snippet Box */}
          <rect x="312" y="206" width="150" height="34" rx="6" fill="#030712" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
          <text x="320" y="219" fill="#38bdf8" fontSize="7.5" fontFamily="monospace">
            const arr = [1, 2, 3];
          </text>
          <text x="320" y="231" fill="#00d9ff" fontSize="7.5" fontFamily="monospace">
            console.log(arr.length);
          </text>

          {/* Options List */}
          <g transform="translate(312, 248)">
            {/* Option 1 */}
            <rect x="0" y="0" width="150" height="12" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
            <circle cx="7" cy="6" r="2.5" stroke="#64748b" strokeWidth="0.8"/>
            <text x="14" y="9" fill="#94a3b8" fontSize="7" fontFamily="monospace">1</text>

            {/* Option 2 (Selected / Correct in Cyan) */}
            <rect x="0" y="15" width="150" height="12" rx="3" fill="rgba(0, 217, 255, 0.15)" stroke="#00d9ff" strokeWidth="0.8"/>
            <circle cx="7" cy="21" r="2.5" fill="#00d9ff"/>
            <text x="14" y="24" fill="#ffffff" fontSize="7" fontFamily="monospace" fontWeight="bold">2</text>

            {/* Option 3 */}
            <rect x="0" y="30" width="150" height="12" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
            <circle cx="7" cy="36" r="2.5" stroke="#64748b" strokeWidth="0.8"/>
            <text x="14" y="39" fill="#94a3b8" fontSize="7" fontFamily="monospace">3</text>

            {/* Option 4 */}
            <rect x="0" y="45" width="150" height="12" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
            <circle cx="7" cy="51" r="2.5" stroke="#64748b" strokeWidth="0.8"/>
            <text x="14" y="54" fill="#94a3b8" fontSize="7" fontFamily="monospace">undefined</text>
          </g>

          {/* Mini Live Leaderboard on right of laptop screen */}
          <g transform="translate(475, 196)">
            <rect x="0" y="0" width="88" height="110" rx="6" fill="#030712" stroke="rgba(0, 217, 255, 0.2)" strokeWidth="0.8"/>
            <text x="8" y="13" fill="#00d9ff" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold">
              Leaderboard
            </text>

            <g fontSize="6.8" fontFamily="monospace">
              <text x="8" y="29" fill="#cbd5e1">1. Alex</text>
              <text x="64" y="29" fill="#38bdf8">920</text>

              <text x="8" y="44" fill="#cbd5e1">2. Sarah</text>
              <text x="64" y="44" fill="#38bdf8">860</text>

              {/* You Highlighted */}
              <rect x="4" y="51" width="80" height="12" rx="3" fill="rgba(0, 217, 255, 0.18)" stroke="rgba(0, 217, 255, 0.4)" strokeWidth="0.5"/>
              <text x="8" y="60" fill="#00d9ff" fontWeight="bold">3. You</text>
              <text x="64" y="60" fill="#00d9ff" fontWeight="bold">800</text>

              <text x="8" y="76" fill="#94a3b8">4. John</text>
              <text x="64" y="76" fill="#64748b">760</text>

              <text x="8" y="91" fill="#94a3b8">5. Emma</text>
              <text x="64" y="91" fill="#64748b">720</text>
            </g>
          </g>

          {/* ── D. FLOATING TECH BADGES WITH SUBTLE NEON HALOS ── */}
          {/* Floating JS Badge */}
          <g transform="translate(680, 150)">
            <rect width="36" height="36" rx="10" fill="#0b1324" stroke="rgba(0, 217, 255, 0.4)" strokeWidth="1.2" filter="url(#cyanGlow)"/>
            <text x="10" y="24" fill="#00d9ff" fontSize="13" fontFamily="monospace" fontWeight="900">JS</text>
          </g>

          {/* Floating React Atom Badge */}
          <g transform="translate(710, 215)">
            <rect width="40" height="40" rx="12" fill="#0b1324" stroke="rgba(0, 217, 255, 0.5)" strokeWidth="1.2" filter="url(#cyanGlow)"/>
            <circle cx="20" cy="20" r="2.5" fill="#00d9ff"/>
            <ellipse cx="20" cy="20" rx="11" ry="4.5" fill="none" stroke="#00d9ff" strokeWidth="0.9" transform="rotate(30 20 20)"/>
            <ellipse cx="20" cy="20" rx="11" ry="4.5" fill="none" stroke="#00d9ff" strokeWidth="0.9" transform="rotate(90 20 20)"/>
            <ellipse cx="20" cy="20" rx="11" ry="4.5" fill="none" stroke="#00d9ff" strokeWidth="0.9" transform="rotate(150 20 20)"/>
          </g>

          {/* Floating GitHub Badge */}
          <g transform="translate(675, 290)">
            <rect width="36" height="36" rx="10" fill="#0b1324" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1"/>
            <path
              d="M18 10C13.58 10 10 13.58 10 18C10 21.54 12.29 24.53 15.47 25.59C15.87 25.66 16.02 25.42 16.02 25.21C16.02 25.02 16.01 24.39 16.01 23.63C13.79 24.11 13.32 22.67 13.32 22.67C12.95 21.75 12.43 21.5 12.43 21.5C11.71 21.01 12.49 21.02 12.49 21.02C13.29 21.08 13.71 21.84 13.71 21.84C14.42 23.05 15.57 22.7 16.02 22.5C16.09 21.99 16.3 21.63 16.52 21.43C14.75 21.23 12.89 20.54 12.89 17.49C12.89 16.62 13.2 15.91 13.71 15.35C13.63 15.15 13.36 14.34 13.79 13.24C13.79 13.24 14.46 13.03 15.98 14.06C16.62 13.88 17.3 13.79 17.98 13.79C18.66 13.79 19.34 13.88 19.98 14.06C21.5 13.03 22.17 13.24 22.17 13.24C22.6 14.34 22.33 15.15 22.25 15.35C22.76 15.91 23.07 16.62 23.07 17.49C23.07 20.55 21.2 21.22 19.42 21.42C19.71 21.67 19.96 22.15 19.96 22.9C19.96 23.98 19.95 24.84 19.95 25.11C19.95 25.33 20.09 25.58 20.5 25.5C23.7 24.43 26 21.46 26 17.9C26 13.48 22.42 10 18 10Z"
              fill="#cbd5e1"
            />
          </g>

          {/* Floating Neon Code Token Badge (Left of Laptop) */}
          <g transform="translate(460, 110)">
            <rect width="40" height="40" rx="12" fill="#08101e" stroke="rgba(0, 217, 255, 0.6)" strokeWidth="1.4" filter="url(#cyanGlow)"/>
            <text x="7" y="26" fill="#00d9ff" fontSize="15" fontFamily="monospace" fontWeight="900">&lt;/&gt;</text>
          </g>

          {/* "Better Developers Together" Desk Inscription */}
          <text
            x="340"
            y="520"
            fill="rgba(148, 163, 184, 0.3)"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
            transform="rotate(-23 340 520)"
          >
            BETTER DEVELOPERS TOGETHER
          </text>
        </svg>
      </div>

      {/* 5. Bottom Vignette Softening Blend */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#070b14] via-[#070b14]/80 to-transparent" />
    </div>
  );
}
