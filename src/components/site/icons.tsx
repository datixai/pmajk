import { Briefcase, GraduationCap, HeartPulse, Landmark, Laptop, Leaf, MessageSquareText, Route, Scale, Users, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = { Scale, Landmark, Laptop, HeartPulse, GraduationCap, Briefcase, Route, MessageSquareText, Leaf, Users };

export function PriorityIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Landmark;
  return <Icon className={className} aria-hidden="true" />;
}
