
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateStoryScreen() {
  const router = useRouter();
  const { promptTitle, promptDescription } = useLocalSearchParams<{ 
    promptTitle?: string; 
    promptDescription?: string; 
  }>();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // If we have a prompt, pre-fill the content
    if (promptTitle && promptDescription) {
      setTitle(promptTitle);
      setContent(`Prompt: ${promptDescription}\n\n`);
      console.log('Using prompt:', promptTitle);
    }
  }, [promptTitle, promptDescription]);

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
      const story = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Get existing stories
      const existingStoriesJson = await AsyncStorage.getItem('stories');
      const existingStories = existingStoriesJson ? JSON.parse(existingStoriesJson) : [];
      
      // Add new story
      const updatedStories = [story, ...existingStories];
      
      // Save back to storage
      await AsyncStorage.setItem('stories', JSON.stringify(updatedStories));
      
      console.log('Story saved successfully');
      Alert.alert('Success', 'Your story has been saved!', [
        { text: 'OK', onPress: () => router.push('/my-stories') }
      ]);
    } catch (error) {
      console.error('Error saving story:', error);
      Alert.alert('Error', 'Failed to save your story. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

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
            New Story
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
              Writing Tips
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
              • Start with an engaging opening line
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
              • Develop your characters with unique traits
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
              • Create conflict to drive the plot forward
            </Text>
            <Text style={commonStyles.textSecondary}>
              • End with a satisfying resolution
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
