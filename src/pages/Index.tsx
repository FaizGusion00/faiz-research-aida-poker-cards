
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CardBoard from '@/components/CardBoard';
import SplashScreen from '@/components/SplashScreen';
import { Card, BoardState, AidaStage } from '@/types';
import { generateId, loadBoardState, saveBoardState, clearBoardState } from '@/utils/storage';
import { getRandomColor, getStageColor } from '@/utils/colors';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';

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
  const [showSplash, setShowSplash] = useState(true);

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
    
    // Add custom font
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Righteous&display=swap';
    document.head.appendChild(link);
    
    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      .font-title {
        font-family: 'Righteous', cursive;
      }
      .animate-text {
        background-size: 200% auto;
        animation: gradientText 4s linear infinite;
      }
      @keyframes gradientText {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }
    `;
    document.head.appendChild(style);
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
      title: cardData.title || 'Untitled Card',
      content: cardData.content || '',
      type: cardData.type || 'risk',
      stage: 'unassigned',
      color: getRandomColor(),
      createdAt: Date.now(),
      image: cardData.image
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
  
  // Handle exporting data
  const handleExport = () => {
    const dataStr = JSON.stringify(boardState, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `fgresearch-poker-cards-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Cards exported successfully");
  };
  
  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
      
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header
          onAddCard={handleAddCard}
          onReset={handleReset}
          onImport={handleImport}
          onExport={handleExport}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="flex-1 overflow-hidden">
          <CardBoard
            boardState={boardState}
            onBoardChange={handleBoardChange}
          />
        </main>
        <footer className="text-center p-4 text-sm text-muted-foreground border-t">
          <p>Developed by Faiz Nasir for Academic Research and Analysis</p>
          <p className="text-xs mt-1">© {new Date().getFullYear()} FGResearch</p>
        </footer>
      </div>
    </>
  );
};

export default Index;
