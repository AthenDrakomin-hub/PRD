# Tasks

- [x] Task 1: Create ECharts Theme Configuration (`src/config/echartsTheme.ts`)
  - [x] SubTask 1.1: Extract ECharts node colors (`itemStyle`), link colors (`lineStyle`), label styles, and tooltip styles into a reusable configuration object.
  - [x] SubTask 1.2: Define different node color themes based on the learning status (`completed`, `in_progress`, `not_started`, and `category`).

- [x] Task 2: Refactor Data Normalization and State Binding (`src/pages/TechTree/index.tsx`)
  - [x] SubTask 2.1: Import `useStore` from `src/store/useStore.ts` to access `userProgress`.
  - [x] SubTask 2.2: Refactor the `treeData` `useMemo` block to dynamically apply the correct `itemStyle` from `echartsTheme.ts` based on each node's `userProgress` status.
  - [x] SubTask 2.3: Replace hardcoded ECharts options (`tooltip`, `series`, etc.) in `TechTree.tsx` with the extracted styles from `echartsTheme.ts`.
