import { Link } from 'gatsby';
import React, { forwardRef } from 'react';
import { animated, useSpring } from 'react-spring';
import Logo from '../images/i.svg';

type HTMLHeaderProps = JSX.IntrinsicElements['header'];

export interface HeaderProps extends HTMLHeaderProps {
  siteTitle?: string;
  show?: boolean;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ siteTitle = '', show = true, ref: _, ...props }, ref) => {
    const s = useSpring({ top: show ? 0 : -100 });

    return (
      <animated.header className="h-12 md:h-16" ref={ref} {...props} style={s}>
        <div
          className="xxl-container mx-auto my-0 flex justify-center items-center py-2"
        >
          <Logo className="h-12 w-12 md:h-16 md:w-16 pr-4 header-logo flex" />
          <h1 id="siteTitle" className="m-0 text-2xl" style={{ fontFamily: 'Montserrat' }}>
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
