# SectionTool Component

The `SectionTool` React component simulates a warehouse section with interactive controls for visualizing and controlling truck operations, such as **loading**, **unloading**, and **status tracking**.

---

## 🔧 Features
- Visual indicator for stock levels (by position and row)
- Buttons to simulate loading/unloading actions
- Status badge with timestamp tracking
- Expandable/collapsible UI for space optimization
- Responsive layout and accessibility-aware

---

## 🚀 Usage

### Import and Use
```tsx
import SectionTool from "@/components/SectionTool";
import { SectionFlattened } from "@/types";

const sectionData: SectionFlattened = {
  sectionName: "A1",
  contents: [100, 60, 20],
  totalCapacity: 300,
  stockedCapacity: 180,
  freeCapacity: 120,
  positionMaxCapacity: 20,
  rowLength: 5,
};

<SectionTool section={sectionData} />;
```

---

## 📘 Types
```ts
interface SectionFlattened {
  sectionName: string;
  contents: number[];
  totalCapacity: number;
  stockedCapacity: number;
  freeCapacity: number;
  positionMaxCapacity: number;
  rowLength: number;
}
```

---

## 📗 JSDoc
Each major function in the component file is internally documented with JSDoc-style comments for improved IntelliSense support.

---

## 📚 Storybook

### 📘 SectionTool.stories.tsx
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import SectionTool from "./SectionTool";
import { SectionFlattened } from "@/types";

const meta: Meta<typeof SectionTool> = {
  component: SectionTool,
  title: "Components/SectionTool",
};

export default meta;

type Story = StoryObj<typeof SectionTool>;

const exampleSection: SectionFlattened = {
  sectionName: "A1",
  contents: [80, 60, 20],
  totalCapacity: 300,
  stockedCapacity: 160,
  freeCapacity: 140,
  positionMaxCapacity: 20,
  rowLength: 5,
};

export const Default: Story = {
  args: {
    section: exampleSection,
  },
};
```

---

## 🧪 Testing Recommendations
- Simulate button presses (`Load`, `Unload`, `Reset`) and check status transitions
- Test responsive behavior across breakpoints
- Check `Last Update` reflects current timestamp

---

## 🏷️ Metadata
- **Component Name:** `SectionTool`
- **Created By:** [Your Name]
- **Last Updated:** [Recent Date]

---

## ✅ Status Legend
| Status     | Color         | Description              |
|------------|---------------|--------------------------|
| `waiting`  | Gray          | No action                |
| `loading`  | Yellow        | Loading in progress      |
| `unloading`| Blue          | Unloading in progress    |
| `complete` | Green         | Operation complete       |