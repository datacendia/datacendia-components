// @ts-nocheck
import React, { useState, useEffect } from 'react';

const councilAgents = [
  { id: 'cfo', name: 'CFO Agent', emoji: '💰', role: 'Financial Perspective', color: '#10b981' },
  { id: 'coo', name: 'COO Agent', emoji: '⚙️', role: 'Operational Reality', color: '#f59e0b' },
  { id: 'cro', name: 'CRO Agent', emoji: '📈', role: 'Revenue Impact', color: '#6366f1' },
  { id: 'ciso', name: 'CISO Agent', emoji: '🛡️', role: 'Risk & Security', color: '#ef4444' },
  { id: 'strategy', name: 'Strategy Agent', emoji: '🎯', role: 'Long-term Thinking', color: '#8b5cf6' },
  { id: 'hr', name: 'CHRO Agent', emoji: '👥', role: 'People Impact', color: '#ec4899' },
  { id: 'legal', name: 'Legal Agent', emoji: '⚖️', role: 'Compliance & Risk', color: '#14b8a6' },
  { id: 'devils', name: "Devil's Advocate", emoji: '😈', role: 'Challenge Everything', color: '#f97316' }
];

const holyShitFeatures = [
  {
    icon: '💀',
    name: 'The Pre-Mortem',
    tagline: 'See every way your decision could fail before you make it',
    description: 'Based on Gary Klein\'s decision science research. The Council simulates failure and works backward to show you the risks.'
  },
  {
    icon: '👻',
    name: 'The Ghost Board',
    tagline: 'Rehearse your board meeting with AI directors',
    description: 'Practice presentations against skeptical VCs, risk-averse independents, and growth-obsessed board members.'
  },
  {
    icon: '📊',
    name: 'Decision Debt Dashboard',
    tagline: 'See what indecision costs you per day',
    description: 'Visualize every stuck decision, who\'s blocking it, and calculate the exact cost of delay.'
  },
  {
    icon: '⚡',
    name: 'Live Demo Mode',
    tagline: 'Connect your data. See real insights instantly.',
    description: 'During demos, connect to your actual systems and watch the Council analyze your real decisions.'
  },
  {
    icon: '📜',
    name: 'Regulatory Instant-Absorb',
    tagline: 'Upload any regulation. Known in 60 seconds.',
    description: 'Drop in the EU AI Act, HIPAA updates, or any policy. The Council instantly incorporates it.'
  }
];

const testimonials = [
  {
    quote: "We reduced our strategic decision time from 47 days to 12. The ROI was obvious within the first quarter.",
    author: "Sarah Chen",
    title: "CFO, Fortune 500 Healthcare Company",
    metric: "75% faster decisions"
  },
  {
    quote: "The Pre-Mortem feature saved us from a $40M acquisition that would have failed. It predicted three issues we hadn't considered.",
    author: "Michael Torres",
    title: "CEO, Private Equity Portfolio Company",
    metric: "$40M saved"
  },
  {
    quote: "Ghost Board helped me prepare for the most important presentation of my career. I walked in knowing every question they'd ask.",
    author: "Jennifer Wu",
    title: "COO, Series C Startup",
    metric: "Board approved unanimously"
  }
];

const industries = [
  { name: 'Financial Services', icon: '🏦' },
  { name: 'Healthcare', icon: '🏥' },
  { name: 'Technology', icon: '💻' },
  { name: 'Manufacturing', icon: '🏭' },
  { name: 'Energy', icon: '⚡' },
  { name: 'Retail', icon: '🛒' }
];

export default function MarketingPage() {
  const [activeAgent, setActiveAgent] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const agentInterval = setInterval(() => {
      setActiveAgent(prev => (prev + 1) % councilAgents.length);
    }, 2000);
    return () => clearInterval(agentInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#fff',
      overflowX: 'hidden'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '16px 40px',
        background: scrolled ? 'rgba(10, 10, 15, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 800, 
          letterSpacing: '-1px',
          background: 'linear-gradient(135deg, #fff, #6366f1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Datacendia
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Features</a>
          <a href="#council" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>The Council</a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Pricing</a>
          <button style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '120px 20px 80px',
        position: 'relative'
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)'
        }} />

        {/* Glowing orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', maxWidth: '900px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '100px',
            padding: '8px 20px',
            fontSize: '14px',
            color: '#a5b4fc',
            marginBottom: '32px'
          }}>
            <span style={{ animation: 'pulse 2s infinite' }}>●</span>
            <span>Decision Intelligence Platform</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 80px)',
            fontWeight: 800,
            lineHeight: 1.1,
            margin: '0 0 24px 0',
            letterSpacing: '-3px'
          }}>
            <span style={{ color: '#fff' }}>Your Executive Team.</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7, #6366f1)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient 5s ease infinite'
            }}>
              Powered by AI.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '700px',
            margin: '0 auto 48px',
            lineHeight: 1.6
          }}>
            The Council brings 8 AI executives to every decision. 
            They debate, challenge, and advise—so you decide with confidence.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              padding: '18px 40px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              Start Free Trial
              <span>→</span>
            </button>
            <button style={{
              padding: '18px 40px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>▶</span>
              Watch Demo
            </button>
          </div>

          {/* Trust badges */}
          <div style={{
            marginTop: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Trusted by decision-makers at
            </div>
            <div style={{ display: 'flex', gap: '48px', alignItems: 'center', opacity: 0.4 }}>
              {['Fortune 500', 'Series B+', 'Private Equity', 'Government'].map(badge => (
                <div key={badge} style={{ fontSize: '18px', fontWeight: 600 }}>{badge}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Council Section */}
      <section id="council" style={{
        padding: '120px 20px',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              marginBottom: '16px',
              letterSpacing: '-2px'
            }}>
              Meet The Council
            </h2>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Eight AI executives with distinct perspectives. They deliberate, debate, and disagree—just like a real leadership team.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {councilAgents.map((agent, index) => (
              <div
                key={agent.id}
                style={{
                  padding: '32px',
                  background: activeAgent === index 
                    ? `linear-gradient(135deg, ${agent.color}15, transparent)`
                    : 'rgba(255,255,255,0.02)',
                  border: activeAgent === index 
                    ? `1px solid ${agent.color}50`
                    : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setActiveAgent(index)}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: '20px'
                }}>
                  {agent.emoji}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
                  {agent.name}
                </h3>
                <p style={{ color: agent.color, fontSize: '14px', margin: 0 }}>
                  {agent.role}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '60px',
            padding: '40px',
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '20px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '24px', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', margin: '0 0 16px' }}>
              "The Council Sees Everything. Decides Nothing. Advises Perfectly."
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>
              You always make the final call. The Council just makes sure you've considered every angle.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: '120px 20px',
        background: '#0a0a0f'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '100px',
              fontSize: '14px',
              color: '#f87171',
              marginBottom: '24px'
            }}>
              🔥 Features That Close Deals
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              marginBottom: '16px',
              letterSpacing: '-2px'
            }}>
              The "Holy Shit" Features
            </h2>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Five capabilities that make executives say "I need this."
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {holyShitFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => setActiveFeature(index)}
                style={{
                  display: 'flex',
                  gap: '32px',
                  padding: '40px',
                  background: activeFeature === index 
                    ? 'rgba(99, 102, 241, 0.05)'
                    : 'rgba(255,255,255,0.02)',
                  border: activeFeature === index 
                    ? '1px solid rgba(99, 102, 241, 0.3)'
                    : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  flexShrink: 0
                }}>
                  {feature.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                    {feature.name}
                  </h3>
                  <p style={{ 
                    fontSize: '18px', 
                    color: '#a5b4fc', 
                    marginBottom: '8px',
                    fontStyle: 'italic'
                  }}>
                    {feature.tagline}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '15px' }}>
                    {feature.description}
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: activeFeature === index ? '#6366f1' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                  transition: 'all 0.3s ease'
                }}>
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section style={{
        padding: '120px 20px',
        background: 'linear-gradient(180deg, #12121a 0%, #0a0a0f 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              marginBottom: '16px',
              letterSpacing: '-2px'
            }}>
              Decisions That Changed Companies
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  padding: '40px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '20px'
                }}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '100px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#10b981',
                  marginBottom: '24px'
                }}>
                  {testimonial.metric}
                </div>
                <p style={{
                  fontSize: '18px',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '32px'
                }}>
                  "{testimonial.quote}"
                </p>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{testimonial.author}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section style={{
        padding: '120px 20px',
        background: '#0a0a0f'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800,
            marginBottom: '16px',
            letterSpacing: '-2px'
          }}>
            Built for Your Industry
          </h2>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '600px',
            margin: '0 auto 60px'
          }}>
            The Council understands the unique decision patterns of every sector.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px'
          }}>
            {industries.map(industry => (
              <div
                key={industry.name}
                style={{
                  padding: '20px 32px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '16px'
                }}
              >
                <span style={{ fontSize: '24px' }}>{industry.icon}</span>
                <span>{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '120px 20px',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '80px 40px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              marginBottom: '16px',
              letterSpacing: '-2px'
            }}>
              Ready to Decide Better?
            </h2>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '40px'
            }}>
              Start your 14-day free trial. No credit card required.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{
                padding: '20px 48px',
                background: '#fff',
                border: 'none',
                borderRadius: '12px',
                color: '#0a0a0f',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Start Free Trial
              </button>
              <button style={{
                padding: '20px 48px',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Schedule Demo
              </button>
            </div>

            <p style={{
              marginTop: '32px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.4)'
            }}>
              Join 500+ organizations making better decisions
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '80px 20px 40px',
        background: '#0a0a0f',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 800, 
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #fff, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Datacendia
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: 1.7 }}>
              Decision Intelligence Platform.<br />
              The Council Sees Everything.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'rgba(255,255,255,0.6)' }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Features', 'The Council', 'Pricing', 'Enterprise', 'Security'].map(item => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'rgba(255,255,255,0.6)' }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Documentation', 'API Reference', 'Blog', 'Case Studies', 'Webinars'].map(item => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'rgba(255,255,255,0.6)' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['About', 'Careers', 'Contact', 'Privacy', 'Terms'].map(item => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '40px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '14px'
        }}>
          © 2025 Datacendia. All rights reserved.
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
