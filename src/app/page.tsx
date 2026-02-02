"use client";

import { TheStack, LayerId } from "@/components/TheStack";

export default function Home() {
  const handleLayerSelect = (layerId: LayerId) => {
    console.log("Selected layer:", layerId);
    // Navigate to deep dive page
  };

  return (
    <main>
      <TheStack
        onLayerSelect={handleLayerSelect}
        enableScroll={false}
        sectionHeight="100vh"
      />
    </main>
  );
}
