import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Search,
  BookOpen,
  Bot,
  BarChart3,
  Shield,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-light to-white -z-10" />

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="secondary" className="mb-4">
                  Plataforma #1 em transformação AI First
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-text leading-tight mb-6"
              >
                Sua empresa{' '}
                <span className="text-transparent bg-clip-text bg-gradient-celebration">
                  AI First
                </span>{' '}
                em semanas, não anos.
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-text-secondary max-w-2xl mb-8"
              >
                Diagnóstico, capacitação com IA e gestão — tudo integrado onde
                sua equipe já trabalha. Transforme sua organização com
                metodologia comprovada.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button size="xl" asChild>
                  <Link to="/register">
                    Começar diagnóstico gratuito
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <a href="#demo">
                    <Play className="mr-2 h-5 w-5" />
                    Ver demonstração
                  </a>
                </Button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-celebration border-2 border-white"
                    />
                  ))}
                </div>
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-text">5.000+</span>{' '}
                  profissionais capacitados
                </p>
              </motion.div>
            </motion.div>

            {/* Right: Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative">
                {/* Main card mockup */}
                <div className="bg-white rounded-2xl shadow-card-hover p-6 animate-float">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-status-error" />
                    <div className="w-3 h-3 rounded-full bg-status-warning" />
                    <div className="w-3 h-3 rounded-full bg-status-success" />
                  </div>

                  {/* Dashboard preview */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 bg-surface-light rounded-lg p-4">
                        <p className="text-xs text-text-muted mb-1">Maturidade</p>
                        <p className="text-2xl font-bold text-text">58%</p>
                        <div className="h-1.5 bg-surface-border rounded-full mt-2">
                          <div className="h-full w-[58%] rounded-full progress-gradient" />
                        </div>
                      </div>
                      <div className="flex-1 bg-surface-light rounded-lg p-4">
                        <p className="text-xs text-text-muted mb-1">Capacitados</p>
                        <p className="text-2xl font-bold text-text">47/150</p>
                        <p className="text-xs text-status-success mt-1">+12 esta semana</p>
                      </div>
                    </div>

                    {/* Journey preview */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-phase-plan" />
                      <div className="flex-1 h-2 rounded-full bg-phase-execute/30" />
                      <div className="flex-1 h-2 rounded-full bg-surface-border" />
                    </div>
                    <p className="text-xs text-text-secondary">
                      Jornada: PLANEJAR → EXECUTAR → GERIR
                    </p>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-card p-3 animate-float" style={{ animationDelay: '1s' }}>
                  <Bot className="h-6 w-6 text-brand-coral" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card p-3 animate-float" style={{ animationDelay: '2s' }}>
                  <BarChart3 className="h-6 w-6 text-phase-manage" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Client logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 text-center"
          >
            <p className="text-sm text-text-muted mb-6">
              Empresas que confiam na AIMANA
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {['Empresa A', 'Empresa B', 'Empresa C', 'Empresa D', 'Empresa E'].map(
                (name) => (
                  <div
                    key={name}
                    className="text-xl font-bold text-text-muted"
                  >
                    {name}
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              78% das empresas brasileiras não têm estratégia de IA.
            </h2>
            <p className="text-white/70 text-lg">
              E das que têm, a maioria enfrenta estes desafios:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Shadow AI descontrolado',
                description:
                  'Funcionários usando ChatGPT e outras ferramentas sem governança, expondo dados sensíveis.',
                icon: Shield,
              },
              {
                title: 'Sem métricas de ROI',
                description:
                  'Investimento em IA sem clareza sobre retorno, dificultando justificar orçamento.',
                icon: BarChart3,
              },
              {
                title: 'Treinamentos que não funcionam',
                description:
                  'Cursos genéricos que não consideram contexto da empresa ou níveis diferentes.',
                icon: BookOpen,
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="bg-white/5 border-white/10 text-white"
              >
                <CardHeader>
                  <item.icon className="h-10 w-10 text-brand-coral mb-2" />
                  <CardTitle className="text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">
              Como funciona
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Uma jornada clara em 3 fases
            </h2>
            <p className="text-text-secondary text-lg">
              PLANEJAR → EXECUTAR → GERIR. Metodologia testada para transformar
              sua empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                title: 'Diagnóstico',
                description: 'Avalie maturidade e identifique Shadow AI',
                icon: Search,
                color: '#4573D2',
              },
              {
                step: 2,
                title: 'Capacitação',
                description: 'Trilhas personalizadas por nível e área',
                icon: BookOpen,
                color: '#F8A325',
              },
              {
                step: 3,
                title: 'LIFOW',
                description: 'IA que responde dúvidas onde a equipe trabalha',
                icon: Bot,
                color: '#F06A6A',
              },
              {
                step: 4,
                title: 'Resultados',
                description: 'Métricas, ROI e gestão contínua',
                icon: BarChart3,
                color: '#9B5DE5',
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-surface-border" />
                )}

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon
                      className="h-8 w-8"
                      style={{ color: item.color }}
                    />
                  </div>
                  <h3 className="font-semibold text-text mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/register">
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LIFOW Highlight */}
      <section className="py-20 bg-gradient-to-r from-brand-coral/10 to-phase-execute/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Mockup */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-card-hover p-6 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-coral/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-brand-coral" />
                  </div>
                  <div>
                    <p className="font-semibold text-text">LIFOW</p>
                    <p className="text-xs text-text-muted">Oráculo de IA</p>
                  </div>
                  <Badge variant="success" className="ml-auto">
                    Online
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="bg-surface-light rounded-lg p-3">
                    <p className="text-sm text-text-secondary">
                      <span className="font-medium text-text">João:</span> Como
                      uso IA para análise de dados de vendas?
                    </p>
                  </div>
                  <div className="bg-brand-coral/5 rounded-lg p-3 border border-brand-coral/20">
                    <p className="text-sm text-text">
                      Boa pergunta! Recomendo o módulo "IA para Análise de
                      Vendas" do curso de Marketing. Quer que eu te inscreva?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex-1">
              <Badge variant="secondary" className="mb-4">
                LIFOW - Learning In Flow Of Work
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
                Aprendizado onde o trabalho acontece
              </h2>
              <p className="text-text-secondary text-lg mb-8">
                O LIFOW é o oráculo de IA da sua empresa. Integra com Slack,
                Teams e WhatsApp para responder dúvidas e sugerir conteúdos
                relevantes em tempo real.
              </p>

              <ul className="space-y-4">
                {[
                  'Responde dúvidas sobre IA contextualizado à sua empresa',
                  'Sugere conteúdos e cursos baseado nas perguntas',
                  'Acompanha progresso sem sair das ferramentas do dia-a-dia',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-status-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-status-success" />
                    </div>
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 mt-8">
                <p className="text-sm text-text-muted">Conecta com:</p>
                <div className="flex gap-2">
                  {['Slack', 'Teams', 'WhatsApp'].map((platform) => (
                    <Badge key={platform} variant="outline">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">
              Preços
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Planos para cada estágio da sua jornada
            </h2>
            <p className="text-text-secondary text-lg">
              Comece pequeno e escale conforme sua empresa evolui
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'R$ 5.000',
                description: 'Para empresas iniciando a jornada',
                features: [
                  'Até 50 usuários',
                  'Diagnóstico de maturidade',
                  'Academy completo',
                  'LIFOW (1 canal)',
                  'Suporte por email',
                ],
                cta: 'Começar grátis',
                highlighted: false,
              },
              {
                name: 'Professional',
                price: 'R$ 15.000',
                description: 'Para empresas em transformação',
                features: [
                  'Até 200 usuários',
                  'Tudo do Starter',
                  'Scanner Shadow AI',
                  'LIFOW (3 canais)',
                  'Integrações MCP',
                  'Painel de métricas',
                  'Suporte prioritário',
                ],
                cta: 'Começar agora',
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'R$ 35.000+',
                description: 'Para empresas líderes em IA',
                features: [
                  'Usuários ilimitados',
                  'Tudo do Professional',
                  'Trust Agent',
                  'AIMANA API',
                  'Conectores personalizados',
                  'Customer Success dedicado',
                  'SLA garantido',
                ],
                cta: 'Falar com especialista',
                highlighted: false,
              },
            ].map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? 'border-brand-coral shadow-card-hover relative'
                    : ''
                }
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Mais popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-text">
                      {plan.price}
                    </span>
                    <span className="text-text-muted">/mês</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-status-success flex-shrink-0" />
                        <span className="text-sm text-text-secondary">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to="/register">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para transformar sua empresa?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Comece com um diagnóstico gratuito e descubra como sua empresa pode
            se tornar AI First em semanas.
          </p>
          <Button size="xl" className="bg-white text-brand-navy hover:bg-white/90" asChild>
            <Link to="/register">
              Começar diagnóstico gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
