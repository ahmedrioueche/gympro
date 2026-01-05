import {
  DailyActivity,
  ProgressHistory,
  ProgressStats,
} from '@ahmedrioueche/gympro-client';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProgramHistoryModel,
  TrainingProgramModel,
} from '../training/training.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(ProgramHistoryModel.name)
    private historyModel: Model<ProgramHistoryModel>,
    @InjectModel(TrainingProgramModel.name)
    private programModel: Model<TrainingProgramModel>,
  ) {}

  async getStats(userId: string): Promise<ProgressStats> {
    // Get all completed or active history
    const histories = await this.historyModel
      .find({ userId })
      .populate('program')
      .exec();

    let totalWorkouts = 0;
    let totalVolumeKg = 0;
    let totalDurationMinutes = 0;
    let workoutsThisWeek = 0;

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start

    const dates: string[] = [];

    histories.forEach((h) => {
      if (h.progress && h.progress.dayLogs) {
        h.progress.dayLogs.forEach((log) => {
          totalWorkouts++;
          const logDate = new Date(log.date);
          dates.push(logDate.toISOString().split('T')[0]);

          // Check for this week
          if (logDate >= startOfWeek && logDate <= now) {
            workoutsThisWeek++;
          }

          // Calculate volume
          log.exercises.forEach((ex) => {
            ex.sets.forEach((set) => {
              if (set.completed) {
                totalVolumeKg += set.weight * set.reps;
              }
            });
          });

          // Estimate duration (rough estimate: 1 min per set + 2 min rest)
          // Ideally this should be stored in the log if we monitored it
          // For now, let's just create a placeholder or aggregate if we had it
          // defaulting to 45 mins per workout if not tracked
          totalDurationMinutes += 45;
        });
      }
    });

    const { currentStreak, bestStreak } = this.calculateStreaks(dates);

    const activeHistory = histories.find(
      (h) => h.status === 'active' || h.status === 'paused',
    );

    return {
      totalWorkouts,
      totalDurationMinutes,
      totalVolumeKg,
      currentStreak,
      bestStreak,
      workoutsThisWeek,
      activeProgram: activeHistory ? activeHistory.program : undefined,
    };
  }

  async getHistory(userId: string): Promise<ProgressHistory[]> {
    const histories = await this.historyModel.find({ userId }).exec();
    const activityMap = new Map<string, DailyActivity>();

    histories.forEach((h) => {
      if (h.progress && h.progress.dayLogs) {
        h.progress.dayLogs.forEach((log) => {
          const dateStr = new Date(log.date).toISOString().split('T')[0];
          let activity = activityMap.get(dateStr);

          if (!activity) {
            activity = {
              date: dateStr,
              workoutCount: 0,
              volumeKg: 0,
              durationMinutes: 0,
            };
          }

          activity.workoutCount += 1;
          activity.durationMinutes += 45; // Placeholder

          log.exercises.forEach((ex) => {
            ex.sets.forEach((set) => {
              if (set.completed) {
                activity.volumeKg += set.weight * set.reps;
              }
            });
          });

          activityMap.set(dateStr, activity);
        });
      }
    });

    return Array.from(activityMap.values()).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }

  private calculateStreaks(dates: string[]): {
    currentStreak: number;
    bestStreak: number;
  } {
    if (dates.length === 0) return { currentStreak: 0, bestStreak: 0 };

    // Unique sorted dates
    const uniqueDates = Array.from(new Set(dates)).sort();

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Check current streak (working backwards from today)
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];

    const hasToday = uniqueDates.includes(today);
    const hasYesterday = uniqueDates.includes(yesterday);

    if (!hasToday && !hasYesterday) {
      currentStreak = 0;
    } else {
      // Logic to count backwards would go here,
      // simplified: if strictly consecutive days
    }

    // Simplified streak implementation for robustness:
    // Convert to timestamps
    const timestamps = uniqueDates.map((d) => new Date(d).getTime());

    let streak = 1;
    let max = 1;

    for (let i = 0; i < timestamps.length - 1; i++) {
      const diff = (timestamps[i + 1] - timestamps[i]) / (1000 * 3600 * 24);
      if (diff === 1) {
        streak++;
      } else {
        streak = 1;
      }
      if (streak > max) max = streak;
    }

    // Recalculate current
    let curr = 0;
    if (hasToday || hasYesterday) {
      // Work backwards
      let checkDate = new Date();
      if (!hasToday) checkDate.setDate(checkDate.getDate() - 1);

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (uniqueDates.includes(dateStr)) {
          curr++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return { currentStreak: curr, bestStreak: max };
  }
}
