import React from "react";
import { useParams, Link } from "react-router-dom";
import blogData from "../../data/blogData";
import "./BlogPostPage.css";

const BlogPostPage = () => {
  const { slug } = useParams();
  const blog = blogData.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <h1>Blog post not found</h1>
          <Link to="/blog">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <article className="blog-post">
        {/* Hero Image */}
        <div className="post-hero">
          <img src={blog.image} alt={blog.title} />
          <div className="hero-overlay"></div>
        </div>

        <div className="container">
          {/* Post Header */}
          <div className="post-header">
            <span className="post-category">{blog.category}</span>
            <h1 className="post-title">{blog.title}</h1>
            <div className="post-meta">
              <span className="post-author">By {blog.author}</span>
              <span className="post-date">{blog.date}</span>
              <span className="post-read-time">{blog.readTime}</span>
            </div>
          </div>

          {/* Post Content */}
          <div className="post-content">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Post Footer */}
          <div className="post-footer">
            <div className="post-tags">
              <span>TAGS:</span>
              <p className="tag">Toxicology</p>
              <p className="tag">Research</p>
              <p className="tag">Medical</p>
              <p className="tag">Education</p>
            </div>

            <div className="post-navigation">
              <Link to="/blog" className="back-to-blog">
                ← Back to Blog
              </Link>
            </div>

            {/* Related Posts */}
            <div className="related-posts">
              <h3>Related Articles</h3>
              <div className="related-grid">
                {blogData
                  .filter(
                    (b) => b.category === blog.category && b.id !== blog.id
                  )
                  .slice(0, 3)
                  .map((relatedBlog) => (
                    <div key={relatedBlog.id} className="related-post">
                      <Link to={`/blog/${relatedBlog.slug}`}>
                        <h4>{relatedBlog.title}</h4>
                        <span>{relatedBlog.date}</span>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default React.memo(BlogPostPage);
