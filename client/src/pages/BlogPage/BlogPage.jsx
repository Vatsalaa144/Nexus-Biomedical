import React from "react";
import BlogCard from "../../components/BlogCard/BlogCard";
import blogData from "../../data/blogData";
import "./BlogPage.css";

const BlogPage = () => {
  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <h1 className="page-title">Our Blogs</h1>
          <p className="page-subtitle">
            Stay updated with the latest research, news, and insights in
            Bio-Medical And Allied Health Science
          </p>
        </div>
      </section>

      <section className="all-blogs-section">
        <div className="container">
          <div className="blog-categories">
            <button className="category-btn active">All Articles</button>
          </div>

          <div className="all-blogs-grid">
            {blogData.map((blog) => (
              <BlogCard key={blog.id} blog={blog} compact={false} />
            ))}
          </div>

          {/* Pagination would go here */}
          {/* <div className="pagination">
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">Next →</button>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default React.memo(BlogPage);
