import { Link } from 'gatsby';
import React, { forwardRef } from 'react';

type HTMLHeaderProps = JSX.IntrinsicElements['header'];

export interface HeaderProps extends HTMLHeaderProps {
  siteTitle?: string;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ siteTitle = '', ...props }, ref) => (
    <header ref={ref} {...props}>
      <div
        className="xxl-container mx-auto my-0"
        style={{
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'Montserrat' }}>
          <Link
            to="/"
            style={{
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
      </div>
    </header>
  )
);

export default Header;
