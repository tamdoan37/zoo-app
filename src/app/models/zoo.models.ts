export interface Animal {
  id: number;
  name: string;
  species: string;
  status: string;
  health: string;
  location: {
    latitude: number;
    longitude: number;
  };
  'feeding schedule': {  
    time: string;
    notes: string;
  };
}

export interface Location {
  name: string;        
  type: string;
  lat: number;
  lon: number;
}
export interface Booking {
  b_name: string;
  b_email: string;
  b_phone?: string;
  b_animal: string;
  b_when: string;
  b_group: number;
}

export interface Member {
  m_name: string;
  m_email: string;
  m_phone?: string;
  m_type: 'Individual' | 'Family' | 'Student';
}