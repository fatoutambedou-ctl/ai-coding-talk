export type Service = {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  priceFcfa: number;
  description: string;
};

export type Salon = {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  seats: number;
  slotStepMinutes: number;
  /** Clé = jour de la semaine (0 = dimanche … 6 = samedi). Jour absent = fermé. */
  openingHours: Record<string, [string, string]>;
};

export type BookingStatus = "confirme" | "annule" | "honore";

export type Booking = {
  id: string;
  serviceId: string;
  date: string; // AAAA-MM-JJ
  start: string; // HH:MM
  end: string; // HH:MM
  clientName: string;
  clientPhone: string;
  status: BookingStatus;
  createdAt: string;
};
