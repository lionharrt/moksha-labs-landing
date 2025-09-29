/**
 * Navigation Types
 */

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavigationProps {
  items?: NavigationItem[];
  onNavigate?: (sectionId: string) => void;
  className?: string;
}
