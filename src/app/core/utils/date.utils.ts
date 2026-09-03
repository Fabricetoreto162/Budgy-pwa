import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatShortDate(iso: string): string {
  return format(new Date(iso), 'dd/MM/yyyy', { locale: fr });
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: fr });
}

export function formatDayTime(iso: string): string {
  const date = new Date(iso);
  const time = format(date, 'HH:mm');

  if (isToday(date)) return `Aujourd'hui ${time}`;
  if (isYesterday(date)) return `Hier ${time}`;
  return `${format(date, 'dd MMM', { locale: fr })} ${time}`;
}