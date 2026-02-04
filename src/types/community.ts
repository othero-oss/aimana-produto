export type EventType = 'live' | 'mentoria_coletiva' | 'mentoria_individual' | 'workshop';
export type RegistrationStatus = 'registered' | 'attended' | 'no_show';

export interface CommunityEvent {
  id: string;
  companyId: string | null;
  eventType: EventType;
  title: string;
  description: string | null;
  speakerName: string | null;
  speakerRole: string | null;
  speakerAvatarUrl: string | null;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl: string | null;
  recordingUrl: string | null;
  maxParticipants: number | null;
  currentParticipants: number;
  isActive: boolean;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  attendedAt: string | null;
  feedback: string | null;
  rating: number | null;
  createdAt: string;
}

export interface PodcastEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string | null;
  audioUrl: string;
  thumbnailUrl: string | null;
  durationMinutes: number;
  transcript: string | null;
  aiSummary: string | null;
  publishedAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface NewsletterEdition {
  id: string;
  editionNumber: number;
  title: string;
  contentPreview: string | null;
  contentUrl: string | null;
  publishedAt: string | null;
  openRate: number | null;
  clickRate: number | null;
  createdAt: string;
}

export interface EventWithRegistration extends CommunityEvent {
  registration?: EventRegistration;
  isRegistered: boolean;
}
