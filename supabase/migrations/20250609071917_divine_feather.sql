/*
  # 在庫管理システムのデータベース構築

  1. 新しいテーブル
    - `inventory_items` - 在庫アイテム情報
    - `inventory_transactions` - 在庫取引履歴

  2. セキュリティ
    - 両テーブルでRLSを有効化
    - 認証済みユーザーのアクセスポリシーを設定

  3. インデックス
    - パフォーマンス向上のためのインデックスを追加

  4. トリガー
    - updated_at自動更新機能
*/

-- 既存のポリシーを削除（存在する場合）
DO $$
BEGIN
  -- inventory_itemsのポリシーを削除
  DROP POLICY IF EXISTS "Users can read inventory items" ON inventory_items;
  DROP POLICY IF EXISTS "Users can insert inventory items" ON inventory_items;
  DROP POLICY IF EXISTS "Users can update inventory items" ON inventory_items;
  DROP POLICY IF EXISTS "Users can delete inventory items" ON inventory_items;
  
  -- inventory_transactionsのポリシーを削除
  DROP POLICY IF EXISTS "Users can read inventory transactions" ON inventory_transactions;
  DROP POLICY IF EXISTS "Users can insert inventory transactions" ON inventory_transactions;
EXCEPTION
  WHEN undefined_table THEN
    -- テーブルが存在しない場合は何もしない
    NULL;
END $$;

-- 在庫アイテムテーブル
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT '個',
  min_quantity integer DEFAULT 0,
  max_quantity integer DEFAULT 1000,
  location text DEFAULT '',
  supplier text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 在庫取引履歴テーブル
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id uuid REFERENCES inventory_items(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('入庫', '出庫', '調整')),
  quantity_change integer NOT NULL,
  reason text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- インデックス（存在しない場合のみ作成）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inventory_items_category') THEN
    CREATE INDEX idx_inventory_items_category ON inventory_items(category);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inventory_items_item_id') THEN
    CREATE INDEX idx_inventory_items_item_id ON inventory_items(item_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inventory_transactions_item_id') THEN
    CREATE INDEX idx_inventory_transactions_item_id ON inventory_transactions(inventory_item_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inventory_transactions_created_at') THEN
    CREATE INDEX idx_inventory_transactions_created_at ON inventory_transactions(created_at);
  END IF;
END $$;

-- RLS有効化
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- 在庫アイテムのポリシー
CREATE POLICY "Users can read inventory items"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inventory items"
  ON inventory_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update inventory items"
  ON inventory_items
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete inventory items"
  ON inventory_items
  FOR DELETE
  TO authenticated
  USING (true);

-- 在庫取引履歴のポリシー
CREATE POLICY "Users can read inventory transactions"
  ON inventory_transactions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inventory transactions"
  ON inventory_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- updated_at自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atトリガー（存在しない場合のみ作成）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_inventory_items_updated_at'
  ) THEN
    CREATE TRIGGER update_inventory_items_updated_at
      BEFORE UPDATE ON inventory_items
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- サンプルデータの挿入
INSERT INTO inventory_items (item_id, name, category, quantity, unit, min_quantity, max_quantity, location, supplier, description) VALUES
  ('A1001', '原材料A', '原材料', 1250, 'kg', 100, 2000, '倉庫A-01', 'サプライヤーX', '主要な原材料'),
  ('A2344', '部品B', '部品', 5, '個', 10, 100, '倉庫A-12', 'サプライヤーX', '製品Aの組立に使用する重要な部品'),
  ('A3422', '工具C', '工具', 15, 'セット', 5, 50, '工具室', 'サプライヤーY', '生産に必要な工具セット'),
  ('B1422', '材料D', '原材料', 450, 'kg', 50, 1000, '倉庫B-01', 'サプライヤーZ', '補助材料'),
  ('B2344', '部品E', '部品', 120, '個', 20, 200, '倉庫A-15', 'サプライヤーX', '汎用部品'),
  ('C1001', 'パーツF', 'パーツ', 8, '個', 10, 50, '倉庫C-01', 'サプライヤーY', '特殊パーツ'),
  ('C3422', '材料G', '原材料', 0, 'リットル', 10, 500, '倉庫B-05', 'サプライヤーZ', '液体材料')
ON CONFLICT (item_id) DO NOTHING;