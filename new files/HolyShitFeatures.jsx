import React, { useState, useEffect } from 'react';

const features = [
  {
    id: 1,
    name: "THE PRE-MORTEM",
    tagline: "Before you decide, let me show you every way this could fail.",
    icon: "💀",
    color: "#FF3366",
    gradient: "linear-gradient(135deg, #FF3366 0%, #FF6B6B 50%, #C44569 100%)",
    description: "User makes a decision → Council runs a pre-mortem simulation → AI agents roleplay the future where the decision FAILED and work backward to explain why.",
    output: "Here are 7 ways this decision fails, ranked by probability",
    clinchers: [
      "Based on Gary Klein's actual decision science research",
      "Executives have been burned before - this speaks to their fear",
      "No one else does this"
    ],
    demo: {
      input: "Expand into European market Q2 2025",
      stages: ["Simulating failure scenarios...", "Agents debating causality...", "Ranking by probability..."],
      results: [
        { risk: "Regulatory delays", prob: 73, cost: "$2.1M" },
        { risk: "Talent acquisition gap", prob: 61, cost: "$890K" },
        { risk: "Currency exposure", prob: 54, cost: "$1.4M" },
        { risk: "Partner misalignment", prob: 48, cost: "$620K" },
        { risk: "Cultural integration", prob: 42, cost: "$340K" },
        { risk: "Tech stack incompatibility", prob: 31, cost: "$780K" },
        { risk: "Competitive response", prob: 28, cost: "$1.8M" }
      ]
    }
  },
  {
    id: 2,
    name: "THE GHOST BOARD",
    tagline: "Rehearse your board meeting with AI directors before the real one.",
    icon: "👻",
    color: "#7C4DFF",
    gradient: "linear-gradient(135deg, #7C4DFF 0%, #B388FF 50%, #651FFF 100%)",
    description: "Before presenting to the actual board, run your proposal through simulated board members who fight back harder than the real thing.",
    output: "Here are the 12 questions your board will ask, with suggested answers",
    clinchers: [
      "EVERY executive is terrified of board meetings",
      "Practice with AI that fights back harder than the real board",
      "Never walk in unprepared again"
    ],
    personas: [
      { emoji: "🎯", name: "The Skeptical VC", question: "What's the exit multiple?" },
      { emoji: "🛡️", name: "The Risk-Averse Independent", question: "What's our liability exposure?" },
      { emoji: "📈", name: "The Growth Obsessed", question: "Why isn't this bigger?" },
      { emoji: "🔬", name: "The Industry Expert", question: "Our competitors tried this in 2019..." }
    ]
  },
  {
    id: 3,
    name: "DECISION DEBT DASHBOARD",
    tagline: "See every decision that's stuck, who's blocking it, and what it's costing you per day.",
    icon: "📊",
    color: "#00BFA5",
    gradient: "linear-gradient(135deg, #00BFA5 0%, #64FFDA 50%, #1DE9B6 100%)",
    description: "Visual dashboard showing all pending decisions, days stuck, cost of delay, blockers, dependencies, and your company's overall Decision Debt score.",
    output: "We're losing $50K/day on stuck decisions",
    clinchers: [
      "Makes invisible organizational dysfunction VISIBLE",
      "Executives love dashboards that expose problems",
      "No one else quantifies decision debt"
    ],
    metrics: [
      { label: "Decisions Stuck", value: "47", trend: "up" },
      { label: "Avg Days Blocked", value: "12.3", trend: "up" },
      { label: "Daily Burn Rate", value: "$52,400", trend: "up" },
      { label: "Decision Debt Score", value: "C-", trend: "down" }
    ]
  },
  {
    id: 4,
    name: "LIVE DEMO MODE",
    tagline: "Let's connect to YOUR data right now and run a real deliberation.",
    icon: "⚡",
    color: "#FF9100",
    gradient: "linear-gradient(135deg, #FF9100 0%, #FFAB40 50%, #FF6D00 100%)",
    description: "During the sales demo: connect to their actual system, run a real Council deliberation on something THEY care about, with their data, their context, real recommendations.",
    output: "I need to know what it says about [X]...",
    clinchers: [
      "Proves it's not vaporware",
      "They see THEIR company, not fake demo data",
      "Creates immediate emotional investment"
    ],
    steps: [
      { step: 1, text: "Read-only access granted", icon: "🔐" },
      { step: 2, text: "Datacendia connects live", icon: "🔌" },
      { step: 3, text: "Real Council deliberation", icon: "🧠" },
      { step: 4, text: "Their data, real insights", icon: "💎" }
    ]
  },
  {
    id: 5,
    name: "REGULATORY INSTANT-ABSORB",
    tagline: "Drop in any regulation. The Council knows it in 60 seconds.",
    icon: "📜",
    color: "#2979FF",
    gradient: "linear-gradient(135deg, #2979FF 0%, #82B1FF 50%, #448AFF 100%)",
    description: "Upload any PDF - EU AI Act, HIPAA, industry regulation, internal policy. The Council instantly incorporates it into all future deliberations.",
    output: "Wait, it just... learned our new policy?",
    clinchers: [
      "Regulations change constantly",
      "Compliance teams are drowning",
      "No one else does instant context injection"
    ],
    docs: [
      { name: "EU AI Act 2024", pages: 892, time: "47s" },
      { name: "HIPAA Guidelines", pages: 234, time: "18s" },
      { name: "SOX Compliance", pages: 156, time: "12s" },
      { name: "Internal Policy v4.2", pages: 45, time: "4s" }
    ]
  }
];

export default function HolyShitFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [demoStage, setDemoStage] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const feature = features[activeFeature];

  useEffect(() => {
    setIsAnimating(true);
    setDemoStage(0);
    setShowResults(false);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeFeature]);

  const runDemo = () => {
    setDemoStage(0);
    setShowResults(false);
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      setDemoStage(stage);
      if (stage >= 3) {
        clearInterval(interval);
        setTimeout(() => setShowResults(true), 500);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: "'Space Grotesk', 'SF Pro Display', -apple-system, sans-serif",
      color: '#fff',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridPulse 20s ease-in-out infinite'
      }} />

      {/* Glow orb following active feature color */}
      <div style={{
        position: 'fixed',
        top: '20%',
        right: '10%',
        width: '600px',
        height: '600px',
        background: `radial-gradient(circle, ${feature.color}20 0%, transparent 70%)`,
        filter: 'blur(80px)',
        transition: 'background 0.8s ease',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <header style={{
        position: 'relative',
        padding: '60px 80px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: '14px',
            letterSpacing: '4px',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase'
          }}>Datacendia</span>
          <div style={{
            width: '40px',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)'
          }} />
        </div>
        <h1 style={{
          fontSize: '64px',
          fontWeight: 700,
          margin: 0,
          background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-2px'
        }}>
          🔥 The 5 "Holy Shit" Features
        </h1>
        <p style={{
          fontSize: '20px',
          color: 'rgba(255,255,255,0.5)',
          marginTop: '12px',
          fontWeight: 300
        }}>The demos that close deals.</p>
      </header>

      {/* Feature Navigation */}
      <nav style={{
        display: 'flex',
        gap: '0',
        padding: '0 80px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        zIndex: 10
      }}>
        {features.map((f, idx) => (
          <button
            key={f.id}
            onClick={() => setActiveFeature(idx)}
            style={{
              flex: 1,
              padding: '24px 20px',
              background: activeFeature === idx ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: 'none',
              borderBottom: activeFeature === idx ? `3px solid ${f.color}` : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            <div style={{
              fontSize: '28px',
              marginBottom: '8px',
              filter: activeFeature === idx ? 'none' : 'grayscale(0.5)',
              transition: 'filter 0.3s ease'
            }}>{f.icon}</div>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: activeFeature === idx ? '#fff' : 'rgba(255,255,255,0.4)',
              letterSpacing: '1px',
              transition: 'color 0.3s ease'
            }}>{f.name}</div>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        padding: '80px',
        position: 'relative',
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
        transition: 'all 0.5s ease'
      }}>
        {/* Left: Feature Info */}
        <div>
          {/* Feature Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: feature.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              boxShadow: `0 20px 60px ${feature.color}40`
            }}>
              {feature.icon}
            </div>
            <div>
              <div style={{
                fontSize: '12px',
                letterSpacing: '3px',
                color: feature.color,
                marginBottom: '4px'
              }}>FEATURE {feature.id}</div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: 700,
                margin: 0,
                letterSpacing: '-1px'
              }}>{feature.name}</h2>
            </div>
          </div>

          {/* Tagline */}
          <blockquote style={{
            fontSize: '24px',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.9)',
            borderLeft: `4px solid ${feature.color}`,
            paddingLeft: '24px',
            margin: '0 0 32px 0',
            lineHeight: 1.5
          }}>
            "{feature.tagline}"
          </blockquote>

          {/* Description */}
          <p style={{
            fontSize: '17px',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '40px'
          }}>
            {feature.description}
          </p>

          {/* Output */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '40px'
          }}>
            <div style={{
              fontSize: '11px',
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}>Sample Output</div>
            <div style={{
              fontSize: '18px',
              color: feature.color,
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              → "{feature.output}"
            </div>
          </div>

          {/* Why It's a Deal Clincher */}
          <div>
            <h3 style={{
              fontSize: '14px',
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>Why It's a Deal Clincher</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {feature.clinchers.map((clincher, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: feature.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>✓</div>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{clincher}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive Demo */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Demo glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle, ${feature.color}10 0%, transparent 60%)`,
            pointerEvents: 'none'
          }} />

          <div style={{
            fontSize: '11px',
            letterSpacing: '3px',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '24px',
            textTransform: 'uppercase',
            position: 'relative'
          }}>Interactive Preview</div>

          {/* Feature-specific demos */}
          {activeFeature === 0 && (
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Decision Input</div>
                <div style={{ color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>
                  {feature.demo.input}
                </div>
              </div>

              <button onClick={runDemo} style={{
                width: '100%',
                padding: '16px',
                background: feature.gradient,
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '24px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
                Run Pre-Mortem Simulation 💀
              </button>

              {demoStage > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  {feature.demo.stages.slice(0, demoStage).map((stage, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 0',
                      color: feature.color,
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <span style={{ animation: 'pulse 1s infinite' }}>⚡</span>
                      {stage}
                    </div>
                  ))}
                </div>
              )}

              {showResults && (
                <div style={{
                  animation: 'slideUp 0.5s ease'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '16px',
                    color: feature.color
                  }}>Failure Modes Identified:</div>
                  {feature.demo.results.map((result, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>{result.risk}</span>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <span style={{
                          color: result.prob > 60 ? '#FF3366' : result.prob > 40 ? '#FF9100' : '#00BFA5',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '14px'
                        }}>{result.prob}%</span>
                        <span style={{
                          color: 'rgba(255,255,255,0.4)',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '14px'
                        }}>{result.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeFeature === 1 && (
            <div>
              <div style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '24px'
              }}>Your AI Board Members:</div>
              {feature.personas.map((persona, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '28px' }}>{persona.emoji}</span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{persona.name}</span>
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontStyle: 'italic',
                    paddingLeft: '40px'
                  }}>
                    "{persona.question}"
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeFeature === 2 && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px'
              }}>
                {feature.metrics.map((metric, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.4)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>{metric.label}</div>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: metric.trend === 'up' ? '#FF3366' : '#00BFA5'
                    }}>{metric.value}</div>
                  </div>
                ))}
              </div>
              <div style={{
                background: `linear-gradient(135deg, ${feature.color}20, transparent)`,
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${feature.color}40`,
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                  ⚠️ You're bleeding <strong style={{ color: '#FF3366' }}>$52,400/day</strong> on decision paralysis
                </span>
              </div>
            </div>
          )}

          {activeFeature === 3 && (
            <div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0'
              }}>
                {feature.steps.map((s, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '24px 0',
                    borderBottom: idx < feature.steps.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: feature.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      boxShadow: `0 10px 30px ${feature.color}30`
                    }}>{s.icon}</div>
                    <div>
                      <div style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.4)',
                        marginBottom: '4px'
                      }}>Step {s.step}</div>
                      <div style={{ fontWeight: 600 }}>{s.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeFeature === 4 && (
            <div>
              <div style={{
                border: '2px dashed rgba(255,255,255,0.2)',
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
                marginBottom: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
                <div style={{ color: 'rgba(255,255,255,0.5)' }}>Drop any regulation PDF</div>
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Recently Absorbed:</div>
              {feature.docs.map((doc, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: feature.color }}>✓</span>
                    <span>{doc.name}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.4)'
                  }}>
                    <span>{doc.pages} pages</span>
                    <span style={{ color: '#00BFA5 ' }}>{doc.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '40px 80px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
          These are the features that make competitors nervous.
        </div>
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {features.map((f, idx) => (
            <div key={idx} style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: activeFeature === idx ? f.color : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px ${feature.color}50 !important;
        }
      `}</style>
    </div>
  );
}
