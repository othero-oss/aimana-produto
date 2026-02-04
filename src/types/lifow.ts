export type LIFOWPlatform = 'slack' | 'teams' | 'whatsapp';

export interface LIFOWChannel {
  id: string;
  companyId: string;
  platform: LIFOWPlatform;
  channelId: string;
  channelName: string;
  webhookUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LIFOWInteraction {
  id: string;
  companyId: string;
  channelId: string;
  userId: string | null;
  userExternalId: string | null;
  userName: string | null;
  question: string;
  answer: string;
  suggestedContentId: string | null;
  suggestedContentType: 'course' | 'module' | 'article' | null;
  modelUsed: string | null;
  tokensUsed: number | null;
  rating: number | null;
  createdAt: string;
}

export interface LIFOWTopicInsight {
  topic: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface LIFOWInsight {
  id: string;
  companyId: string;
  periodStart: string;
  periodEnd: string;
  totalQuestions: number;
  uniqueUsers: number;
  topTopics: LIFOWTopicInsight[];
  satisfactionAvg: number | null;
  contentsSuggested: number;
  aiInsight: string | null;
  createdAt: string;
}

export interface LIFOWMetrics {
  questionsAnswered: number;
  questionsChange: number;
  contentsSuggested: number;
  contentsChange: number;
  satisfaction: number;
  satisfactionChange: number;
  uniqueUsers: number;
  usersChange: number;
}
