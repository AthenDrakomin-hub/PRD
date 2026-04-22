# KForge Plugin Architecture Spec

## Why
The user identified a core value proposition: KForge shouldn't just be a static knowledge base, but an actionable, embeddable plugin. For example, if KForge is integrated into another project running on a server, it could provide a "one-click IP protection" or "multi-hop proxy" defensive skill directly to that host project. This transforms KForge from a documentation site into a dynamic security orchestrator (Security-as-a-Service plugin).

## What Changes
- **Architecture Shift**: Introduce a backend orchestration layer (Node.js SDK / CLI Daemon) to manage Docker-based security simulations programmatically, replacing the static `scripts/run_sim.sh`.
- **Plugin Interfaces**: Design the architecture to expose KForge skills via:
  1. A Node.js SDK (`@kforge/core`) for programmatic execution.
  2. A REST/WebSocket API Daemon for cross-language integration.
  3. Embeddable UI Components (React/Web Components) for the host project's frontend.
- **State Management**: Define a strict state machine for skill execution (`IDLE` -> `PREPARING` -> `EXECUTING` -> `ANALYZING` -> `CLEANING`) to provide real-time feedback to the host project.

## Impact
- Affected specs: `SimulationsPage` (frontend) and `scripts/run_sim.sh` (backend execution).
- Affected code: New directories for the SDK/Daemon and refactored simulation scripts.

## ADDED Requirements
### Requirement: Programmatic Skill Execution (SDK)
The system SHALL provide a Node.js API to programmatically trigger, monitor, and stop security skills (e.g., Docker-compose orchestration).

#### Scenario: Success case
- **WHEN** a host project calls `kforge.executeSkill('multi-hop-proxy')`
- **THEN** the KForge SDK spins up the required Docker containers, executes the configuration scripts, and streams the real-time logs and status changes back to the host project via event listeners.

### Requirement: Embeddable UI Component
The system SHALL provide a framework-agnostic or React-based UI component that can be embedded in external dashboards to trigger KForge skills.

#### Scenario: Success case
- **WHEN** a user clicks "Enable IP Protection" on the host project's dashboard
- **THEN** the embedded KForge component visually displays the real-time terminal output and status progression of the underlying Docker execution.
