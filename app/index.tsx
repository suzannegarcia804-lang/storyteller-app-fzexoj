
import React from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../components/Icon';

export default function HomeScreen() {
  const router = useRouter();

  const handleNewStory = () => {
    console.log('Navigate to new story');
    router.push('/create-story');
  };

  const handleViewStories = () => {
    console.log('Navigate to view stories');
    router.push('/my-stories');
  };

  const handleExplorePrompts = () => {
    console.log('Navigate to explore prompts');
    router.push('/prompts');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: 40, paddingBottom: 20 }}>
          <Text style={[commonStyles.title, { textAlign: 'center', fontSize: 32 }]}>
            StoryTeller
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
            Craft amazing stories with ease
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <TouchableOpacity
            style={[commonStyles.card, { alignItems: 'center', paddingVertical: 24 }]}
            onPress={handleNewStory}
            activeOpacity={0.7}
          >
            <Icon name="create-outline" size={48} color={colors.primary} />
            <Text style={[commonStyles.subtitle, { marginTop: 12, marginBottom: 4 }]}>
              Start New Story
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              Begin crafting your next masterpiece
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.card, { alignItems: 'center', paddingVertical: 24 }]}
            onPress={handleViewStories}
            activeOpacity={0.7}
          >
            <Icon name="library-outline" size={48} color={colors.primary} />
            <Text style={[commonStyles.subtitle, { marginTop: 12, marginBottom: 4 }]}>
              My Stories
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              View and edit your saved stories
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.card, { alignItems: 'center', paddingVertical: 24 }]}
            onPress={handleExplorePrompts}
            activeOpacity={0.7}
          >
            <Icon name="bulb-outline" size={48} color={colors.primary} />
            <Text style={[commonStyles.subtitle, { marginTop: 12, marginBottom: 4 }]}>
              Story Prompts
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              Get inspired with creative prompts
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
