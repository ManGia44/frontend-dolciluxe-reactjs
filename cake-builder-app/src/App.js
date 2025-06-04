import React, { useState, useRef } from 'react';
import CakeControl from './components/CakeControl';
import CakeCanvas from './components/CakeCanvas';
import html2canvas from 'html2canvas'; // Import html2canvas
import './App.css';

function App() {
    // State để lưu trữ các lựa chọn của người dùng
    const [numLayers, setNumLayers] = useState(null);
    const [shape, setShape] = useState(null);
    const [baseColor, setBaseColor] = useState(null);
    const [midCream, setMidCream] = useState(null); // Chỉ khi 2 tầng
    const [topColorSecondLayer, setTopColorSecondLayer] = useState(null); // Chỉ khi 2 tầng
    const [topCream, setTopCream] = useState(null);
    const [sugar, setSugar] = useState(null);

    // State để quản lý các lớp hình ảnh hiển thị trên canvas
    const [layers, setLayers] = useState([]);

    // Ref để tham chiếu đến element canvas cho việc chụp ảnh
    const cakeCanvasRef = useRef(null);

    const imagePath = '/images/';

    // Hàm reset toàn bộ bánh về trạng thái ban đầu
    const resetCake = () => {
        console.log('Resetting cake...');
        setNumLayers(null);
        setShape(null);
        setBaseColor(null);
        setMidCream(null);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        setLayers([]);
    };

    // Hàm cập nhật các lớp trên canvas
    const updateLayers = (newLayer, layerType, removeShapeLayer = false) => {
        setLayers(prevLayers => {
            console.log('updateLayers: prevLayers', prevLayers);
            console.log('updateLayers: newLayer', newLayer, 'layerType', layerType, 'removeShapeLayer', removeShapeLayer);

            let updated = prevLayers.filter(layer => layer.type !== layerType); // Xóa lớp cũ cùng loại
            if (removeShapeLayer) {
                updated = updated.filter(layer => layer.type !== 'shape'); // Xóa lớp hình dạng nếu yêu cầu
            }
            if (newLayer) {
                updated.push(newLayer); // Thêm lớp mới
            }
            // Sắp xếp lại các lớp để đảm bảo thứ tự hiển thị đúng (zIndex)
            const layerOrder = ['shape', 'base', 'midCream', 'topColorSecondLayer', 'topCream', 'sugar'];
            updated.sort((a, b) => layerOrder.indexOf(a.type) - layerOrder.indexOf(b.type));
            console.log('updateLayers: updated layers', updated);
            return updated;
        });
    };

    // --- Các hàm xử lý lựa chọn (click và drag-drop sẽ gọi các hàm này) ---

    const handleSelectNumLayers = (layersCount) => {
        console.log('handleSelectNumLayers called with:', layersCount);
        resetCake(); // Reset toàn bộ khi chọn lại số tầng
        setNumLayers(layersCount);
    };

    const handleSelectShape = (selectedShape) => {
        console.log('handleSelectShape called with:', selectedShape);
        setShape(selectedShape);
        setBaseColor(null);
        setMidCream(null);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        // Lọc bỏ tất cả các lớp trừ lớp hình dạng (nếu đã có)
        setLayers(prevLayers => prevLayers.filter(layer => layer.type === 'shape'));
        // Thêm lớp hình dạng mới
        updateLayers({ type: 'shape', image: `${selectedShape}_form.png` }, 'shape');
    };

    const handleSelectBaseColor = (color) => {
        console.log('handleSelectBaseColor called with:', color);
        setBaseColor(color);
        setMidCream(null);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        // Khi chọn màu sắc, ẩn hình dạng và thay bằng hình ảnh màu sắc cơ bản
        updateLayers({ type: 'base', image: `${shape}_base_${color}.png` }, 'base', true);
    };

    const handleSelectMidCream = (cream) => {
        console.log('handleSelectMidCream called with:', cream);
        setMidCream(cream);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        updateLayers({ type: 'midCream', image: `${shape}_mid_${cream}.png` }, 'midCream');
    };

    const handleSelectTopColorSecondLayer = (color) => {
        console.log('handleSelectTopColorSecondLayer called with:', color);
        setTopColorSecondLayer(color);
        setTopCream(null);
        setSugar(null);
        updateLayers({ type: 'topColorSecondLayer', image: `${shape}_base_${color}.png` }, 'topColorSecondLayer');
    };

    const handleSelectTopCream = (cream) => {
        console.log('handleSelectTopCream called with:', cream);
        setTopCream(cream);
        setSugar(null);
        updateLayers({ type: 'topCream', image: `${shape}_top_${cream}.png` }, 'topCream');
    };

    const handleSelectSugar = (hasSugar) => {
        console.log('handleSelectSugar called with:', hasSugar);
        if (hasSugar) {
            setSugar(true);
            updateLayers({ type: 'sugar', image: `${shape}_sugar.png` }, 'sugar');
        } else {
            setSugar(false); // Đặt false để biết là đã chọn bỏ qua
            updateLayers(null, 'sugar'); // Xóa lớp đường mịn
        }
    };

    // --- Các hàm xử lý "Bỏ qua" ---

    const handleSkipShape = () => {
        console.log('handleSkipShape called');
        setShape(null);
        setBaseColor(null);
        setMidCream(null);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        setLayers([]); // Xóa tất cả các lớp liên quan đến hình dạng và sau đó
    };

    const handleSkipBaseColor = () => {
        console.log('handleSkipBaseColor called');
        setBaseColor(null);
        setMidCream(null);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        // Giữ lại lớp hình dạng nếu có, sau đó lọc bỏ các lớp base và sau đó
        setLayers(prevLayers => {
            let updated = prevLayers.filter(layer => layer.type !== 'base' && layer.type !== 'midCream' && layer.type !== 'topColorSecondLayer' && layer.type !== 'topCream' && layer.type !== 'sugar');
            if (shape && !updated.some(layer => layer.type === 'shape')) {
                updated.push({ type: 'shape', image: `${shape}_form.png` });
            }
            return updated;
        });
    };

    const handleSkipMidCream = () => {
        console.log('handleSkipMidCream called');
        setMidCream(null);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        setLayers(prevLayers => prevLayers.filter(layer => layer.type !== 'midCream' && layer.type !== 'topColorSecondLayer' && layer.type !== 'topCream' && layer.type !== 'sugar'));
    };

    const handleSkipTopColorSecondLayer = () => {
        console.log('handleSkipTopColorSecondLayer called');
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        setLayers(prevLayers => prevLayers.filter(layer => layer.type !== 'topColorSecondLayer' && layer.type !== 'topCream' && layer.type !== 'sugar'));
    };

    const handleSkipTopCream = () => {
        console.log('handleSkipTopCream called');
        setTopCream(null);
        setSugar(null);
        setLayers(prevLayers => prevLayers.filter(layer => layer.type !== 'topCream' && layer.type !== 'sugar'));
    };

    const handleSkipSugar = () => {
        console.log('handleSkipSugar called');
        setSugar(null);
        setLayers(prevLayers => prevLayers.filter(layer => layer.type !== 'sugar'));
    };

    // --- Hàm xử lý kéo thả ---
    const handleDrop = (e) => {
        e.preventDefault();
        const dataString = e.dataTransfer.getData('application/json');
        console.log('handleDrop: Data transferred (string):', dataString);
        try {
            const data = JSON.parse(dataString);
            const { itemType, itemName } = data;
            console.log('handleDrop: Parsed data:', { itemType, itemName });

            // Dựa vào itemType để gọi hàm xử lý lựa chọn tương ứng
            switch (itemType) {
                case 'numLayers':
                    handleSelectNumLayers(parseInt(itemName));
                    break;
                case 'shape':
                    handleSelectShape(itemName);
                    break;
                case 'baseColor':
                    handleSelectBaseColor(itemName);
                    break;
                case 'midCream':
                    // Chỉ cho phép kéo thả kem giữa nếu là bánh 2 tầng và đã chọn màu sắc cơ bản
                    if (numLayers === 2 && baseColor !== null) {
                        handleSelectMidCream(itemName);
                    } else {
                        alert('Vui lòng chọn bánh 2 tầng và màu sắc cơ bản trước khi thêm kem ở giữa.');
                    }
                    break;
                case 'topColorSecondLayer':
                    // Chỉ cho phép kéo thả màu tầng 2 nếu là bánh 2 tầng và đã chọn kem giữa
                    if (numLayers === 2 && midCream !== null) {
                        handleSelectTopColorSecondLayer(itemName);
                    } else {
                        alert('Vui lòng chọn bánh 2 tầng và kem ở giữa trước khi thêm màu tầng 2.');
                    }
                    break;
                case 'topCream':
                    // Chỉ cho phép kéo thả kem phủ nếu đã chọn màu sắc cơ bản (1 tầng) hoặc màu tầng 2 (2 tầng)
                    if ((numLayers === 1 && baseColor !== null) || (numLayers === 2 && topColorSecondLayer !== null)) {
                        handleSelectTopCream(itemName);
                    } else {
                        alert('Vui lòng hoàn thành các bước trước khi thêm kem phủ.');
                    }
                    break;
                case 'sugar':
                    // Chỉ cho phép kéo thả đường mịn nếu đã chọn kem phủ
                    if (topCream !== null) {
                        handleSelectSugar(itemName === 'yes');
                    } else {
                        alert('Vui lòng thêm kem phủ trước khi thêm đường mịn.');
                    }
                    break;
                default:
                    console.warn('handleDrop: Unknown itemType:', itemType);
                    break;
            }
        } catch (error) {
            console.error('handleDrop: Error parsing dataTransfer data:', error, 'Data string:', dataString);
        }
    };

    // Hàm tạo ảnh từ canvas
    const handleCreateImage = () => {
        if (cakeCanvasRef.current) {
            html2canvas(cakeCanvasRef.current, {
                backgroundColor: null, // Đặt null để nền trong suốt nếu không có màu nền
                scale: 2, // Tăng độ phân giải ảnh
            }).then(canvas => {
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = 'banh_kem_thiet_ke.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert('Ảnh bánh kem đã được tạo và tải xuống!');
            }).catch(error => {
                console.error('Lỗi khi tạo ảnh:', error);
                alert('Không thể tạo ảnh bánh kem. Vui lòng thử lại.');
            });
        }
    };

    return (
        <div className="app-container">
            <CakeControl
                numLayers={numLayers}
                shape={shape}
                baseColor={baseColor}
                midCream={midCream}
                topColorSecondLayer={topColorSecondLayer}
                topCream={topCream}
                sugar={sugar}
                onSelectNumLayers={handleSelectNumLayers}
                onSelectShape={handleSelectShape}
                onSelectBaseColor={handleSelectBaseColor}
                onSelectMidCream={handleSelectMidCream}
                onSelectTopColorSecondLayer={handleSelectTopColorSecondLayer}
                onSelectTopCream={handleSelectTopCream}
                onSelectSugar={handleSelectSugar}
                onSkipShape={handleSkipShape}
                onSkipBaseColor={handleSkipBaseColor}
                onSkipMidCream={handleSkipMidCream}
                onSkipTopColorSecondLayer={handleSkipTopColorSecondLayer}
                onSkipTopCream={handleSkipTopCream}
                onSkipSugar={handleSkipSugar}
            />
            <div className="cake-display-area">
                <CakeCanvas
                    ref={cakeCanvasRef} // Gán ref vào CakeCanvas
                    layers={layers.map(layer => ({ ...layer, src: imagePath + layer.image }))}
                    numLayers={numLayers}
                    onDrop={handleDrop} // Truyền handleDrop cho CakeCanvas
                />
                <div className="actions">
                    <button onClick={handleCreateImage}>Tạo ảnh</button>
                    <button onClick={resetCake}>Reset</button>
                </div>
            </div>
        </div>
    );
}

export default App;
