
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
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

export default function EditStoryScreen() {
  const router = useRouter();
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadStory();
  }, [storyId]);

  const loadStory = async () => {
    try {
      const storiesJson = await AsyncStorage.getItem('stories');
      const stories = storiesJson ? JSON.parse(storiesJson) : [];
      const story = stories.find((s: Story) => s.id === storyId);
      
      if (story) {
        setTitle(story.title);
        setContent(story.content);
        console.log('Loaded story for editing:', story.title);
      }
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

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Information', 'Please enter both a title and story content.');
      return;
    }

    setIsSaving(true);
    try {
      const storiesJson = await AsyncStorage.getItem('stories');
      const stories = storiesJson ? JSON.parse(storiesJson) : [];
      
      const updatedStories = stories.map((story: Story) => {
        if (story.id === storyId) {
          return {
            ...story,
            title: title.trim(),
            content: content.trim(),
            updatedAt: new Date().toISOString(),
          };
        }
        return story;
      });

      await AsyncStorage.setItem('stories', JSON.stringify(updatedStories));
      
      console.log('Story updated successfully');
      Alert.alert('Success', 'Your story has been updated!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating story:', error);
      Alert.alert('Error', 'Failed to update your story. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.centerContent, { flex: 1 }]}>
          <Text style={commonStyles.textSecondary}>Loading story...</Text>
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
          <Text style={[commonStyles.subtitle, { flex: 1, textAlign: 'center', marginBottom: 0 }]}>
            Edit Story
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[buttonStyles.primary, { paddingHorizontal: 16, paddingVertical: 8 }]}
            activeOpacity={0.7}
            disabled={isSaving}
          >
            <Text style={[buttonStyles.text, { fontSize: 14 }]}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {/* Title Input */}
          <View style={commonStyles.section}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
              Story Title
            </Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter your story title..."
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* Content Input */}
          <View style={commonStyles.section}>
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                Story Content
              </Text>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                {wordCount} words
              </Text>
            </View>
            <TextInput
              style={[commonStyles.textArea, { minHeight: 300 }]}
              placeholder="Start writing your story here..."
              placeholderTextColor={colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Writing Tips */}
          <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
              Editing Tips
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
              • Read your story aloud to catch awkward phrasing
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
              • Check for consistent character voices
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
              • Ensure smooth transitions between scenes
            </Text>
            <Text style={commonStyles.textSecondary}>
              • Remove unnecessary words for better flow
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
