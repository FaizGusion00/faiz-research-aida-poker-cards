
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Upload, Download, Sun, Moon, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CardForm from './CardForm';
import { Card } from '../types';
import AnimatedTitle from './AnimatedTitle';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onAddCard: (card: Partial<Card>) => void;
  onReset: () => void;
  onImport: (data: any) => void;
  onExport: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddCard, 
  onReset, 
  onImport,
  onExport,
  isDarkMode, 
  toggleDarkMode 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json, image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (file.type.startsWith('image/')) {
        // Handle image import
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          onAddCard({
            title: file.name.split('.')[0] || 'Imported Image',
            content: 'Imported from image',
            type: 'risk',
            image: imageData
          });
          toast({
            title: "Image imported",
            description: "Your image has been imported as a new card",
          });
        };
        reader.readAsDataURL(file);
      } else {
        // Handle JSON import
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
    <header className="py-4 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center border-b sticky top-0 bg-background z-10 backdrop-blur-sm bg-opacity-90">
      <div className="flex items-center mb-3 md:mb-0">
        <AnimatedTitle text="FGResearch Poker Cards" />
      </div>
      
      <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)} size={isMobile ? "sm" : "default"}>
          <Plus size={16} className="mr-1" /> {isMobile ? "" : "Add Card"}
        </Button>
        
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleImportClick}>
          <Upload size={16} className="mr-1" /> {isMobile ? "" : "Import"}
        </Button>
        
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onExport}>
          <Download size={16} className="mr-1" /> {isMobile ? "" : "Export"}
        </Button>
        
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleResetClick}>
          <RefreshCw size={16} className="mr-1" /> {isMobile ? "" : "Reset"}
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
