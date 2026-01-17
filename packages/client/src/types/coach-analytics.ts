export interface CoachAnalytics {
  metrics: CoachMetrics;
  sessionTrendData: TrendDataPoint[];
  sessionDistribution: SessionDistribution;
  recentActivity: RecentActivity[];
}

export interface CoachMetrics {
  totalClients: number;
  activeClients: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  sessionCompletionRate: number;
  averageSessionsPerWeek: number;
  totalSessionHours: number;
  clientsTrend?: number; // % change from last month
  sessionsTrend?: number; // % change from last month
}

export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface SessionDistribution {
  one_on_one: number;
  consultation: number;
  check_in: number;
  assessment: number;
}

export interface RecentActivity {
  type:
    | "session_completed"
    | "new_client"
    | "session_cancelled"
    | "session_created";
  description: string;
  date: string | Date;
  clientName?: string;
  clientAvatar?: string;
}
