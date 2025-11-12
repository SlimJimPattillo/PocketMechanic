import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Colors, Typography, Spacing, Layout, BorderRadius, Shadows } from '../../constants/theme';
import { Vehicle, MaintenanceTask } from '../../types';

export function DashboardScreen({ navigation }: any) {
  const { user, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<MaintenanceTask[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadData();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const loadData = async () => {
    try {
      console.log('Loading dashboard data for user:', user?.id);

      // Load vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (vehiclesError) {
        console.error('Error loading vehicles:', vehiclesError);
      }

      setVehicles(vehiclesData || []);
      console.log('Loaded vehicles:', vehiclesData?.length || 0);

      // Load maintenance tasks
      if (vehiclesData && vehiclesData.length > 0) {
        const vehicleIds = vehiclesData.map((v) => v.id);
        const { data: tasksData, error: tasksError } = await supabase
          .from('maintenance_tasks')
          .select('*')
          .in('vehicle_id', vehicleIds)
          .order('next_due_mileage', { ascending: true })
          .limit(10);

        if (tasksError) {
          console.error('Error loading tasks:', tasksError);
        }

        const tasks = (tasksData || []).map((t: any) => ({
          ...t,
          isOverdue: t.is_overdue,
          nextDueMileage: t.next_due_mileage,
          vehicleId: t.vehicle_id,
        })) as MaintenanceTask[];

        const overdue = tasks.filter((t) => t.isOverdue);
        const upcoming = tasks.filter((t) => !t.isOverdue);

        setOverdueTasks(overdue);
        setUpcomingTasks(upcoming);
        console.log('Loaded tasks - Overdue:', overdue.length, 'Upcoming:', upcoming.length);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (vehicles.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.vehicleAvatar} onPress={() => navigation.navigate('Vehicles')}>
            <Text style={styles.avatarText}>🚗</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('VehicleSetup')}>
            <Text style={styles.calendarIcon}>➕</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section - Empty State */}
        <LinearGradient
          colors={[Colors.gradientGreenStart, Colors.gradientGreenEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroSubtext}>Welcome to PocketMechanic!</Text>
            <Text style={styles.heroTitle}>
              Add your first vehicle to get started
            </Text>
            <Text style={styles.heroDetail}>
              Track maintenance, stay on schedule, and keep your car healthy
            </Text>
            <View style={{ marginTop: Spacing.lg }}>
              <Button
                title="Add Vehicle"
                onPress={() => navigation.navigate('VehicleSetup')}
              />
            </View>
          </View>
          {/* Decorative circles */}
          <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
        </LinearGradient>

        {/* Quick Insights Cards - Empty State */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick insights</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightCards}
          >
            <LinearGradient
              colors={[Colors.gradientPurpleStart, Colors.gradientPurpleEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.insightCard, styles.insightCardEmpty]}
            >
              <View style={styles.insightBadge}>
                <Text style={styles.insightBadgeText}>Status</Text>
              </View>
              <Text style={styles.insightCardTitle}>Vehicle health</Text>
              <Text style={styles.insightCardSubtitle}>
                Add vehicle
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={[Colors.gradientIndigoStart, Colors.gradientIndigoEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.insightCard, styles.insightCardEmpty]}
            >
              <View style={styles.insightBadge}>
                <Text style={styles.insightBadgeText}>Schedule</Text>
              </View>
              <Text style={styles.insightCardTitle}>Maintenance calendar</Text>
              <Text style={styles.insightCardSubtitle}>
                0 tasks
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={[Colors.gradientCyanStart, Colors.gradientCyanEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.insightCard, styles.insightCardEmpty]}
            >
              <View style={styles.insightBadge}>
                <Text style={styles.insightBadgeText}>History</Text>
              </View>
              <Text style={styles.insightCardTitle}>Service records</Text>
              <Text style={styles.insightCardSubtitle}>View all</Text>
            </LinearGradient>

            <LinearGradient
              colors={[Colors.accent, Colors.gradientPurpleEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.insightCard, styles.insightCardEmpty]}
            >
              <View style={styles.insightBadge}>
                <Text style={styles.insightBadgeText}>Guide</Text>
              </View>
              <Text style={styles.insightCardTitle}>Warning lights</Text>
              <Text style={styles.insightCardSubtitle}>Learn more</Text>
            </LinearGradient>
          </ScrollView>
        </View>

        {/* Recommended Section - Empty State */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <LinearGradient
            colors={[Colors.gradientIndigoStart, Colors.gradientIndigoEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featureCard}
          >
            <View style={styles.featureCardContent}>
              <Text style={styles.featureCardTitle}>Add a vehicle to see</Text>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📅</Text>
                <Text style={styles.featureText}>Upcoming maintenance tasks</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>⚠️</Text>
                <Text style={styles.featureText}>Overdue maintenance alerts</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📖</Text>
                <Text style={styles.featureText}>Personalized how-to guides</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    );
  }

  const primaryVehicle = vehicles[0];
  const mostUrgentTask = overdueTasks[0] || upcomingTasks[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.vehicleAvatar} onPress={() => navigation.navigate('Vehicles')}>
          <Text style={styles.avatarText}>🚗</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('VehicleSetup')}>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <LinearGradient
        colors={[Colors.gradientGreenStart, Colors.gradientGreenEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          {mostUrgentTask ? (
            <>
              <Text style={styles.heroSubtext}>
                {mostUrgentTask.isOverdue ? '⚠️ Maintenance overdue' : '📅 Coming up soon'}
              </Text>
              <Text style={styles.heroTitle}>
                {mostUrgentTask.title}
              </Text>
              <Text style={styles.heroDetail}>
                {primaryVehicle && `${primaryVehicle.year} ${primaryVehicle.make} ${primaryVehicle.model}`}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.heroSubtext}>All caught up!</Text>
              <Text style={styles.heroTitle}>
                Your vehicle is running smoothly
              </Text>
              <Text style={styles.heroDetail}>
                {primaryVehicle && `${primaryVehicle.year} ${primaryVehicle.make} ${primaryVehicle.model}`}
              </Text>
            </>
          )}
        </View>
        {/* Decorative circles */}
        <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
        <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
      </LinearGradient>

      {/* Quick Insights Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick insights</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.insightCards}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Vehicles')}>
            <LinearGradient
              colors={[Colors.gradientPurpleStart, Colors.gradientPurpleEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.insightCard}
            >
              <View style={styles.insightBadge}>
                <Text style={styles.insightBadgeText}>Status</Text>
              </View>
              <Text style={styles.insightCardTitle}>Vehicle health</Text>
              <Text style={styles.insightCardSubtitle}>
                {primaryVehicle ? `${primaryVehicle.mileage.toLocaleString()} mi` : 'Add vehicle'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Maintenance')}>
            <LinearGradient
              colors={[Colors.gradientIndigoStart, Colors.gradientIndigoEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.insightCard}
            >
              <View style={styles.insightBadge}>
                <Text style={styles.insightBadgeText}>Schedule</Text>
              </View>
              <Text style={styles.insightCardTitle}>Maintenance calendar</Text>
              <Text style={styles.insightCardSubtitle}>
                {upcomingTasks.length} tasks
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ServiceRecords')}>
            <LinearGradient
              colors={[Colors.gradientCyanStart, Colors.gradientCyanEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.insightCard}
            >
              <View style={styles.insightBadge}>
                <Text style={styles.insightBadgeText}>History</Text>
              </View>
              <Text style={styles.insightCardTitle}>Service records</Text>
              <Text style={styles.insightCardSubtitle}>View all</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('WarningLights')}>
            <LinearGradient
              colors={[Colors.accent, Colors.gradientPurpleEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.insightCard}
            >
              <View style={styles.insightBadge}>
                <Text style={styles.insightBadgeText}>Guide</Text>
              </View>
              <Text style={styles.insightCardTitle}>Warning lights</Text>
              <Text style={styles.insightCardSubtitle}>Learn more</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Recommended / Upcoming Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended</Text>

        {overdueTasks.length > 0 && (
          <LinearGradient
            colors={[Colors.warning, Colors.urgencyHigh]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featureCard}
          >
            <View style={styles.featureCardContent}>
              <Text style={styles.featureCardTitle}>Overdue maintenance</Text>
              {overdueTasks.slice(0, 3).map((task) => (
                <View key={task.id} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>⚠️</Text>
                  <Text style={styles.featureText}>{task.title}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        )}

        {upcomingTasks.length > 0 && (
          <LinearGradient
            colors={[Colors.gradientIndigoStart, Colors.gradientIndigoEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featureCard}
          >
            <View style={styles.featureCardContent}>
              <Text style={styles.featureCardTitle}>Coming up</Text>
              {upcomingTasks.slice(0, 3).map((task) => (
                <View key={task.id} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>{task.title}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        )}

        {vehicles.length > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate('Guides')}>
            <LinearGradient
              colors={[Colors.gradientCyanStart, Colors.gradientCyanEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureCard}
            >
              <View style={styles.featureCardContent}>
                <Text style={styles.featureCardTitle}>How-to guides</Text>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>📖</Text>
                  <Text style={styles.featureText}>Learn basic maintenance</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🔧</Text>
                  <Text style={styles.featureText}>DIY repairs</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>💡</Text>
                  <Text style={styles.featureText}>Tips and tricks</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.screenPadding,
    backgroundColor: Colors.backgroundSecondary,
  },
  emptyTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },

  // Top Header
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  vehicleAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  dateText: {
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  calendarIcon: {
    fontSize: 28,
  },

  // Hero Section
  heroSection: {
    minHeight: 280,
    marginHorizontal: 0,
    marginBottom: Spacing.lg,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.xl * 2,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: BorderRadius.xl,
    ...Shadows.green,
  },
  heroContent: {
    zIndex: 1,
  },
  heroSubtext: {
    fontSize: Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: Spacing.sm,
    fontWeight: Typography.semibold,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    marginBottom: Spacing.md,
    lineHeight: 38,
  },
  heroDetail: {
    fontSize: Typography.body,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  // Decorative circles for hero section
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  decorativeCircle1: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    top: -80,
    right: -60,
  },
  decorativeCircle2: {
    width: 150,
    height: 150,
    backgroundColor: '#FFFFFF',
    bottom: -50,
    left: -40,
  },

  // Section
  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Layout.screenPadding,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  // Insight Cards
  insightCards: {
    paddingRight: Layout.screenPadding,
  },
  insightCard: {
    width: 160,
    height: 180,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.md,
    justifyContent: 'space-between',
    ...Shadows.purple,
  },
  insightBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  insightBadgeText: {
    fontSize: Typography.caption,
    color: Colors.text,
    fontWeight: Typography.semibold,
  },
  insightCardTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: '#fff',
    marginTop: Spacing.md,
  },
  insightCardSubtitle: {
    fontSize: Typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Feature Cards
  featureCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    minHeight: 180,
    ...Shadows.lg,
  },
  featureCardContent: {
    flex: 1,
  },
  featureCardTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: '#fff',
    marginBottom: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.body,
    color: '#fff',
  },

  // Empty State Styles
  insightCardEmpty: {
    opacity: 0.8,
  },
});
