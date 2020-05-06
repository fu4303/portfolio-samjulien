import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import SEO from 'components/SEO'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import Container from 'components/Container'
import Layout from '../components/Layout'
import Link from '../components/Link'
import { fonts } from '../lib/typography'
import Share from '../components/Share'
import config from '../../config/website'
import { bpMaxSM } from '../lib/breakpoints'

const DateText = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${props => (props.showDateUpdated ? '10px' : '20px')};
  h3,
  span {
    text-align: center;
    font-size: 15px;
    opacity: 0.6;
    font-family: ${fonts.regular}, sans-serif;
    font-weight: normal;
    margin: 0 5px;
  }
`

export default function Post({
  data: { site, mdx },
  pageContext: { next, prev },
}) {
  const { date, title, banner, date_updated, ogimage } = mdx.frontmatter
  const keywords = site.siteMetadata.keywords
  const showDateUpdated = date_updated && date_updated > date
  const ogImagePath = ogimage && ogimage.childImageSharp.fixed.src

  return (
    <Layout frontmatter={mdx.frontmatter}>
      <SEO frontmatter={mdx.frontmatter} isBlogPost postImage={ogImagePath} />
      <article
        css={css`
          width: 100%;
          display: flex;
        `}
      >
        <Container>
          <h1
            css={css`
              text-align: center;
              margin-bottom: 20px;
            `}
          >
            {title}
          </h1>
          <DateText showDateUpdated={showDateUpdated}>
            {date && <h3>First Published: {date}</h3>}
          </DateText>
          {showDateUpdated && (
            <DateText>
              <h3>Last Updated: {date_updated}</h3>
            </DateText>
          )}
          {banner && (
            <div
              css={css`
                padding: 30px;
                ${bpMaxSM} {
                  padding: 0;
                }
              `}
            >
              <Img
                sizes={banner.childImageSharp.fluid}
                alt={keywords.join(', ')}
              />
            </div>
          )}
          <br />
          <MDXRenderer>{mdx.body}</MDXRenderer>
          <br />
          <Link
            to="/writing"
            aria-label="Visit bwriting"
            className="button-secondary"
          >
            ← Back to writing
          </Link>
        </Container>
      </article>
      <Container noVerticalPadding>
        <Share
          url={`${config.siteUrl}/${mdx.frontmatter.slug}/`}
          title={title}
          twitterHandle={config.twitterHandle}
        />
      </Container>
      <br />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    site {
      siteMetadata {
        keywords
      }
    }
    mdx(fields: { id: { eq: $id } }) {
      frontmatter {
        title
        description
        date(formatString: "MMMM Do, YYYY")
        date_updated(formatString: "MMMM Do, YYYY")
        author
        ogimage {
          childImageSharp {
            fixed(height: 630, width: 1200) {
              src
            }
          }
        }
        banner {
          childImageSharp {
            fluid(maxWidth: 900) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        slug
        tags
      }
      body
    }
  }
`
