
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import CardItem from './CardItem';
import CardForm from './CardForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, BoardState, AidaStage } from '../types';
import { getStageColor } from '../utils/colors';
import { useIsMobile } from '@/hooks/use-mobile';

interface CardBoardProps {
  boardState: BoardState;
  onBoardChange: (newState: BoardState) => void;
}

const CardBoard: React.FC<CardBoardProps> = ({ boardState, onBoardChange }) => {
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const isMobile = useIsMobile();
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Check if the card was dropped outside any droppable area
    if (!destination) return;
    
    // Check if the card was dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    // Get the source and destination columns
    const sourceColumn = boardState.columns[source.droppableId as AidaStage];
    const destColumn = boardState.columns[destination.droppableId as AidaStage];
    
    // Create a new array of card IDs for the source column
    const sourceCardIds = [...sourceColumn.cardIds];
    // Remove the card from the source position
    sourceCardIds.splice(source.index, 1);
    
    // Create a new array of card IDs for the destination column
    const destCardIds = [...destColumn.cardIds];
    // Insert the card at the destination position
    destCardIds.splice(destination.index, 0, draggableId);
    
    // Update the card's stage if it changed
    let updatedCards = { ...boardState.cards };
    if (source.droppableId !== destination.droppableId) {
      const newStage = destination.droppableId as AidaStage;
      updatedCards = {
        ...updatedCards,
        [draggableId]: {
          ...updatedCards[draggableId],
          stage: newStage,
          // Update color if moved to an AIDA section
          color: newStage !== 'unassigned' ? getStageColor(newStage) : updatedCards[draggableId].color
        }
      };
    }
    
    // Create a new board state with the updated columns
    const newBoardState: BoardState = {
      cards: updatedCards,
      columns: {
        ...boardState.columns,
        [source.droppableId as AidaStage]: {
          ...sourceColumn,
          cardIds: sourceCardIds
        },
        [destination.droppableId as AidaStage]: {
          ...destColumn,
          cardIds: destCardIds
        }
      }
    };
    
    // Update the board state
    onBoardChange(newBoardState);
  };
  
  const handleEditCard = (id: string) => {
    setEditingCard(boardState.cards[id]);
  };
  
  const handleDeleteCard = (id: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      // Create a copy of the cards without the deleted card
      const updatedCards = { ...boardState.cards };
      delete updatedCards[id];
      
      // Create a copy of the columns with the card ID removed
      const updatedColumns = { ...boardState.columns };
      Object.keys(updatedColumns).forEach((columnKey) => {
        const column = updatedColumns[columnKey as AidaStage];
        column.cardIds = column.cardIds.filter((cardId) => cardId !== id);
      });
      
      // Update the board state
      onBoardChange({
        cards: updatedCards,
        columns: updatedColumns
      });
    }
  };
  
  const handleUpdateCard = (cardData: Partial<Card>) => {
    if (!editingCard || !cardData.id) return;
    
    // Update the card
    const updatedCards = {
      ...boardState.cards,
      [cardData.id]: {
        ...boardState.cards[cardData.id],
        title: cardData.title || boardState.cards[cardData.id].title,
        content: cardData.content || boardState.cards[cardData.id].content,
        type: cardData.type || boardState.cards[cardData.id].type,
        image: cardData.image !== undefined ? cardData.image : boardState.cards[cardData.id].image
      }
    };
    
    // Update the board state
    onBoardChange({
      ...boardState,
      cards: updatedCards
    });
    
    // Close the edit dialog
    setEditingCard(null);
  };
  
  return (
    <div className="p-2 md:p-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        {isMobile ? (
          // Mobile layout: vertical columns
          <div className="flex flex-col space-y-6">
            {Object.values(boardState.columns).map((column) => (
              <div 
                key={column.id} 
                className={`p-4 rounded-lg shadow-sm ${
                  column.id !== 'unassigned' ? `aida-section-${column.id}` : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <h2 className="text-lg font-semibold mb-3 capitalize">{column.title}</h2>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[150px] p-2 rounded-md transition-colors ${
                        snapshot.isDraggingOver ? 'bg-primary bg-opacity-5' : ''
                      }`}
                    >
                      {column.cardIds.map((cardId, index) => (
                        <Draggable key={cardId} draggableId={cardId} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? 'dragging' : ''}
                            >
                              <CardItem
                                card={boardState.cards[cardId]}
                                onEdit={handleEditCard}
                                onDelete={handleDeleteCard}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        ) : (
          // Desktop layout: horizontal columns
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5 h-[calc(100vh-150px)]">
            {Object.values(boardState.columns).map((column) => (
              <div 
                key={column.id} 
                className={`p-4 rounded-lg shadow-sm h-full flex flex-col ${
                  column.id !== 'unassigned' ? `aida-section-${column.id}` : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <h2 className="text-lg font-semibold mb-3 capitalize">{column.title}</h2>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 rounded-md transition-colors overflow-y-auto ${
                        snapshot.isDraggingOver ? 'bg-primary bg-opacity-5' : ''
                      }`}
                    >
                      {column.cardIds.map((cardId, index) => (
                        <Draggable key={cardId} draggableId={cardId} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? 'dragging' : ''}
                            >
                              <CardItem
                                card={boardState.cards[cardId]}
                                onEdit={handleEditCard}
                                onDelete={handleDeleteCard}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        )}
      </DragDropContext>
      
      {/* Edit Card Dialog */}
      <Dialog open={!!editingCard} onOpenChange={(open) => !open && setEditingCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          {editingCard && (
            <CardForm
              card={editingCard}
              onSave={handleUpdateCard}
              onCancel={() => setEditingCard(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardBoard;
