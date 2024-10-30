import React, { useState } from 'react';
import SelectionCard from './SelectionCard';

const SelectionGrid = ({ numSides, numEntrees, onSelect }) => {
  const [selectedSideIndex, setSelectedSideIndex] = useState(null);
  const [selectedEntreeIndex, setSelectedEntreeIndex] = useState(null);

  const handleCardClick = (type, index) => {
    if (type === 'side') {
      setSelectedSideIndex(index);
      setSelectedEntreeIndex(null); // Clear the entree selection when a side is selected
      onSelect(type); 
    } else if (type === 'entree') {
      setSelectedEntreeIndex(index);
      setSelectedSideIndex(null); // Clear the side selection when an entree is selected
      onSelect(type);
    }
  };

  const renderCards = (count, type) => {
    return Array.from({ length: count }, (_, index) => (
      <SelectionCard 
        key={`${type}-${index}`} 
        type={type} 
        isSelected={(type === 'side' && index === selectedSideIndex) || (type === 'entree' && index === selectedEntreeIndex)} 
        onClick={() => handleCardClick(type, index)} 
      />
    ));
  };

  return (
    <div className="selection-grid mt-4">
      <div className="sides-section">
        {renderCards(numSides, 'side')}
      </div>
      <div className="entrees-section">
        {renderCards(numEntrees, 'entree')}
      </div>
    </div>
  );
};

export default SelectionGrid;
