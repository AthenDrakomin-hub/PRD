# KForge Commercial SaaS Architecture Spec

## Why
The user clarified the ultimate vision for KForge: It is not just a backend service, but a **commercial SaaS platform for security plugins**. To monetize the core capabilities (IP proxy, DDoS defense, etc.) running on the backend Daemon, the system needs a visual interface. 
1. **Admin Dashboard (管理端)**: A visual "Lego-like" drag-and-drop editor where administrators can compose atomic security skills into sellable products.
2. **H5 Marketing Generator (H5 生成端)**: A service that automatically generates promotional, mobile-friendly landing pages (H5) for the composed plugins to showcase their value, distribute them, and drive monetization.

## What Changes
We will expand the Monorepo architecture to include two new frontend applications under the `apps/` directory, effectively turning KForge into a full-stack SaaS platform:
- **`apps/admin`**: A React/Vite SPA using React Flow for node-based visual orchestration of security skills, alongside a dynamic Payment Configuration Panel.
- **`apps/h5-builder`**: A Next.js application for server-side rendered (SSR), highly convertible mobile marketing pages with integrated Crypto (USDT-TRC20) checkout flows.
- **`packages/shared-schema`**: A new shared package defining the JSON DSL (Domain Specific Language) that bridges the Admin's visual graph, the Daemon's execution engine, and the H5's marketing copy, including payment gateway schemas.

## Impact
- Affected specs: Monorepo structure, business model, and API Daemon routing.
- Affected code: Addition of `apps/admin`, `apps/h5-builder`, and `packages/shared-schema`.

## ADDED Requirements

### Requirement: Visual Skill Orchestration and Payment Config (Admin Dashboard)
The system SHALL provide an authenticated web dashboard with two core capabilities:
1. A visual editor allowing administrators to drag-and-drop security atomic skills (e.g., `attack.sh`, `detect.sh`) into a directed acyclic graph (DAG) pipeline, configure their parameters, and publish them as a "Plugin Product".
2. A **Dynamic Payment Gateway Configuration** panel, allowing administrators to configure crypto wallets (specifically **USDT-TRC20** addresses), Webhook callback URLs for payment confirmation, and pricing models without touching backend code.

#### Scenario: Success case
- **WHEN** an admin drags a "Multi-hop Proxy" node and connects it to an "Alert Webhook" node on the canvas, sets the price, and clicks "Publish"
- **THEN** the system generates a standard JSON DSL representing this pipeline and saves it to the database via the Daemon API.

### Requirement: H5 Promotional Page Generation
The system SHALL automatically generate a mobile-friendly, SEO-optimized landing page for every published "Plugin Product" to facilitate sharing and monetization.

#### Scenario: Success case
- **WHEN** a potential customer opens the generated H5 link (e.g., on WeChat or LinkedIn)
- **THEN** they see a beautifully rendered page showcasing the plugin's value proposition, an animated diagram of how it works, and a "Purchase/Integrate Now" call-to-action button that triggers a **USDT-TRC20 checkout flow** using the dynamically loaded payment configurations from the Admin dashboard, and upon confirmation, issues the integration API key.
