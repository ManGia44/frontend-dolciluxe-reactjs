import React from 'react';

function Option({ name, image, onClick, itemType, isSelected }) {
  const handleDragStart = (e) => {
    const dataToTransfer = { itemType, itemName: name };
    e.dataTransfer.setData('application/json', JSON.stringify(dataToTransfer));
  };

  return (
    <div
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
      className={`cursor-pointer rounded-lg border-2 p-2 shadow-sm transition-transform duration-150 hover:scale-105 ${isSelected ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300'}`}
    >
      <img src={image} alt={name} className="h-20 w-20 object-contain" />
    </div>
  );
}

export default Option;
