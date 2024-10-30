import React from 'react';
import SelectionCard from './SelectionCard';

const SelectionGrid = ({ numSides, numEntrees, onSelect }) => {
  const renderCards = (count, type) => {
    return Array.from({ length: count }, (_, index) => (
      <SelectionCard 
        key={`${type}-${index}`} 
        type={type} 
        isSelected={index === 0 && type === 'Side'} 
        onClick={onSelect}
      />
    ));
  };

  return (
    <div className="selection-grid mt-4">
      <div className="sides-section">
        {renderCards(numSides, 'Side')}
      </div>
      <div className="entrees-section">
        {renderCards(numEntrees, 'Entree')}
      </div>
    </div>
  );
};

export default SelectionGrid;
