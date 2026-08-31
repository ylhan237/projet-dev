'use client';

import { useEffect, useMemo, useState } from 'react';

const features = [
  'Support client intelligent',
  'Agents IA spécialisés',
  'Base de connaissance RAG',
  'Actions métier automatisées',
  'Chat temps réel',
  'Dashboard superviseur',
];

const defaultDocuments = [
  {
    id: 'doc-knowledge-1',
    title: 'Politique de remboursement',
    content:
      'Les clients peuvent demander un remboursement jusqu’à 30 jours après la commande. Le service client vérifie les preuves et traite la demande dans 48 heures.',
  },
  {
    id: 'doc-knowledge-2',
    title: 'Support VPN',
    content:
      'Si le VPN ne fonctionne pas, vérifiez le mot de passe, redémarrez le client et réessayez dans 5 minutes. Une réinitialisation du certificat peut aussi être nécessaire.',
  },
];

type Conversation = {
  conversationId: string;
  customer: string;
  status: string;
  agent: string;
  lastMessage: string;
  updatedAt: string;
  priority: string;
};

type Overview = {
  activeConversations: number;
  avgResponseTimeMs: number;
  resolvedToday: number;
  escalationRate: number;
  agentsOnline: number;
  agentStatus: Array<{ name: string; status: string; queue: number }>;
};

export default function Home() {
  const [overview, setOverview] = useState<Overview>({
    activeConversations: 14,
    avgResponseTimeMs: 1840,
    resolvedToday: 63,
    escalationRate: 12,
    agentsOnline: 4,
    agentStatus: [
      { name: 'router', status: 'active', queue: 2 },
      { name: 'support', status: 'processing', queue: 5 },
      { name: 'action', status: 'idle', queue: 0 },
      { name: 'escalation', status: 'active', queue: 1 },
    ],
  });
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      conversationId: 'conv-2041',
      customer: 'Léa M.',
      status: 'in_progress',
      agent: 'support',
      lastMessage: 'Je ne parviens plus à me connecter au VPN.',
      updatedAt: '2024-06-30T11:28:00Z',
      priority: 'high',
    },
    {
      conversationId: 'conv-1987',
      customer: 'Nicolas P.',
      status: 'waiting',
      agent: 'router',
      lastMessage: 'Je veux un remboursement sur ma commande.',
      updatedAt: '2024-06-30T11:11:00Z',
      priority: 'medium',
    },
    {
      conversationId: 'conv-2004',
      customer: 'Sophie D.',
      status: 'resolved',
      agent: 'action',
      lastMessage: 'Le ticket a bien été créé et la demande est cloturée.',
      updatedAt: '2024-06-30T10:49:00Z',
      priority: 'low',
    },
  ]);
  const [query, setQuery] = useState('remboursement et support client');
  const [searchResults, setSearchResults] = useState(defaultDocuments);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: 'Bonjour, je peux vous aider sur votre demande de support.' },
    { sender: 'customer', text: 'Je n’arrive plus à me connecter au VPN.' },
    { sender: 'assistant', text: 'Je vais vérifier le statut VPN et lancer le diagnostic de connexion.' },
  ]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/dashboard/overview');
        const data = await response.json();
        setOverview(data);
      } catch (error) {
        console.error('Unable to load dashboard overview', error);
      }
    };

    const fetchConversations = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/conversations');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) setConversations(data);
      } catch (error) {
        console.error('Unable to load conversations', error);
      }
    };

    fetchOverview();
    fetchConversations();

    const stream = new EventSource('http://localhost:8080/api/dashboard/events');
    stream.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setOverview((current) => ({
        ...current,
        activeConversations: update.activeConversations,
        avgResponseTimeMs: update.avgResponseTimeMs,
      }));
    };

    return () => stream.close();
  }, []);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/ws/chat');
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.event === 'connected') {
        console.log(payload.message);
      }
    };

    return () => socket.close();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Conversations actives', value: overview.activeConversations },
      { label: 'Temps de réponse', value: `${overview.avgResponseTimeMs} ms` },
      { label: 'Résolues aujourd’hui', value: overview.resolvedToday },
      { label: 'Taux d’escalade', value: `${overview.escalationRate}%` },
    ],
    [overview],
  );

  const onSearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch('http://localhost:8002/api/documents/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 5 }),
      });
      const data = await response.json();
      setSearchResults(data.results || defaultDocuments);
    } catch (error) {
      console.error('Unable to query RAG', error);
    }
  };

  const onSendMessage = () => {
    setTyping(true);
    setChatMessages((current) => [...current, { sender: 'customer', text: 'Je veux plus de détails sur le VPN.' }]);
    setTimeout(() => {
      setChatMessages((current) => [
        ...current,
        { sender: 'assistant', text: 'Je vous propose de vérifier le mot de passe, puis de redémarrer le client et de réessayer après 5 minutes.' },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 font-bold text-slate-950">A</div>
            <div>
              <p className="text-xl font-semibold">AgentHub</p>
              <p className="text-sm text-slate-400">Support client piloté par des agents IA</p>
            </div>
          </div>
          <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-300">
            Phase 4 - Temps réel
          </span>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Dashboard superviseur</h2>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">en ligne</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {overview.agentStatus.map((agent) => (
                <div key={agent.name} className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium uppercase tracking-wide text-sky-300">{agent.name}</p>
                    <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase text-slate-300">{agent.status}</span>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">{agent.queue}</p>
                  <p className="text-xs text-slate-400">Messages en attente</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Conversations</h2>
              <span className="text-sm text-slate-400">{conversations.length} actives</span>
            </div>
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div key={conversation.conversationId} className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{conversation.customer}</p>
                    <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase text-slate-300">{conversation.priority}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{conversation.lastMessage}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{conversation.agent}</span>
                    <span>{conversation.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold text-white">Chat live</h2>
            <div className="mt-4 space-y-3 rounded-xl border border-slate-700 bg-slate-950 p-4">
              {chatMessages.map((message, index) => (
                <div
                  key={`${message.sender}-${index}`}
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    message.sender === 'assistant'
                      ? 'bg-sky-500/15 text-sky-100'
                      : 'ml-auto bg-slate-800 text-slate-100'
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {typing && <div className="text-xs text-slate-400">L’agent rédige une réponse…</div>}
            </div>
            <div className="mt-4 flex gap-3">
              <input
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none placeholder:text-slate-500"
                placeholder="Écrivez votre message..."
              />
              <button
                type="button"
                onClick={onSendMessage}
                className="rounded-xl bg-sky-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-sky-400"
              >
                Envoyer
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Base de connaissances</h2>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">RAG actif</span>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none placeholder:text-slate-500"
              placeholder="Ex: remboursement et support client"
            />
            <button
              type="button"
              onClick={onSearch}
              className="mt-4 rounded-xl border border-slate-700 px-4 py-2 font-medium text-slate-100 transition hover:border-slate-500"
            >
              Rechercher
            </button>
            <div className="mt-6 space-y-4">
              {searchResults.map((document) => (
                <div key={document.id} className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                  <p className="text-sky-300">{document.title}</p>
                  <p className="mt-2 text-sm text-slate-300">{document.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-xl font-semibold text-white">Fonctionnalités</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 h-10 w-10 rounded-lg bg-sky-500/15" />
                <h3 className="text-lg font-semibold text-white">{feature}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
