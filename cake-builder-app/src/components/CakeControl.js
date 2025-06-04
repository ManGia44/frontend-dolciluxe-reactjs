import React from 'react';
import Option from './Option';

function CakeControl({
    numLayers,
    shape,
    baseColor,
    midCream,
    topColorSecondLayer,
    topCream,
    sugar,
    onSelectNumLayers,
    onSelectShape,
    onSelectBaseColor,
    onSelectMidCream,
    onSelectTopColorSecondLayer,
    onSelectTopCream,
    onSelectSugar,
    onSkipShape,
    onSkipBaseColor,
    onSkipMidCream,
    onSkipTopColorSecondLayer,
    onSkipTopCream,
    onSkipSugar,
}) {
    // Định nghĩa các lựa chọn hình dạng, màu sắc, kem...
    const shapes = [
        { name: 'circle', image: '/images/circle_form.png' },
        { name: 'heart', image: '/images/heart_form.png' },
        { name: 'square', image: '/images/square_form.png' },
    ];

    const baseColors = shape ? [
        { name: 'brown', image: `/images/${shape}_base_brown.png` },
        { name: 'red', image: `/images/${shape}_base_red.png` },
        { name: 'yellow', image: `/images/${shape}_base_yellow.png` },
    ] : [];

    const midCreams = shape ? [
        { name: 'green', image: `/images/${shape}_mid_green.png` },
        { name: 'violet', image: `/images/${shape}_mid_violet.png` },
        { name: 'white', image: `/images/${shape}_mid_white.png` },
    ] : [];

    const topCreams = shape ? [
        { name: 'brown', image: `/images/${shape}_top_brown.png` },
        { name: 'red', image: `/images/${shape}_top_red.png` },
        { name: 'yellow', image: `/images/${shape}_top_yellow.png` },
    ] : [];

    const sugarOption = shape ? [{ name: 'yes', image: `/images/${shape}_sugar.png` }] : [];

    return (
        <div className="cake-control">
            <h2>Tùy chỉnh bánh</h2>

            {/* Bước 1: Chọn số tầng - Luôn hiển thị */}
            <div className="control-section">
                <h3>Số tầng</h3>
                <div className="options-grid">
                    <button
                        onClick={() => onSelectNumLayers(1)}
                        draggable="true"
                        onDragStart={(e) => {
                            const dataToTransfer = { itemType: 'numLayers', itemName: '1' };
                            console.log('CakeControl: DragStart - Transferring:', dataToTransfer);
                            e.dataTransfer.setData('application/json', JSON.stringify(dataToTransfer));
                        }}
                        className={numLayers === 1 ? 'selected-option-button' : ''}
                    >
                        1 tầng
                    </button>
                    <button
                        onClick={() => onSelectNumLayers(2)}
                        draggable="true"
                        onDragStart={(e) => {
                            const dataToTransfer = { itemType: 'numLayers', itemName: '2' };
                            console.log('CakeControl: DragStart - Transferring:', dataToTransfer);
                            e.dataTransfer.setData('application/json', JSON.stringify(dataToTransfer));
                        }}
                        className={numLayers === 2 ? 'selected-option-button' : ''}
                    >
                        2 tầng
                    </button>
                </div>
            </div>

            {/* Bước 2: Chọn hình dạng - Chỉ hiển thị khi đã chọn số tầng */}
            {numLayers !== null && (
                <div className="control-section">
                    <h3>Hình dạng</h3>
                    <div className="options-grid">
                        {shapes.map((s) => (
                            <Option
                                key={s.name}
                                name={s.name}
                                image={s.image}
                                onClick={() => onSelectShape(s.name)}
                                itemType="shape"
                                isSelected={shape === s.name}
                            />
                        ))}
                    </div>
                    <button className="skip-button" onClick={onSkipShape}>Bỏ qua</button>
                </div>
            )}

            {/* Bước 3: Chọn màu sắc - Chỉ hiển thị khi đã chọn hình dạng */}
            {shape !== null && (
                <div className="control-section">
                    <h3>Màu sắc</h3>
                    <div className="options-grid">
                        {baseColors.map((color) => (
                            <Option
                                key={color.name}
                                name={color.name}
                                image={color.image}
                                onClick={() => onSelectBaseColor(color.name)}
                                itemType="baseColor"
                                isSelected={baseColor === color.name}
                            />
                        ))}
                    </div>
                    <button className="skip-button" onClick={onSkipBaseColor}>Bỏ qua</button>
                </div>
            )}

            {/* Bước 4: Chọn kem ở giữa - Chỉ hiển thị khi 2 tầng và đã chọn màu sắc cơ bản */}
            {numLayers === 2 && baseColor !== null && (
                <div className="control-section">
                    <h3>Kem ở giữa</h3>
                    <div className="options-grid">
                        {midCreams.map((cream) => (
                            <Option
                                key={cream.name}
                                name={cream.name}
                                image={cream.image}
                                onClick={() => onSelectMidCream(cream.name)}
                                itemType="midCream"
                                isSelected={midCream === cream.name}
                            />
                        ))}
                    </div>
                    <button className="skip-button" onClick={onSkipMidCream}>Bỏ qua</button>
                </div>
            )}

            {/* Bước 5: Chọn màu sắc tầng 2 - Chỉ hiển thị khi 2 tầng và đã chọn kem ở giữa */}
            {numLayers === 2 && midCream !== null && (
                <div className="control-section">
                    <h3>Màu sắc tầng 2</h3>
                    <div className="options-grid">
                        {baseColors.map((color) => (
                            <Option
                                key={`top2-${color.name}`}
                                name={color.name}
                                image={color.image}
                                onClick={() => onSelectTopColorSecondLayer(color.name)}
                                itemType="topColorSecondLayer"
                                isSelected={topColorSecondLayer === color.name}
                            />
                        ))}
                    </div>
                    <button className="skip-button" onClick={onSkipTopColorSecondLayer}>Bỏ qua</button>
                </div>
            )}

            {/* Bước 6: Chọn kem phủ - Chỉ hiển thị khi đã chọn màu sắc tầng 2 (nếu 2 tầng) hoặc màu sắc cơ bản (nếu 1 tầng) */}
            {((numLayers === 1 && baseColor !== null) || (numLayers === 2 && topColorSecondLayer !== null)) && (
                <div className="control-section">
                    <h3>Kem phủ</h3>
                    <div className="options-grid">
                        {topCreams.map((cream) => (
                            <Option
                                key={cream.name}
                                name={cream.name}
                                image={cream.image}
                                onClick={() => onSelectTopCream(cream.name)}
                                itemType="topCream"
                                isSelected={topCream === cream.name}
                            />
                        ))}
                    </div>
                    <button className="skip-button" onClick={onSkipTopCream}>Bỏ qua</button>
                </div>
            )}

            {/* Bước 7: Chọn đường mịn - Chỉ hiển thị khi đã chọn kem phủ */}
            {topCream !== null && (
                <div className="control-section">
                    <h3>Đường mịn</h3>
                    <div className="options-grid">
                        {sugarOption.map((s) => (
                            <div
                                key={s.name}
                                className={`option ${sugar ? 'selected-option' : ''}`}
                                onClick={() => onSelectSugar(true)}
                                draggable="true"
                                onDragStart={(e) => {
                                    const dataToTransfer = { itemType: 'sugar', itemName: 'yes' };
                                    console.log('CakeControl: DragStart - Transferring:', dataToTransfer);
                                    e.dataTransfer.setData('application/json', JSON.stringify(dataToTransfer));
                                }}
                            >
                                <img src={s.image} alt="Đường mịn" style={{ width: '80px', height: '80px', cursor: 'pointer' }} />
                            </div>
                        ))}
                        <button onClick={() => onSelectSugar(false)}>Bỏ qua</button>
                    </div>
                    <button className="skip-button" onClick={onSkipSugar}>Bỏ qua</button>
                </div>
            )}
        </div>
    );
}

export default CakeControl;
