import { Clapperboard, Grid2x2Plus, Layers3, Megaphone, Monitor, PanelsTopLeft } from 'lucide-react';

export const servicePaths = ['/services/videotron-outdoor/', '/services/led-indoor/', '/services/rental-led/', '/services/media-konvensional/', '/services/digital-signage/', '/services/event-production/'] as const;
export const serviceIcons = [Monitor, PanelsTopLeft, Layers3, Grid2x2Plus, Megaphone, Clapperboard] as const;
