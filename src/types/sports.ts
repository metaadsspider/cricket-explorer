export interface SportsEvent {
  unix_timestamp: number;
  sport: string;
  tournament: string;
  match: string;
  channels: string[];
}

export interface SportsApiResponse {
  events: {
    [date: string]: SportsEvent[];
  };
}

export interface MatchPageParams {
  sport: string;
  date: string;
  index: string;
}