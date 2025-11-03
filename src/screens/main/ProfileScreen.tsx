import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Colors, Typography, Spacing, Layout } from '../../constants/theme';

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: () => signOut(), style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Plan:</Text>
          <Text style={[styles.value, styles.premiumBadge]}>
            {user?.isPremium ? 'Premium 👑' : 'Free'}
          </Text>
        </View>
      </Card>

      {!user?.isPremium && (
        <Card style={styles.premiumCard}>
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <Text style={styles.premiumDescription}>
            Unlock unlimited vehicles, advanced tracking, and exclusive features
          </Text>
          <View style={styles.premiumFeatures}>
            <Text style={styles.feature}>✓ Unlimited vehicles</Text>
            <Text style={styles.feature}>✓ Advanced maintenance tracking</Text>
            <Text style={styles.feature}>✓ Household management</Text>
            <Text style={styles.feature}>✓ Priority support</Text>
          </View>
          <Button title="Upgrade Now - $4.99/month" onPress={() => {}} fullWidth />
        </Card>
      )}

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <Text style={styles.infoText}>Version: 1.0.0</Text>
        <Text style={styles.infoText}>PocketMechanic MVP</Text>
      </Card>

      <Button
        title="Sign Out"
        onPress={handleSignOut}
        variant="outline"
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
  profileCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: Typography.body,
    color: Colors.text,
    fontWeight: Typography.medium,
  },
  premiumBadge: {
    color: Colors.accent,
  },
  premiumCard: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.primary + '10',
  },
  premiumTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  premiumDescription: {
    fontSize: Typography.body,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  premiumFeatures: {
    marginBottom: Spacing.md,
  },
  feature: {
    fontSize: Typography.body,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
});
