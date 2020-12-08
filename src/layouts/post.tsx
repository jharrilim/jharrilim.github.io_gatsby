/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Header from '../components/header';
import '../styles/tailwind.css';

export interface PostProps {
  showHeader?: boolean;
}

const Post: FC<PostProps> = ({ children, showHeader = true }) => {
  const data = useStaticQuery(graphql`
    query {
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
        show={showHeader}
        className="header"
        siteTitle={data.site.siteMetadata.title}
      />
      <div className="mx-auto my-0">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Post;
