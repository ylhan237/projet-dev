package com.agenthub.gateway.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    @GetMapping("/dashboard/overview")
    public Map<String, Object> dashboardOverview() {
        return Map.of(
            "activeConversations", 14,
            "avgResponseTimeMs", 1840,
            "resolvedToday", 63,
            "escalationRate", 12,
            "agentsOnline", 4,
            "agentStatus", List.of(
                Map.of("name", "router", "status", "active", "queue", 2),
                Map.of("name", "support", "status", "processing", "queue", 5),
                Map.of("name", "action", "status", "idle", "queue", 0),
                Map.of("name", "escalation", "status", "active", "queue", 1)
            )
        );
    }

    @GetMapping("/conversations")
    public List<Map<String, Object>> conversations() {
        return List.of(
            Map.of(
                "conversationId", "conv-2041",
                "customer", "Léa M.",
                "status", "in_progress",
                "agent", "support",
                "lastMessage", "Je ne parviens plus à me connecter au VPN.",
                "updatedAt", "2024-06-30T11:28:00Z",
                "priority", "high"
            ),
            Map.of(
                "conversationId", "conv-1987",
                "customer", "Nicolas P.",
                "status", "waiting",
                "agent", "router",
                "lastMessage", "Je veux un remboursement sur ma commande.",
                "updatedAt", "2024-06-30T11:11:00Z",
                "priority", "medium"
            ),
            Map.of(
                "conversationId", "conv-2004",
                "customer", "Sophie D.",
                "status", "resolved",
                "agent", "action",
                "lastMessage", "Le ticket a bien été créé et la demande est cloturée.",
                "updatedAt", "2024-06-30T10:49:00Z",
                "priority", "low"
            )
        );
    }

    @GetMapping(value = "/dashboard/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Map<String, Object>> dashboardEvents() {
        return Flux.interval(Duration.ofSeconds(2))
            .map(index -> Map.of(
                "event", "heartbeat",
                "timestamp", Instant.now().toString(),
                "activeConversations", 14 + (index.intValue() % 3),
                "avgResponseTimeMs", 1800 + (index.intValue() * 120)
            ));
    }
}
