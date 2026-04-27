export type News = {
  id: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  category: string;
  date: string;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Player = {
  id: string;
  name: string;
  number: string;
  position: string;
  height: string | null;
  age: string | null;
  bio: string | null;
  photo_url: string | null;
  ppg: number;
  apg: number;
  rpg: number;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ClubSetting = {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
};

export type AdminProfile = {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
};

export type Game = {
  id: string;
  date: string;
  date_label: string;
  time_label: string;
  home_team: string;
  away_team: string;
  home_logo_url: string | null;
  away_logo_url: string | null;
  venue: string | null;
  competition: string;
  round: string | null;
  result: string | null;
  status: string;
  home_score: number | null;
  away_score: number | null;
  time: string | null;
  fpb_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Team = {
  id: string;
  name: string;
  slug: string;
  season: string;
  is_current: boolean;
  team_photo_url: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type TeamSchedule = {
  id: string;
  team_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  venue: string;
  display_order: number;
};

export type TeamPlayer = {
  id: string;
  team_id: string;
  name: string;
  number: string | null;
  position: string | null;
  role: string;
  staff_role: string | null;
  photo_url: string | null;
  bio: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};
