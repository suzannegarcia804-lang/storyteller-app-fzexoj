
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Story {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function ViewStoryScreen() {
  const router = useRouter();
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStory();
  }, [storyId]);

  const loadStory = async () => {
    try {
      const storiesJson = await AsyncStorage.getItem('stories');
      const stories = storiesJson ? JSON.parse(storiesJson) : [];
      const foundStory = stories.find((s: Story) => s.id === storyId);
      setStory(foundStory || null);
      console.log('Loaded story:', foundStory?.title);
    } catch (error) {
      console.error('Error loading story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    console.log('Navigate back');
    router.back();
  };

  const handleEdit = () => {
    if (story) {
      console.log('Edit story:', story.title);
      router.push({
        pathname: '/edit-story',
        params: { storyId: story.id }
      });
    }
  };

  const handleDelete = () => {
    if (!story) return;

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
              const storiesJson = await AsyncStorage.getItem('stories');
              const stories = storiesJson ? JSON.parse(storiesJson) : [];
              const updatedStories = stories.filter((s: Story) => s.id !== story.id);
              await AsyncStorage.setItem('stories', JSON.stringify(updatedStories));
              console.log('Story deleted:', story.title);
              router.replace('/my-stories');
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWordCount = (content: string) => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.centerContent, { flex: 1 }]}>
          <Text style={commonStyles.textSecondary}>Loading story...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!story) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.centerContent, { flex: 1 }]}>
          <Icon name="document-outline" size={64} color={colors.textSecondary} />
          <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
            Story not found
          </Text>
          <TouchableOpacity
            style={[buttonStyles.primary, { marginTop: 20 }]}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={buttonStyles.text}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={handleEdit}
            style={{ padding: 8, marginRight: 8 }}
            activeOpacity={0.7}
          >
            <Icon name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={{ padding: 8, marginRight: -8 }}
            activeOpacity={0.7}
          >
            <Icon name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {/* Story Title */}
          <Text style={[commonStyles.title, { marginBottom: 8 }]}>
            {story.title}
          </Text>

          {/* Story Metadata */}
          <View style={[commonStyles.row, { marginBottom: 24 }]}>
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              {getWordCount(story.content)} words
            </Text>
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              Created {formatDate(story.createdAt)}
            </Text>
          </View>

          {/* Story Content */}
          <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt }]}>
            <Text style={[commonStyles.text, { lineHeight: 28 }]}>
              {story.content}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ marginTop: 20, marginBottom: 40 }}>
            <TouchableOpacity
              style={[buttonStyles.primary, { marginBottom: 12 }]}
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <Text style={buttonStyles.text}>Edit Story</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.secondary]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Text style={[buttonStyles.textSecondary, { color: colors.error }]}>Delete Story</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
