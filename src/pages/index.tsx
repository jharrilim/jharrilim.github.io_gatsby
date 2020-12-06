import React, { FC, useRef, useEffect, useState, useCallback } from 'react';
import { Link, graphql, PageProps } from 'gatsby';

import clsx from 'clsx';

import Main from '../layouts/main';
import SEO from '../components/seo';
import sepImg1 from '../images/photos/20200114_201414-md.jpg';

import './index.css';

interface PageQuery {
  allMarkdownRemark: {
    edges: {
      node: {
        frontmatter: {
          title: string;
          slug: string;
          published: string;
          date: string;
        };
      };
    }[];
  };
}

const IndexPage: FC<PageProps<PageQuery>> = ({ data }) => {
  const titleNameRef = useRef<HTMLParagraphElement | null>(null);
  const bioRef = useRef<HTMLElement | null>(null);
  const section2Ref = useRef<HTMLElement | null>(null);
  const section3Ref = useRef<HTMLElement | null>(null);
  const [atTopOfPage, setAtTopOfPage] = useState(true);
  const [showHeader, setShowHeader] = useState(false);

  const onScroll = (ev: Event) => {
    const shouldShow = document.documentElement.scrollTop <= 2;
    setAtTopOfPage(shouldShow);

    const titleName = titleNameRef.current!.getBoundingClientRect();
    if (showHeader) {
      const bottomOfTitleName = titleName.top + titleName.height;
      setShowHeader(bottomOfTitleName <= 0);
    } else {
      setShowHeader(titleName.top <= 0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToBlogPosts = useCallback(() => {
    if (section2Ref.current === null) return;
    const distanceFromTop = section2Ref.current.getBoundingClientRect().top;

    if (distanceFromTop <= 58) return; // otherwise it'll scroll back to the very top

    window.scrollTo({
      top: distanceFromTop - 50,
      behavior: 'smooth',
    });
  }, [section2Ref.current]);

  const downArrowClick = () => {
    if (!atTopOfPage) return;
    scrollToBlogPosts();
  };

  return (
    <Main showHeader={showHeader}>
      <SEO title="Home" />
      <section className="section-1 grid">
        <div className="section-1-hero flex items-center justify-center pt-4">

        </div>
        <div className="flex section-1-quotes flex-col items-center justify-evenly px-4">
          <div>
            <h1 ref={titleNameRef} className="text-center" style={{ fontFamily: 'Montserrat, Segoe UI, sans', fontSize: '1.5rem' }}>Joseph Harrison-Lim</h1>
            <blockquote
              className="max-1000 p-2 text-center"
              ref={bioRef}
              style={{ fontSize: '1.25rem' }}
            >
              Front End Developer. DevOps Engineer. Tech Blogger.
            </blockquote>
          </div>
          <blockquote className="max-1000 p-2">
            Find me on <a href="https://github.com/jharrilim">GitHub</a> or{' '}
            <a href="https://linkedin.com/in/joseph-harrison-lim">LinkedIn</a>.
          </blockquote>
        </div>
        <div className="flex justify-center items-end pb-2">
          <div
            className={clsx(
              'down-arrow',
              !atTopOfPage && 'down-arrow-hidden'
            )}
            onClick={downArrowClick}
          >
            <span>⬇</span>
          </div>
        </div>
      </section>
      <section ref={section2Ref} className="section-2 py-2 px-8">
        <h2 id="blog-posts">
          <a href="#blog-posts" onClick={scrollToBlogPosts}>
            Blog Posts
          </a>
        </h2>
        <div className="blog-posts">
          {data.allMarkdownRemark.edges.map(({ node: { frontmatter } }) => (
            <div key={frontmatter.slug} className="blog-post-item pl-8 py-3">
              <h3 className="blog-title">
                <Link to={frontmatter.slug}>
                  {frontmatter.title}
                </Link>
              </h3>
              <p>{frontmatter.date}</p>
            </div>
          ))}
        </div>
      </section>
      <section ref={section3Ref} className="section-3">
        <h2 className="px-8 pt-4">
          <a href="#about-me">
            About Me
          </a>
        </h2>
        <div className="section-3-content grid">
          <div className="px-8">
            <h2>Things I like</h2>
            <ul>
              <li>GraphQL</li>
              <li>React</li>
              <li>Rust</li>
            </ul>
          </div>
          <div>
            <img src={sepImg1} alt="Me" />
          </div>
        </div>
      </section>
    </Main>
  );
};

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      limit: 10
      sort: { fields: frontmatter___date, order: DESC }
      filter: { frontmatter: { published: { eq: true } } }
    ) {
      edges {
        node {
          frontmatter {
            title
            slug
            published
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;

export default IndexPage;
