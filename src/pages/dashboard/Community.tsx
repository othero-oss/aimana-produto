import { useState } from 'react';
import {
  Calendar,
  Users,
  Play,
  Headphones,
  Mail,
  Clock,
  ChevronRight,
  Mic,
  Video,
  UserCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared';

// Mock data
const mockEvents = [
  {
    id: '1',
    type: 'live',
    title: 'IA Generativa: O que esperar em 2025',
    speaker: 'Dr. Rafael Mendes',
    speakerRole: 'AI Research Lead @ AIMANA',
    date: '2025-02-15T14:00:00',
    duration: 60,
    participants: 234,
    maxParticipants: 500,
    isRegistered: false,
  },
  {
    id: '2',
    type: 'mentoria_coletiva',
    title: 'Mentoria: Implementando IA no RH',
    speaker: 'Ana Paula Silva',
    speakerRole: 'HR Tech Specialist',
    date: '2025-02-18T10:00:00',
    duration: 90,
    participants: 45,
    maxParticipants: 50,
    isRegistered: true,
  },
  {
    id: '3',
    type: 'workshop',
    title: 'Workshop: Prompt Engineering Avançado',
    speaker: 'Lucas Ferreira',
    speakerRole: 'AI Solutions Architect',
    date: '2025-02-22T15:00:00',
    duration: 120,
    participants: 89,
    maxParticipants: 100,
    isRegistered: false,
  },
];

const mockPodcastEpisodes = [
  {
    id: '1',
    number: 42,
    title: 'O futuro do trabalho com IA: Ameaça ou oportunidade?',
    description: 'Discutimos como a IA está transformando profissões e criando novas oportunidades.',
    duration: 45,
    publishedAt: '2025-02-01',
  },
  {
    id: '2',
    number: 41,
    title: 'Casos de sucesso: Empresas brasileiras usando IA',
    description: 'Entrevistas com líderes que transformaram seus negócios com inteligência artificial.',
    duration: 52,
    publishedAt: '2025-01-25',
  },
  {
    id: '3',
    number: 40,
    title: 'IA Responsável: Ética e governança',
    description: 'Como implementar IA de forma ética e responsável na sua organização.',
    duration: 38,
    publishedAt: '2025-01-18',
  },
];

const mockNewsletters = [
  {
    id: '1',
    edition: 24,
    title: 'As 10 ferramentas de IA que você precisa conhecer',
    preview: 'Selecionamos as melhores ferramentas de IA para aumentar sua produtividade...',
    publishedAt: '2025-02-01',
  },
  {
    id: '2',
    edition: 23,
    title: 'Tendências de IA para 2025',
    preview: 'O que esperar do mercado de IA neste ano e como se preparar...',
    publishedAt: '2025-01-15',
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Community() {
  const [activeTab, setActiveTab] = useState('events');

  const featuredEvent = mockEvents[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comunidade"
        description="Conecte-se com outros profissionais e participe de eventos exclusivos"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="events">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="recordings">Lives Gravadas</TabsTrigger>
          <TabsTrigger value="podcast">Podcast</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          {/* Featured Event */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-brand-navy to-brand-secondary p-6 text-white">
              <Badge className="bg-white/20 text-white mb-3">Destaque</Badge>
              <h2 className="text-2xl font-bold mb-2">{featuredEvent.title}</h2>
              <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(featuredEvent.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {featuredEvent.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {featuredEvent.participants}/{featuredEvent.maxParticipants}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{featuredEvent.speaker}</p>
                  <p className="text-sm text-white/70">{featuredEvent.speakerRole}</p>
                </div>
              </div>
              <Button className="bg-white text-brand-navy hover:bg-white/90">
                Inscrever-se gratuitamente
              </Button>
            </div>
          </Card>

          {/* Other Events */}
          <div className="grid md:grid-cols-2 gap-4">
            {mockEvents.slice(1).map((event) => (
              <Card key={event.id} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={event.type === 'workshop' ? 'warning' : 'secondary'}>
                      {event.type === 'mentoria_coletiva' ? 'Mentoria' : 'Workshop'}
                    </Badge>
                    {event.isRegistered && (
                      <Badge variant="success">Inscrito</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
                    <UserCircle className="h-4 w-4" />
                    <span>{event.speaker}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.date)}
                    </span>
                    <span className="text-text-muted">
                      {event.participants}/{event.maxParticipants} vagas
                    </span>
                  </div>
                  <Button
                    variant={event.isRegistered ? 'outline' : 'default'}
                    className="w-full mt-4"
                    size="sm"
                  >
                    {event.isRegistered ? 'Ver detalhes' : 'Inscrever-se'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recordings" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="h-16 w-16 mx-auto mb-4 text-text-muted" />
              <h3 className="font-medium mb-2">Lives gravadas</h3>
              <p className="text-sm text-text-muted mb-4">
                Todas as lives anteriores ficam disponíveis aqui para você assistir quando quiser.
              </p>
              <Button variant="outline">Ver gravações anteriores</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="podcast" className="space-y-6">
          {/* Podcast Header */}
          <Card className="bg-gradient-to-r from-brand-navy to-brand-secondary text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center">
                  <Mic className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">AIMANA Podcast</h2>
                  <p className="text-white/80 text-sm mb-2">
                    Conversas sobre IA, inovação e o futuro do trabalho
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      <Headphones className="h-4 w-4 mr-1" />
                      Spotify
                    </Button>
                    <Button size="sm" variant="secondary">
                      Apple Podcasts
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Episodes */}
          <div className="space-y-3">
            {mockPodcastEpisodes.map((episode) => (
              <Card key={episode.id} className="hover:shadow-card-hover transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-surface-light flex items-center justify-center flex-shrink-0">
                      <Play className="h-6 w-6 text-brand-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          #{episode.number}
                        </Badge>
                        <span className="text-xs text-text-muted">{episode.duration} min</span>
                      </div>
                      <h3 className="font-medium mb-1 line-clamp-1">{episode.title}</h3>
                      <p className="text-sm text-text-muted line-clamp-2">{episode.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-6">
          {/* Newsletter Signup */}
          <Card className="bg-surface-light">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-brand-teal" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Newsletter AIMANA</h3>
                  <p className="text-sm text-text-muted">
                    Receba as últimas novidades sobre IA toda semana
                  </p>
                </div>
                <Badge variant="success">Inscrito</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Archive */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Edições anteriores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockNewsletters.map((newsletter) => (
                <div
                  key={newsletter.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center text-sm font-bold">
                    #{newsletter.edition}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-0.5">{newsletter.title}</h4>
                    <p className="text-xs text-text-muted line-clamp-1">{newsletter.preview}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-text-muted flex-shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
