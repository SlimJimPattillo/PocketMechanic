import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Card } from '../../components/common/Card';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../../constants/theme';
import { maintenanceGuides } from '../../data/maintenanceGuides';

export const GuidesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  const filteredGuides = maintenanceGuides.filter((guide) =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return Colors.success;
      case 'moderate':
        return Colors.warning;
      case 'hard':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const toggleGuide = (id: string) => {
    setExpandedGuide(expandedGuide === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search maintenance guides..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {filteredGuides.map((guide) => (
          <Card key={guide.id} onPress={() => toggleGuide(guide.id)} style={styles.guideCard}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideTitle}>{guide.title}</Text>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(guide.difficulty) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(guide.difficulty) },
                  ]}
                >
                  {guide.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.guideInfo}>
              <Text style={styles.infoText}>⏱️ {guide.estimatedTime} min</Text>
              <Text style={styles.infoText}>🔧 {guide.toolsRequired.length} tools</Text>
            </View>

            {expandedGuide === guide.id && (
              <View style={styles.expandedContent}>
                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Tools Required:</Text>
                {guide.toolsRequired.map((tool, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {tool}
                  </Text>
                ))}

                {guide.partsRequired.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>
                      Parts Required:
                    </Text>
                    {guide.partsRequired.map((part, index) => (
                      <Text key={index} style={styles.listItem}>
                        • {part}
                      </Text>
                    ))}
                  </>
                )}

                <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>Steps:</Text>
                {guide.steps.map((step) => (
                  <View key={step.stepNumber} style={styles.stepContainer}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                    </View>
                  </View>
                ))}

                {guide.tips && guide.tips.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>
                      💡 Tips:
                    </Text>
                    {guide.tips.map((tip, index) => (
                      <Text key={index} style={styles.tipText}>
                        • {tip}
                      </Text>
                    ))}
                  </>
                )}

                {guide.warnings && guide.warnings.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: Spacing.md, color: Colors.error }]}>
                      ⚠️ Warnings:
                    </Text>
                    {guide.warnings.map((warning, index) => (
                      <Text key={index} style={styles.warningText}>
                        • {warning}
                      </Text>
                    ))}
                  </>
                )}
              </View>
            )}

            <Text style={styles.tapToExpand}>
              {expandedGuide === guide.id ? 'Tap to collapse' : 'Tap to view full guide'}
            </Text>
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
  guideCard: {
    marginBottom: Spacing.md,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  guideTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.semibold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.md,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
  },
  guideInfo: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  expandedContent: {
    marginTop: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  listItem: {
    fontSize: Typography.bodySmall,
    color: Colors.text,
    marginBottom: 4,
    marginLeft: Spacing.sm,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tipText: {
    fontSize: Typography.bodySmall,
    color: Colors.primary,
    marginBottom: 4,
    marginLeft: Spacing.sm,
    lineHeight: 20,
  },
  warningText: {
    fontSize: Typography.bodySmall,
    color: Colors.error,
    marginBottom: 4,
    marginLeft: Spacing.sm,
    lineHeight: 20,
  },
  tapToExpand: {
    fontSize: Typography.caption,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
