import React, { useState, useEffect } from 'react';
import { Card, CardType, AidaStage } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageIcon, UploadIcon, X } from 'lucide-react';

interface CardFormProps {
  card?: Card;
  onSave: (cardData: Partial<Card>) => void;
  onCancel: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ card, onSave, onCancel }) => {
  const [title, setTitle] = useState(card?.title || '');
  const [content, setContent] = useState(card?.content || '');
  const [type, setType] = useState<CardType>(card?.type || 'risk');
  const [image, setImage] = useState<string | undefined>(card?.image);
  
  const isEditing = !!card;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    onSave({
      id: card?.id,
      title,
      content,
      type,
      image,
      // Other fields like stage and color will be handled by the parent component
    });
    
    setTitle('');
    setContent('');
    setType('risk');
    setImage(undefined);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg shadow-sm border">
      <div>
        <label htmlFor="card-title" className="block text-sm font-medium mb-1">
          Card Title
        </label>
        <Input
          id="card-title"
          placeholder="Enter card title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="card-content" className="block text-sm font-medium mb-1">
          Card Description
        </label>
        <Textarea
          id="card-content"
          placeholder="Enter card description..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      <div>
        <label htmlFor="card-type" className="block text-sm font-medium mb-1">
          Card Type
        </label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as CardType)}
        >
          <SelectTrigger id="card-type">
            <SelectValue placeholder="Select card type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="risk">Risk Factor</SelectItem>
            <SelectItem value="aida">AIDA Element</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Image (Optional)
        </label>
        {image ? (
          <div className="relative mt-2 mb-4">
            <img 
              src={image} 
              alt="Card" 
              className="w-full h-auto max-h-40 object-contain rounded-md border"
            />
            <Button 
              type="button" 
              variant="destructive" 
              size="sm" 
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={removeImage}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
            <div className="space-y-1 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                >
                  <span>Upload an image</span>
                  <Input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF up to 2MB
              </p>
            </div>
          </div>
        )}
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
