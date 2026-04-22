# Tech Tree Refactoring and State Management Spec

## Why
The current implementation of the `TechTree` component suffers from three main technical debts:
1. **Data and UI Coupling**: The ECharts tree data is tightly coupled with hardcoded styles within the component.
2. **Bloated ECharts Configuration**: The `option` object in `TechTree.tsx` contains extensive UI styles (`itemStyle`, `lineStyle`, `color`, etc.) mixed with business logic, making it difficult to maintain or support multiple themes.
3. **Lack of Global State Integration in Visualization**: Although a Zustand store (`useStore.ts`) exists for tracking learning progress, the `TechTree` visualization does not dynamically reflect this global state (e.g., changing a node's color when a user marks it as "completed").

## What Changes
- **Data Normalization**: Separate the raw `techItems` data from the ECharts tree node generation logic.
- **Theme Configuration Extraction**: Create a dedicated `src/config/echartsTheme.ts` to manage ECharts styling (colors, line styles, fonts).
- **Zustand State Integration**: Bind the `TechTree` component to the existing Zustand store (`userProgress`) so that node styles (e.g., colors) dynamically update based on the user's learning status (`completed`, `in_progress`, `not_started`).

## Impact
- Affected specs: `TechTree` visualization.
- Affected code: 
  - `src/pages/TechTree/index.tsx` (Refactored)
  - `src/config/echartsTheme.ts` (New file)

## ADDED Requirements
### Requirement: Dynamic Visualization State
The `TechTree` nodes SHALL visually represent the user's learning progress.

#### Scenario: Success case
- **WHEN** a user marks a technology as "completed" in the detail page
- **THEN** the corresponding node in the `TechTree` automatically updates its color to the "completed" theme color defined in the theme configuration.

## MODIFIED Requirements
### Requirement: ECharts Configuration
The ECharts `option` generation MUST NOT contain hardcoded hex color codes or style objects directly within the component body. It MUST import these from a centralized theme configuration file.
