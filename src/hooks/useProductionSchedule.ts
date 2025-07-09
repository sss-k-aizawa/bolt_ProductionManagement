import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ProductionScheduleItem {
  id: string;
  item_id: string;
  item_name: string;
  scheduled_quantity: number;
  produced_quantity: number;
  scheduled_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UseProductionScheduleReturn {
  scheduleItems: ProductionScheduleItem[];
  loading: boolean;
  error: string | null;
  addScheduleItem: (item: Omit<ProductionScheduleItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateScheduleItem: (id: string, updates: Partial<ProductionScheduleItem>) => Promise<void>;
  deleteScheduleItem: (id: string) => Promise<void>;
  refreshSchedule: () => Promise<void>;
}

export function useProductionSchedule(): UseProductionScheduleReturn {
  const [scheduleItems, setScheduleItems] = useState<ProductionScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScheduleItems = async () => {
    try {
      setLoading(true);
      setError(null);

      // Since we don't have a production_schedule table in the schema,
      // we'll create mock data that would work with the inventory system
      const mockData: ProductionScheduleItem[] = [
        {
          id: '1',
          item_id: 'ITEM001',
          item_name: 'Sample Product A',
          scheduled_quantity: 100,
          produced_quantity: 75,
          scheduled_date: new Date().toISOString(),
          status: 'in_progress',
          priority: 'high',
          notes: 'Rush order for customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          item_id: 'ITEM002',
          item_name: 'Sample Product B',
          scheduled_quantity: 50,
          produced_quantity: 0,
          scheduled_date: new Date(Date.now() + 86400000).toISOString(),
          status: 'pending',
          priority: 'medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setScheduleItems(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch production schedule');
    } finally {
      setLoading(false);
    }
  };

  const addScheduleItem = async (item: Omit<ProductionScheduleItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      
      const newItem: ProductionScheduleItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setScheduleItems(prev => [...prev, newItem]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add schedule item');
      throw err;
    }
  };

  const updateScheduleItem = async (id: string, updates: Partial<ProductionScheduleItem>) => {
    try {
      setError(null);
      
      setScheduleItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...updates, updated_at: new Date().toISOString() }
            : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update schedule item');
      throw err;
    }
  };

  const deleteScheduleItem = async (id: string) => {
    try {
      setError(null);
      setScheduleItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete schedule item');
      throw err;
    }
  };

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
  
  const refreshSchedule = async () => {
    await fetchScheduleItems();
  };

  useEffect(() => {
    fetchScheduleItems();
  }, []);

  return {
    scheduleItems,
    loading,
    error,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    refreshSchedule,
  };
}