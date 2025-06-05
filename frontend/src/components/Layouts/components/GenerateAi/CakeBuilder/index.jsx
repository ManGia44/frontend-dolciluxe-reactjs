import React, { useState, useRef, useEffect } from 'react';
import CakeControl from '../CakeControl';
import CakeCanvas from '../CakeCanvas';

function CakeBuilder() {
  const [numLayers, setNumLayers] = useState(null);
  const [shape, setShape] = useState(null);
  const [baseColor, setBaseColor] = useState(null);
  const [midCream, setMidCream] = useState(null);
  const [topColorSecondLayer, setTopColorSecondLayer] = useState(null);
  const [topCream, setTopCream] = useState(null);
  const [sugar, setSugar] = useState(null);
  const [layers, setLayers] = useState([]);

  const cakeCanvasRef = useRef(null);
  const imagePath = '/src/assets/images_ai/';

  const resetCake = () => {
    setNumLayers(null);
    setShape(null);
    setBaseColor(null);
    setMidCream(null);
    setTopColorSecondLayer(null);
    setTopCream(null);
    setSugar(null);
    setLayers([]);
  };

  const updateLayers = (newLayer, layerType, removeShapeLayer = false) => {
    setLayers((prev) => {
      let updated = prev.filter((l) => l.type !== layerType);
      if (removeShapeLayer) updated = updated.filter((l) => l.type !== 'shape');
      if (newLayer) updated.push(newLayer);
      const order = ['shape', 'base', 'midCream', 'topColorSecondLayer', 'topCream', 'sugar'];
      updated.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
      return updated;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const { itemType, itemName } = data;
    switch (itemType) {
      case 'numLayers':
        handleSelectNumLayers(+itemName);
        break;
      case 'shape':
        handleSelectShape(itemName);
        break;
      case 'baseColor':
        handleSelectBaseColor(itemName);
        break;
      case 'midCream':
        if (numLayers === 2 && baseColor) handleSelectMidCream(itemName);
        break;
      case 'topColorSecondLayer':
        if (numLayers === 2 && midCream) handleSelectTopColorSecondLayer(itemName);
        break;
      case 'topCream':
        if ((numLayers === 1 && baseColor) || (numLayers === 2 && topColorSecondLayer)) handleSelectTopCream(itemName);
        break;
      case 'sugar':
        if (topCream) handleSelectSugar(itemName === 'yes');
        break;
    }
  };

  const handleCreateImage = async () => {
    if (!cakeCanvasRef.current) return;

    try {
      const { toBlob } = await import('html-to-image');
      const blob = await toBlob(cakeCanvasRef.current);
      if (!blob) throw new Error('Failed to generate image');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'banh_kem_thiet_ke.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Không thể tạo ảnh bánh kem.');
    }
  };

  const handleSelectNumLayers = (count) => {
    resetCake();
    setNumLayers(count);
  };
  const handleSelectShape = (s) => {
    setShape(s);
    setBaseColor(null);
    setMidCream(null);
    setTopColorSecondLayer(null);
    setTopCream(null);
    setSugar(null);
    setLayers([{ type: 'shape', image: `${s}_form.png` }]);
  };
  const handleSelectBaseColor = (c) => {
    setBaseColor(c);
    setMidCream(null);
    setTopColorSecondLayer(null);
    setTopCream(null);
    setSugar(null);
    updateLayers({ type: 'base', image: `${shape}_base_${c}.png` }, 'base', true);
  };
  const handleSelectMidCream = (c) => {
    setMidCream(c);
    setTopColorSecondLayer(null);
    setTopCream(null);
    setSugar(null);
    updateLayers({ type: 'midCream', image: `${shape}_mid_${c}.png` }, 'midCream');
  };
  const handleSelectTopColorSecondLayer = (c) => {
    setTopColorSecondLayer(c);
    setTopCream(null);
    setSugar(null);
    updateLayers({ type: 'topColorSecondLayer', image: `${shape}_base_${c}.png` }, 'topColorSecondLayer');
  };
  const handleSelectTopCream = (c) => {
    setTopCream(c);
    setSugar(null);
    updateLayers({ type: 'topCream', image: `${shape}_top_${c}.png` }, 'topCream');
  };
  const handleSelectSugar = (yes) => {
    setSugar(yes);
    if (yes) updateLayers({ type: 'sugar', image: `${shape}_sugar.png` }, 'sugar');
    else updateLayers(null, 'sugar');
  };

  const skip = (types) => setLayers((l) => l.filter((layer) => !types.includes(layer.type)));

  return (
    <div className="flex w-full flex-col gap-8 p-4 lg:flex-row">
      <div className="w-full lg:w-1/2">
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
          onSkipShape={() => skip(['shape', 'base', 'midCream', 'topColorSecondLayer', 'topCream', 'sugar'])}
          onSkipBaseColor={() => skip(['base', 'midCream', 'topColorSecondLayer', 'topCream', 'sugar'])}
          onSkipMidCream={() => skip(['midCream', 'topColorSecondLayer', 'topCream', 'sugar'])}
          onSkipTopColorSecondLayer={() => skip(['topColorSecondLayer', 'topCream', 'sugar'])}
          onSkipTopCream={() => skip(['topCream', 'sugar'])}
          onSkipSugar={() => skip(['sugar'])}
        />
      </div>

      <div className="relative w-full lg:w-1/2">
        <div className="sticky top-4 flex flex-col items-center gap-4">
          <div
            ref={cakeCanvasRef}
            className="flex h-[320px] w-[320px] items-center justify-center rounded bg-gray-100 px-[10px] shadow-inner"
          >
            <div className="translate-x-[3px]">
              <CakeCanvas
                layers={layers.map((layer) => ({ ...layer, src: `${imagePath}${layer.image}` }))}
                numLayers={numLayers}
                onDrop={handleDrop}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCreateImage}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white shadow hover:bg-blue-700"
            >
              Tải ảnh
            </button>
            <button
              onClick={resetCake}
              className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CakeBuilder;
