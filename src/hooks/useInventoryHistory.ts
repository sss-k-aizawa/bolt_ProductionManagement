import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export interface InventoryHistoryItem {
  date: string;
  item_id: string;
  item_name: string;
  category: string;
  unit: string;
  current_stock: number;
  inbound: number;
  outbound: number;
  usage: number;
  adjustments: number;
}

export const useInventoryHistory = () => {
  const [historyData, setHistoryData] = useState<InventoryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // 過去7日間の日付を生成
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        return format(date, 'yyyy-MM-dd');
      }).reverse();

      // 在庫アイテムを取得
      const { data: items, error: itemsError } = await supabase
        .from('inventory_items')
        .select('id, item_id, name, category, unit, quantity');

      if (itemsError) throw itemsError;

      // サンプルデータを生成（実際の実装では、データベースから取得）
      const sampleTransactions = generateSampleTransactions(dates, items || []);

      // 各アイテムの在庫変動を計算
      const allHistory: InventoryHistoryItem[] = [];
      
      (items || []).forEach(item => {
        // 現在の在庫数（最終日の在庫）
        const finalStock = item.quantity;
        
        // 各日の取引データを取得
        const dailyTransactions = dates.map(date => {
          const dayTransactions = sampleTransactions.filter(t => 
            t.date === date && t.item_id === item.item_id
          );
          
          const inbound = dayTransactions
            .filter(t => t.type === 'inbound')
            .reduce((sum, t) => sum + t.quantity, 0);
          
          const outbound = dayTransactions
            .filter(t => t.type === 'outbound')
            .reduce((sum, t) => sum + t.quantity, 0);
          
          const adjustments = dayTransactions
            .filter(t => t.type === 'adjustment')
            .reduce((sum, t) => sum + t.quantity, 0);

          return {
            date,
            inbound,
            outbound,
            adjustments
          };
        });

        // 最終日から逆算して初日の在庫を計算
        let totalNetChange = 0;
        for (let i = 0; i < dailyTransactions.length; i++) {
          const day = dailyTransactions[i];
          totalNetChange += day.inbound - day.outbound + day.adjustments;
        }
        
        // 初日の開始在庫 = 最終在庫 - 全期間の純変動
        let startingStock = finalStock - totalNetChange;
        
        // 開始在庫がマイナスにならないように調整
        if (startingStock < 0) {
          startingStock = Math.max(50, Math.floor(finalStock * 0.5));
        }

        // 各日の在庫を順次計算
        let currentStock = startingStock;
        
        dailyTransactions.forEach((dayData, index) => {
          // 在庫数 = 前日の在庫数 + 入庫数 - 使用数 + 調整数
          currentStock = currentStock + dayData.inbound - dayData.outbound + dayData.adjustments;
          
          // 在庫がマイナスにならないように調整
          if (currentStock < 0) {
            currentStock = 0;
          }

          allHistory.push({
            date: dayData.date,
            item_id: item.item_id,
            item_name: item.name,
            category: item.category,
            unit: item.unit,
            current_stock: currentStock,
            inbound: dayData.inbound,
            outbound: dayData.outbound,
            usage: dayData.outbound, // 使用数は出庫数と同じ
            adjustments: dayData.adjustments,
          });
        });
      });

      setHistoryData(allHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryHistory();
  }, []);

  return {
    historyData,
    loading,
    error,
    refetch: fetchInventoryHistory,
  };
};

// サンプル取引データを生成する関数
const generateSampleTransactions = (dates: string[], items: any[]) => {
  const transactions: Array<{
    date: string;
    item_id: string;
    type: 'inbound' | 'outbound' | 'adjustment';
    quantity: number;
  }> = [];

  dates.forEach((date, dateIndex) => {
    items.forEach((item) => {
      const dayOfWeek = new Date(date).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // 週末は活動を減らす
      const activityMultiplier = isWeekend ? 0.3 : 1;
      
      // アイテムカテゴリーに基づく基本活動レベル
      let baseActivity = 1;
      let maxInbound = 50;
      let maxOutbound = 30;
      
      switch (item.category) {
        case '原材料':
          baseActivity = 3;
          maxInbound = 200;
          maxOutbound = 80;
          break;
        case '部品':
          baseActivity = 2;
          maxInbound = 100;
          maxOutbound = 40;
          break;
        case '工具':
          baseActivity = 0.5;
          maxInbound = 20;
          maxOutbound = 5;
          break;
        case 'パーツ':
          baseActivity = 1.5;
          maxInbound = 80;
          maxOutbound = 25;
          break;
        default:
          baseActivity = 1;
          maxInbound = 50;
          maxOutbound = 20;
      }

      // 入庫データ（週に2-3回程度）
      if (Math.random() < 0.4 * activityMultiplier) {
        const quantity = Math.floor(Math.random() * maxInbound * baseActivity) + 10;
        transactions.push({
          date,
          item_id: item.item_id,
          type: 'inbound',
          quantity
        });
      }

      // 出庫・使用データ（平日はほぼ毎日）
      if (Math.random() < 0.8 * activityMultiplier) {
        const quantity = Math.floor(Math.random() * maxOutbound * baseActivity) + 5;
        transactions.push({
          date,
          item_id: item.item_id,
          type: 'outbound',
          quantity
        });
      }

      // 調整データ（稀に発生）
      if (Math.random() < 0.1 * activityMultiplier) {
        const quantity = Math.floor(Math.random() * 20) + 1; // 1 to 20
        transactions.push({
          date,
          item_id: item.item_id,
          type: 'adjustment',
          quantity
        });
      }
    });
  });

  return transactions;
};