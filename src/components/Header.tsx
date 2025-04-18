
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Upload, Sun, Moon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CardForm from './CardForm';
import { Card } from '../types';

interface HeaderProps {
  onAddCard: (card: Partial<Card>) => void;
  onReset: () => void;
  onImport: (data: any) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddCard, 
  onReset, 
  onImport, 
  isDarkMode, 
  toggleDarkMode 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            onImport(data);
            toast({
              title: "Import successful",
              description: "Your cards have been imported successfully",
            });
          } catch (error) {
            toast({
              title: "Import failed",
              description: "There was an error importing your cards. Please check the file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetClick = () => {
    if (confirm("Are you sure you want to reset? This will clear all cards.")) {
      onReset();
      toast({
        title: "Reset successful",
        description: "All cards have been cleared",
      });
    }
  };

  return (
    <header className="py-4 px-6 flex justify-between items-center border-b">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold">FGResearch Poker Cards</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus size={16} className="mr-1" /> Add Card
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleImportClick}>
          <Upload size={16} className="mr-1" /> Import
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleResetClick}>
          <RefreshCw size={16} className="mr-1" /> Reset
        </Button>
        
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
          </DialogHeader>
          <CardForm 
            onSave={(cardData) => {
              onAddCard(cardData);
              setIsAddDialogOpen(false);
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
