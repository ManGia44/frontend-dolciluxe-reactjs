import React from 'react';
import './Option.css';

// Thêm isSelected vào props
function Option({ name, image, onClick, itemType, isSelected }) {
    console.log(`Option: Rendering ${name}, received itemType: ${itemType}, isSelected: ${isSelected}`);

    const handleDragStart = (e) => {
        // Đóng gói thông tin về item đang kéo vào dataTransfer
        const dataToTransfer = { itemType: itemType, itemName: name };
        console.log('Option: handleDragStart - Transferring:', dataToTransfer);
        e.dataTransfer.setData('application/json', JSON.stringify(dataToTransfer));
    };

    return (
        <div
            // Thêm class 'selected-option' nếu isSelected là true
            className={`option ${isSelected ? 'selected-option' : ''}`}
            onClick={onClick}
            draggable="true" // Cho phép kéo
            onDragStart={handleDragStart} // Xử lý sự kiện bắt đầu kéo
        >
            <img src={image} alt={name} />
            {/* <p>{name}</p> */}
        </div>
    );
}

export default Option;
