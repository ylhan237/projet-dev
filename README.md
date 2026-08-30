# AgentHub

AgentHub est une plateforme SaaS de support client pilotée par des agents IA autonomes.

## Objectif

- répondre aux demandes clients automatiquement,
- chercher dans la base de connaissances,
- exécuter des actions de support,
- escalader vers un humain si besoin,
- exposer un tableau de bord de supervision.

## Structure du monorepo

- `apps/frontend` : interface web Next.js
- `apps/api-gateway` : API gateway Spring Boot
- `apps/agent-orchestrator` : orchestration des agents IA
- `apps/knowledge-service` : base de connaissance et RAG
- `apps/action-service` : actions métiers
- `deploy` : configuration Kubernetes / Helm / ArgoCD
- `.github/workflows` : CI/CD

## Démarrage rapide

```bash
docker compose up --build
```

## Phase actuelle

Phase 1 - Fondations : structure monorepo, base de dev local, services vides prêts à développer.
