# AgentHub

AgentHub est une plateforme SaaS de support client pilotée par des agents IA autonomes.

## Objectif

- répondre aux demandes clients automatiquement,
- chercher dans la base de connaissances,
- exécuter des actions de support,
- escalader vers un humain si besoin,
- exposer un tableau de bord de supervision en temps réel.

## Structure du monorepo

- `apps/frontend` : interface web Next.js
- `apps/api-gateway` : API gateway Spring Boot
- `apps/agent-orchestrator` : orchestration des agents IA
- `apps/knowledge-service` : base de connaissance et RAG
- `apps/action-service` : actions métiers
- `deploy` : configuration Kubernetes / Helm / ArgoCD
- `.github/workflows` : CI/CD

## Livrables validés

### Phase 1 - Fondations
- monorepo défini et structuré
- services bootstrappés
- Docker Compose pour le dev local
- CI de base préparée

### Phase 2 - Knowledge Base & RAG
- service FastAPI de connaissance
- upload de documents et stockage interne
- découpage en chunks
- recherche sémantique avec scoring
- interface frontend de démonstration

### Phase 3 - Multi-Agent Runtime
- chargement des agents depuis les fichiers Markdown
- routage automatique selon l’intention du client
- exécution contextuelle par agent
- logique d’escalade humaine

### Phase 4 - Temps réel & dashboard
- API de métriques d’activité
- liste des conversations actives
- websocket de diffusion temps réel
- dashboard frontend de supervision

## Démarrage rapide

```bash
docker compose up --build
```

## Accès local

- Frontend : http://localhost:3000
- API Gateway : http://localhost:8080
- Agent Orchestrator : http://localhost:8001
- Knowledge Service : http://localhost:8002
- Action Service : http://localhost:8081

## Vérifications utiles

```bash
# Gateway
cd apps/api-gateway && ./mvnw test

# Knowledge service
cd apps/knowledge-service && . .venv/bin/activate && python -m pytest tests/test_main.py -q

# Agent orchestrator
cd apps/agent-orchestrator && . .venv/bin/activate && python -m pytest tests/test_main.py -q
```

## Prochaine étape

La prochaine phase est la Phase 5, avec l’infrastructure Azure & GitOps.
