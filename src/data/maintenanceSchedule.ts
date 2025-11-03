// Default maintenance schedule template
// This will be used to create initial maintenance tasks for a vehicle

export interface MaintenanceScheduleItem {
  title: string;
  description: string;
  category: string;
  intervalType: 'mileage' | 'time' | 'both';
  intervalMileage?: number;
  intervalMonths?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const defaultMaintenanceSchedule: MaintenanceScheduleItem[] = [
  {
    title: 'Oil Change',
    description: 'Change engine oil and oil filter',
    category: 'oil_change',
    intervalType: 'both',
    intervalMileage: 5000,
    intervalMonths: 6,
    priority: 'high',
  },
  {
    title: 'Tire Rotation',
    description: 'Rotate tires to promote even wear',
    category: 'tire_rotation',
    intervalType: 'mileage',
    intervalMileage: 6000,
    priority: 'medium',
  },
  {
    title: 'Air Filter Replacement',
    description: 'Replace engine air filter',
    category: 'filter_replacement',
    intervalType: 'mileage',
    intervalMileage: 15000,
    priority: 'low',
  },
  {
    title: 'Cabin Air Filter Replacement',
    description: 'Replace cabin air filter for clean interior air',
    category: 'filter_replacement',
    intervalType: 'mileage',
    intervalMileage: 15000,
    priority: 'low',
  },
  {
    title: 'Brake Inspection',
    description: 'Inspect brake pads, rotors, and brake fluid',
    category: 'brake_inspection',
    intervalType: 'mileage',
    intervalMileage: 12000,
    priority: 'high',
  },
  {
    title: 'Battery Check',
    description: 'Test battery health and clean terminals',
    category: 'battery',
    intervalType: 'both',
    intervalMileage: 12000,
    intervalMonths: 12,
    priority: 'medium',
  },
  {
    title: 'Coolant Flush',
    description: 'Flush and replace engine coolant',
    category: 'fluid_check',
    intervalType: 'both',
    intervalMileage: 30000,
    intervalMonths: 24,
    priority: 'medium',
  },
  {
    title: 'Transmission Fluid Change',
    description: 'Change transmission fluid and filter',
    category: 'fluid_check',
    intervalType: 'mileage',
    intervalMileage: 40000,
    priority: 'medium',
  },
  {
    title: 'Spark Plug Replacement',
    description: 'Replace spark plugs',
    category: 'other',
    intervalType: 'mileage',
    intervalMileage: 30000,
    priority: 'medium',
  },
  {
    title: 'Serpentine Belt Inspection',
    description: 'Inspect serpentine belt for wear and cracks',
    category: 'inspection',
    intervalType: 'mileage',
    intervalMileage: 25000,
    priority: 'medium',
  },
  {
    title: 'Wiper Blade Replacement',
    description: 'Replace windshield wiper blades',
    category: 'other',
    intervalType: 'time',
    intervalMonths: 12,
    priority: 'low',
  },
  {
    title: 'Tire Pressure Check',
    description: 'Check and adjust tire pressure',
    category: 'other',
    intervalType: 'time',
    intervalMonths: 1,
    priority: 'medium',
  },
  {
    title: 'Wheel Alignment',
    description: 'Check and adjust wheel alignment',
    category: 'other',
    intervalType: 'mileage',
    intervalMileage: 20000,
    priority: 'low',
  },
  {
    title: 'Multi-Point Inspection',
    description: 'Comprehensive vehicle inspection',
    category: 'inspection',
    intervalType: 'both',
    intervalMileage: 15000,
    intervalMonths: 12,
    priority: 'medium',
  },
];
