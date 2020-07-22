import React, { FC } from "react";
import { graphql, PageProps, Link } from "gatsby";
import "./blog-template.css";
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

const BlogTemplate: FC<PageProps<{ markdownRemark: Post }>> = ({ data }) => {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;
  return (
    <Main>
      <SEO title={frontmatter.title} />
      <div className="blog-post-container">
        <Link to="/">&lt; Back</Link>
        <div className="blog-post">
          <h1>{frontmatter.title}</h1>
          <h2>{frontmatter.date}</h2>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </Main>
  );
};

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
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
