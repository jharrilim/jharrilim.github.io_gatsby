import { RegularPolygonConfig } from 'konva/lib/shapes/RegularPolygon';
import React, { FC, useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import { animated, Spring } from '@react-spring/konva';
import { useState } from 'react';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';
import { useEffect } from 'react';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setHover(true);
      setTimeout(() => setHover(false), 400);
    }, Math.floor(Math.random() * 60000));

    return () => {
      clearInterval(interval);
    }
  }, [setHover]);

  return (
    <Spring
      from={{ fill: 'rgb(255,255,255)' }}
      to={{ fill: hover ? hoverColour : 'rgba(255,255,255,0)' }}
    >
      {springProps =>
        <animated.RegularPolygon
          sides={6}
          radius={20}
          {/*stroke="black"
          strokeWidth={2}*/}
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
  const radius = isMobile ? 20 : 35;
  const a = 2 * Math.PI / 6;
  const strokeWidth = 2;
  
  const strokeOffsetX = isMobile ? 1.5 : 2.25;
  const strokeOffsetY = isMobile ? 2.5 : 4.75;

  const positions = (size: number, offset: number) => Array(size).fill(1).map((_, i) => ({
    x: (i + 1) * (radius * 1) * (Math.sqrt(3) / 2) + (offset * (radius - strokeWidth * strokeOffsetX) * 2),
    y: (i + 0.75) * (radius * 2 - strokeWidth * strokeOffsetY) * Math.sin(a),
  }));

  return (
    <Stage width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Layer>
        <BrowserView>
          {positions(11, -5).map(pos => <Hexagon {...pos} radius={radius} strokeWidth={strokeWidth} />)}
          {positions(12, -4).map(pos => <Hexagon {...pos} radius={radius} strokeWidth={strokeWidth} />)}
          {positions(10, -3).map(pos => <Hexagon {...pos} radius={radius} strokeWidth={strokeWidth} />)}
          {positions(6, -2).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(7, -1).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(8, 0).map(pos => <Hexagon {...pos}   radius={radius} strokeWidth={strokeWidth} />)}
          {positions(4, 1).map(pos => <Hexagon {...pos}   radius={radius} strokeWidth={strokeWidth} />)}
          {positions(3, 2).map(pos => <Hexagon {...pos}   radius={radius} strokeWidth={strokeWidth} />)}
          {positions(2, 3).map(pos => <Hexagon {...pos}   radius={radius} strokeWidth={strokeWidth} />)}
          {positions(2, 4).map(pos => <Hexagon {...pos}   radius={radius} strokeWidth={strokeWidth} />)}
          {positions(6, 5).map(pos => <Hexagon {...pos}   radius={radius} strokeWidth={strokeWidth} />)}
          {positions(5, 6).map(pos => <Hexagon {...pos}   radius={radius} strokeWidth={strokeWidth} />)}
          {positions(3, 7).map(pos => <Hexagon {...pos}   radius={radius} strokeWidth={strokeWidth} />)}
          {positions(2, 8).map(pos => <Hexagon {...pos}   radius={radius} strokeWidth={strokeWidth} />)}
          {positions(2, 9).map(pos => <Hexagon {...pos}   radius={radius} strokeWidth={strokeWidth} />)}
          {positions(3, 10).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(4, 11).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(3, 12).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(3, 13).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(2, 14).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(1, 14).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(2, 15).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(2, 16).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
        </BrowserView>
        <MobileView>
          {positions(5, 0).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(4, 1).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(3, 2).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(5, 3).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(6, 4).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(4, 5).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(2, 6).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(1, 7).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(2, 8).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(3, 9).map(pos => <Hexagon {...pos}  radius={radius} strokeWidth={strokeWidth} />)}
          {positions(2, 10).map(pos => <Hexagon {...pos} radius={radius} strokeWidth={strokeWidth} />)}
          {positions(1, 11).map(pos => <Hexagon {...pos} radius={radius} strokeWidth={strokeWidth} />)}
        </MobileView>
      </Layer>
    </Stage>
  );
};
