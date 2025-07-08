import { useState } from 'react';

interface ProductionItem {
  id: string;
  customer_id: string;
  product: string;
  customer: string;
  quantity: number;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  startDate?: string;
  completedDate?: string;
}

export function useProductionSchedule() {
  const [productionItems] = useState<ProductionItem[]>([
    {
      id: '1',
      customer_id: 'CUST-001',
      product: 'ミネラルウォーター 500ml',
      customer: 'A商事株式会社',
      quantity: 10000,
      status: 'pending',
      priority: 'high',
      dueDate: '2024-01-15',
    },
    {
      id: '2',
      customer_id: 'CUST-002',
      product: 'お茶 350ml',
      customer: 'B流通株式会社',
      quantity: 8000,
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-01-18',
      startDate: '2024-01-10',
    },
    {
      id: '3',
      customer_id: 'CUST-003',
      product: 'スポーツドリンク 500ml',
      customer: 'Cマート',
      quantity: 15000,
      status: 'pending',
      priority: 'high',
      dueDate: '2024-01-20',
    },
    {
      id: '4',
      customer_id: 'CUST-004',
      product: 'コーヒー 250ml',
      customer: 'D食品株式会社',
      quantity: 5000,
      status: 'completed',
      priority: 'low',
      dueDate: '2024-01-12',
      startDate: '2024-01-08',
      completedDate: '2024-01-11',
    },
    {
      id: '5',
      customer_id: 'CUST-005',
      product: 'フルーツジュース 1L',
      customer: 'E商店',
      quantity: 3000,
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-01-25',
    },
  ]);

  const updateItemStatus = (id: string, status: ProductionItem['status']) => {
    // Implementation would update the item status
    console.log(`Updating item ${id} to status ${status}`);
  };

  const getPendingItems = () => {
    return productionItems.filter(item => item.status === 'pending');
  };

  const getInProgressItems = () => {
    return productionItems.filter(item => item.status === 'in-progress');
  };

  const getCompletedItems = () => {
    return productionItems.filter(item => item.status === 'completed');
  };

  const getItemsByPriority = (priority: ProductionItem['priority']) => {
    return productionItems.filter(item => item.priority === priority);
  };

  return {
    productionItems,
    updateItemStatus,
    getPendingItems,
    getInProgressItems,
    getCompletedItems,
    getItemsByPriority,
  };
}