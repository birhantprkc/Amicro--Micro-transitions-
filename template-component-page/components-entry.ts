import type { ComponentItem } from "@/lib/components";

export const sampleComponentEntry: ComponentItem = {
  name: "Sample Component",
  href: "/components/samplecomponent",
  registry: "sample-component",
  description: "A customizable card component with smooth backdrop blur.",
  source: "https://github.com/Subhan-code/oxygen_ui/blob/main/components/ui/sample-component.tsx",
  preview: "/componentdemos/samplecomponent.mp4",
  dependencies: [],
  interaction: "Hover over card element to observe visual states.",
  usage: `import { SampleComponent } from "@/components/ui/sample-component";\n\nexport default function Example() {\n  return <SampleComponent title="Demo" />;\n}`,
  props: [
    {
      name: "title",
      type: "string",
      default: '"Sample Component"',
      description: "Main header text displayed inside the card.",
    },
    {
      name: "description",
      type: "string",
      default: '"A clean template component."',
      description: "Subordinate text providing extra context.",
    },
  ],
};
