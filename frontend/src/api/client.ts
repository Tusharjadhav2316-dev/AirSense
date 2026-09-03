import type {
  AQICurrentData,
  AQIForecastResponse,
  AQITrendResponse,
  AgentAdviceResponse,
  ChatResponse,
  HealthCheckResponse,
  HealthProfile,
  ChatMessageItem,
  AuthTokenResponse,
  RegisterRequest,
  LoginRequest,
  OAuthLoginRequest,
  User,
  CityCompareResponse,
  AlertListResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Health check endpoint
 */
export async function fetchHealth(): Promise<HealthCheckResponse> {
  const res = await fetch(`${API_BASE_URL}/health`);
  return handleResponse<HealthCheckResponse>(res);
}

/**
 * Register a new user
 */
export async function registerUser(payload: RegisterRequest): Promise<AuthTokenResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthTokenResponse>(res);
}

/**
 * Login user
 */
export async function loginUser(payload: LoginRequest): Promise<AuthTokenResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthTokenResponse>(res);
}

/**
 * OAuth Login or Register user (Google or Apple)
 */
export async function oauthLoginUser(payload: OAuthLoginRequest): Promise<AuthTokenResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/oauth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthTokenResponse>(res);
}

/**
 * Get current user details from JWT token
 */
export async function getCurrentUser(token: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<User>(res);
}

/**
 * Fetch live or cached AQI reading for a city
 */
export async function fetchAQICurrent(city: string): Promise<AQICurrentData> {
  const res = await fetch(`${API_BASE_URL}/aqi/current?city=${encodeURIComponent(city)}`);
  return handleResponse<AQICurrentData>(res);
}

/**
 * Fetch 24-48h hourly AQI forecast for a city
 */
export async function fetchAQIForecast(city: string): Promise<AQIForecastResponse> {
  const res = await fetch(`${API_BASE_URL}/aqi/forecast?city=${encodeURIComponent(city)}`);
  return handleResponse<AQIForecastResponse>(res);
}

/**
 * Fetch historical AQI trend with 7-day rolling average and anomaly detection
 */
export async function fetchAQITrend(city: string, days: number = 30): Promise<AQITrendResponse> {
  const res = await fetch(`${API_BASE_URL}/aqi/trend?city=${encodeURIComponent(city)}&days=${days}`);
  return handleResponse<AQITrendResponse>(res);
}

/**
 * Fetch personalized WHO/EPA grounded AI recommendation for a city + health profile
 */
export async function fetchAgentAdvice(
  city: string,
  healthProfile: HealthProfile = 'none'
): Promise<AgentAdviceResponse> {
  const res = await fetch(`${API_BASE_URL}/agent/advice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, health_profile: healthProfile }),
  });
  return handleResponse<AgentAdviceResponse>(res);
}

/**
 * Send conversational question to RAG-grounded chat endpoint
 */
export async function sendChatMessage(
  city: string,
  healthProfile: HealthProfile,
  message: string,
  history: ChatMessageItem[] = []
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      city,
      health_profile: healthProfile,
      message,
      conversation_history: history,
    }),
  });
  return handleResponse<ChatResponse>(res);
}

/**
 * Fetch comparative AI health insight and per-city summaries for 2-3 cities
 */
export async function fetchCompare(
  cities: string[],
  healthProfile: HealthProfile = 'none'
): Promise<CityCompareResponse> {
  const res = await fetch(`${API_BASE_URL}/agent/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cities, health_profile: healthProfile }),
  });
  return handleResponse<CityCompareResponse>(res);
}

/**
 * Fetch active air quality threshold alerts
 */
export async function fetchAlerts(): Promise<AlertListResponse> {
  const res = await fetch(`${API_BASE_URL}/alerts`);
  return handleResponse<AlertListResponse>(res);
}

/**
 * Dismiss a specific threshold alert by ID
 */
export async function dismissAlert(alertId: string): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE_URL}/alerts/${alertId}`, {
    method: 'DELETE',
  });
  return handleResponse<{ status: string; message: string }>(res);
}
