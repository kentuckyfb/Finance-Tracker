/*
  # Create Purchase Orders Table

  1. New Tables
    - `purchase_orders`
      - `id` (uuid, primary key)
      - `agency` (text)
      - `estimate_number` (text)
      - `price` (numeric)
      - `start_date` (date)
      - `end_date` (date)
      - `deadline_date` (date)
      - `estimate_due_date` (date)
      - `estimate_start_date` (date)
      - `status` (text)
      - `po_number` (text, nullable)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `purchase_orders` table
    - Add policies for authenticated users to manage their own POs
*/

CREATE TABLE purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency text NOT NULL,
  estimate_number text NOT NULL,
  price numeric NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  deadline_date date NOT NULL,
  estimate_due_date date NOT NULL,
  estimate_start_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'pending', 'approved', 'closed')),
  po_number text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own POs"
  ON purchase_orders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);