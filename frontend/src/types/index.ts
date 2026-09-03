export type HealthProfile = 'none' | 'asthma' | 'elderly' | 'child' | 'outdoor_worker';

export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';

export interface PollutantBreakdown {
  pm2_5?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
  so2?: number;
  co?: number;
}

export interface AQICurrentData {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  aqi: number;
  category: AQICategory;
  category_color: string;
  category_description: string;
  dominant_pollutant: string;
  pollutants: PollutantBreakdown;
  timestamp: string;
  data_source: string;
}

export interface HourlyForecastPoint {
  timestamp: string;
  aqi: number;
  category: AQICategory;
  category_color: string;
  pm2_5?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
}

export interface AQIForecastResponse {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  forecast: HourlyForecastPoint[];
  data_source: string;
}

export interface TrendPoint {
  date: string;
  aqi: number;
  rolling_avg: number;
  is_anomaly: boolean;
}

export interface TrendSummary {
  average_aqi: number;
  highest_aqi: number;
  highest_aqi_date?: string;
  anomaly_count: number;
}

export interface AQITrendResponse {
  city: string;
  days: number;
  trend: TrendPoint[];
  summary: TrendSummary;
}

export interface AgentAdviceRequest {
  city: string;
  health_profile: HealthProfile;
}

export interface AgentAdviceResponse {
  recommendation: string;
  why: string;
  sources: string[];
  aqi_value: number;
  aqi_category: AQICategory;
  dominant_pollutant: string;
  used_ai_generation: boolean;
}

export interface ChatMessageItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  city: string;
  health_profile: HealthProfile;
  message: string;
  conversation_history?: ChatMessageItem[];
}

export interface ChatResponse {
  response: string;
  sources: string[];
}

export interface HealthCheckResponse {
  status: string;
  app: string;
  version: string;
}

export interface User {
  id: number;
  email: string;
  health_profile: HealthProfile;
  home_location: string;
  created_at: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  health_profile: HealthProfile;
  home_location: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OAuthLoginRequest {
  provider: 'google' | 'apple';
  email: string;
  id_token?: string;
  health_profile?: HealthProfile;
  home_location?: string;
}

export interface CityCompareSummary {
  city: string;
  aqi_value: number;
  aqi_category: AQICategory;
  dominant_pollutant: string;
  recommendation: string;
}

export interface CityCompareResponse {
  comparative_insight: string;
  cities_data: CityCompareSummary[];
}

export interface AlertItem {
  id: string;
  city: string;
  aqi: number;
  category: AQICategory;
  message: string;
  timestamp: string;
  dismissed: boolean;
}

export interface AlertListResponse {
  alerts: AlertItem[];
}
