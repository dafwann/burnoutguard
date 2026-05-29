export function StudentsIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 480" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* soft background blob */}
      <ellipse cx="300" cy="380" rx="240" ry="22" fill="var(--primary-light)" opacity="0.6" />
      <circle cx="120" cy="120" r="70" fill="var(--mint)" opacity="0.5" />
      <circle cx="490" cy="90" r="50" fill="var(--primary-light)" />
      <rect x="60" y="240" width="200" height="140" rx="20" fill="var(--surface)" stroke="var(--foreground)" strokeWidth="2" />
      <rect x="78" y="260" width="120" height="10" rx="5" fill="var(--primary)" />
      <rect x="78" y="280" width="80" height="8" rx="4" fill="var(--primary-soft)" />
      <rect x="78" y="296" width="160" height="8" rx="4" fill="var(--primary-light)" />
      <rect x="78" y="312" width="100" height="8" rx="4" fill="var(--primary-light)" />
      <circle cx="220" cy="345" r="14" fill="var(--mint)" />
      {/* Person 1 */}
      <g stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="180" cy="180" r="28" fill="var(--surface)" />
        <path d="M152 180c0-15 12-28 28-28s28 13 28 28" fill="var(--foreground)" />
        <path d="M165 215v40l-15 50" />
        <path d="M195 215v40l15 50" />
        <path d="M155 230l-25 20 10 30" />
        <path d="M205 230l25 20-10 30" />
      </g>
      {/* Person 2 */}
      <g stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="400" cy="200" r="32" fill="var(--surface)" />
        <path d="M368 198c0-18 14-32 32-32s32 14 32 32c0 6-2 10-4 14" fill="var(--primary)" />
        <path d="M380 240v50l-18 60" />
        <path d="M420 240v50l18 60" />
        <path d="M370 255l-30 25 12 35" />
        <path d="M430 255l30 25-12 35" />
      </g>
      {/* Floating chart card */}
      <g>
        <rect x="320" y="80" width="170" height="100" rx="16" fill="var(--surface)" stroke="var(--foreground)" strokeWidth="2" />
        <polyline points="340,150 370,130 400,140 430,110 460,120" stroke="var(--primary)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="460" cy="120" r="4" fill="var(--primary)" />
        <rect x="340" y="95" width="60" height="8" rx="4" fill="var(--foreground)" opacity="0.3" />
      </g>
    </svg>
  );
}

export function MeditationIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 500" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="250" cy="250" r="180" fill="var(--primary-light)" opacity="0.6" />
      <circle cx="250" cy="250" r="130" fill="var(--mint)" opacity="0.4" />
      <g stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="250" cy="200" r="32" fill="var(--surface)" />
        <path d="M218 198c0-18 14-32 32-32s32 14 32 32" fill="var(--primary)" />
        <path d="M220 240c-15 30-15 60 0 80h60c15-20 15-50 0-80z" fill="var(--surface)" />
        <path d="M220 280l-50 10" />
        <path d="M280 280l50 10" />
        <circle cx="170" cy="290" r="6" fill="var(--surface)" />
        <circle cx="330" cy="290" r="6" fill="var(--surface)" />
        <path d="M180 350h140" />
      </g>
      <circle cx="120" cy="140" r="8" fill="var(--primary)" opacity="0.4" />
      <circle cx="400" cy="380" r="12" fill="var(--mint)" />
      <circle cx="380" cy="120" r="6" fill="var(--primary-soft)" />
    </svg>
  );
}