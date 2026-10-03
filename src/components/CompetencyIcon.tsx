import {
  Target,
  Users,
  Scale,
  BarChart3,
  Compass,
  Calculator,
  Sliders,
  Sparkles,
  Cpu,
  CheckSquare,
  ShieldCheck,
  Brain,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Target,
  Users,
  Scale,
  BarChart3,
  Compass,
  Calculator,
  Sliders,
  Sparkles,
  Cpu,
  CheckSquare,
  ShieldCheck,
  Brain,
};

export function CompetencyIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] || Target;
  return <Icon className={className} />;
}

