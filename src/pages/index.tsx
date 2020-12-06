import React, { FC, useRef, useEffect, useState, useCallback } from 'react';
import { Link, graphql, PageProps, useStaticQuery } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import clsx from 'clsx';

import Main from '../layouts/main';
import SEO from '../components/seo';

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
  p1: {
    childImageSharp: {
      fluid: FluidObject;
    }
  };
  p2: {
    childImageSharp: {
      fluid: FluidObject;
    }
  };
  p3: {
    childImageSharp: {
      fluid: FluidObject;
    }
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
              Full Stack Developer. DevOps Engineer. Tech Blogger.
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
      <section ref={section2Ref} className="section-2 py-2 px-8 md:container md:mx-auto">
        <h2 id="blog-posts" className="pb-8">
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
      <section ref={section3Ref} className="section-3 py-8 px-8  lg:container lg:mx-auto ">
        <h2 id="gallery" className="pb-8">
          <a href="#gallery">
            Gallery
          </a>
        </h2>
        <div className="pt-12flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-3">
          <Img
            className="rounded"
            fluid={data.p1.childImageSharp.fluid}
            alt="Toronto, downtown"
          />
          <div className="p-8 flex items-center">
            <div>
              <blockquote className="p-4 border-l-4 border-black">Inspirational instagramable blurb.</blockquote>
            </div>
          </div>
          <div className="p-8 hidden lg:flex items-center justify-end">
            <blockquote className="p-4 border-r-4 border-black">
              Deep quote about life.
            </blockquote>
          </div>
          <Img
            className="rounded"
            fluid={data.p2.childImageSharp.fluid}
            alt="Toronto, downtown"
          />
          <div className="p-8 lg:hidden flex items-center">
            <blockquote className="p-4 border-l-4 border-black">
              Deep quote about life.
            </blockquote>
          </div>
          <Img
            className="rounded"
            fluid={data.p3.childImageSharp.fluid}
            alt="Toronto, downtown"
          />
          <div className="p-8 flex items-center">
            <blockquote className="p-4 border-l-4 border-black">
              Statement of gratitude.
            </blockquote>
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
    p1: file(relativePath: { eq: "photos/20200114_201414.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    p2: file(relativePath: { eq: "photos/20200114_201423.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    p3: file(relativePath: { eq: "photos/20200114_201432.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;

export default IndexPage;
