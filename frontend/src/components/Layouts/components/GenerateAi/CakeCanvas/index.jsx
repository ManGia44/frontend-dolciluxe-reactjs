import React, { forwardRef, useState, useEffect } from 'react';
import Layer from '../Layer';

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const CakeCanvas = forwardRef(({ layers, numLayers, onDrop }, ref) => {
  const [imageSizes, setImageSizes] = useState({});

  const getImageDimensions = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = src;
    });
  };

  useEffect(() => {
    const fetchSizes = async () => {
      const sizes = {};
      for (const layer of layers) {
        if (layer.src && !sizes[layer.src]) {
          const dimensions = await getImageDimensions(layer.src);
          sizes[layer.src] = dimensions;
        }
      }
      setImageSizes((prev) => ({ ...prev, ...sizes }));
    };
    fetchSizes();
  }, [layers]);

  return (
    <div
      className="cake-canvas"
      style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
      ref={ref}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {layers.map((layer, index) => {
        const originalSize = imageSizes[layer.src] || { width: 100, height: 100 };
        let displayWidth = originalSize.width;
        let displayHeight = originalSize.height;

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2 + 50;
        let offsetX = 0;
        let offsetY = 0;

        if (
          layer.type === 'topColorSecondLayer' ||
          (layer.type === 'topCream' && numLayers === 2) ||
          (layer.type === 'sugar' && numLayers === 2)
        ) {
          displayWidth *= 0.8;
          displayHeight *= 0.8;
        }

        let x = centerX - displayWidth / 2;
        let y = centerY - displayHeight / 2;
        let zIndex = index + 1;

        switch (layer.type) {
          case 'midCream':
            offsetY -= 22.6;
            break;
          case 'topColorSecondLayer':
            offsetY -= 42.6;
            break;
          case 'topCream':
            offsetY -= numLayers === 1 ? 22.6 : 61.9;
            break;
          case 'sugar':
            offsetY -= numLayers === 1 ? 30.6 : 72.2;
            break;
        }

        x += offsetX;
        y += offsetY;

        return (
          <Layer
            key={layer.type}
            src={layer.src}
            alt={layer.type}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              width: `${displayWidth}px`,
              height: `${displayHeight}px`,
              zIndex,
            }}
          />
        );
      })}
    </div>
  );
});

export default CakeCanvas;
