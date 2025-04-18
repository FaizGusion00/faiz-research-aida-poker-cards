
export type CardType = 'risk' | 'aida';

export type AidaStage = 'attention' | 'interest' | 'desire' | 'action' | 'unassigned';

export interface Card {
  id: string;
  content: string;
  type: CardType;
  color: string;
  stage: AidaStage;
  createdAt: number;
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
