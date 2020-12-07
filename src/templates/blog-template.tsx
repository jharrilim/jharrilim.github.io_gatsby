import React, { FC } from 'react';
import { graphql, PageProps, Link } from 'gatsby';
import './blog-template.css';
import Main from '../layouts/main';
import SEO from '../components/seo';

interface Post {
  html: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
    date: string;
  };
}

const BlogTemplate: FC<PageProps<{ markdownRemark: Post | null }>> = ({ data }) => {
  const { markdownRemark } = data; // data.markdownRemark holds your post data

  if (markdownRemark === null)
    return <></>;

  const { frontmatter, html } = markdownRemark;
  return (
    <Main>
      <SEO title={frontmatter.title} />
      <div className="pt-16 md:pt-16 blog__blog-post-container">
        <div className="flex justify-between">
          <Link to="/">&lt; Back</Link>
          <p>{frontmatter.date}</p>
        </div>
        <div className="mt-4">
          <h1>{frontmatter.title}</h1>
          <div
            className="blog__blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </Main>
  );
};

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } published: { eq: true } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`;

export default BlogTemplate;
