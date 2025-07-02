import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];

export interface InventoryItemWithStatus extends InventoryItem {
  status: '適正' | '在庫少' | '在庫切れ';
}

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItemWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStatus = (quantity: number, minQuantity: number): '適正' | '在庫少' | '在庫切れ' => {
    if (quantity === 0) return '在庫切れ';
    if (quantity <= minQuantity) return '在庫少';
    return '適正';
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const itemsWithStatus: InventoryItemWithStatus[] = (data || []).map(item => ({
        ...item,
        status: getStatus(item.quantity, item.min_quantity)
      }));

      setItems(itemsWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchItems(); // リフレッシュ
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  const addItem = async (item: Database['public']['Tables']['inventory_items']['Insert']) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert(item);

      if (error) throw error;
      
      await fetchItems(); // リフレッシュ
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchItems(); // リフレッシュ
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    updateItem,
    addItem,
    deleteItem
  };
};