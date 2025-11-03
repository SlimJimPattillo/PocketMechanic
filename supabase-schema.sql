-- PocketMechanic Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  vin TEXT,
  trim TEXT,
  mileage INTEGER NOT NULL DEFAULT 0,
  nickname TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance tasks table
CREATE TABLE IF NOT EXISTS public.maintenance_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  interval_type TEXT NOT NULL CHECK (interval_type IN ('mileage', 'time', 'both')),
  interval_mileage INTEGER,
  interval_months INTEGER,
  last_completed_mileage INTEGER,
  last_completed_date TIMESTAMP WITH TIME ZONE,
  next_due_mileage INTEGER,
  next_due_date TIMESTAMP WITH TIME ZONE,
  is_overdue BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service records table
CREATE TABLE IF NOT EXISTS public.service_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  maintenance_task_id UUID REFERENCES public.maintenance_tasks(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  mileage INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  cost DECIMAL(10, 2),
  location TEXT,
  receipt_photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  maintenance_task_id UUID NOT NULL REFERENCES public.maintenance_tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  due_mileage INTEGER,
  is_read BOOLEAN DEFAULT false,
  is_push_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Vehicles policies
CREATE POLICY "Users can view own vehicles" ON public.vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles" ON public.vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- Maintenance tasks policies
CREATE POLICY "Users can view own maintenance tasks" ON public.maintenance_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = maintenance_tasks.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own maintenance tasks" ON public.maintenance_tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = maintenance_tasks.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own maintenance tasks" ON public.maintenance_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = maintenance_tasks.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own maintenance tasks" ON public.maintenance_tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = maintenance_tasks.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

-- Service records policies
CREATE POLICY "Users can view own service records" ON public.service_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = service_records.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own service records" ON public.service_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = service_records.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own service records" ON public.service_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = service_records.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own service records" ON public.service_records
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = service_records.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

-- Reminders policies
CREATE POLICY "Users can view own reminders" ON public.reminders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = reminders.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own reminders" ON public.reminders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = reminders.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_vehicle_id ON public.maintenance_tasks(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_records_vehicle_id ON public.service_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reminders_vehicle_id ON public.reminders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reminders_is_read ON public.reminders(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_tasks_updated_at BEFORE UPDATE ON public.maintenance_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_records_updated_at BEFORE UPDATE ON public.service_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
