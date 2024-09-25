import { icons } from "lucide-react";

export type IconNames = keyof typeof icons;

type IconsProps = {
  name: IconNames;
  size?: number;
  color?: string;
  className?: string;
};

export const Icon = ({ name, color, size, className }: IconsProps) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon color={color} size={size} className={className} />;
};

export default Icon;
