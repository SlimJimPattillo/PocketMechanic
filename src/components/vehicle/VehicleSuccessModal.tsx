import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface VehicleSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onViewDashboard: () => void;
  onAddAnother: () => void;
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    nickname?: string;
  };
}

export const VehicleSuccessModal: React.FC<VehicleSuccessModalProps> = ({
  visible,
  onClose,
  onViewDashboard,
  onAddAnother,
  vehicleDetails,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={[Colors.gradientPurpleStart, Colors.gradientPurpleEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalContent}
          >
            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Success icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.successIcon}>🎉</Text>
            </View>

            {/* Success message */}
            <Text style={styles.title}>Vehicle Added Successfully!</Text>

            {/* Vehicle details */}
            <View style={styles.detailsContainer}>
              {vehicleDetails.nickname && (
                <Text style={styles.nickname}>{vehicleDetails.nickname}</Text>
              )}
              <Text style={styles.vehicleInfo}>
                {vehicleDetails.year} {vehicleDetails.make} {vehicleDetails.model}
              </Text>
              <Text style={styles.mileageInfo}>
                {vehicleDetails.mileage.toLocaleString()} miles
              </Text>
            </View>

            {/* Action buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onViewDashboard}
              >
                <Text style={styles.primaryButtonText}>View Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onAddAnother}
              >
                <Text style={styles.secondaryButtonText}>Add Another Vehicle</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: Typography.bold,
  },
  iconContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  successIcon: {
    fontSize: 64,
  },
  title: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    width: '100%',
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  nickname: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  vehicleInfo: {
    fontSize: Typography.body,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  mileageInfo: {
    fontSize: Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
  },
  primaryButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: '#FFFFFF',
  },
});
