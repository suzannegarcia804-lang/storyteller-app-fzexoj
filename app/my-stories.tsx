
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import Icon from '../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Story {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyStoriesScreen() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStories = async () => {
    try {
      const storiesJson = await AsyncStorage.getItem('stories');
      const loadedStories = storiesJson ? JSON.parse(storiesJson) : [];
      setStories(loadedStories);
      console.log('Loaded stories:', loadedStories.length);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadStories();
    }, [])
  );

  const handleBack = () => {
    console.log('Navigate back to home');
    router.back();
  };

  const handleViewStory = (story: Story) => {
    console.log('View story:', story.title);
    router.push({
      pathname: '/view-story',
      params: { storyId: story.id }
    });
  };

  const handleDeleteStory = (story: Story) => {
    Alert.alert(
      'Delete Story',
      `Are you sure you want to delete "${story.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedStories = stories.filter(s => s.id !== story.id);
              await AsyncStorage.setItem('stories', JSON.stringify(updatedStories));
              setStories(updatedStories);
              console.log('Story deleted:', story.title);
            } catch (error) {
              console.error('Error deleting story:', error);
              Alert.alert('Error', 'Failed to delete story. Please try again.');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPreview = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.content, { paddingTop: 10 }]}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 20 }]}>
          <TouchableOpacity
            onPress={handleBack}
            style={{ padding: 8, marginLeft: -8 }}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.subtitle, { flex: 1, textAlign: 'center', marginBottom: 0 }]}>
            My Stories
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/create-story')}
            style={{ padding: 8, marginRight: -8 }}
            activeOpacity={0.7}
          >
            <Icon name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={[commonStyles.centerContent, { flex: 1 }]}>
            <Text style={commonStyles.textSecondary}>Loading stories...</Text>
          </View>
        ) : stories.length === 0 ? (
          <View style={[commonStyles.centerContent, { flex: 1 }]}>
            <Icon name="library-outline" size={64} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
              No stories yet
            </Text>
            <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
              Start writing your first story!
            </Text>
            <TouchableOpacity
              style={[commonStyles.card, { marginTop: 20, alignItems: 'center', backgroundColor: colors.primary }]}
              onPress={() => router.push('/create-story')}
              activeOpacity={0.7}
            >
              <Text style={[commonStyles.text, { color: colors.background, fontWeight: '600' }]}>
                Create New Story
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {stories.map((story) => (
              <TouchableOpacity
                key={story.id}
                style={commonStyles.card}
                onPress={() => handleViewStory(story)}
                activeOpacity={0.7}
              >
                <View style={[commonStyles.row, { marginBottom: 8 }]}>
                  <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]} numberOfLines={1}>
                    {story.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteStory(story)}
                    style={{ padding: 4, marginRight: -4 }}
                    activeOpacity={0.7}
                  >
                    <Icon name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
                <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]} numberOfLines={3}>
                  {getPreview(story.content)}
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  Created {formatDate(story.createdAt)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
