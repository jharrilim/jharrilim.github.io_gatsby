import Konva from 'konva';
import { RegularPolygonConfig } from 'konva/lib/shapes/RegularPolygon';
import React, { FC, useRef } from 'react';
import { Layer, RegularPolygon, Stage } from 'react-konva';
import { animated, Spring } from '@react-spring/konva';
import { useState } from 'react';

interface HexagonsProps {
  width: number;
  height: number;
}

const Hexagon: FC<Omit<RegularPolygonConfig, 'sides'>> = ({
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const { current: hoverColour } = useRef(
    Math.floor(Math.random() * 100) > 95
    ? 'rgb(0,0,0)'
    : 'hsl(55, 85%, 70%)');

  return (
    <Spring
      from={{ fill: 'rgb(255,255,255)' }}
      to={{ fill: hover ? hoverColour : 'rgba(255,255,255,0)' }}
    >
      {springProps =>
        <animated.RegularPolygon
          sides={6}
          radius={20}
          stroke="black"
          strokeWidth={2}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onTouchStart={() => {
            setHover(true);
            setTimeout(() => setHover(false), 300);
          }}
          {...props}
          {...springProps}
        />
      }
    </Spring>
  );
}

export const Hexagons: FC<HexagonsProps> = ({
  width,
  height,
}) => {
  const radius = 20;
  const a = 2 * Math.PI / 6;
  const strokeWidth = 2;
  const positions = (size: number, offset: number) => Array(size).fill(1).map((_, i) => ({
    x: (i + 1) * (radius * 1) * (Math.sqrt(3) / 2) + (offset * (radius - (strokeWidth * 1.5)) * 2),
    y: (i + 1) * (radius * 2 - strokeWidth * 2.5) * Math.sin(a),
  }));

  return (
    <Stage width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Layer>
        {positions(8, 0).map(pos => <Hexagon {...pos} />)}
        {positions(4, 1).map(pos => <Hexagon {...pos} />)}
        {positions(3, 2).map(pos => <Hexagon {...pos} />)}
        {positions(2, 3).map(pos => <Hexagon {...pos} />)}
        {positions(2, 4).map(pos => <Hexagon {...pos} />)}
        {positions(6, 5).map(pos => <Hexagon {...pos} />)}
        {positions(3, -1).map(pos => <Hexagon {...pos} />)}
        {positions(6, -2).map(pos => <Hexagon {...pos} />)}
        {positions(2, -3).map(pos => <Hexagon {...pos} />)}
      </Layer>
    </Stage>
  );
};
