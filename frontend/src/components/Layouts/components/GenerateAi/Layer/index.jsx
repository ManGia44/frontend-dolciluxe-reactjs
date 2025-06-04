import React from 'react';

function Layer({ src, alt, style }) {
  return <img src={src} alt={alt} style={style} draggable={false} />;
}

export default Layer;
