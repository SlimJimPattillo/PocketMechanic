import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Card } from '../../components/common/Card';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../../constants/theme';
import { dashboardLights } from '../../data/dashboardLights';

export const WarningLightsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLights = dashboardLights.filter((light) =>
    light.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    light.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return Colors.urgencyCritical;
      case 'high':
        return Colors.urgencyHigh;
      case 'medium':
        return Colors.urgencyMedium;
      case 'low':
        return Colors.urgencyLow;
      default:
        return Colors.textSecondary;
    }
  };

  const getUrgencyMessage = (canDriveSafely: boolean) => {
    return canDriveSafely
      ? '✓ Safe to drive carefully'
      : '⚠️ DO NOT DRIVE - Have vehicle towed';
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search warning lights..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {filteredLights.map((light) => (
          <Card key={light.id} style={styles.lightCard}>
            <View style={styles.lightHeader}>
              <View style={styles.lightTitleContainer}>
                <Text style={styles.lightSymbol}>{light.symbol}</Text>
                <Text style={styles.lightName}>{light.name}</Text>
              </View>
              <View
                style={[
                  styles.urgencyBadge,
                  { backgroundColor: getUrgencyColor(light.urgency) },
                ]}
              >
                <Text style={styles.urgencyText}>{light.urgency.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.lightDescription}>{light.description}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>What to do:</Text>
            <Text style={styles.recommendedAction}>{light.recommendedAction}</Text>

            <View
              style={[
                styles.safetyBadge,
                {
                  backgroundColor: light.canDriveSafely
                    ? Colors.success + '20'
                    : Colors.error + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.safetyText,
                  {
                    color: light.canDriveSafely ? Colors.success : Colors.error,
                  },
                ]}
              >
                {getUrgencyMessage(light.canDriveSafely)}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  searchContainer: {
    padding: Layout.screenPadding,
    backgroundColor: Colors.background,
  },
  searchInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.body,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Layout.screenPadding,
  },
  lightCard: {
    marginBottom: Spacing.md,
  },
  lightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  lightTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lightSymbol: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  lightName: {
    fontSize: Typography.h4,
    fontWeight: Typography.semibold,
    color: Colors.text,
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgencyText: {
    fontSize: Typography.caption,
    color: '#fff',
    fontWeight: Typography.bold,
  },
  lightDescription: {
    fontSize: Typography.body,
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  recommendedAction: {
    fontSize: Typography.body,
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  safetyBadge: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  safetyText: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
    textAlign: 'center',
  },
});
