import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { supabase } from '../../services/supabase';
import { nhtsaApi } from '../../services/nhtsaApi';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { VehicleSuccessModal } from '../../components/vehicle/VehicleSuccessModal';
import { Colors, Typography, Spacing, Layout } from '../../constants/theme';
import { defaultMaintenanceSchedule } from '../../data/maintenanceSchedule';

export const VehicleSetupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [useVin, setUseVin] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedVehicle, setAddedVehicle] = useState<{
    make: string;
    model: string;
    year: number;
    mileage: number;
    nickname?: string;
  } | null>(null);

  const handleVinLookup = async () => {
    if (vin.length !== 17) {
      Alert.alert('Invalid VIN', 'VIN must be 17 characters');
      return;
    }

    setLoading(true);
    const result = await nhtsaApi.decodeVIN(vin);
    setLoading(false);

    if (result) {
      setMake(result.make);
      setModel(result.model);
      setYear(result.year.toString());
      Alert.alert('Success', 'Vehicle information loaded from VIN');
    } else {
      Alert.alert('Error', 'Could not decode VIN. Please enter manually.');
    }
  };

  const handleAddVehicle = async () => {
    // Validation
    if (!make || !model || !year || !mileage) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Check if user exists
    if (!user?.id) {
      Alert.alert(
        'Authentication Error',
        'User not found. Please log out and log back in, then try again.'
      );
      return;
    }

    const yearNum = parseInt(year);
    const mileageNum = parseInt(mileage);

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert('Invalid Year', 'Please enter a valid year');
      return;
    }

    if (isNaN(mileageNum) || mileageNum < 0) {
      Alert.alert('Invalid Mileage', 'Please enter a valid mileage');
      return;
    }

    setLoading(true);

    try {
      // Insert vehicle
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          user_id: user?.id,
          make,
          model,
          year: yearNum,
          vin: vin || null,
          mileage: mileageNum,
          nickname: nickname || null,
        })
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // Create default maintenance tasks
      const maintenanceTasks = defaultMaintenanceSchedule.map((task) => ({
        vehicle_id: vehicleData.id,
        title: task.title,
        description: task.description,
        category: task.category,
        interval_type: task.intervalType,
        interval_mileage: task.intervalMileage,
        interval_months: task.intervalMonths,
        next_due_mileage: task.intervalMileage ? mileageNum + task.intervalMileage : null,
        next_due_date: task.intervalMonths
          ? new Date(Date.now() + task.intervalMonths * 30 * 24 * 60 * 60 * 1000).toISOString()
          : null,
        priority: task.priority,
        is_overdue: false,
      }));

      const { error: tasksError } = await supabase
        .from('maintenance_tasks')
        .insert(maintenanceTasks);

      if (tasksError) console.error('Error creating maintenance tasks:', tasksError);

      // Set vehicle details and show success modal
      setAddedVehicle({
        make,
        model,
        year: yearNum,
        mileage: mileageNum,
        nickname: nickname || undefined,
      });
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      const errorMessage = error?.message || 'Failed to add vehicle. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const handleViewDashboard = () => {
    setShowSuccessModal(false);
    navigation.navigate('MainTabs', { screen: 'Dashboard' });
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
    // Reset form
    setVin('');
    setMake('');
    setModel('');
    setYear('');
    setMileage('');
    setNickname('');
    setUseVin(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Your Vehicle</Text>

        <View style={styles.toggleContainer}>
          <Button
            title="Use VIN"
            onPress={() => setUseVin(true)}
            variant={useVin ? 'primary' : 'outline'}
            size="small"
          />
          <Button
            title="Enter Manually"
            onPress={() => setUseVin(false)}
            variant={!useVin ? 'primary' : 'outline'}
            size="small"
          />
        </View>

        {useVin ? (
          <>
            <Input
              label="VIN (17 characters)"
              value={vin}
              onChangeText={setVin}
              placeholder="1HGBH41JXMN109186"
              autoCapitalize="characters"
            />
            <Button
              title="Decode VIN"
              onPress={handleVinLookup}
              loading={loading}
              fullWidth
            />
            <Text style={styles.dividerText}>Vehicle Information</Text>
          </>
        ) : (
          <Text style={styles.dividerText}>Enter Vehicle Details</Text>
        )}

        <Input
          label="Make *"
          value={make}
          onChangeText={setMake}
          placeholder="Honda"
        />

        <Input
          label="Model *"
          value={model}
          onChangeText={setModel}
          placeholder="Accord"
        />

        <Input
          label="Year *"
          value={year}
          onChangeText={setYear}
          placeholder="2020"
          keyboardType="numeric"
        />

        <Input
          label="Current Mileage *"
          value={mileage}
          onChangeText={setMileage}
          placeholder="50000"
          keyboardType="numeric"
        />

        <Input
          label="Nickname (Optional)"
          value={nickname}
          onChangeText={setNickname}
          placeholder="My Car"
        />

        <Button
          title="Add Vehicle"
          onPress={handleAddVehicle}
          loading={loading}
          fullWidth
        />
      </ScrollView>

      {/* Success Modal */}
      {addedVehicle && (
        <VehicleSuccessModal
          visible={showSuccessModal}
          onClose={handleCloseModal}
          onViewDashboard={handleViewDashboard}
          onAddAnother={handleAddAnother}
          vehicleDetails={addedVehicle}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Layout.screenPadding,
  },
  title: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  dividerText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginVertical: Spacing.md,
  },
});
