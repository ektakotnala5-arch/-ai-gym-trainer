// AnimeMascot.jsx — Drop-in replacement for HabitTracker
// Characters: Giyu(0d) | Zenitsu(3d) | Levi(7d) | Muichiro(14d) | Obanai(21d) | Ichigo(30d)

import { useEffect, useRef } from 'react'

// ─── CSS animations injected once ────────────────────────────────────────────
const ANIM_CSS = `
@keyframes waterFloat   { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-12px) rotate(1deg)} }
@keyframes thunderBolt  { 0%,100%{transform:translateY(0) rotate(0)} 20%{transform:translateY(-18px) rotate(-7deg)} 60%{transform:translateY(-14px) rotate(7deg)} }
@keyframes scoutFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
@keyframes mistDrift    { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-13px) rotate(2deg)} }
@keyframes serpentSway  { 0%,100%{transform:translateY(0) rotate(0)} 33%{transform:translateY(-10px) rotate(-6deg)} 66%{transform:translateY(-8px) rotate(6deg)} }
@keyframes bankaiRage   { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.12) translateY(-20px)} }
@keyframes auraRing     { 0%,100%{opacity:0.2} 50%{opacity:0.55} }
@keyframes zapAnim      { 0%,100%{opacity:0;transform:scaleY(0.3)} 15%,85%{opacity:1;transform:scaleY(1)} 50%{opacity:0.6} }
@keyframes trailFade    { 0%{stroke-dashoffset:0;opacity:0.8} 100%{stroke-dashoffset:100;opacity:0} }
@keyframes surgeUp      { 0%,100%{transform:translateY(0);opacity:0.6} 50%{transform:translateY(-35px);opacity:0} }
@keyframes eyeBlink     { 0%,86%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.06)} }
@keyframes maskPulse    { 0%,100%{opacity:0.85} 50%{opacity:1} }
`

// ─── Shared SVG helpers ───────────────────────────────────────────────────────
const Feet = ({ boot, strap }) => (
  <>
    <rect x="72" y="276" width="32" height="24" rx="10" fill={boot}/>
    <rect x="116" y="276" width="32" height="24" rx="10" fill={boot}/>
    <rect x="72" y="282" width="32" height="8" rx="3" fill={strap}/>
    <rect x="116" y="282" width="32" height="8" rx="3" fill={strap}/>
  </>
)

const Pants = ({ c1, c2 }) => (
  <>
    <rect x="76" y="242" width="68" height="38" rx="10" fill={c1}/>
    <line x1="110" y1="242" x2="110" y2="280" stroke={c2} strokeWidth="2"/>
  </>
)

const Arms = ({ color }) => (
  <>
    <path d="M62 188 Q38 206 30 234 Q27 248 41 250 Q54 251 58 237 Q62 220 72 208Z" fill={color}/>
    <ellipse cx="34" cy="251" rx="13" ry="10" fill={color}/>
    <path d="M158 188 Q182 206 190 234 Q193 248 179 250 Q166 251 162 237 Q158 220 148 208Z" fill={color}/>
    <ellipse cx="186" cy="251" rx="13" ry="10" fill={color}/>
  </>
)

const Neck = () => (
  <path d="M96 162 Q110 174 124 162 L124 183 Q110 172 96 183Z" fill="url(#skinGrad)"/>
)

const Head = () => (
  <>
    <ellipse cx="110" cy="118" rx="47" ry="49" fill="url(#skinGrad)"/>
    <ellipse cx="110" cy="118" rx="47" ry="49" fill="none" stroke="#c07840" strokeWidth="1"/>
    <ellipse cx="62"  cy="118" rx="9"  ry="12" fill="url(#skinGrad)" stroke="#c07840" strokeWidth="1"/>
    <ellipse cx="158" cy="118" rx="9"  ry="12" fill="url(#skinGrad)" stroke="#c07840" strokeWidth="1"/>
    <path d="M107 128 Q110 133 113 128" fill="none" stroke="#c07840" strokeWidth="1.5" strokeLinecap="round"/>
  </>
)

const NormalEyes = ({ iris, pupil }) => (
  <>
    <g style={{ transformOrigin:'94px 114px', animation:'eyeBlink 3.8s infinite' }}>
      <ellipse cx="94" cy="114" rx="11" ry="13" fill="white"/>
      <ellipse cx="96" cy="115" rx="7"  ry="8.5" fill={iris}/>
      <ellipse cx="97" cy="113" rx="3"  ry="3.5" fill={pupil}/>
      <ellipse cx="98" cy="111" rx="1.4" ry="1.6" fill="white" opacity="0.9"/>
    </g>
    <g style={{ transformOrigin:'126px 114px', animation:'eyeBlink 3.8s infinite 0.4s' }}>
      <ellipse cx="126" cy="114" rx="11" ry="13" fill="white"/>
      <ellipse cx="128" cy="115" rx="7"  ry="8.5" fill={iris}/>
      <ellipse cx="129" cy="113" rx="3"  ry="3.5" fill={pupil}/>
      <ellipse cx="130" cy="111" rx="1.4" ry="1.6" fill="white" opacity="0.9"/>
    </g>
  </>
)

const Brows = ({ color }) => (
  <>
    <path d="M80 98 Q94 91 106 97"  fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M114 97 Q126 91 140 98" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
  </>
)

const Cheeks = ({ opacity = '0.15' }) => (
  <>
    <ellipse cx="80"  cy="126" rx="11" ry="8" fill="#ff7043" opacity={opacity}/>
    <ellipse cx="140" cy="126" rx="11" ry="8" fill="#ff7043" opacity={opacity}/>
  </>
)

const SwordRight = ({ blade, guard, wrap }) => (
  <>
    <rect x="152" y="182" width="5.5" height="75" rx="2.5" fill={blade} transform="rotate(12,155,218)"/>
    <ellipse cx="154" cy="185" rx="10" ry="5.5" fill={guard} transform="rotate(12,154,185)"/>
    <rect x="152" y="208" width="5.5" height="34" rx="1.5" fill={wrap}  transform="rotate(12,155,225)"/>
  </>
)

const SwordLeft = ({ blade, guard, wrap }) => (
  <>
    <rect x="62"  y="182" width="5.5" height="75" rx="2.5" fill={blade} transform="rotate(-12,65,218)"/>
    <ellipse cx="66" cy="185" rx="10" ry="5.5" fill={guard} transform="rotate(-12,66,185)"/>
    <rect x="63"  y="208" width="5.5" height="34" rx="1.5" fill={wrap}  transform="rotate(-12,65,225)"/>
  </>
)

// Checker pattern for Giyu haori
const CheckerRect = ({ x, y, w, h, c1, c2, size = 10 }) => {
  const cells = []
  for (let row = 0; row < Math.ceil(h / size); row++) {
    for (let col = 0; col < Math.ceil(w / size); col++) {
      const fill = (row + col) % 2 === 0 ? c1 : c2
      cells.push(<rect key={`${row}-${col}`} x={x + col * size} y={y + row * size} width={size} height={size} fill={fill} opacity="0.92"/>)
    }
  }
  return (
    <>
      <clipPath id="checkerClip"><rect x={x} y={y} width={w} height={h} rx="10"/></clipPath>
      <g clipPath="url(#checkerClip)">{cells}</g>
    </>
  )
}

// Obanai stripe haori
const StripeHaori = ({ x, y, w, h }) => {
  const stripes = []
  const sw = 10
  for (let i = 0; i < Math.ceil(w / sw); i++) {
    const fill = i % 2 === 0 ? '#1a1a1a' : '#f5f5f5'
    stripes.push(<rect key={i} x={x + i * sw} y={y} width={sw} height={h} fill={fill} opacity="0.92"/>)
  }
  return (
    <>
      <clipPath id="stripeClip"><rect x={x} y={y} width={w} height={h} rx="10"/></clipPath>
      <g clipPath="url(#stripeClip)">{stripes}</g>
    </>
  )
}

// Aura rings behind each character
const AuraRings = ({ color, streak }) => (
  <>
    <ellipse cx="110" cy="310" rx={streak >= 30 ? 90 : 72} ry="22"
      fill={color} opacity="0.18" style={{ animation:'auraRing 2s infinite' }}/>
    <ellipse cx="110" cy="310" rx={streak >= 30 ? 110 : 90} ry="28"
      fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="8 6" opacity="0.18"
      style={{ animation:`auraRing ${streak === 3 || streak >= 30 ? '1.2s' : '2.6s'} infinite reverse` }}/>

    {/* Zenitsu lightning bolts */}
    {streak >= 3 && streak < 7 && (
      <>
        <line x1="50"  y1="310" x2="38"  y2="248" stroke="#ffe082" strokeWidth="2.5" style={{ animation:'zapAnim 0.5s infinite' }}/>
        <line x1="170" y1="310" x2="182" y2="246" stroke="#fff176" strokeWidth="2.5" style={{ animation:'zapAnim 0.5s infinite 0.25s' }}/>
      </>
    )}

    {/* Muichiro mist surges */}
    {streak >= 14 && streak < 21 && (
      <>
        <path d="M32 285 Q14 255 20 222 Q26 252 38 248Z" fill="#26a69a" opacity="0.5" style={{ animation:'surgeUp 2.5s infinite' }}/>
        <path d="M188 285 Q206 255 200 222 Q194 252 182 248Z" fill="#00897b" opacity="0.5" style={{ animation:'surgeUp 2.5s infinite 1.2s' }}/>
      </>
    )}

    {/* Obanai serpent energy */}
    {streak >= 21 && streak < 30 && (
      <>
        <path d="M38 300 Q20 272 28 238 Q32 265 44 260Z" fill="#9c27b0" opacity="0.55" style={{ animation:'surgeUp 2s infinite' }}/>
        <path d="M182 300 Q200 272 192 238 Q188 265 176 260Z" fill="#7b1fa2" opacity="0.5" style={{ animation:'surgeUp 2s infinite 1s' }}/>
      </>
    )}

    {/* Ichigo Vasto Lorde massive aura */}
    {streak >= 30 && (
      <>
        <path d="M20 312 Q0 262 18 202 Q22 257 38 250Z" fill="#d32f2f" opacity="0.65" style={{ animation:'surgeUp 1s infinite' }}/>
        <path d="M200 312 Q220 262 202 202 Q198 257 182 250Z" fill="#b71c1c" opacity="0.6" style={{ animation:'surgeUp 1s infinite 0.5s' }}/>
        <path d="M40 318 Q10 272 22 222 Q28 268 45 260Z" fill="#e53935" opacity="0.45" style={{ animation:'surgeUp 1.3s infinite 0.2s' }}/>
        <path d="M180 318 Q210 272 198 222 Q192 268 175 260Z" fill="#c62828" opacity="0.4" style={{ animation:'surgeUp 1.3s infinite 0.7s' }}/>
      </>
    )}
  </>
)

// ─── Individual character bodies ──────────────────────────────────────────────

const GiyuBody = () => (
  <>
    <Feet boot="#0a0a1a" strap="#1a1a3a"/>
    <Pants c1="#1a1a3a" c2="#0d0d22"/>
    {/* Red left / green-yellow checker right haori */}
    <rect x="62" y="180" width="48" height="76" rx="10" fill="#c62828"/>
    <rect x="110" y="180" width="48" height="76" rx="10" fill="#2e7d32"/>
    <CheckerRect x={110} y={180} w={48} h={76} c1="#f9a825" c2="#1b5e20" size={10}/>
    {/* Shirt */}
    <rect x="62" y="180" width="96" height="66" rx="13" fill="#1a1a2e"/>
    <path d="M84 180 L110 200 L136 180" fill="#111"/>
    <rect x="62" y="208" width="96" height="3" rx="1" fill="#333"/>
    <Arms color="#1a1a2e"/>
    <Neck/>
    <Head/>
    {/* Dark black-blue layered hair */}
    <ellipse cx="110" cy="90" rx="47" ry="34" fill="#1a1a2e"/>
    <path d="M63 100 Q56 68 74 60 Q65 80 80 78Z" fill="#12122a"/>
    <path d="M157 100 Q164 68 146 60 Q155 80 140 78Z" fill="#12122a"/>
    <path d="M76 74 Q84 46 108 62Z" fill="#0d0d22"/>
    <path d="M144 74 Q136 46 112 62Z" fill="#0d0d22"/>
    <path d="M108 66 Q108 40 116 55Z" fill="#1a1a2e"/>
    <path d="M63 105 Q56 128 60 152 Q58 132 68 128Z" fill="#1a1a2e"/>
    <path d="M157 105 Q164 128 160 152 Q162 132 152 128Z" fill="#1a1a2e"/>
    <NormalEyes iris="#2e6db5" pupil="#1a4488"/>
    <Brows color="#1a1a2e"/>
    {/* Stoic flat mouth */}
    <path d="M102 142 Q110 139 118 142" fill="none" stroke="#7a4520" strokeWidth="2" strokeLinecap="round"/>
    <Cheeks opacity="0.1"/>
    {/* Water Breathing trail */}
    <path d="M155 215 Q180 185 176 152" fill="none" stroke="#4fc3f7" strokeWidth="2.5"
      strokeDasharray="12 6" opacity="0.7" style={{ animation:'trailFade 2.2s linear infinite' }}/>
    <path d="M158 220 Q184 188 180 148" fill="none" stroke="#81d4fa" strokeWidth="1.2"
      strokeDasharray="8 10" opacity="0.45" style={{ animation:'trailFade 2.2s linear infinite 0.8s' }}/>
    <SwordRight blade="#4a90d9" guard="#1a5280" wrap="#b8860b"/>
  </>
)

const ZenitsuBody = () => (
  <>
    <Feet boot="#1a1000" strap="#2a1e00"/>
    <Pants c1="#1a1400" c2="#0d0c00"/>
    {/* Yellow haori */}
    <rect x="62" y="180" width="96" height="76" rx="13" fill="#e65100"/>
    <rect x="62" y="180" width="96" height="20" rx="8" fill="#bf360c" opacity="0.6"/>
    <path d="M86 180 L110 200 L134 180" fill="#7f2700"/>
    <rect x="62" y="210" width="96" height="3" rx="1" fill="#ffd54f"/>
    <rect x="66" y="224" width="88" height="3" rx="1" fill="#ffd54f"/>
    <Arms color="#e65100"/>
    <Neck/>
    <Head/>
    {/* Zenitsu spiky yellow hair */}
    <ellipse cx="110" cy="88" rx="47" ry="34" fill="#fdd835"/>
    <path d="M63 98 Q55 65 72 57 Q63 78 78 76Z" fill="#f9a825"/>
    <path d="M157 98 Q165 65 148 57 Q157 78 142 76Z" fill="#f9a825"/>
    <path d="M74 72 Q82 42 106 60Z" fill="#ffb300"/>
    <path d="M146 72 Q138 42 114 60Z" fill="#f9a825"/>
    <path d="M108 64 Q108 36 116 52Z" fill="#fdd835"/>
    <path d="M120 66 Q130 38 128 58Z" fill="#f9a825"/>
    <NormalEyes iris="#6d4c41" pupil="#4e342e"/>
    <Brows color="#8d6e63"/>
    {/* Big smile */}
    <path d="M96 142 Q110 157 124 142" fill="none" stroke="#7a4520" strokeWidth="2.5" strokeLinecap="round"/>
    <Cheeks opacity="0.65"/>
    {/* Thunder trail */}
    <path d="M155 215 L178 186 L170 192 L188 158" fill="none" stroke="#fff176" strokeWidth="3"
      style={{ animation:'trailFade 0.5s linear infinite' }}/>
    <SwordLeft blade="#ffd740" guard="#b8960c" wrap="#5d3b00"/>
  </>
)

const LeviBody = () => (
  <>
    <Feet boot="#2e1800" strap="#4a2e12"/>
    {/* Survey Corps pants + ODM harness */}
    <rect x="76" y="242" width="62" height="46" rx="10" fill="#6d4c41"/>
    <line x1="107" y1="242" x2="107" y2="288" stroke="#4e342e" strokeWidth="2"/>
    <rect x="70" y="234" width="76" height="14" rx="5" fill="#795548"/>
    <rect x="84" y="238" width="18" height="8" rx="2" fill="#4e342e"/>
    <rect x="112" y="238" width="18" height="8" rx="2" fill="#4e342e"/>
    <rect x="62" y="180" width="96" height="58" rx="13" fill="#6d4c41"/>
    <rect x="62" y="180" width="96" height="22" rx="8" fill="#5d4037" opacity="0.7"/>
    <path d="M84 180 L110 198 L136 180" fill="#4e342e"/>
    <rect x="62" y="208" width="96" height="3" rx="1" fill="#8d6e63"/>
    <rect x="64" y="220" width="92" height="3" rx="1" fill="#8d6e63"/>
    {/* Tan cravat */}
    <rect x="78" y="183" width="64" height="18" rx="4" fill="#9e8274" opacity="0.35"/>
    {/* ODM strap holders */}
    <rect x="64" y="237" width="16" height="44" rx="5" fill="#8d6e63"/>
    <rect x="134" y="237" width="16" height="44" rx="5" fill="#8d6e63"/>
    <rect x="66" y="262" width="16" height="9" rx="3" fill="#795548"/>
    <rect x="136" y="262" width="16" height="9" rx="3" fill="#795548"/>
    {/* Arms crossed */}
    <path d="M62 186 Q38 204 30 232 Q27 244 40 246 Q52 247 56 234 Q60 220 70 208Z" fill="#6d4c41"/>
    <ellipse cx="34" cy="247" rx="13" ry="10" fill="#6d4c41"/>
    <path d="M62 186 Q88 205 80 218 Q70 212 62 186Z" fill="#5d4037" opacity="0.6"/>
    <path d="M158 186 Q182 204 190 232 Q193 244 180 246 Q168 247 164 234 Q160 220 150 208Z" fill="#6d4c41"/>
    <ellipse cx="186" cy="247" rx="13" ry="10" fill="#6d4c41"/>
    <path d="M158 186 Q132 205 140 218 Q150 212 158 186Z" fill="#5d4037" opacity="0.6"/>
    <path d="M68 220 Q110 232 152 220" fill="none" stroke="#795548" strokeWidth="2.5"/>
    <Neck/>
    <Head/>
    {/* Short dark undercut hair */}
    <rect x="63" y="70" width="94" height="40" rx="20" fill="#1a1a1a"/>
    <ellipse cx="110" cy="86" rx="47" ry="28" fill="#1a1a1a"/>
    <path d="M63 98 Q60 78 68 68 Q64 84 75 80Z" fill="#111"/>
    <path d="M157 98 Q160 78 152 68 Q156 84 145 80Z" fill="#111"/>
    <path d="M75 72 Q84 50 104 65Z" fill="#212121"/>
    <path d="M145 72 Q136 50 116 65Z" fill="#212121"/>
    <NormalEyes iris="#607d8b" pupil="#37474f"/>
    {/* Heavy scowl brows */}
    <path d="M78 96 Q92 88 104 94" fill="none" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M116 94 Q128 88 142 96" fill="none" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M99 142 Q110 138 121 142" fill="none" stroke="#7a4520" strokeWidth="2" strokeLinecap="round"/>
    <Cheeks opacity="0.06"/>
    {/* ODM blades */}
    <path d="M145 208 L182 170" fill="none" stroke="#ccc" strokeWidth="2.5"/>
    <path d="M75 208 L38 172" fill="none" stroke="#ccc" strokeWidth="2.5"/>
    <path d="M148 212 Q175 175 172 148" fill="none" stroke="#e0e0e0" strokeWidth="2"
      strokeDasharray="20 8" style={{ animation:'trailFade 1.5s linear infinite' }}/>
  </>
)

const MuichiroBody = () => (
  <>
    <Feet boot="#111" strap="#1e1e1e"/>
    <Pants c1="#0d1f1e" c2="#07100f"/>
    <rect x="62" y="180" width="96" height="76" rx="13" fill="#1a1a1a"/>
    <rect x="62" y="180" width="96" height="22" rx="8" fill="#0d0d0d" opacity="0.6"/>
    <path d="M86 180 L110 200 L134 180" fill="#080808"/>
    <rect x="62" y="208" width="96" height="3" rx="1" fill="#26a69a" opacity="0.7"/>
    <rect x="66" y="222" width="88" height="3" rx="1" fill="#26a69a" opacity="0.4"/>
    <Arms color="#1a1a1a"/>
    <Neck/>
    <Head/>
    {/* Teal long hair */}
    <ellipse cx="110" cy="88" rx="47" ry="34" fill="#00695c"/>
    <path d="M63 100 Q54 65 72 55 Q62 78 78 75Z" fill="#00796b"/>
    <path d="M157 100 Q166 65 148 55 Q158 78 142 75Z" fill="#00796b"/>
    <path d="M76 72 Q84 44 106 60Z" fill="#00897b"/>
    <path d="M144 72 Q136 44 114 60Z" fill="#00897b"/>
    <path d="M108 65 Q108 38 116 52Z" fill="#004d40"/>
    {/* Long flowing side strands */}
    <path d="M63 105 Q52 135 55 165 Q54 142 65 138Z" fill="#00695c"/>
    <path d="M157 105 Q168 135 165 165 Q166 142 155 138Z" fill="#00695c"/>
    <path d="M66 108 Q48 148 52 178 Q50 155 62 150Z" fill="#00796b" opacity="0.7"/>
    <path d="M154 108 Q172 148 168 178 Q170 155 158 150Z" fill="#00796b" opacity="0.7"/>
    <NormalEyes iris="#4db6ac" pupil="#00796b"/>
    <Brows color="#004d40"/>
    <path d="M99 142 Q110 154 121 142" fill="none" stroke="#7a4520" strokeWidth="2" strokeLinecap="round"/>
    <Cheeks opacity="0.22"/>
    {/* Mist trails */}
    <path d="M155 218 Q182 188 178 155" fill="none" stroke="#80cbc4" strokeWidth="2.5"
      strokeDasharray="14 7" style={{ animation:'trailFade 2.5s linear infinite' }}/>
    <path d="M152 222 Q180 192 175 150" fill="none" stroke="#b2dfdb" strokeWidth="1.2"
      strokeDasharray="9 12" opacity="0.5" style={{ animation:'trailFade 2.5s linear infinite 1s' }}/>
    <SwordRight blade="#b2dfdb" guard="#80cbc4" wrap="#004d40"/>
  </>
)

const ObanaiBody = () => (
  <>
    <Feet boot="#0a0a0a" strap="#1a1a1a"/>
    <Pants c1="#111" c2="#080808"/>
    {/* Serpent Hashira black+white striped haori */}
    <rect x="60" y="178" width="100" height="80" rx="10" fill="#1a1a1a"/>
    <StripeHaori x={60} y={178} w={100} h={80}/>
    <rect x="62" y="180" width="96" height="76" rx="10" fill="none" stroke="#555" strokeWidth="0.5"/>
    <path d="M84 180 L110 200 L136 180" fill="#111"/>
    <rect x="62" y="180" width="96" height="66" rx="13" fill="#111"/>
    <rect x="62" y="208" width="96" height="3" rx="1" fill="#555"/>
    <Arms color="#111"/>
    <Neck/>
    <Head/>
    {/* Black hair */}
    <ellipse cx="110" cy="88" rx="47" ry="33" fill="#1a1a1a"/>
    <path d="M63 98 Q56 66 73 57 Q64 78 79 76Z" fill="#111"/>
    <path d="M157 98 Q164 66 147 57 Q156 78 141 76Z" fill="#111"/>
    <path d="M77 72 Q85 44 106 60Z" fill="#222"/>
    <path d="M143 72 Q135 44 114 60Z" fill="#222"/>
    {/* Heterochromia — green left, blue right */}
    <g style={{ transformOrigin:'94px 114px', animation:'eyeBlink 3.8s infinite' }}>
      <ellipse cx="94"  cy="114" rx="11" ry="13" fill="white"/>
      <ellipse cx="96"  cy="115" rx="7.5" ry="9" fill="#4caf50"/>
      <ellipse cx="97"  cy="113" rx="3.2" ry="3.8" fill="#1a1a1a"/>
      <ellipse cx="98"  cy="111" rx="1.4" ry="1.6" fill="white" opacity="0.9"/>
    </g>
    <g style={{ transformOrigin:'126px 114px', animation:'eyeBlink 3.8s infinite 0.4s' }}>
      <ellipse cx="126" cy="114" rx="11" ry="13" fill="white"/>
      <ellipse cx="128" cy="115" rx="7.5" ry="9" fill="#1565c0"/>
      <ellipse cx="129" cy="113" rx="3.2" ry="3.8" fill="#1a1a1a"/>
      <ellipse cx="130" cy="111" rx="1.4" ry="1.6" fill="white" opacity="0.9"/>
    </g>
    <path d="M78 94 Q92 87 104 93" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
    <path d="M116 93 Q128 87 142 94" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
    {/* Bandage mask */}
    <rect x="80" y="126" width="60" height="22" rx="6" fill="#f5f5f5"/>
    <rect x="80" y="130" width="60" height="3" rx="1" fill="#e0e0e0"/>
    <rect x="80" y="136" width="60" height="3" rx="1" fill="#e0e0e0"/>
    <rect x="80" y="142" width="60" height="3" rx="1" fill="#e0e0e0"/>
    <Cheeks opacity="0.06"/>
    {/* Kaburamaru the white snake */}
    <path d="M140 145 Q165 132 172 108 Q175 125 162 138 Q172 130 170 120 Q176 140 158 148Z"
      fill="#e0e0e0" stroke="#bdbdbd" strokeWidth="1"/>
    <ellipse cx="174" cy="106" rx="7" ry="9" fill="#e0e0e0" stroke="#bdbdbd" strokeWidth="1"/>
    <ellipse cx="174" cy="103" rx="2.5" ry="3" fill="#ffd740"/>
    <path d="M171 106 L174 110 L177 106" fill="#bdbdbd"/>
    <SwordLeft blade="#e1bee7" guard="#ce93d8" wrap="#4a148c"/>
  </>
)

const IchigoBody = () => (
  <>
    <Feet boot="#0a0a0a" strap="#1a1a1a"/>
    <Pants c1="#050000" c2="#030000"/>
    {/* Hollow/Arrancar black robes — ragged edges */}
    <rect x="58" y="175" width="104" height="80" rx="12" fill="#080808"/>
    <rect x="56" y="175" width="108" height="80" rx="12" fill="none"
      stroke="#c62828" strokeWidth="1.5" opacity="0.6" style={{ animation:'maskPulse 2s infinite' }}/>
    <path d="M84 175 L110 197 L136 175" fill="#050505"/>
    <rect x="62" y="210" width="96" height="3" rx="1" fill="#b71c1c" opacity="0.8"/>
    {/* Ragged hem */}
    <path d="M62 255 Q72 250 78 255 Q86 248 92 255 Q100 249 108 255 Q116 249 122 255 Q130 248 138 255 Q144 250 152 254 Q158 249 162 255 L162 175 L62 175Z" fill="#0a0a0a"/>
    {/* Long dark hollow arms */}
    <path d="M58 183 Q32 202 24 232 Q20 248 36 250 Q50 251 54 237 Q58 220 68 208Z" fill="#0d0d0d"/>
    <ellipse cx="28" cy="252" rx="14" ry="11" fill="#0d0d0d"/>
    <path d="M24 232 Q18 240 20 252" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
    <path d="M162 183 Q188 202 196 232 Q200 248 184 250 Q170 251 166 237 Q162 220 152 208Z" fill="#0d0d0d"/>
    <ellipse cx="192" cy="252" rx="14" ry="11" fill="#0d0d0d"/>
    <Neck/>
    <Head/>
    {/* Orange Ichigo hair — spiky */}
    <ellipse cx="110" cy="87" rx="47" ry="33" fill="#e65100"/>
    <path d="M63 98 Q55 64 72 55 Q63 78 78 75Z" fill="#d84315"/>
    <path d="M157 98 Q165 64 148 55 Q157 78 142 75Z" fill="#d84315"/>
    <path d="M76 72 Q84 43 106 60Z" fill="#bf360c"/>
    <path d="M144 72 Q136 43 114 60Z" fill="#bf360c"/>
    <path d="M108 64 Q108 36 115 52Z" fill="#e65100"/>
    <path d="M122 68 Q132 40 128 60Z" fill="#d84315"/>
    <path d="M97 64 Q90 36 98 54Z" fill="#bf360c"/>
    {/* Hollow mask fragment right side */}
    <path d="M138 100 Q155 92 158 108 Q156 120 144 124 Q148 112 142 106Z"
      fill="white" stroke="#ddd" strokeWidth="1" style={{ animation:'maskPulse 2s infinite' }}/>
    <ellipse cx="152" cy="108" rx="4" ry="6" fill="#b71c1c"/>
    {/* Battle scar */}
    <path d="M80 102 Q84 116 82 130" fill="none" stroke="#d32f2f" strokeWidth="2.5"
      strokeLinecap="round" opacity="0.9"/>
    {/* Glowing red eyes */}
    <g style={{ transformOrigin:'94px 113px', animation:'eyeBlink 3.8s infinite' }}>
      <ellipse cx="94"  cy="113" rx="11" ry="13" fill="white"/>
      <ellipse cx="96"  cy="114" rx="7"  ry="8.5" fill="#c62828"/>
      <ellipse cx="97"  cy="112" rx="3"  ry="3.5" fill="#1a0000"/>
      <ellipse cx="98"  cy="110" rx="1.3" ry="1.5" fill="white" opacity="0.85"/>
    </g>
    <g style={{ transformOrigin:'126px 113px', animation:'eyeBlink 3.8s infinite 0.4s' }}>
      <ellipse cx="126" cy="113" rx="11" ry="13" fill="white"/>
      <ellipse cx="128" cy="114" rx="7"  ry="8.5" fill="#c62828"/>
      <ellipse cx="129" cy="112" rx="3"  ry="3.5" fill="#1a0000"/>
      <ellipse cx="130" cy="110" rx="1.3" ry="1.5" fill="white" opacity="0.85"/>
    </g>
    {/* Angry red brows */}
    <path d="M77 95 Q92 88 104 94" fill="none" stroke="#c62828" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M116 94 Q128 88 143 95" fill="none" stroke="#c62828" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M98 138 Q110 130 122 138" fill="none" stroke="#7a1010" strokeWidth="2.5" strokeLinecap="round"/>
    <Cheeks opacity="0.04"/>
    {/* Massive Zangetsu black blade */}
    <rect x="150" y="170" width="8" height="90" rx="3" fill="#111" transform="rotate(-40,154,210)"/>
    <rect x="151" y="172" width="8" height="90" rx="2" fill="#333" transform="rotate(-40,155,212)" opacity="0.5"/>
    <rect x="148" y="168" width="18" height="10" rx="3" fill="#444" transform="rotate(-40,157,173)"/>
    {/* Red reiatsu trail */}
    <path d="M160 175 Q192 148 186 118" fill="none" stroke="#ef5350" strokeWidth="4"
      strokeDasharray="30 12" style={{ animation:'trailFade 0.7s linear infinite' }}/>
    <path d="M163 178 Q196 150 190 112" fill="none" stroke="#b71c1c" strokeWidth="2.5"
      strokeDasharray="20 15" style={{ animation:'trailFade 0.7s linear infinite 0.35s' }}/>
  </>
)

// ─── Character config per streak tier ────────────────────────────────────────
const CHAR_CONFIG = {
  0: {
    anim: 'waterFloat', animDur: '2.5s',
    auraColor: '#1565c0', border: '#1565c0',
    arc: 'BROKEN ARC', arcIcon: '💧', arcColor: '#4fc3f7',
    arcSub: 'Water Hashira is deeply disappointed...',
    badgeBg: 'linear-gradient(135deg,#0d1f2d,#000)',
    badgeColor: '#4fc3f7',
    power: 0,
    speech: '"...I have nothing to say to someone like you." — please, just ONE day.',
    Body: GiyuBody,
  },
  3: {
    anim: 'thunderBolt', animDur: '0.75s',
    auraColor: '#f9a825', border: '#f9a825',
    arc: 'ROOKIE ARC', arcIcon: '⚡', arcColor: '#ffd740',
    arcSub: 'Thunder Breathing — First Form awakens!',
    badgeBg: 'linear-gradient(135deg,#1a1400,#000)',
    badgeColor: '#ffe082',
    power: 850,
    speech: '"UWAAAH! THREE DAYS?! Even a coward like me can do this — THUNDER BREATHING, FIRST FORM!!"',
    Body: ZenitsuBody,
  },
  7: {
    anim: 'scoutFloat', animDur: '2s',
    auraColor: '#607d8b', border: '#607d8b',
    arc: 'FIGHTER ARC', arcIcon: '⚔️', arcColor: '#b0bec5',
    arcSub: 'Survey Corps — seven days of pure grit',
    badgeBg: 'linear-gradient(135deg,#1a1a1a,#000)',
    badgeColor: '#e0e0e0',
    power: 3500,
    speech: '"Tch. A week. Don\'t get full of yourself — this is exactly where weak people quit."',
    Body: LeviBody,
  },
  14: {
    anim: 'mistDrift', animDur: '2.2s',
    auraColor: '#00897b', border: '#00897b',
    arc: 'HERO ARC', arcIcon: '🌿', arcColor: '#4db6ac',
    arcSub: 'Mist Hashira — two weeks, clarity unlocked',
    badgeBg: 'linear-gradient(135deg,#00201e,#000)',
    badgeColor: '#b2dfdb',
    power: 9999,
    speech: '"I remember now... why I push this body. 14 days. The mist in my head has lifted."',
    Body: MuichiroBody,
  },
  21: {
    anim: 'serpentSway', animDur: '2s',
    auraColor: '#7b1fa2', border: '#7b1fa2',
    arc: 'TITAN ARC', arcIcon: '🐍', arcColor: '#ba68c8',
    arcSub: 'Serpent Hashira — 21 days of cold resolve',
    badgeBg: 'linear-gradient(135deg,#160020,#000)',
    badgeColor: '#ce93d8',
    power: 47000,
    speech: '"*Kaburamaru tightens* 21 days. Every obstacle? Already crushed."',
    Body: ObanaiBody,
  },
  30: {
    anim: 'bankaiRage', animDur: '1.1s',
    auraColor: '#c62828', border: '#c62828',
    arc: 'DEMON KING ARC', arcIcon: '💀', arcColor: '#ef5350',
    arcSub: 'Vasto Lorde — 30 days, the mask has broken',
    badgeBg: 'linear-gradient(135deg,#1a0000,#000)',
    badgeColor: '#ffcdd2',
    power: 999999,
    speech: '"I\'ve already crossed a line I can\'t come back from. 30 DAYS. I am something else now."',
    Body: IchigoBody,
  },
}

// ─── Main AnimeMascot component ───────────────────────────────────────────────
export default function AnimeMascot({ streak = 0 }) {
  const styleRef = useRef(null)

  // Inject CSS animations once
  useEffect(() => {
    if (!document.getElementById('anime-mascot-css')) {
      const tag = document.createElement('style')
      tag.id = 'anime-mascot-css'
      tag.textContent = ANIM_CSS
      document.head.appendChild(tag)
    }
  }, [])

  const key = streak >= 30 ? 30 : streak >= 21 ? 21 : streak >= 14 ? 14 : streak >= 7 ? 7 : streak >= 3 ? 3 : 0
  const cfg = CHAR_CONFIG[key]
  const { Body } = cfg

  return (
    <div style={{ position:'relative', width:220, height:340 }}>
      <svg
        width="220" height="340"
        viewBox="0 0 220 340"
        style={{ overflow:'visible', position:'absolute', inset:0 }}
      >
        <defs>
          <radialGradient id="skinGrad" cx="42%" cy="38%" r="62%">
            <stop offset="0%"   stopColor="#ffe0bd"/>
            <stop offset="100%" stopColor="#d4874a"/>
          </radialGradient>
          <clipPath id="haoriRightClip">
            <rect x="110" y="180" width="48" height="76" rx="10"/>
          </clipPath>
        </defs>

        {/* Aura / effect rings behind character */}
        <AuraRings color={cfg.auraColor} streak={key}/>

        {/* Character with animation */}
        <g style={{ animation:`${cfg.anim} ${cfg.animDur} ease-in-out infinite` }}>
          <Body/>
        </g>
      </svg>
    </div>
  )
}
