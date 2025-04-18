import React, { useState, useEffect } from 'react';
import { Card, CardType, AidaStage } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CardFormProps {
  card?: Card;
  onSave: (cardData: Partial<Card>) => void;
  onCancel: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ card, onSave, onCancel }) => {
  const [content, setContent] = useState(card?.content || '');
  const [type, setType] = useState<CardType>(card?.type || 'risk');
  
  const isEditing = !!card;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    onSave({
      id: card?.id,
      content,
      type,
      // Other fields like stage and color will be handled by the parent component
    });
    
    setContent('');
    setType('risk');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg shadow-sm border">
      <div>
        <Textarea
          placeholder="Enter card content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>
      <div>
        <Select
          value={type}
          onValueChange={(value) => setType(value as CardType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select card type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="risk">Risk Factor</SelectItem>
            <SelectItem value="aida">AIDA Element</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2 justify-end">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Card' : 'Add Card'}
        </Button>
      </div>
    </form>
  );
};

export default CardForm;
