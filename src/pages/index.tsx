import React, { FC, useRef, useEffect, useState, useCallback } from 'react';
import { Link, graphql, PageProps } from 'gatsby';

import clsx from 'clsx';

import Main from '../layouts/main';
import SEO from '../components/seo';
import banner1 from '../images/photos/me-banner-1.jpg';
import banner1transparent from '../images/photos/me-banner-1-transparent.png';

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
  const tvRef = useRef<HTMLDivElement | null>(null);
  const tvBackgroundRef = useRef<HTMLImageElement | null>(null);
  const bioRef = useRef<HTMLElement | null>(null);
  const section2Ref = useRef<HTMLElement | null>(null);
  const [showScrollDownButton, setShowScrollDownButton] = useState(true);
  const onScroll = (ev: Event) => {
    const shouldShow = document.documentElement.scrollTop === 0;
    setShowScrollDownButton(shouldShow);
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
      top: distanceFromTop - 58,
      behavior: 'smooth',
    });
  }, [section2Ref.current]);

  const downArrowClick = () => {
    if (!showScrollDownButton) return;
    scrollToBlogPosts();
  };

  return (
    <Main>
      <SEO title="Home" />
      <section className="section-1 grid px-4">
        <div className="flex items-center justify-center pt-4">
          <div ref={tvRef} className="tv-bezel">
            <div className="scanlines tv-screen">
              <img
                ref={tvBackgroundRef}
                className="tv-background"
                src={banner1}
              />
              <p className="tv-title p-1">
                <span>Joseph Harrison-Lim</span>
                <br />
                <span>Software Developer</span>
              </p>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  zIndex: 102,
                }}
              >
                <img
                  className="tv-foreground"
                  src={banner1transparent}
                  alt="me"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex section-1-quotes flex-col items-center justify-evenly px-4">
          <blockquote
            className="max-1000 p-2 text-center"
            ref={bioRef}
            style={{ fontSize: '1.25rem' }}
          >
            Front End Developer. DevOps Engineer. Tech Blogger.
          </blockquote>
          <blockquote className="max-1000 p-2">
            Find me on <a href="https://github.com/jharrilim">GitHub</a> or{' '}
            <a href="https://linkedin.com/in/joseph-harrison-lim">LinkedIn</a>.
          </blockquote>
        </div>
        <div className="flex justify-center items-end pb-2">
          <div
            className={clsx(
              'down-arrow',
              !showScrollDownButton && 'down-arrow-hidden'
            )}
            onClick={downArrowClick}
          >
            <span>⬇</span>
          </div>
        </div>
      </section>
      <section ref={section2Ref} className="section-2 p-2">
        <h2 id="blog-posts">
          <a href="#blog-posts" onClick={scrollToBlogPosts}>
            Blog Posts
          </a>
        </h2>
        <div className="blog-posts">
          {data.allMarkdownRemark.edges.map(({ node: { frontmatter } }) => (
            <div key={frontmatter.slug} className="px-1 py-3">
              <Link to={frontmatter.slug}>
                <h3 className="blog-title">{frontmatter.title}</h3>
              </Link>
              <p>{frontmatter.date}</p>
            </div>
          ))}
        </div>
        <div
          className="blog-posts-image flex justify-center"
          style={{ backgroundImage: `url(${sepImg1})` }}
        >
          <div className="flex justify-center items-end pb-2">
            <div className={clsx('down-arrow')} onClick={downArrowClick}>
              <span>⬇</span>
            </div>
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
