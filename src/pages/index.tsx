import React, { FC, useRef, useEffect, useState, useCallback } from 'react';
import { Link, graphql, PageProps } from 'gatsby';
import { GatsbyImage as Img, IGatsbyImageData } from 'gatsby-plugin-image';
import clsx from 'clsx';

import Main from '../layouts/main';
import SEO from '../components/seo';
import Logo from '../images/i2.svg';

import './index.css';
import { animated, Spring } from 'react-spring';
import VisibilitySensor from 'react-visibility-sensor';

import { IndexContext } from '../contexts';

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
      gatsbyImageData: IGatsbyImageData;
    };
  };
  p2: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
  p3: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
}

const IndexPage: FC<PageProps<PageQuery>> = ({ data }) => {
  const titleNameRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLQuoteElement>(null);
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const section3Ref = useRef<HTMLElement>(null);
  const [atTopOfPage, setAtTopOfPage] = useState(true);
  const [hideHeader, sethideHeader] = useState(true);
  const onScroll = (ev: Event) => {
    const shouldShow = document.documentElement.scrollTop <= 200;
    setAtTopOfPage(shouldShow);

    const titleName = titleNameRef.current!.getBoundingClientRect();
    if (hideHeader) {
      sethideHeader(titleName.top > 0);
    } else {
      const bottomOfTitleName = titleName.top + titleName.height;
      sethideHeader(bottomOfTitleName > 0);
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
    <IndexContext.Provider value={{ hideHeader }}>
      <Main>
        <SEO title="Home" />
        <section ref={section1Ref} className="section-1 grid">
          <div className="section-1-hero flex items-center justify-center pt-4">
          </div>
          <div className="flex section-1-quotes flex-col items-center justify-evenly px-4">
            <div className="flex flex-col items-center" style={{ backgroundColor: 'var(--background)' }}>
              <Logo className="h-20 w-20 lg:h-24 lg:w-24" />
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
          <div className="flex justify-center items-end pb-2" style={{ zIndex: 1 }}>
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
        <section ref={section2Ref} className="section-2 pt-12 md:pt-16 pb-2 px-8 md:container mx-auto">
          <div className="w-full">
            <h2 id="blog-posts" className="pb-8">
              <a href="#blog-posts" onClick={scrollToBlogPosts}>
                Blog Posts
              </a>
            </h2>
          </div>
          <div className="blog-posts gap-8 w-full">
            {data.allMarkdownRemark.edges.map(({ node: { frontmatter } }) => (
              <div key={frontmatter.slug} className="blog-post-item pl-8 py-8">
                <div className="absolute top-0 left-0 w-8 h-8 quote-border-top-left"></div>
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
        <section ref={section3Ref} className="section-3 pb-8 px-8 pt-12 md:pt-16 lg:container lg:mx-auto">
          <h2 id="gallery" className="pb-8">
            <a href="#gallery">
              Gallery
            </a>
          </h2>
          <div className="pt-12flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-3">
            <Img
              className="rounded"
              image={data.p1.childImageSharp.gatsbyImageData}
              alt="Toronto, downtown"
            />
            <div className="p-4 lg:p-8 flex items-center">
              <div className="flex items-center min-h-full min-w-full relative">
                <VisibilitySensor>
                  {({ isVisible }) =>
                    <blockquote className="p-4 quote-border-left overflow-hidden">
                      <Spring delay={100} to={{ left: isVisible ? 0 : -500 }}>
                        {style =>
                          <animated.span style={{ left: style.left, position: 'relative' }}>
                            Inspirational instagramable blurb.
                          </animated.span>
                        }
                      </Spring>
                    </blockquote>
                  }
                </VisibilitySensor>
                <div className="hidden lg:block absolute top-0 right-0 w-8 h-8 quote-border-top-right"></div>
              </div>
            </div>
            <div className="p-8 hidden lg:flex">
              <div className="flex items-center min-h-full min-w-full relative justify-end">
                <div className="hidden lg:block absolute top-0 left-0 w-8 h-8 quote-border-top-left"></div>
                <VisibilitySensor>
                  {({ isVisible }) =>
                    <blockquote className="p-4 quote-border-right overflow-hidden">
                      <Spring delay={100} to={{ right: isVisible ? 0 : -500 }}>
                        {style =>
                          <animated.span style={{ right: style.right, position: 'relative' }}>
                            Deep quote about life.
                          </animated.span>
                        }
                      </Spring>
                    </blockquote>
                  }
                </VisibilitySensor>
              </div>
            </div>
            <Img
              className="rounded"
              image={data.p2.childImageSharp.gatsbyImageData}
              alt="Toronto, downtown"
            />
            <div className="p-4 lg:p-8 lg:hidden flex items-center">
              <VisibilitySensor>
                {({ isVisible }) =>
                  <blockquote className="p-4 quote-border-left overflow-hidden">
                    <Spring delay={100} to={{ left: isVisible ? 0 : -500 }}>
                      {style =>
                        <animated.span style={{ left: style.left, position: 'relative' }}>
                          Deep quote about life.
                        </animated.span>
                      }
                    </Spring>
                  </blockquote>
                }
              </VisibilitySensor>
            </div>
            <Img
              className="rounded"
              image={data.p3.childImageSharp.gatsbyImageData}
              alt="Toronto, downtown"
            />
            <div className="p-4 lg:p-8 flex">
              <div className="flex items-center min-h-full min-w-full relative">
                <VisibilitySensor>
                  {({ isVisible }) =>
                    <blockquote className="p-4 quote-border-left overflow-hidden">
                      <Spring delay={100} to={{ left: isVisible ? 0 : -500 }}>
                        {style =>
                          <animated.span style={{ left: style.left, position: 'relative' }}>
                            Statement of gratitude.
                          </animated.span>
                        }
                      </Spring>
                    </blockquote>
                  }
                </VisibilitySensor>
                <div className="hidden lg:block absolute bottom-0 right-0 w-8 h-8 quote-border-bottom-right"></div>
              </div>
            </div>
          </div>
        </section>
      </Main>
    </IndexContext.Provider>
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
        gatsbyImageData(layout: CONSTRAINED)
      }
    }
    p2: file(relativePath: { eq: "photos/20200114_201423.jpg" }) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED)
      }
    }
    p3: file(relativePath: { eq: "photos/20200114_201432.jpg" }) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED)
      }
    }
  }
`;

export default IndexPage;
