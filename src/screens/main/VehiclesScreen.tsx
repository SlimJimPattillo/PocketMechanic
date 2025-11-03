import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Colors, Typography, Spacing, Layout } from '../../constants/theme';
import { Vehicle } from '../../types';

export const VehiclesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadVehicles();
    }
  }, [user]);

  const loadVehicles = async () => {
    try {
      const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      setVehicles(data || []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVehicles();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading vehicles...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {vehicles.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No vehicles yet</Text>
          <Text style={styles.emptySubtitle}>Add your first vehicle to get started</Text>
        </View>
      ) : (
        vehicles.map((vehicle) => (
          <Card key={vehicle.id} style={styles.vehicleCard}>
            <Text style={styles.vehicleName}>
              {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            </Text>
            {vehicle.nickname && (
              <Text style={styles.vehicleModel}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Text>
            )}
            <Text style={styles.vehicleMileage}>
              {vehicle.mileage.toLocaleString()} miles
            </Text>
            {vehicle.vin && (
              <Text style={styles.vehicleVin}>VIN: {vehicle.vin}</Text>
            )}
          </Card>
        ))
      )}

      <Button
        title="Add Vehicle"
        onPress={() => navigation.navigate('VehicleSetup')}
        fullWidth
      />
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  vehicleCard: {
    marginBottom: Spacing.md,
  },
  vehicleName: {
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  vehicleModel: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  vehicleMileage: {
    fontSize: Typography.body,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  vehicleVin: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
