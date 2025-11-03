# PocketMechanic - Vehicle Maintenance Confidence App

A mobile app for everyday vehicle owners that delivers confidence and convenience in car maintenance by providing ultra-clear, vehicle-specific instructions, automated reminders, and transparent information about repairs and costs.

## Features

### MVP Features
- **Vehicle Profile Setup**: Easy onboarding with VIN decoder using NHTSA API or manual entry
- **Ultra-Clear Maintenance Guides**: Step-by-step instructions with checklists for common maintenance tasks
- **Automated Maintenance Reminders**: Based on mileage/time intervals
- **Dashboard Light Library**: Visual library of dashboard warning lights with meanings and recommended actions
- **Repair Cost Transparency**: Display typical repair tasks with average industry prices
- **Service History Logging**: Track completed maintenance with notes and photos
- **Multi-Vehicle Management**: Support for multiple vehicles per account
- **Freemium Model**: Free for 1 vehicle, Premium for unlimited vehicles and advanced features

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Backend**: Supabase (Auth + PostgreSQL)
- **Navigation**: React Navigation
- **Vehicle Data**: NHTSA vPIC API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for Android development)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd PocketMechanic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase Database**

   a. Go to your Supabase project at https://app.supabase.com

   b. Navigate to the SQL Editor

   c. Run the SQL script from `supabase-schema.sql` to create all tables and policies

   d. Enable Row Level Security (RLS) on all tables (this is done in the SQL script)

4. **Configure Environment**

   Your Supabase credentials are already configured in `src/constants/config.ts`:
   - URL: `https://wwjtddejnvtgmhaqptpc.supabase.co`
   - Anon Key: Already set

5. **Run the app**
   ```bash
   # For iOS (Mac only)
   npm run ios

   # For Android
   npm run android

   # For Web
   npm run web
   ```

## Project Structure

```
PocketMechanic/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Button, Input, Card, etc.
│   │   └── dashboard/    # Dashboard-specific components
│   ├── constants/        # Theme, colors, config
│   ├── contexts/         # React Context (Auth)
│   ├── data/             # Mock data (guides, lights, costs, parts)
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation setup
│   ├── screens/          # All app screens
│   │   ├── auth/        # Authentication screens
│   │   ├── main/        # Main tab screens
│   │   ├── vehicle/     # Vehicle management screens
│   │   └── maintenance/ # Maintenance-related screens
│   ├── services/         # API services (Supabase, NHTSA)
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, etc.
├── App.tsx              # Root component
├── supabase-schema.sql  # Database schema
└── package.json
```

## Database Schema

The app uses the following main tables in Supabase:

- **users**: User profiles (extends Supabase auth.users)
- **vehicles**: Vehicle information
- **maintenance_tasks**: Scheduled maintenance items
- **service_records**: Completed service history
- **reminders**: Maintenance reminders

See `supabase-schema.sql` for complete schema with Row Level Security policies.

## Mock Data

The app includes comprehensive mock data for:

- **Dashboard Warning Lights** (15 common lights): `src/data/dashboardLights.ts`
- **Maintenance Guides** (5 step-by-step guides): `src/data/maintenanceGuides.ts`
- **Repair Costs** (20 common repairs): `src/data/repairCosts.ts`
- **Parts Information** (15 common parts): `src/data/parts.ts`
- **Default Maintenance Schedule**: `src/data/maintenanceSchedule.ts`

## Key Features Implementation

### Authentication
- Email/password authentication via Supabase
- Password reset flow
- Persistent sessions with AsyncStorage

### Vehicle Management
- VIN decoder using free NHTSA vPIC API
- Manual vehicle entry
- Automatic maintenance schedule creation on vehicle add
- Mileage tracking

### Dashboard
- Overview of overdue and upcoming maintenance
- Quick actions to warning lights and guides
- Vehicle summaries

### Warning Lights Library
- Searchable library of 15 common dashboard warning lights
- Color-coded urgency levels (Critical, High, Medium, Low)
- Clear descriptions and recommended actions
- Safety indicators (Can you drive safely?)

### Maintenance Guides
- 5 detailed step-by-step guides for common tasks
- Difficulty ratings (Easy, Moderate, Hard)
- Required tools and parts lists
- Safety tips and warnings
- Expandable cards for easy reading

### Profile & Premium
- Account information
- Premium upgrade CTA for free users
- Sign out functionality

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
# iOS
expo build:ios

# Android
expo build:android
```

### EAS Build (Recommended)
```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

## Design System

The app uses a calming color scheme designed to reduce user anxiety:

- **Primary**: Soft Blue (#4A90E2)
- **Secondary**: Calming Green (#5DBB63)
- **Accent**: Muted Purple (#8B7EC5)
- **Urgency Colors**: Red (Critical), Orange (High), Yellow (Medium), Green (Low)

See `src/constants/theme.ts` for complete design tokens.

## APIs Used

### NHTSA vPIC API (Free)
- **Purpose**: VIN decoding and vehicle information
- **Endpoint**: https://vpic.nhtsa.dot.gov/api
- **Documentation**: https://vpic.nhtsa.dot.gov/api/
- **Cost**: Free, no API key required

### Supabase
- **Purpose**: Authentication, database, file storage
- **Features Used**: Auth, PostgreSQL, Row Level Security
- **Documentation**: https://supabase.com/docs

## Future Enhancements

- [ ] Push notifications for maintenance reminders
- [ ] Photo upload for service records
- [ ] Repair cost estimator by ZIP code
- [ ] Integration with paid maintenance schedule APIs
- [ ] Vehicle-specific maintenance schedules
- [ ] Mechanic finder and reviews
- [ ] Parts price comparison
- [ ] Vehicle health score
- [ ] Family/household management features
- [ ] Apple/Google Wallet integration for service records

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## License

Copyright © 2025 PocketMechanic. All rights reserved.

---

**Built with ❤️ for vehicle owners who want confidence in their car maintenance**
