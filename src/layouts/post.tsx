/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Header from '../components/header';
import { IndexContext } from '../contexts';

export interface PostProps {
  hideHeader?: boolean;
}

const Post: FC<PostProps> = ({ children, hideHeader = false }) => {
  const data = useStaticQuery(graphql`
    query PostSiteTitle {
      site {
        siteMetadata {
          title
        }
      }
    } 
  `);

  return (
    <IndexContext.Provider value={{ hideHeader }}>
      <Header
        className="header"
        siteTitle={data.site.siteMetadata.title}
        style={{ position: 'sticky' }}
      />
      <main className="">{children}</main>
    </IndexContext.Provider>
  );
};

export default Post;
