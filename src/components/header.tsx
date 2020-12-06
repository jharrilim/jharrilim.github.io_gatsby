import { Link } from 'gatsby';
import React, { forwardRef, Ref, useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';

type HTMLHeaderProps = JSX.IntrinsicElements['header'];

export interface HeaderProps extends HTMLHeaderProps {
  siteTitle?: string;
  show?: boolean;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ siteTitle = '', show = true, ref: _, ...props }, ref) => {
    const s = useSpring({ top: show ? 0 : -100 });

    return (
      <animated.header ref={ref} {...props} style={s}>
        <div
          className="xxl-container mx-auto my-0"
          style={{
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
          }}
        >
          <h1 id="siteTitle" style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'Montserrat' }}>
            <Link
              to="/"
            >
              {siteTitle}
            </Link>
          </h1>
        </div>
      </animated.header>
    );
  }
);

export default Header;
