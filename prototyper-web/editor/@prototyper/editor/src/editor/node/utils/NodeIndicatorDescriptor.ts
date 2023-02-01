export interface NodeIndicatorDescriptor {
  name: string;
  id: string;
  state: 'hovered' | 'selected';

  remove?: () => void;
  selectParent?: () => void;
  drag?: (ref?: HTMLElement) => void;
}
