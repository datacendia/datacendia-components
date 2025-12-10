import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, ArrowRight, User } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const posts = [
    {
      title: 'Introducing Chronos: See Your Organization Through Time',
      excerpt: 'Navigate your company\'s past, present, and future with our new temporal intelligence feature.',
      date: 'December 2024',
      author: 'Datacendia Team',
      category: 'Product',
      href: '/cortex/intelligence/chronos',
    },
    {
      title: 'The Case for Sovereign AI Deployment',
      excerpt: 'Why enterprises need complete control over their AI infrastructure and decision systems.',
      date: 'November 2024',
      author: 'Datacendia Team',
      category: 'Insights',
      href: '/manifesto',
    },
    {
      title: 'Decision Intelligence: Beyond Business Intelligence',
      excerpt: 'How AI-powered decision councils are transforming enterprise strategy.',
      date: 'October 2024',
      author: 'Datacendia Team',
      category: 'Insights',
      href: '/product',
    },
    {
      title: 'Air-Gapped Deployment Guide',
      excerpt: 'Complete walkthrough for deploying Datacendia on isolated, secure networks.',
      date: 'September 2024',
      author: 'Datacendia Team',
      category: 'Technical',
      href: '/docs',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Datacendia</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/product" className="text-neutral-600 hover:text-neutral-900">Product</Link>
            <Link to="/manifesto" className="text-neutral-600 hover:text-neutral-900">Manifesto</Link>
            <Link to="/contact" className="text-neutral-600 hover:text-neutral-900">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h1 className="text-3xl font-bold mb-4">Blog & Insights</h1>
          <p className="text-neutral-400">
            Thoughts on decision intelligence, sovereign AI, and enterprise technology.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {posts.map((post, index) => (
              <article key={index} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                  <span className="px-2 py-1 bg-neutral-100 rounded text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-neutral-600 mb-4">{post.excerpt}</p>
                <Link 
                  to={post.href}
                  className="inline-flex items-center gap-2 text-neutral-900 font-medium hover:underline"
                >
                  Read more <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-neutral-600 mb-6">
            Get notified about new features and insights.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
          >
            Subscribe
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-100 py-8 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Datacendia, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
