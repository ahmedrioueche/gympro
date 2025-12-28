import { SupportedCurrency } from "./common";

export interface GlobalStatsMetrics {
  totalRevenue: number;
  totalMembers: number;
  activeMembers: number;
  totalGyms: number;
  revenueTrend: number; // percentage change
  membersTrend: number; // percentage change
}

export interface RevenueByGym {
  gymId: string;
  gymName: string;
  revenue: number;
  currency: SupportedCurrency;
}

export interface MembershipDistribution {
  active: number;
  pending: number;
  expired: number;
  banned: number;
}

export interface GlobalAnalytics {
  metrics: GlobalStatsMetrics;
  revenueByGym: RevenueByGym[];
  membershipDistribution: MembershipDistribution;
  revenueTrendData: { date: string; amount: number }[];
  memberTrendData: { date: string; count: number }[];
}

export interface GymAnalytics {
  gymId: string;
  metrics: {
    totalMembers: number;
    activeMembers: number;
    expiredMembers: number;
    checkedIn: number;
    occupancyRate: number; // percentage based on some capacity
  };
  membershipDistribution: MembershipDistribution;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  attendanceTrend: { date: string; count: number }[];
}
