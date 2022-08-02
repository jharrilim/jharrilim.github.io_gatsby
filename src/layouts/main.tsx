import '../styles/tailwind.css';
import './main.css';

/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Header from '../components/header';

export interface MainProps {

}

const Main: FC<MainProps> = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  
  return (
    <>
      <Header
        className="header"
        siteTitle={data.site.siteMetadata.title}
      />
      <div className="mx-auto my-0">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Main;
