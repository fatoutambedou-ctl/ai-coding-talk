import type { Booking, Salon, Service } from "./types.js";
import { nowAtSalon, toHHMM, toMinutes, weekday } from "./time.js";

export type Slot = { start: string; end: string; available: boolean };

/**
 * Calcule les créneaux d'une journée pour une prestation.
 * Un créneau est libre si, sur toute sa durée, le nombre de rendez-vous
 * confirmés qui se chevauchent reste inférieur au nombre de postes du salon.
 */
export function computeSlots(salon: Salon, service: Service, date: string, bookings: Booking[]): Slot[] {
  const hours = salon.openingHours[String(weekday(date))];
  if (!hours) return [];

  const open = toMinutes(hours[0]);
  const close = toMinutes(hours[1]);
  const now = nowAtSalon();
  const active = bookings.filter((b) => b.date === date && b.status !== "annule");

  const slots: Slot[] = [];
  for (let start = open; start + service.durationMinutes <= close; start += salon.slotStepMinutes) {
    const end = start + service.durationMinutes;
    const overlapping = active.filter((b) => toMinutes(b.start) < end && toMinutes(b.end) > start).length;
    const inPast = date < now.date || (date === now.date && start <= now.minutes);
    slots.push({ start: toHHMM(start), end: toHHMM(end), available: !inPast && overlapping < salon.seats });
  }
  return slots;
}

export function isOpen(salon: Salon, date: string): boolean {
  return Boolean(salon.openingHours[String(weekday(date))]);
}
