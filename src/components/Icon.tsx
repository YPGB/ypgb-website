import {
  Award,
  Baby,
  BookOpenText,
  CalendarDays,
  Church,
  Clock,
  Eye,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Library,
  Lightbulb,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  School,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserRound,
  Users,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'

import type { IconName } from '@/fields/icon'

const icons: Record<IconName, LucideIcon> = {
  'graduation-cap': GraduationCap,
  school: School,
  'book-open-text': BookOpenText,
  library: Library,
  users: Users,
  'user-round': UserRound,
  baby: Baby,
  'heart-handshake': HeartHandshake,
  'hand-heart': HandHeart,
  church: Church,
  award: Award,
  trophy: Trophy,
  star: Star,
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  target: Target,
  eye: Eye,
  'calendar-days': CalendarDays,
  clock: Clock,
  newspaper: Newspaper,
  'map-pin': MapPin,
  phone: Phone,
  mail: Mail,
}

export function Icon({ name, ...props }: { name?: string | null } & LucideProps) {
  const Cmp = name ? icons[name as IconName] : undefined
  return Cmp ? <Cmp aria-hidden {...props} /> : null
}
