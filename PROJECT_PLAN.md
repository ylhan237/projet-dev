# AgentHub - Plateforme de Support Client Autonome avec IA Agentique

## Vision du Projet

**AgentHub** est une plateforme SaaS de support client propulsee par des agents IA autonomes.
Les agents sont definis comme des fichiers Markdown (pattern agent-as-config), comprennent les
demandes clients, recherchent dans la base de connaissances (RAG), executent des actions
(remboursement, creation de ticket, escalade humaine) et apprennent des interactions passees.
Le tout avec un dashboard temps reel pour les superviseurs.

> **Pourquoi ce projet impressionne un recruteur ?**
> - Stack 100% moderne et en production dans les entreprises en 2025-2026
> - Architecture multi-agents (agentic AI) - la competence la plus demandee actuellement
> - Agents definis en Markdown (agent-as-config) - pattern moderne et maintenable
> - Deploiement complet sur Azure avec Kubernetes + GitOps (ArgoCD)
> - Backend Spring Boot (Java 21) - le framework enterprise #1 en Europe
> - Monitoring, observabilite, CI/CD - maturite DevOps complete
> - Monorepo propre avec separation claire des responsabilites

---

## Architecture Globale

```
                        ┌──────────────────────────────┐
                        │     Azure Front Door (CDN)    │
                        └──────────────┬───────────────┘
                                       │
                        ┌──────────────▼───────────────┐
                        │  Azure Application Gateway    │
                        │  (Ingress Controller)         │
                        └──┬───────────────────────┬───┘
                           │                       │
              ┌────────────▼─────────┐  ┌─────────▼──────────────┐
              │   Frontend (Next.js) │  │  API Gateway            │
              │   AKS Pod           │  │  (Spring Boot / Java 21) │
              └──────────────────────┘  │  AKS Pod                │
                                        └─────────┬──────────────┘
                                                  │
                           ┌──────────────────────┼──────────────────────┐
                           │                      │                      │
              ┌────────────▼─────────┐ ┌─────────▼──────────┐ ┌────────▼──────────┐
              │  Agent Orchestrator  │ │  Knowledge Service  │ │  Action Service   │
              │  (Python/LangGraph)  │ │  (Python/FastAPI)   │ │  (Spring Boot)    │
              │  AKS Pod            │ │  AKS Pod            │ │  AKS Pod          │
              └────────────┬─────────┘ └─────────┬──────────┘ └────────┬──────────┘
                           │                     │                     │
              ┌────────────▼─────────────────────▼─────────────────────▼──────────┐
              │                        Data Layer (Azure)                          │
              │  ┌───────────────────┐  ┌──────────────┐  ┌────────────────────┐  │
              │  │ Azure Database    │  │ pgvector     │  │ Azure Cache for    │  │
              │  │ for PostgreSQL    │  │ (embeddings) │  │ Redis              │  │
              │  └───────────────────┘  └──────────────┘  └────────────────────┘  │
              │  ┌───────────────────┐  ┌──────────────┐                          │
              │  │ Azure Blob        │  │ Azure        │                          │
              │  │ Storage           │  │ Service Bus  │                          │
              │  │ (documents)       │  │ (event queue)│                          │
              │  └───────────────────┘  └──────────────┘                          │
              └───────────────────────────────────────────────────────────────────┘

              ┌───────────────────────────────────────────────────────────────────┐
              │                     GitOps Layer                                  │
              │  GitHub Actions (CI) ──► ACR ──► ArgoCD ──► AKS                  │
              │  (build & test)       (push)   (sync)     (deploy)               │
              └───────────────────────────────────────────────────────────────────┘
```

---

## Stack Technique

### Frontend
| Technologie | Usage |
|---|---|
| **Next.js 15** (App Router) | Framework React SSR/SSG |
| **TypeScript** | Typage statique |
| **Tailwind CSS v4** | Styling utility-first |
| **shadcn/ui** | Composants UI accessibles |
| **TanStack Query** | Gestion du state serveur |
| **Socket.io Client** | Temps reel (conversations live) |
| **Recharts** | Visualisation dashboard analytics |

### API Gateway (Spring Boot)
| Technologie | Usage |
|---|---|
| **Java 21** (LTS) | Langage principal backend |
| **Spring Boot 3.3+** | Framework enterprise |
| **Spring WebFlux** | API reactive / WebSocket |
| **Spring Security + JWT** | Authentification & autorisation |
| **Spring Data JPA** | ORM PostgreSQL |
| **Hibernate 6** | Mapping objet-relationnel |
| **Micrometer + OpenTelemetry** | Tracing distribue & metriques |
| **MapStruct** | Mapping DTO <-> Entity |
| **Lombok** | Reduction du boilerplate |

### Agent Orchestrator (Python)
| Technologie | Usage |
|---|---|
| **Python 3.12+** | Runtime agents IA |
| **LangGraph** | Framework multi-agents (state machines) |
| **LangChain** | Chaines LLM, outils, memoire |
| **FastAPI** | API HTTP pour le service |
| **Claude API (Anthropic)** | LLM principal |
| **Pydantic v2** | Validation des schemas |
| **pgvector** | Recherche vectorielle (RAG) |

### Knowledge Service (Python)
| Technologie | Usage |
|---|---|
| **FastAPI** | API HTTP |
| **sentence-transformers** | Generation d'embeddings |
| **Unstructured** | Parsing de documents (PDF, HTML, etc.) |
| **pgvector** | Stockage et recherche de vecteurs |

### Action Service (Spring Boot)
| Technologie | Usage |
|---|---|
| **Java 21** | Execution des actions agents |
| **Spring Boot 3.3+** | Framework enterprise |
| **Azure SDK for Java** | Interactions services Azure |
| **Spring AMQP** | Consumer Azure Service Bus |

### Infrastructure & DevOps
| Technologie | Usage |
|---|---|
| **Terraform** | Infrastructure as Code (provisioning Azure) |
| **Azure Kubernetes Service (AKS)** | Orchestration conteneurs |
| **Azure Database for PostgreSQL** | Base de donnees + pgvector |
| **Azure Cache for Redis** | Cache + Pub/Sub temps reel |
| **Azure Blob Storage** | Stockage documents knowledge base |
| **Azure Service Bus** | File d'attente evenementielle |
| **Azure Front Door** | CDN + WAF pour le frontend |
| **Azure Application Gateway** | Ingress controller AKS |
| **Azure Container Registry (ACR)** | Registre d'images Docker |
| **Azure Key Vault** | Gestion des secrets |
| **Docker** | Conteneurisation |
| **Helm** | Packaging Kubernetes manifests |
| **ArgoCD** | GitOps - deploiement declaratif |
| **GitHub Actions** | CI (build, test, push images) |
| **OpenTelemetry + Grafana** | Monitoring & observabilite |
| **Prometheus** | Metriques Kubernetes & applicatives |

---

## Structure du Monorepo

```
agenthub/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # Lint, test, build sur chaque PR
│       ├── build-push.yml          # Build images Docker + push ACR (merge main)
│       └── infra-plan.yml          # Terraform plan sur PR infra
│
├── apps/
│   ├── frontend/                   # Next.js 15 + TypeScript
│   │   ├── src/
│   │   │   ├── app/                # App Router (pages, layouts)
│   │   │   │   ├── (auth)/         # Routes authentification
│   │   │   │   ├── (dashboard)/    # Dashboard superviseur
│   │   │   │   │   ├── conversations/
│   │   │   │   │   ├── analytics/
│   │   │   │   │   ├── knowledge-base/
│   │   │   │   │   └── agents/
│   │   │   │   └── chat/           # Interface chat client
│   │   │   ├── components/         # Composants reutilisables
│   │   │   │   ├── ui/             # shadcn/ui components
│   │   │   │   ├── chat/           # ChatWindow, MessageBubble, TypingIndicator
│   │   │   │   ├── dashboard/      # KPICard, ConversationList, AgentStatus
│   │   │   │   └── knowledge/      # DocumentUploader, SearchPreview
│   │   │   ├── hooks/              # Custom hooks (useChat, useAgent, useRealtime)
│   │   │   ├── lib/                # Utils, API client, socket config
│   │   │   └── types/              # Types TypeScript partages
│   │   ├── Dockerfile
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api-gateway/                # Spring Boot - Point d'entree API
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/com/agenthub/gateway/
│   │   │   │   │   ├── GatewayApplication.java
│   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── ConversationController.java
│   │   │   │   │   │   ├── AuthController.java
│   │   │   │   │   │   ├── KnowledgeController.java
│   │   │   │   │   │   └── WebSocketHandler.java
│   │   │   │   │   ├── config/
│   │   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   │   ├── WebSocketConfig.java
│   │   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   │   └── OpenTelemetryConfig.java
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── ConversationDTO.java
│   │   │   │   │   │   ├── MessageDTO.java
│   │   │   │   │   │   └── UserDTO.java
│   │   │   │   │   ├── entity/
│   │   │   │   │   │   ├── Conversation.java
│   │   │   │   │   │   ├── Message.java
│   │   │   │   │   │   └── User.java
│   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── ConversationRepository.java
│   │   │   │   │   │   ├── MessageRepository.java
│   │   │   │   │   │   └── UserRepository.java
│   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── ConversationService.java
│   │   │   │   │   │   ├── AuthService.java
│   │   │   │   │   │   └── AgentClientService.java
│   │   │   │   │   ├── security/
│   │   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   │   │   └── exception/
│   │   │   │   │       ├── GlobalExceptionHandler.java
│   │   │   │   │       └── ApiException.java
│   │   │   │   └── resources/
│   │   │   │       ├── application.yml
│   │   │   │       ├── application-dev.yml
│   │   │   │       ├── application-staging.yml
│   │   │   │       └── application-prod.yml
│   │   │   └── test/
│   │   │       └── java/com/agenthub/gateway/
│   │   │           ├── controller/
│   │   │           ├── service/
│   │   │           └── integration/
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── mvnw
│   │
│   ├── agent-orchestrator/         # Python - Cerveau IA agentique
│   │   ├── src/
│   │   │   ├── agents/             # Code Python d'orchestration
│   │   │   │   ├── loader.py             # Charge les agents depuis les .md
│   │   │   │   ├── router_agent.py       # Logique routage (utilise router.md)
│   │   │   │   ├── support_agent.py      # Logique support (utilise support.md)
│   │   │   │   ├── action_agent.py       # Logique action (utilise action.md)
│   │   │   │   └── escalation_agent.py   # Logique escalade (utilise escalation.md)
│   │   │   ├── agent-definitions/        # **AGENTS DEFINIS EN MARKDOWN**
│   │   │   │   ├── router.md             # Personnalite, regles, intent mapping
│   │   │   │   ├── support.md            # Comportement RAG, ton, limites
│   │   │   │   ├── action.md             # Actions autorisees, conditions, workflow
│   │   │   │   └── escalation.md         # Criteres escalade, format resume, priorites
│   │   │   ├── graphs/
│   │   │   │   └── support_graph.py      # LangGraph state machine
│   │   │   ├── tools/
│   │   │   │   ├── knowledge_search.py   # Outil RAG
│   │   │   │   ├── ticket_create.py      # Outil creation ticket
│   │   │   │   ├── refund_process.py     # Outil remboursement
│   │   │   │   └── human_handoff.py      # Outil escalade humaine
│   │   │   ├── memory/
│   │   │   │   └── conversation_memory.py # Memoire conversationnelle
│   │   │   └── api/
│   │   │       ├── main.py               # FastAPI app
│   │   │       └── routes.py             # Endpoints
│   │   ├── tests/
│   │   │   ├── test_loader.py            # Tests du chargement des .md
│   │   │   ├── test_router.py
│   │   │   ├── test_support.py
│   │   │   └── test_graph.py
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── requirements.txt
│   │
│   ├── knowledge-service/          # Python - Gestion base de connaissances
│   │   ├── src/
│   │   │   ├── ingestion/
│   │   │   │   ├── document_parser.py    # Parse PDF, HTML, Markdown
│   │   │   │   ├── chunker.py            # Decoupe en chunks
│   │   │   │   └── embedder.py           # Generation embeddings
│   │   │   ├── search/
│   │   │   │   └── vector_search.py      # Recherche semantique pgvector
│   │   │   └── api/
│   │   │       ├── main.py
│   │   │       └── routes.py
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   └── action-service/             # Spring Boot - Execution des actions
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/agenthub/action/
│       │   │   │   ├── ActionServiceApplication.java
│       │   │   │   ├── controller/
│       │   │   │   │   └── ActionController.java
│       │   │   │   ├── executor/
│       │   │   │   │   ├── RefundExecutor.java
│       │   │   │   │   ├── TicketExecutor.java
│       │   │   │   │   └── NotificationExecutor.java
│       │   │   │   ├── listener/
│       │   │   │   │   └── ServiceBusListener.java
│       │   │   │   └── config/
│       │   │   │       └── AzureServiceBusConfig.java
│       │   │   └── resources/
│       │   │       └── application.yml
│       │   └── test/
│       ├── Dockerfile
│       ├── pom.xml
│       └── mvnw
│
├── agents/                         # **DEFINITIONS DES AGENTS EN MARKDOWN**
│   ├── README.md                   # Documentation du format agent
│   ├── router.md                   # Agent routeur
│   ├── support.md                  # Agent support
│   ├── action.md                   # Agent action
│   └── escalation.md              # Agent escalade
│
├── deploy/                         # **GITOPS - Manifests Kubernetes + Helm**
│   ├── helm/
│   │   └── agenthub/              # Chart Helm principal
│   │       ├── Chart.yaml
│   │       ├── values.yaml                 # Valeurs par defaut
│   │       ├── values-staging.yaml         # Override staging
│   │       ├── values-production.yaml      # Override production
│   │       └── templates/
│   │           ├── _helpers.tpl
│   │           ├── frontend/
│   │           │   ├── deployment.yaml
│   │           │   ├── service.yaml
│   │           │   └── hpa.yaml
│   │           ├── api-gateway/
│   │           │   ├── deployment.yaml
│   │           │   ├── service.yaml
│   │           │   └── hpa.yaml
│   │           ├── agent-orchestrator/
│   │           │   ├── deployment.yaml
│   │           │   ├── service.yaml
│   │           │   └── hpa.yaml
│   │           ├── knowledge-service/
│   │           │   ├── deployment.yaml
│   │           │   ├── service.yaml
│   │           │   └── hpa.yaml
│   │           ├── action-service/
│   │           │   ├── deployment.yaml
│   │           │   ├── service.yaml
│   │           │   └── hpa.yaml
│   │           ├── ingress.yaml
│   │           └── configmap.yaml
│   │
│   └── argocd/                     # Configuration ArgoCD
│       ├── project.yaml            # ArgoCD AppProject
│       ├── app-staging.yaml        # ArgoCD Application staging
│       └── app-production.yaml     # ArgoCD Application production
│
├── infra/                          # Terraform - Infrastructure Azure
│   ├── modules/
│   │   ├── networking/             # VNet, subnets, NSG
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── aks/                    # Azure Kubernetes Service
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── database/               # Azure Database for PostgreSQL + pgvector
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── cache/                  # Azure Cache for Redis
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── storage/                # Azure Blob Storage + Front Door
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── messaging/              # Azure Service Bus
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── registry/               # Azure Container Registry
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── keyvault/               # Azure Key Vault
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   └── monitoring/             # Azure Monitor, Grafana, Prometheus
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       └── outputs.tf
│   ├── environments/
│   │   ├── staging/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── terraform.tfvars
│   │   └── production/
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       └── terraform.tfvars
│   └── backend.tf                  # Azure Storage backend pour le state Terraform
│
├── docker-compose.yml              # Dev local : tous les services
├── docker-compose.override.yml     # Overrides pour dev (hot reload, ports)
├── Makefile                        # Commandes raccourcies (make dev, make test, etc.)
├── .env.example                    # Variables d'environnement template
└── README.md                       # Documentation projet
```

---

## Agents IA en Markdown - Le Pattern Agent-as-Config

### Principe

Chaque agent est defini dans un fichier `.md` qui contient sa personnalite, ses regles,
ses outils disponibles, et son comportement. Le code Python charge ces fichiers et les
injecte comme system prompt dans le LLM. Cela permet de :

- **Modifier le comportement d'un agent sans toucher au code**
- **Versionner les agents avec Git** (diff lisible, review facile)
- **Permettre aux non-developpeurs** (product, support) de contribuer aux prompts
- **Tester differentes configurations** facilement (A/B testing de prompts)

### Format des fichiers Agent `.md`

Chaque fichier agent suit cette structure avec un frontmatter YAML :

```markdown
---
name: router
description: Agent de routage des messages clients
model: claude-sonnet-5
temperature: 0.1
max_tokens: 1024
tools:
  - classify_intent
  - get_conversation_history
---

# Agent Routeur

## Role
Tu es l'agent de routage d'AgentHub. Tu recois chaque nouveau message client
et tu determines quel agent specialise doit le traiter.

## Regles
1. Analyse le message et le contexte de la conversation
2. Classifie l'intent parmi : `question`, `action_request`, `complaint`, `escalation`
3. Si le client mentionne un remboursement ou une modification -> `action_request`
4. Si le client est clairement enerve ou demande un humain -> `escalation`
5. Si c'est une question sur un produit ou un service -> `question`
6. En cas de doute, privilegie `question` (le support agent peut escalader)

## Format de sortie
Reponds toujours en JSON :
{
  "intent": "question | action_request | complaint | escalation",
  "confidence": 0.0-1.0,
  "reason": "explication courte de la classification",
  "extracted_entities": {
    "order_id": "...",
    "product": "...",
    "sentiment": "positive | neutral | negative"
  }
}

## Exemples
**Message**: "J'ai commande il y a 3 jours et toujours rien recu"
**Reponse**: {"intent": "complaint", "confidence": 0.85, ...}

**Message**: "Je veux me faire rembourser ma commande #12345"
**Reponse**: {"intent": "action_request", "confidence": 0.95, ...}
```

### Loader Python - Comment les .md deviennent des agents

```python
import yaml
import frontmatter
from pathlib import Path
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import SystemMessage

class AgentLoader:
    def __init__(self, agents_dir: str = "agents/"):
        self.agents_dir = Path(agents_dir)

    def load_agent(self, agent_name: str) -> dict:
        """Charge un agent depuis son fichier .md"""
        md_path = self.agents_dir / f"{agent_name}.md"
        post = frontmatter.load(str(md_path))

        return {
            "name": post.metadata["name"],
            "description": post.metadata["description"],
            "model": post.metadata.get("model", "claude-sonnet-5"),
            "temperature": post.metadata.get("temperature", 0.3),
            "max_tokens": post.metadata.get("max_tokens", 2048),
            "tools": post.metadata.get("tools", []),
            "system_prompt": post.content,  # Le contenu Markdown = system prompt
        }

    def create_llm(self, agent_config: dict) -> ChatAnthropic:
        """Cree une instance LLM configuree pour l'agent"""
        return ChatAnthropic(
            model=agent_config["model"],
            temperature=agent_config["temperature"],
            max_tokens=agent_config["max_tokens"],
        )

    def load_all(self) -> dict:
        """Charge tous les agents du dossier"""
        agents = {}
        for md_file in self.agents_dir.glob("*.md"):
            if md_file.name == "README.md":
                continue
            agent = self.load_agent(md_file.stem)
            agents[agent["name"]] = agent
        return agents
```

### Les 4 fichiers agents

**`agents/router.md`** - Classifie les intentions et route les messages
**`agents/support.md`** - Repond aux questions via RAG + knowledge base
**`agents/action.md`** - Execute les actions (remboursement, ticket, modification)
**`agents/escalation.md`** - Gere le transfert vers un humain avec contexte

---

## Systeme Multi-Agents (Agentic AI) - Le Coeur du Projet

### Architecture des Agents avec LangGraph

```
              Message Client
                    │
                    ▼
           ┌───────────────┐
           │  Router Agent  │  router.md → Analyse l'intent
           │  (classificateur)│
           └───────┬───────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
  ┌───────────┐ ┌──────────┐ ┌──────────────┐
  │  Support   │ │  Action  │ │  Escalation  │
  │  Agent     │ │  Agent   │ │  Agent       │
  │ support.md │ │action.md │ │escalation.md │
  │            │ │          │ │              │
  │ - RAG      │ │ - Refund │ │ - Handoff    │
  │ - FAQ      │ │ - Ticket │ │ - Priority   │
  │ - History  │ │ - Update │ │ - Notify     │
  └───────────┘ └──────────┘ └──────────────┘
```

### Fonctionnement detaille

**1. Router Agent** (`router.md`) - Le dispatcher intelligent
- Recoit chaque message client
- Classifie l'intent : `question`, `action_request`, `complaint`, `escalation`
- Route vers l'agent specialise
- Gere le contexte de la conversation

**2. Support Agent** (`support.md`) - L'expert connaissances
- Utilise le RAG (Retrieval Augmented Generation) pour chercher dans la knowledge base
- Accede a l'historique des conversations du client
- Genere des reponses contextuelles et precises
- Detecte quand il ne sait pas et escalade

**3. Action Agent** (`action.md`) - L'executant
- Interprete les demandes d'action (remboursement, modification commande, etc.)
- Verifie les conditions prealables (droits, eligibilite)
- Execute via l'Action Service (Spring Boot)
- Confirme l'execution au client

**4. Escalation Agent** (`escalation.md`) - Le superviseur
- Detecte les situations critiques (client enerve, cas complexe)
- Prepare un resume pour l'agent humain
- Effectue le handoff en temps reel via WebSocket
- Notifie le superviseur sur le dashboard

### Graph LangGraph avec chargement des agents .md

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict
from langchain_core.messages import BaseMessage

class ConversationState(TypedDict):
    messages: list[BaseMessage]
    intent: str
    context: dict
    actions_taken: list[str]
    should_escalate: bool

# Charger les agents depuis les fichiers .md
loader = AgentLoader(agents_dir="agents/")
agents = loader.load_all()

# Construire le graph
graph = StateGraph(ConversationState)

graph.add_node("router", create_node(agents["router"]))
graph.add_node("support", create_node(agents["support"]))
graph.add_node("action", create_node(agents["action"]))
graph.add_node("escalation", create_node(agents["escalation"]))

graph.set_entry_point("router")

graph.add_conditional_edges("router", route_by_intent, {
    "question": "support",
    "action_request": "action",
    "escalation": "escalation",
})

graph.add_conditional_edges("support", check_escalation, {
    "escalate": "escalation",
    "done": END,
})

graph.add_conditional_edges("action", check_action_result, {
    "success": END,
    "failure": "escalation",
})

graph.add_edge("escalation", END)

app = graph.compile()
```

---

## GitOps avec ArgoCD - Le Pipeline de Deploiement

### Flux GitOps Complet

```
  Developpeur                    GitHub                      Azure
  ──────────                    ──────                      ─────
       │                           │                          │
  1.   │── git push ──────────────►│                          │
       │                           │                          │
  2.   │                    GitHub Actions                    │
       │                    (CI Pipeline)                     │
       │                    - lint & test                     │
       │                    - build Docker images             │
       │                    - push vers ACR ─────────────────►│ Azure Container
       │                    - update image tag                │ Registry (ACR)
       │                      dans deploy/helm/               │
       │                           │                          │
  3.   │                           │◄──── ArgoCD surveille ───│ ArgoCD
       │                           │      le repo Git         │ (dans AKS)
       │                           │                          │
  4.   │                           │      ArgoCD detecte ────►│ AKS Cluster
       │                           │      le changement       │ - kubectl apply
       │                           │      de tag et           │ - rolling update
       │                           │      sync automatique    │ - health check
       │                           │                          │
  5.   │◄── notification ─────────│                          │
       │    (Slack / GitHub)       │                          │
```

### Principes GitOps appliques

1. **Git = Source of Truth** : L'etat desire du cluster est dans `deploy/helm/`
2. **Pull-based deployment** : ArgoCD pull les changements (pas de push vers le cluster)
3. **Reconciliation automatique** : ArgoCD corrige tout drift entre Git et le cluster
4. **Audit trail** : Chaque deploiement = un commit Git (tracable, reversible)
5. **Rollback instantane** : `git revert` + ArgoCD sync = rollback en production

### Configuration ArgoCD

```yaml
# deploy/argocd/app-staging.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: agenthub-staging
  namespace: argocd
spec:
  project: agenthub
  source:
    repoURL: https://github.com/<user>/agenthub
    targetRevision: main
    path: deploy/helm/agenthub
    helm:
      valueFiles:
        - values-staging.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: agenthub-staging
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

---

## Plan de Developpement - 6 Phases

### Phase 1 : Fondations (Semaine 1-2)
**Objectif** : Setup du monorepo, CI de base, dev local fonctionnel

- [ ] Initialiser le monorepo avec la structure de dossiers
- [ ] Setup Docker Compose pour le dev local (PostgreSQL, Redis, pgvector)
- [ ] Creer le frontend Next.js 15 avec TypeScript + Tailwind + shadcn/ui
- [ ] Creer l'API Gateway Spring Boot (Java 21, Spring WebFlux, structure de base)
- [ ] Configurer Spring Security avec JWT (authentification / autorisation)
- [ ] Creer le squelette FastAPI pour l'agent-orchestrator et le knowledge-service
- [ ] Creer le squelette Spring Boot pour l'action-service
- [ ] Setup GitHub Actions CI : lint + tests sur chaque PR
- [ ] Configurer les Dockerfiles multi-stage pour chaque service
- [ ] Initialiser les fichiers agents `.md` (router, support, action, escalation)

**Livrables** : Monorepo fonctionnel, docker-compose up lance tout, CI verte

---

### Phase 2 : Knowledge Base & RAG (Semaine 3-4)
**Objectif** : Ingestion de documents et recherche semantique fonctionnelle

- [ ] Configurer PostgreSQL avec l'extension pgvector
- [ ] Implementer le document parser (PDF, Markdown, HTML)
- [ ] Implementer le chunking strategy (recursive text splitter)
- [ ] Implementer la generation d'embeddings (sentence-transformers)
- [ ] Implementer la recherche vectorielle (cosine similarity via pgvector)
- [ ] Creer l'API REST du knowledge-service (upload, search, list)
- [ ] Creer l'UI d'upload de documents sur le frontend (drag & drop)
- [ ] Creer l'UI de preview de recherche (tester la qualite du RAG)

**Livrables** : On peut uploader des docs et faire des recherches semantiques

---

### Phase 3 : Systeme Multi-Agents (Semaine 5-7)
**Objectif** : Les agents IA fonctionnent de bout en bout

- [ ] Implementer le AgentLoader (charge les .md en system prompts)
- [ ] Rediger les fichiers agents .md complets (router, support, action, escalation)
- [ ] Configurer le client Claude API (Anthropic SDK)
- [ ] Implementer le Router Agent (classification d'intent depuis router.md)
- [ ] Implementer le Support Agent (RAG + generation depuis support.md)
- [ ] Implementer l'Action Agent (tool calling depuis action.md)
- [ ] Implementer l'Escalation Agent (handoff depuis escalation.md)
- [ ] Implementer le graph LangGraph (state machine multi-agents)
- [ ] Implementer la memoire conversationnelle (historique par session)
- [ ] Implementer l'Action Service Spring Boot (refund, ticket, notification)
- [ ] Connecter l'Action Service a Azure Service Bus (consumer/producer)
- [ ] Ecrire les tests unitaires et d'integration des agents
- [ ] Connecter le tout : message client -> router -> agent -> reponse

**Livrables** : Un message client est traite par le bon agent et retourne une reponse

---

### Phase 4 : Interface Temps Reel (Semaine 8-9)
**Objectif** : Chat live et dashboard superviseur

- [ ] Implementer les WebSockets (Spring WebFlux WebSocketHandler)
- [ ] Creer le ChatWindow component (bulles, typing indicator, streaming)
- [ ] Implementer le streaming des reponses agent (SSE via Spring WebFlux)
- [ ] Creer le dashboard superviseur :
  - [ ] Liste des conversations actives en temps reel
  - [ ] Vue detaillee d'une conversation (messages + metadata agent)
  - [ ] KPIs : temps de reponse moyen, taux de resolution, satisfaction
  - [ ] Statut des agents (actif, en traitement, erreur)
- [ ] Implementer la prise en main humaine (superviseur rejoint une conversation)
- [ ] Implementer les notifications (escalade, erreur agent)

**Livrables** : Interface chat fonctionnelle + dashboard superviseur temps reel

---

### Phase 5 : Infrastructure Azure & GitOps (Semaine 10-12)
**Objectif** : Deploiement complet sur Azure avec Terraform + ArgoCD

- [ ] Ecrire les modules Terraform :
  - [ ] Networking : VNet, subnets, NSG (Network Security Groups)
  - [ ] AKS : Cluster Kubernetes, node pools, RBAC
  - [ ] Database : Azure Database for PostgreSQL avec pgvector
  - [ ] Cache : Azure Cache for Redis
  - [ ] Storage : Azure Blob Storage + Azure Front Door (CDN)
  - [ ] Messaging : Azure Service Bus (queues pour actions async)
  - [ ] Registry : Azure Container Registry (ACR)
  - [ ] Secrets : Azure Key Vault
  - [ ] Monitoring : Azure Monitor + workspace pour Grafana
- [ ] Configurer les environnements staging et production
- [ ] Creer le Helm chart avec templates pour chaque service
- [ ] Creer les values-staging.yaml et values-production.yaml
- [ ] Installer et configurer ArgoCD sur le cluster AKS
- [ ] Creer les ArgoCD Applications (staging + production)
- [ ] Setup GitHub Actions CD :
  - [ ] Build et push des images Docker vers ACR
  - [ ] Mise a jour automatique des image tags dans `deploy/helm/`
  - [ ] `terraform plan` sur PR infra (preview des changements)
  - [ ] `terraform apply` via approval manuelle
- [ ] Configurer le DNS et les certificats SSL (Azure DNS + cert-manager)
- [ ] Tester le flux GitOps complet : push -> CI -> ACR -> ArgoCD -> AKS

**Livrables** : Application deployee sur Azure staging via GitOps, ArgoCD operationnel

---

### Phase 6 : Observabilite & Production-Ready (Semaine 13-14)
**Objectif** : Monitoring, alerting, et polish final

- [ ] Integrer OpenTelemetry dans tous les services (traces distribuees)
  - [ ] Spring Boot : Micrometer + OpenTelemetry exporter
  - [ ] Python : opentelemetry-instrumentation-fastapi
  - [ ] Next.js : @vercel/otel
- [ ] Deployer Prometheus + Grafana sur AKS (via Helm)
- [ ] Configurer Grafana dashboards :
  - [ ] Latence des requetes par service (Kubernetes pods)
  - [ ] Taux d'erreur et logs structures
  - [ ] Metriques agents IA (tokens utilises, temps de reponse LLM)
  - [ ] Metriques business (conversations/jour, taux d'escalade)
  - [ ] Sante du cluster Kubernetes (CPU, RAM, pods, nodes)
- [ ] Configurer les alertes (erreur rate > seuil, latence P99, pod crashloop)
- [ ] Implementer le rate limiting sur l'API Gateway (Spring Cloud Gateway)
- [ ] Configurer liveness et readiness probes pour tous les pods
- [ ] Configurer le HorizontalPodAutoscaler (HPA) pour chaque service
- [ ] Ecrire les tests end-to-end (Playwright pour le frontend)
- [ ] Rediger le README complet avec :
  - [ ] Architecture diagram
  - [ ] Guide de setup local
  - [ ] Guide de deploiement GitOps
  - [ ] Screenshots/GIFs de demo
- [ ] Enregistrer une video demo (2-3 minutes)

**Livrables** : Application production-ready avec monitoring complet

---

## Fonctionnalites Cles pour le CV

| Feature | Technologie | Pourquoi ca impressionne |
|---|---|---|
| Multi-Agent System | LangGraph + Claude API | Agentic AI en production |
| Agent-as-Config | Fichiers .md + loader Python | Pattern moderne et maintenable |
| RAG Pipeline | pgvector + embeddings | IA appliquee a un vrai use case |
| Real-time Chat | WebSocket + SSE streaming | UX moderne |
| Backend Enterprise | Spring Boot 3 + Java 21 | Le framework #1 en entreprise EU |
| Microservices | Spring Boot + Python + Next.js | Polyvalence technique |
| GitOps | ArgoCD + Helm + AKS | DevOps maturite senior |
| Infrastructure as Code | Terraform + Azure | Cloud enterprise |
| Kubernetes | AKS + HPA + probes | Cloud-native production |
| CI/CD Pipeline | GitHub Actions + ACR + ArgoCD | Automatisation complete |
| Distributed Tracing | OpenTelemetry + Grafana + Prometheus | Observabilite production |
| Containerization | Docker + Kubernetes | Standard industrie |

---

## Comment Presenter ce Projet sur ton CV

### Titre
**AgentHub** - Plateforme SaaS de Support Client avec Agents IA Autonomes

### Description (2-3 lignes)
Plateforme de support client pilotee par des agents IA autonomes definis en Markdown
(LangGraph/Claude API) avec RAG, execution d'actions, et escalade humaine temps reel.
Architecture microservices (Spring Boot + Python + Next.js) deployee sur Azure AKS
via GitOps (ArgoCD + Terraform).

### Bullet Points Techniques
- Concu un systeme multi-agents (LangGraph) avec agents definis en Markdown (agent-as-config)
- Developpe un pipeline RAG complet (ingestion, embeddings, recherche vectorielle pgvector)
- Construit l'API Gateway en Spring Boot 3 / Java 21 avec WebSocket temps reel
- Deploye sur Azure AKS via GitOps (ArgoCD + Helm) avec Terraform pour l'IaC
- Mis en place CI/CD complet (GitHub Actions -> ACR -> ArgoCD -> AKS)
- Implemente l'observabilite distribuee (OpenTelemetry, Prometheus, Grafana)

---

## Pour Demarrer

```bash
# Cloner et lancer le dev local
git clone <repo>
cd agenthub
cp .env.example .env
make dev  # docker-compose up + migrations + seed data

# Lancer les tests
make test

# Deployer l'infra Azure (premiere fois)
cd infra/environments/staging
terraform init && terraform apply

# Installer ArgoCD sur le cluster
make argocd-install

# Deployer via GitOps (apres setup)
git push origin main  # CI build -> push ACR -> ArgoCD sync -> AKS deploy

# Rollback en production
git revert <commit> && git push  # ArgoCD sync automatiquement
```
