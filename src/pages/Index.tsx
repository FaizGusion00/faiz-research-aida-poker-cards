
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CardBoard from '@/components/CardBoard';
import { Card, BoardState, AidaStage } from '@/types';
import { generateId, loadBoardState, saveBoardState, clearBoardState } from '@/utils/storage';
import { getRandomColor, getStageColor } from '@/utils/colors';
import { toast } from 'sonner';

// Initial state with empty columns for each AIDA stage
const getInitialState = (): BoardState => ({
  cards: {},
  columns: {
    unassigned: {
      id: 'unassigned',
      title: 'Unassigned Cards',
      cardIds: []
    },
    attention: {
      id: 'attention',
      title: 'Attention',
      cardIds: []
    },
    interest: {
      id: 'interest',
      title: 'Interest',
      cardIds: []
    },
    desire: {
      id: 'desire',
      title: 'Desire',
      cardIds: []
    },
    action: {
      id: 'action',
      title: 'Action',
      cardIds: []
    }
  }
});

const Index: React.FC = () => {
  const [boardState, setBoardState] = useState<BoardState>(getInitialState());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Load board state from localStorage on initial render
  useEffect(() => {
    const savedState = loadBoardState();
    if (savedState) {
      setBoardState(savedState);
    }
    
    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Save board state to localStorage whenever it changes
  useEffect(() => {
    saveBoardState(boardState);
  }, [boardState]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };
  
  // Handle adding a new card
  const handleAddCard = (cardData: Partial<Card>) => {
    const id = generateId();
    const newCard: Card = {
      id,
      content: cardData.content || '',
      type: cardData.type || 'risk',
      stage: 'unassigned',
      color: getRandomColor(),
      createdAt: Date.now()
    };
    
    // Update the cards and add the new card to the unassigned column
    const updatedBoardState: BoardState = {
      cards: {
        ...boardState.cards,
        [id]: newCard
      },
      columns: {
        ...boardState.columns,
        unassigned: {
          ...boardState.columns.unassigned,
          cardIds: [...boardState.columns.unassigned.cardIds, id]
        }
      }
    };
    
    setBoardState(updatedBoardState);
    toast.success("Card added successfully");
  };
  
  // Handle board state changes (e.g., from drag and drop)
  const handleBoardChange = (newState: BoardState) => {
    setBoardState(newState);
  };
  
  // Handle resetting the board
  const handleReset = () => {
    clearBoardState();
    setBoardState(getInitialState());
  };
  
  // Handle importing data
  const handleImport = (data: any) => {
    try {
      if (data && data.cards && data.columns) {
        setBoardState(data);
      } else {
        toast.error("Invalid import data format");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("There was an error importing the data");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        onAddCard={handleAddCard}
        onReset={handleReset}
        onImport={handleImport}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="flex-1 overflow-auto">
        <CardBoard
          boardState={boardState}
          onBoardChange={handleBoardChange}
        />
      </main>
    </div>
  );
};

export default Index;
