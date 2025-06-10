export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'client' | 'provider';
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

export interface Service {
  id: string;
  provider_id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  client_id: string;
  provider_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  meeting_room_id?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  booking_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface MeetingRoom {
  id: string;
  booking_id: string;
  is_active: boolean;
  participants: string[];
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: 'client' | 'provider') => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}