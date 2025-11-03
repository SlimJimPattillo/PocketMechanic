import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Colors, Typography, Spacing, Layout } from '../../constants/theme';
import { Vehicle, MaintenanceTask } from '../../types';

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<MaintenanceTask[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      // Load vehicles
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      setVehicles(vehiclesData || []);

      // Load maintenance tasks
      if (vehiclesData && vehiclesData.length > 0) {
        const vehicleIds = vehiclesData.map((v) => v.id);
        const { data: tasksData } = await supabase
          .from('maintenance_tasks')
          .select('*')
          .in('vehicle_id', vehicleIds)
          .order('next_due_mileage', { ascending: true })
          .limit(10);

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

  const renderUrgencyBadge = (priority: string) => {
    const colors = {
      critical: Colors.urgencyCritical,
      high: Colors.urgencyHigh,
      medium: Colors.urgencyMedium,
      low: Colors.urgencyLow,
    };

    return (
      <View style={[styles.urgencyBadge, { backgroundColor: colors[priority as keyof typeof colors] }]}>
        <Text style={styles.urgencyText}>{priority.toUpperCase()}</Text>
      </View>
    );
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
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Welcome to PocketMechanic!</Text>
        <Text style={styles.emptySubtitle}>
          Add your first vehicle to start tracking maintenance
        </Text>
        <Button
          title="Add Vehicle"
          onPress={() => navigation.navigate('VehicleSetup')}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.email?.split('@')[0]}!</Text>
        <Text style={styles.subtitle}>Here's your maintenance overview</Text>
      </View>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Overdue Maintenance</Text>
          {overdueTasks.map((task) => (
            <Card key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                {renderUrgencyBadge(task.priority)}
              </View>
              <Text style={styles.taskDescription}>{task.description}</Text>
              <Text style={styles.taskDue}>
                Due: {task.nextDueMileage} miles
              </Text>
            </Card>
          ))}
        </View>
      )}

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Upcoming Maintenance</Text>
          {upcomingTasks.slice(0, 5).map((task) => (
            <Card key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                {renderUrgencyBadge(task.priority)}
              </View>
              <Text style={styles.taskDescription}>{task.description}</Text>
              <Text style={styles.taskDue}>
                Due: {task.nextDueMileage} miles
              </Text>
            </Card>
          ))}
        </View>
      )}

      {/* Vehicles Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚗 Your Vehicles</Text>
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} onPress={() => navigation.navigate('Vehicles')}>
            <Text style={styles.vehicleName}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
            <Text style={styles.vehicleDetail}>
              {vehicle.mileage.toLocaleString()} miles
            </Text>
          </Card>
        ))}
        <Button
          title="Add Another Vehicle"
          onPress={() => navigation.navigate('VehicleSetup')}
          variant="outline"
          fullWidth
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('WarningLights')}
          >
            <Text style={styles.quickActionIcon}>⚠️</Text>
            <Text style={styles.quickActionText}>Warning Lights</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Guides')}
          >
            <Text style={styles.quickActionIcon}>📖</Text>
            <Text style={styles.quickActionText}>How-To Guides</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: Layout.screenPadding,
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
  header: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  taskCard: {
    marginBottom: Spacing.md,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  taskTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    flex: 1,
  },
  taskDescription: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  taskDue: {
    fontSize: Typography.bodySmall,
    color: Colors.primary,
  },
  urgencyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgencyText: {
    fontSize: Typography.caption,
    color: '#fff',
    fontWeight: Typography.bold,
  },
  vehicleName: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  vehicleDetail: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  quickActionText: {
    fontSize: Typography.bodySmall,
    color: Colors.text,
    textAlign: 'center',
  },
});
