import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, addDays, startOfWeek } from 'date-fns';

export interface ProductionScheduleItem {
  date: string;
  product_id: string;
  product_name: string;
  planned_quantity: number;
  actual_quantity: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
}

export interface WeeklyProductionData {
  date: string;
  product_id: string;
  product_name: string;
  planned_quantity: number;
  actual_quantity: number;
  status: string;
  completion_rate: number;
}

export const useProductionSchedule = (currentWeek?: Date) => {
  const [scheduleData, setScheduleData] = useState<WeeklyProductionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductionSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      // 指定された週の開始日から1週間分の日付を生成
      const weekStart = currentWeek ? startOfWeek(currentWeek, { weekStartsOn: 1 }) : startOfWeek(new Date(), { weekStartsOn: 1 });
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i);
        return format(date, 'yyyy-MM-dd');
      });

      // モックデータ（実際の実装では、production_schedules テーブルから取得）
      const products = [
        { id: 'PROD-A', name: '製品A' },
        { id: 'PROD-B', name: '製品B' },
        { id: 'PROD-C', name: '製品C' },
        { id: 'PROD-D', name: '製品D' },
        { id: 'PROD-E', name: '製品E' },
      ];

      // 各日付・製品の組み合わせでスケジュールデータを生成
      const schedulePromises = dates.map(async (date) => {
        return products.map(product => {
          // 実際の実装では、データベースから取得
          const dayOfWeek = new Date(date).getDay();
          const baseQuantity = Math.floor(Math.random() * 500) + 100;
          const plannedQuantity = dayOfWeek === 0 || dayOfWeek === 6 ? 0 : baseQuantity; // 土日は生産なし
          const actualQuantity = Math.floor(plannedQuantity * (0.8 + Math.random() * 0.4)); // 80-120%の範囲
          
          let status = 'scheduled';
          const today = format(new Date(), 'yyyy-MM-dd');
          if (date < today) {
            status = actualQuantity >= plannedQuantity * 0.95 ? 'completed' : 'delayed';
          } else if (date === today) {
            status = 'in_progress';
          }

          const completionRate = plannedQuantity > 0 ? (actualQuantity / plannedQuantity) * 100 : 0;

          return {
            date,
            product_id: product.id,
            product_name: product.name,
            planned_quantity: plannedQuantity,
            actual_quantity: date <= today ? actualQuantity : 0,
            status,
            completion_rate: Math.min(completionRate, 100),
          };
        });
      });

      const allSchedule = await Promise.all(schedulePromises);
      setScheduleData(allSchedule.flat());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductionSchedule();
  }, [currentWeek]);

  return {
    scheduleData,
    loading,
    error,
    refetch: fetchProductionSchedule,
  };
};