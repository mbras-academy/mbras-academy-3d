// MBRAS Academy - The Stack
// Layer Visual Selector Component

import { LayerId, LayerVisualProps } from "./types";
import {
  SignalParticles,
  StructureGrid,
  ControlLoop,
  ScaleReplication,
} from "./visuals";

interface LayerVisualSelectorProps extends LayerVisualProps {
  layerId: LayerId;
}

export function LayerVisual({
  layerId,
  isActive,
  intensity,
}: LayerVisualSelectorProps) {
  switch (layerId) {
    case "signal":
      return <SignalParticles isActive={isActive} intensity={intensity} />;
    case "structure":
      return <StructureGrid isActive={isActive} intensity={intensity} />;
    case "control":
      return <ControlLoop isActive={isActive} intensity={intensity} />;
    case "scale":
      return <ScaleReplication isActive={isActive} intensity={intensity} />;
    default:
      return null;
  }
}
