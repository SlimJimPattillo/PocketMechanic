import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface EmailVerificationModalProps {
  visible: boolean;
  email: string;
  onClose: () => void;
  onResendEmail: () => Promise<void>;
  onSignIn: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  visible,
  email,
  onClose,
  onResendEmail,
  onSignIn,
}) => {
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResend = async () => {
    setResending(true);
    setResendSuccess(false);
    setResendError(null);

    try {
      await onResendEmail();
      setResendSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to resend email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send email. Please try again.';
      setResendError(errorMessage);
      // Reset error message after 5 seconds
      setTimeout(() => setResendError(null), 5000);
    } finally {
      setResending(false);
    }
  };

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

            {/* Email icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.emailIcon}>📧</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Check Your Email!</Text>

            {/* Email address display */}
            <View style={styles.emailContainer}>
              <Text style={styles.emailLabel}>We sent a verification link to:</Text>
              <Text style={styles.emailAddress}>{email}</Text>
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionRow}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.instructionText}>
                  Click the verification link in your email
                </Text>
              </View>
              <View style={styles.instructionRow}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.instructionText}>
                  Come back here and sign in to your account
                </Text>
              </View>
            </View>

            {/* Resend success message */}
            {resendSuccess && (
              <View style={styles.successBanner}>
                <Text style={styles.successText}>✓ Email sent! Check your inbox</Text>
              </View>
            )}

            {/* Resend error message */}
            {resendError && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>✕ {resendError}</Text>
              </View>
            )}

            {/* Action buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onSignIn}
              >
                <Text style={styles.primaryButtonText}>I've Verified - Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleResend}
                disabled={resending}
              >
                {resending ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.secondaryButtonText}>Resend Email</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Help text */}
            <Text style={styles.helpText}>
              Didn't receive it? Check your spam folder or click resend
            </Text>
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
  emailIcon: {
    fontSize: 64,
  },
  title: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  emailContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  emailLabel: {
    fontSize: Typography.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emailAddress: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: '#FFFFFF',
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: Spacing.sm,
  },
  instructionText: {
    flex: 1,
    fontSize: Typography.body,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
  },
  successBanner: {
    backgroundColor: 'rgba(43, 199, 148, 0.3)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    width: '100%',
  },
  successText: {
    color: '#FFFFFF',
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    width: '100%',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
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
  helpText: {
    fontSize: Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 18,
  },
});
