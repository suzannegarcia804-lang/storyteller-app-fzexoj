
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../components/Icon';

interface Prompt {
  id: string;
  category: string;
  title: string;
  description: string;
}

const storyPrompts: Prompt[] = [
  {
    id: '1',
    category: 'Adventure',
    title: 'The Lost Map',
    description: 'You find an old map in your grandmother&apos;s attic that leads to a place that doesn&apos;t exist on any modern map.'
  },
  {
    id: '2',
    category: 'Mystery',
    title: 'The Midnight Visitor',
    description: 'Every night at exactly midnight, someone leaves a single flower on your doorstep. Tonight, you decide to wait and see who it is.'
  },
  {
    id: '3',
    category: 'Fantasy',
    title: 'The Magic Library',
    description: 'You discover that the old library in your town has books that write themselves, and the stories inside them are actually happening in real time.'
  },
  {
    id: '4',
    category: 'Sci-Fi',
    title: 'Time Loop Café',
    description: 'You work at a café where every customer is stuck in their own personal time loop, and you&apos;re the only one who remembers.'
  },
  {
    id: '5',
    category: 'Romance',
    title: 'Letters to Tomorrow',
    description: 'You start receiving love letters addressed to you, but they&apos;re dated one year in the future and describe a relationship you&apos;ve never had.'
  },
  {
    id: '6',
    category: 'Horror',
    title: 'The Perfect Neighbor',
    description: 'Your new neighbor seems perfect in every way, but you notice they never seem to sleep, eat, or leave their house during the day.'
  },
  {
    id: '7',
    category: 'Drama',
    title: 'The Last Phone Call',
    description: 'You receive a voicemail from your best friend who died five years ago, and they&apos;re asking for your help with something urgent.'
  },
  {
    id: '8',
    category: 'Comedy',
    title: 'Superhero Support Group',
    description: 'You accidentally join a support group for retired superheroes who are struggling to adapt to normal life.'
  }
];

export default function PromptsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(storyPrompts.map(p => p.category)))];

  const filteredPrompts = selectedCategory === 'All' 
    ? storyPrompts 
    : storyPrompts.filter(p => p.category === selectedCategory);

  const handleBack = () => {
    console.log('Navigate back to home');
    router.back();
  };

  const handleUsePrompt = (prompt: Prompt) => {
    console.log('Use prompt:', prompt.title);
    router.push({
      pathname: '/create-story',
      params: { 
        promptTitle: prompt.title,
        promptDescription: prompt.description 
      }
    });
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Adventure': '#FF6B35',
      'Mystery': '#6B5B95',
      'Fantasy': '#88D8B0',
      'Sci-Fi': '#4ECDC4',
      'Romance': '#FF8B94',
      'Horror': '#A8E6CF',
      'Drama': '#FFD3A5',
      'Comedy': '#FD7272'
    };
    return colorMap[category] || colors.primary;
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
            Story Prompts
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                {
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
                selectedCategory === category && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                }
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text style={[
                commonStyles.textSecondary,
                selectedCategory === category && { color: colors.background, fontWeight: '600' }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Prompts List */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {filteredPrompts.map((prompt) => (
            <View key={prompt.id} style={commonStyles.card}>
              <View style={[commonStyles.row, { marginBottom: 8 }]}>
                <View style={[
                  {
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: getCategoryColor(prompt.category),
                  }
                ]}>
                  <Text style={[commonStyles.textSecondary, { 
                    fontSize: 12, 
                    color: colors.background,
                    fontWeight: '600'
                  }]}>
                    {prompt.category}
                  </Text>
                </View>
              </View>
              
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
                {prompt.title}
              </Text>
              
              <Text style={[commonStyles.textSecondary, { marginBottom: 16, lineHeight: 20 }]}>
                {prompt.description}
              </Text>
              
              <TouchableOpacity
                style={[buttonStyles.primary]}
                onPress={() => handleUsePrompt(prompt)}
                activeOpacity={0.7}
              >
                <Text style={buttonStyles.text}>Use This Prompt</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
