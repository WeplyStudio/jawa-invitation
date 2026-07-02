export interface Wish {
  id: string;
  name: string;
  relationship: 'Keluarga' | 'Teman' | 'Sahabat' | 'Lainnya';
  message: string;
  timestamp: string;
}

export interface RSVP {
  id: string;
  name: string;
  phone: string;
  attendance: 'Hadir' | 'Tidak Hadir';
  guestsCount: number;
  note?: string;
  timestamp: string;
}
