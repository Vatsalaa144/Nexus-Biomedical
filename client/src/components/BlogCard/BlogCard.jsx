import React from "react";
import { Link } from "react-router-dom";
import "./BlogCard.css";

const BlogCard = ({ blog, compact = false }) => {
  return (
    <article className={`blog-card ${compact ? "compact" : ""}`}>
      <div className="blog-image">
        <img src={blog.image} alt={blog.title} />
      </div>
      <div className="blog-content">
        <span className="blog-category">{blog.category}</span>
        <h3 className="blog-title">
          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p className="blog-excerpt">{blog.excerpt}</p>
        <div className="blog-meta">
          <Link to={`/blog/${blog.slug}`} className="blog-read-more">
            Read More →
          </Link>
        </div>
        {!compact && (
          <div className="blog-author">
            <span>By {blog.author}</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default React.memo(BlogCard);
