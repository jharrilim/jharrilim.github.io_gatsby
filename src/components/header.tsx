import clsx from 'clsx';
import { Link } from 'gatsby';
import React, { forwardRef, useContext } from 'react';
import { IndexContext } from '../contexts';
import Logo from '../images/i2.svg';

type HTMLHeaderProps = JSX.IntrinsicElements['header'];

export interface HeaderProps extends HTMLHeaderProps {
  siteTitle?: string;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ siteTitle = '', ref: _, className, ...props }, ref) => {
    const { hideHeader } = useContext(IndexContext);
    
    const cls = clsx({
      'h-12 md:h-16': !className,
      [`${className}`]: className,
    }, hideHeader && 'hide-header');

    return (
      <header className={cls} ref={ref} {...props}>
        <div
          className="header-inner xxl-container mx-auto my-0 flex justify-center items-center py-2"
        >
          <Logo className="h-12 w-12 md:h-16 md:w-16 pr-4 header-logo flex" />
          <p id="siteTitle" className="m-0 p-0 text-2xl" style={{ fontFamily: 'Montserrat' }}>
            <Link
              to="/"
            >
              {siteTitle}
            </Link>
          </p>
        </div>
      </header>
    );
  }
);

export default Header;
