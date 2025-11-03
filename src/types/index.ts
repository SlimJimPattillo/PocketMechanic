// Core Data Types

export interface User {
  id: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  trim?: string;
  mileage: number;
  nickname?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  intervalType: 'mileage' | 'time' | 'both';
  intervalMileage?: number;
  intervalMonths?: number;
  lastCompletedMileage?: number;
  lastCompletedDate?: string;
  nextDueMileage?: number;
  nextDueDate?: string;
  isOverdue: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}

export type MaintenanceCategory =
  | 'oil_change'
  | 'tire_rotation'
  | 'brake_inspection'
  | 'fluid_check'
  | 'filter_replacement'
  | 'battery'
  | 'inspection'
  | 'other';

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  maintenanceTaskId?: string;
  title: string;
  description?: string;
  mileage: number;
  date: string;
  cost?: number;
  location?: string;
  receiptPhotoUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardLight {
  id: string;
  name: string;
  symbol: string;
  color: 'red' | 'yellow' | 'orange' | 'green' | 'blue';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendedAction: string;
  canDriveSafely: boolean;
  category: DashboardLightCategory;
  imageUrl?: string;
}

export type DashboardLightCategory =
  | 'engine'
  | 'brakes'
  | 'battery'
  | 'oil'
  | 'coolant'
  | 'transmission'
  | 'tires'
  | 'airbag'
  | 'lights'
  | 'other';

export interface MaintenanceGuide {
  id: string;
  title: string;
  category: MaintenanceCategory;
  difficulty: 'easy' | 'moderate' | 'hard';
  estimatedTime: number; // minutes
  toolsRequired: string[];
  partsRequired: string[];
  steps: GuideStep[];
  videoUrl?: string;
  tips?: string[];
  warnings?: string[];
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface RepairCost {
  id: string;
  repairName: string;
  category: MaintenanceCategory;
  averageCost: number;
  costRangeLow: number;
  costRangeHigh: number;
  laborHours: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  commonSigns?: string[];
}

export interface Part {
  id: string;
  name: string;
  category: string;
  description: string;
  averageCost: number;
  lifespan?: string;
  replacementFrequency?: string;
  compatibleMakes?: string[];
  imageUrl?: string;
}

export interface Reminder {
  id: string;
  vehicleId: string;
  maintenanceTaskId: string;
  title: string;
  message: string;
  dueDate?: string;
  dueMileage?: number;
  isRead: boolean;
  isPushSent: boolean;
  createdAt: string;
}

// Navigation Types
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  VehicleSetup: undefined;
  VehicleDetail: { vehicleId: string };
  MaintenanceGuide: { guideId: string };
  ServiceHistory: { vehicleId: string };
  AddServiceRecord: { vehicleId: string; maintenanceTaskId?: string };
  RepairCost: { costId?: string };
  DashboardLightDetail: { lightId: string };
  PartDetail: { partId: string };
};

export type MainTabsParamList = {
  Dashboard: undefined;
  Vehicles: undefined;
  WarningLights: undefined;
  Guides: undefined;
  Profile: undefined;
};
