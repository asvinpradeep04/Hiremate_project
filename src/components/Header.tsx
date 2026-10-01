import { Brain, Sparkles } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
  rightContent?: React.ReactNode;
}

export function Header({ onLogoClick, rightContent }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/60 bg-[#fcfbf9]/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <button
          onClick={onLogoClick}
          className="group flex items-center gap-3 text-left transition-all duration-200 cursor-pointer focus:outline-none"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-sm shadow-primary-500/20 ring-1 ring-primary-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary-500/30">
            <Brain className="h-5 w-5 transition-transform duration-300 group-hover:rotate-3" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-ink-900 group-hover:text-primary-700 transition-colors">
                Interview Readiness
              </span>
              <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[9px] font-bold text-primary-700 uppercase tracking-wider border border-primary-200/60">
                PRO
              </span>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              PM Practice Simulator
            </div>
          </div>
        </button>

        {rightContent}
      </div>
    </header>
  );
}
