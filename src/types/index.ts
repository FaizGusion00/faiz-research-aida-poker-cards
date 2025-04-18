
export type CardType = 'risk' | 'aida';

export type AidaStage = 'attention' | 'interest' | 'desire' | 'action' | 'unassigned';

export interface Card {
  id: string;
  title: string;
  content: string;
  type: CardType;
  color: string;
  stage: AidaStage;
  createdAt: number;
  image?: string; // Base64 encoded image
}

export interface CardCollection {
  [id: string]: Card;
}

export interface BoardState {
  cards: CardCollection;
  columns: {
    [key in AidaStage]: {
      id: AidaStage;
      title: string;
      cardIds: string[];
    };
  };
}
