import React from 'react';
import Option from '../Option';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';

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
  const shapes = [
    { name: 'circle', image: '/src/assets/images_ai/circle_form.png' },
    { name: 'heart', image: '/src/assets/images_ai/heart_form.png' },
    { name: 'square', image: '/src/assets/images_ai/square_form.png' },
  ];

  const baseColors = shape
    ? [
        { name: 'brown', image: `/src/assets/images_ai/${shape}_base_brown.png` },
        { name: 'red', image: `/src/assets/images_ai/${shape}_base_red.png` },
        { name: 'yellow', image: `/src/assets/images_ai/${shape}_base_yellow.png` },
      ]
    : [];

  const midCreams = shape
    ? [
        { name: 'green', image: `/src/assets/images_ai/${shape}_mid_green.png` },
        { name: 'violet', image: `/src/assets/images_ai/${shape}_mid_violet.png` },
        { name: 'white', image: `/src/assets/images_ai/${shape}_mid_white.png` },
      ]
    : [];

  const topCreams = shape
    ? [
        { name: 'brown', image: `/src/assets/images_ai/${shape}_top_brown.png` },
        { name: 'red', image: `/src/assets/images_ai/${shape}_top_red.png` },
        { name: 'yellow', image: `/src/assets/images_ai/${shape}_top_yellow.png` },
      ]
    : [];

  const sugarOption = shape ? [{ name: 'yes', image: `/src/assets/images_ai/${shape}_sugar.png` }] : [];

  const renderSection = (title, options, handler, selected, itemType, skipHandler) => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2}>
          {options.map((opt) => (
            <Grid item xs={4} key={opt.name}>
              <Option
                name={opt.name}
                image={opt.image}
                onClick={() => handler(opt.name)}
                itemType={itemType}
                isSelected={selected === opt.name}
              />
            </Grid>
          ))}
        </Grid>
        {skipHandler && (
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={skipHandler}>
            Bỏ qua
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="cake-control w-full">
      <Typography variant="h4" gutterBottom>
        Tùy chỉnh bánh
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Số tầng
          </Typography>
          <Grid container spacing={2}>
            {[1, 2].map((num) => (
              <Grid item xs={6} key={num}>
                <Button
                  variant={numLayers === num ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => onSelectNumLayers(num)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      'application/json',
                      JSON.stringify({ itemType: 'numLayers', itemName: num.toString() }),
                    );
                  }}
                >
                  {num} tầng
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {numLayers !== null && renderSection('Hình dạng', shapes, onSelectShape, shape, 'shape', onSkipShape)}

      {shape && renderSection('Màu sắc', baseColors, onSelectBaseColor, baseColor, 'baseColor', onSkipBaseColor)}

      {numLayers === 2 &&
        baseColor &&
        renderSection('Kem ở giữa', midCreams, onSelectMidCream, midCream, 'midCream', onSkipMidCream)}

      {numLayers === 2 &&
        midCream &&
        renderSection(
          'Màu sắc tầng 2',
          baseColors,
          onSelectTopColorSecondLayer,
          topColorSecondLayer,
          'topColorSecondLayer',
          onSkipTopColorSecondLayer,
        )}

      {((numLayers === 1 && baseColor) || (numLayers === 2 && topColorSecondLayer)) &&
        renderSection('Kem phủ', topCreams, onSelectTopCream, topCream, 'topCream', onSkipTopCream)}

      {topCream && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Đường mịn
            </Typography>
            <Grid container spacing={2}>
              {sugarOption.map((s) => (
                <Grid item xs={6} key={s.name}>
                  <Option
                    name={s.name}
                    image={s.image}
                    onClick={() => onSelectSugar(true)}
                    itemType="sugar"
                    isSelected={sugar === true}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Button
                  variant={sugar === true ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => onSelectSugar(true)}
                >
                  Có đường
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant={sugar === false ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => onSelectSugar(false)}
                >
                  Không đường
                </Button>
              </Grid>
            </Grid>
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onSkipSugar}>
              Bỏ qua
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CakeControl;
