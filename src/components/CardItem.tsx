
import React, { useState } from 'react';
import { Edit, Trash2, Image } from 'lucide-react';
import { Card } from '../types';
import { cn } from '@/lib/utils';

interface CardItemProps {
  card: Card;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCardClass = () => {
    if (card.stage !== 'unassigned') {
      return `card-${card.stage}`;
    }
    return '';
  };

  return (
    <div
      className={cn(
        "relative p-3 rounded-md shadow-sm card-transition mb-3",
        getCardClass(),
        {
          "ring-2 ring-primary ring-opacity-50": isHovered,
        }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        card.stage === 'unassigned' 
          ? { backgroundColor: card.color, color: '#fff' } 
          : {}
      }
    >
      {card.image && !imageError && (
        <div className="w-full h-24 mb-2 overflow-hidden rounded">
          <img 
            src={card.image} 
            alt={card.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}
      
      <h3 className="font-bold text-sm mb-1 line-clamp-2">{card.title}</h3>
      <div className="text-sm opacity-90 line-clamp-3">{card.content}</div>
      
      {card.image && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full p-1">
          <Image size={12} />
        </div>
      )}
      
      {isHovered && (
        <div className="absolute top-1 right-1 flex space-x-1">
          <button
            onClick={() => onEdit(card.id)}
            className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CardItem;
