// @ts-nocheck
// =============================================================================
// DATACENDIA - THE HONESTY MATRICES
// Radical transparency. No exceptions.
// Premium dark theme matching Sovereign Landing Page
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { ArrowRight } from 'lucide-react';

// =============================================================================
// PREMIUM EFFECTS (matching SovereignLandingPage)
// =============================================================================

// Floating particles background
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (stryMutAct_9fa48("53238") ? false : stryMutAct_9fa48("53237") ? true : stryMutAct_9fa48("53236") ? canvas : (stryCov_9fa48("53236", "53237", "53238"), !canvas)) return;
    const ctx = canvas.getContext('2d');
    if (stryMutAct_9fa48("53242") ? false : stryMutAct_9fa48("53241") ? true : stryMutAct_9fa48("53240") ? ctx : (stryCov_9fa48("53240", "53241", "53242"), !ctx)) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = stryMutAct_9fa48("53243") ? ["Stryker was here"] : (stryCov_9fa48("53243"), []);
    const particleCount = 40;
    for (let i = 0; stryMutAct_9fa48("53246") ? i >= particleCount : stryMutAct_9fa48("53245") ? i <= particleCount : stryMutAct_9fa48("53244") ? false : (stryCov_9fa48("53244", "53245", "53246"), i < particleCount); stryMutAct_9fa48("53247") ? i-- : (stryCov_9fa48("53247"), i++)) {
      particles.push(stryMutAct_9fa48("53249") ? {} : (stryCov_9fa48("53249"), {
        x: stryMutAct_9fa48("53250") ? Math.random() / canvas.width : (stryCov_9fa48("53250"), Math.random() * canvas.width),
        y: stryMutAct_9fa48("53251") ? Math.random() / canvas.height : (stryCov_9fa48("53251"), Math.random() * canvas.height),
        vx: stryMutAct_9fa48("53252") ? (Math.random() - 0.5) / 0.2 : (stryCov_9fa48("53252"), (stryMutAct_9fa48("53253") ? Math.random() + 0.5 : (stryCov_9fa48("53253"), Math.random() - 0.5)) * 0.2),
        vy: stryMutAct_9fa48("53254") ? (Math.random() - 0.5) / 0.2 : (stryCov_9fa48("53254"), (stryMutAct_9fa48("53255") ? Math.random() + 0.5 : (stryCov_9fa48("53255"), Math.random() - 0.5)) * 0.2),
        size: stryMutAct_9fa48("53256") ? Math.random() * 2 - 0.5 : (stryCov_9fa48("53256"), (stryMutAct_9fa48("53257") ? Math.random() / 2 : (stryCov_9fa48("53257"), Math.random() * 2)) + 0.5),
        opacity: stryMutAct_9fa48("53258") ? Math.random() * 0.4 - 0.1 : (stryCov_9fa48("53258"), (stryMutAct_9fa48("53259") ? Math.random() / 0.4 : (stryCov_9fa48("53259"), Math.random() * 0.4)) + 0.1)
      }));
    }
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        stryMutAct_9fa48("53262") ? p.x -= p.vx : (stryCov_9fa48("53262"), p.x += p.vx);
        stryMutAct_9fa48("53263") ? p.y -= p.vy : (stryCov_9fa48("53263"), p.y += p.vy);
        if (stryMutAct_9fa48("53267") ? p.x >= 0 : stryMutAct_9fa48("53266") ? p.x <= 0 : stryMutAct_9fa48("53265") ? false : stryMutAct_9fa48("53264") ? true : (stryCov_9fa48("53264", "53265", "53266", "53267"), p.x < 0)) p.x = canvas.width;
        if (stryMutAct_9fa48("53271") ? p.x <= canvas.width : stryMutAct_9fa48("53270") ? p.x >= canvas.width : stryMutAct_9fa48("53269") ? false : stryMutAct_9fa48("53268") ? true : (stryCov_9fa48("53268", "53269", "53270", "53271"), p.x > canvas.width)) p.x = 0;
        if (stryMutAct_9fa48("53275") ? p.y >= 0 : stryMutAct_9fa48("53274") ? p.y <= 0 : stryMutAct_9fa48("53273") ? false : stryMutAct_9fa48("53272") ? true : (stryCov_9fa48("53272", "53273", "53274", "53275"), p.y < 0)) p.y = canvas.height;
        if (stryMutAct_9fa48("53279") ? p.y <= canvas.height : stryMutAct_9fa48("53278") ? p.y >= canvas.height : stryMutAct_9fa48("53277") ? false : stryMutAct_9fa48("53276") ? true : (stryCov_9fa48("53276", "53277", "53278", "53279"), p.y > canvas.height)) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, stryMutAct_9fa48("53280") ? Math.PI / 2 : (stryCov_9fa48("53280"), Math.PI * 2));
        ctx.fillStyle = `rgba(127, 29, 29, ${p.opacity})`;
        ctx.fill();
      });
      particles.forEach((p1, i) => {
        stryMutAct_9fa48("53283") ? particles.forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(127, 29, 29, ${0.08 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }) : (stryCov_9fa48("53283"), particles.slice(stryMutAct_9fa48("53284") ? i - 1 : (stryCov_9fa48("53284"), i + 1)).forEach(p2 => {
          const dx = stryMutAct_9fa48("53286") ? p1.x + p2.x : (stryCov_9fa48("53286"), p1.x - p2.x);
          const dy = stryMutAct_9fa48("53287") ? p1.y + p2.y : (stryCov_9fa48("53287"), p1.y - p2.y);
          const dist = Math.sqrt(stryMutAct_9fa48("53288") ? dx * dx - dy * dy : (stryCov_9fa48("53288"), (stryMutAct_9fa48("53289") ? dx / dx : (stryCov_9fa48("53289"), dx * dx)) + (stryMutAct_9fa48("53290") ? dy / dy : (stryCov_9fa48("53290"), dy * dy))));
          if (stryMutAct_9fa48("53294") ? dist >= 120 : stryMutAct_9fa48("53293") ? dist <= 120 : stryMutAct_9fa48("53292") ? false : stryMutAct_9fa48("53291") ? true : (stryCov_9fa48("53291", "53292", "53293", "53294"), dist < 120)) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(127, 29, 29, ${stryMutAct_9fa48("53297") ? 0.08 / (1 - dist / 120) : (stryCov_9fa48("53297"), 0.08 * (stryMutAct_9fa48("53298") ? 1 + dist / 120 : (stryCov_9fa48("53298"), 1 - (stryMutAct_9fa48("53299") ? dist * 120 : (stryCov_9fa48("53299"), dist / 120)))))})`;
            ctx.stroke();
          }
        }));
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, stryMutAct_9fa48("53304") ? ["Stryker was here"] : (stryCov_9fa48("53304"), []));
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Scan lines overlay
const ScanLines: React.FC = stryMutAct_9fa48("53305") ? () => undefined : (stryCov_9fa48("53305"), (() => {
  const ScanLines: React.FC = () => <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.02]" style={stryMutAct_9fa48("53306") ? {} : (stryCov_9fa48("53306"), {
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
  })} />;
  return ScanLines;
})());

// Glitch text effect
const GlitchText: React.FC<{
  children: string;
  className?: string;
}> = ({
  children,
  className
}) => {
  const [isGlitching, setIsGlitching] = useState(stryMutAct_9fa48("53309") ? true : (stryCov_9fa48("53309"), false));
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(stryMutAct_9fa48("53312") ? false : (stryCov_9fa48("53312"), true));
      setTimeout(stryMutAct_9fa48("53313") ? () => undefined : (stryCov_9fa48("53313"), () => setIsGlitching(stryMutAct_9fa48("53314") ? true : (stryCov_9fa48("53314"), false))), 150);
    }, stryMutAct_9fa48("53315") ? 6000 - Math.random() * 4000 : (stryCov_9fa48("53315"), 6000 + (stryMutAct_9fa48("53316") ? Math.random() / 4000 : (stryCov_9fa48("53316"), Math.random() * 4000))));
    return stryMutAct_9fa48("53317") ? () => undefined : (stryCov_9fa48("53317"), () => clearInterval(interval));
  }, stryMutAct_9fa48("53318") ? ["Stryker was here"] : (stryCov_9fa48("53318"), []));
  return <span className={`relative inline-block ${className}`}>
      <span className={isGlitching ? 'opacity-0' : ''}>{children}</span>
      {stryMutAct_9fa48("53324") ? isGlitching || <>
          <span className="absolute inset-0 text-red-900/80" style={{
        transform: 'translate(-2px, 0)',
        clipPath: 'inset(20% 0 30% 0)'
      }}>{children}</span>
          <span className="absolute inset-0 text-cyan-900/80" style={{
        transform: 'translate(2px, 0)',
        clipPath: 'inset(50% 0 10% 0)'
      }}>{children}</span>
          <span className="absolute inset-0">{children}</span>
        </> : stryMutAct_9fa48("53323") ? false : stryMutAct_9fa48("53322") ? true : (stryCov_9fa48("53322", "53323", "53324"), isGlitching && <>
          <span className="absolute inset-0 text-red-900/80" style={stryMutAct_9fa48("53325") ? {} : (stryCov_9fa48("53325"), {
        transform: 'translate(-2px, 0)',
        clipPath: 'inset(20% 0 30% 0)'
      })}>{children}</span>
          <span className="absolute inset-0 text-cyan-900/80" style={stryMutAct_9fa48("53328") ? {} : (stryCov_9fa48("53328"), {
        transform: 'translate(2px, 0)',
        clipPath: 'inset(50% 0 10% 0)'
      })}>{children}</span>
          <span className="absolute inset-0">{children}</span>
        </>)}
    </span>;
};

// =============================================================================
// MATRIX DATA
// =============================================================================

type MatrixCell = {
  value: string;
  status: 'good' | 'bad' | 'partial' | 'neutral';
};
type MatrixRow = {
  label: string;
  cells: MatrixCell[];
};
type Matrix = {
  id: string;
  title: string;
  question: string;
  description: string;
  icon: string;
  color: string;
  columns: string[];
  rows: MatrixRow[];
  admission: string;
  services: string[];
};
const matrices: Matrix[] = stryMutAct_9fa48("53331") ? [] : (stryCov_9fa48("53331"), [stryMutAct_9fa48("53332") ? {} : (stryCov_9fa48("53332"), {
  id: 'sovereignty',
  title: 'Sovereignty Matrix',
  question: 'How much control do I actually have?',
  description: 'Choose your deployment model based on your sovereignty requirements.',
  icon: '🏛️',
  color: '#6366F1',
  columns: stryMutAct_9fa48("53339") ? [] : (stryCov_9fa48("53339"), ['Cloud', 'Private Cloud', 'Self-Managed', 'Air-Gapped']),
  rows: stryMutAct_9fa48("53344") ? [] : (stryCov_9fa48("53344"), [stryMutAct_9fa48("53345") ? {} : (stryCov_9fa48("53345"), {
    label: 'Who controls the keys?',
    cells: stryMutAct_9fa48("53347") ? [] : (stryCov_9fa48("53347"), [stryMutAct_9fa48("53348") ? {} : (stryCov_9fa48("53348"), {
      value: 'Vendor + Provider',
      status: 'bad'
    }), stryMutAct_9fa48("53351") ? {} : (stryCov_9fa48("53351"), {
      value: 'Shared',
      status: 'partial'
    }), stryMutAct_9fa48("53354") ? {} : (stryCov_9fa48("53354"), {
      value: 'Customer',
      status: 'good'
    }), stryMutAct_9fa48("53357") ? {} : (stryCov_9fa48("53357"), {
      value: 'Customer (offline)',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53360") ? {} : (stryCov_9fa48("53360"), {
    label: 'We can see your data',
    cells: stryMutAct_9fa48("53362") ? [] : (stryCov_9fa48("53362"), [stryMutAct_9fa48("53363") ? {} : (stryCov_9fa48("53363"), {
      value: 'Yes',
      status: 'bad'
    }), stryMutAct_9fa48("53366") ? {} : (stryCov_9fa48("53366"), {
      value: 'Limited',
      status: 'partial'
    }), stryMutAct_9fa48("53369") ? {} : (stryCov_9fa48("53369"), {
      value: 'Never',
      status: 'good'
    }), stryMutAct_9fa48("53372") ? {} : (stryCov_9fa48("53372"), {
      value: 'Impossible',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53375") ? {} : (stryCov_9fa48("53375"), {
    label: 'We can access your system',
    cells: stryMutAct_9fa48("53377") ? [] : (stryCov_9fa48("53377"), [stryMutAct_9fa48("53378") ? {} : (stryCov_9fa48("53378"), {
      value: 'Yes',
      status: 'bad'
    }), stryMutAct_9fa48("53381") ? {} : (stryCov_9fa48("53381"), {
      value: 'Yes',
      status: 'bad'
    }), stryMutAct_9fa48("53384") ? {} : (stryCov_9fa48("53384"), {
      value: 'No',
      status: 'good'
    }), stryMutAct_9fa48("53387") ? {} : (stryCov_9fa48("53387"), {
      value: 'No',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53390") ? {} : (stryCov_9fa48("53390"), {
    label: 'Third parties can be compelled',
    cells: stryMutAct_9fa48("53392") ? [] : (stryCov_9fa48("53392"), [stryMutAct_9fa48("53393") ? {} : (stryCov_9fa48("53393"), {
      value: 'Yes',
      status: 'bad'
    }), stryMutAct_9fa48("53396") ? {} : (stryCov_9fa48("53396"), {
      value: 'No',
      status: 'good'
    }), stryMutAct_9fa48("53399") ? {} : (stryCov_9fa48("53399"), {
      value: 'No',
      status: 'good'
    }), stryMutAct_9fa48("53402") ? {} : (stryCov_9fa48("53402"), {
      value: 'No',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53405") ? {} : (stryCov_9fa48("53405"), {
    label: 'CLOUD Act applies',
    cells: stryMutAct_9fa48("53407") ? [] : (stryCov_9fa48("53407"), [stryMutAct_9fa48("53408") ? {} : (stryCov_9fa48("53408"), {
      value: 'Yes',
      status: 'bad'
    }), stryMutAct_9fa48("53411") ? {} : (stryCov_9fa48("53411"), {
      value: 'Partial',
      status: 'partial'
    }), stryMutAct_9fa48("53414") ? {} : (stryCov_9fa48("53414"), {
      value: 'No',
      status: 'good'
    }), stryMutAct_9fa48("53417") ? {} : (stryCov_9fa48("53417"), {
      value: 'No',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53420") ? {} : (stryCov_9fa48("53420"), {
    label: 'GDPR data residency compliant',
    cells: stryMutAct_9fa48("53422") ? [] : (stryCov_9fa48("53422"), [stryMutAct_9fa48("53423") ? {} : (stryCov_9fa48("53423"), {
      value: 'Partial',
      status: 'partial'
    }), stryMutAct_9fa48("53426") ? {} : (stryCov_9fa48("53426"), {
      value: 'Yes',
      status: 'good'
    }), stryMutAct_9fa48("53429") ? {} : (stryCov_9fa48("53429"), {
      value: 'Yes',
      status: 'good'
    }), stryMutAct_9fa48("53432") ? {} : (stryCov_9fa48("53432"), {
      value: 'Yes',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53435") ? {} : (stryCov_9fa48("53435"), {
    label: 'Fully sovereign',
    cells: stryMutAct_9fa48("53437") ? [] : (stryCov_9fa48("53437"), [stryMutAct_9fa48("53438") ? {} : (stryCov_9fa48("53438"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("53441") ? {} : (stryCov_9fa48("53441"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("53444") ? {} : (stryCov_9fa48("53444"), {
      value: 'Yes',
      status: 'good'
    }), stryMutAct_9fa48("53447") ? {} : (stryCov_9fa48("53447"), {
      value: 'Yes',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53450") ? {} : (stryCov_9fa48("53450"), {
    label: 'Works offline',
    cells: stryMutAct_9fa48("53452") ? [] : (stryCov_9fa48("53452"), [stryMutAct_9fa48("53453") ? {} : (stryCov_9fa48("53453"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("53456") ? {} : (stryCov_9fa48("53456"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("53459") ? {} : (stryCov_9fa48("53459"), {
      value: 'Partial',
      status: 'partial'
    }), stryMutAct_9fa48("53462") ? {} : (stryCov_9fa48("53462"), {
      value: 'Yes',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53465") ? {} : (stryCov_9fa48("53465"), {
    label: 'Works offline forever',
    cells: stryMutAct_9fa48("53467") ? [] : (stryCov_9fa48("53467"), [stryMutAct_9fa48("53468") ? {} : (stryCov_9fa48("53468"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("53471") ? {} : (stryCov_9fa48("53471"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("53474") ? {} : (stryCov_9fa48("53474"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("53477") ? {} : (stryCov_9fa48("53477"), {
      value: 'Yes',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53480") ? {} : (stryCov_9fa48("53480"), {
    label: 'You own the deployment',
    cells: stryMutAct_9fa48("53482") ? [] : (stryCov_9fa48("53482"), [stryMutAct_9fa48("53483") ? {} : (stryCov_9fa48("53483"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("53486") ? {} : (stryCov_9fa48("53486"), {
      value: 'Partial',
      status: 'partial'
    }), stryMutAct_9fa48("53489") ? {} : (stryCov_9fa48("53489"), {
      value: 'Yes',
      status: 'good'
    }), stryMutAct_9fa48("53492") ? {} : (stryCov_9fa48("53492"), {
      value: 'Yes',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53495") ? {} : (stryCov_9fa48("53495"), {
    label: 'Exit cost',
    cells: stryMutAct_9fa48("53497") ? [] : (stryCov_9fa48("53497"), [stryMutAct_9fa48("53498") ? {} : (stryCov_9fa48("53498"), {
      value: 'Medium',
      status: 'partial'
    }), stryMutAct_9fa48("53501") ? {} : (stryCov_9fa48("53501"), {
      value: 'Low',
      status: 'good'
    }), stryMutAct_9fa48("53504") ? {} : (stryCov_9fa48("53504"), {
      value: 'Very Low',
      status: 'good'
    }), stryMutAct_9fa48("53507") ? {} : (stryCov_9fa48("53507"), {
      value: 'Very Low',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53510") ? {} : (stryCov_9fa48("53510"), {
    label: 'Best for',
    cells: stryMutAct_9fa48("53512") ? [] : (stryCov_9fa48("53512"), [stryMutAct_9fa48("53513") ? {} : (stryCov_9fa48("53513"), {
      value: 'Startups, SMBs',
      status: 'neutral'
    }), stryMutAct_9fa48("53516") ? {} : (stryCov_9fa48("53516"), {
      value: 'Enterprise, Regulated',
      status: 'neutral'
    }), stryMutAct_9fa48("53519") ? {} : (stryCov_9fa48("53519"), {
      value: 'Banks, Gov',
      status: 'neutral'
    }), stryMutAct_9fa48("53522") ? {} : (stryCov_9fa48("53522"), {
      value: 'Defense, Intel',
      status: 'neutral'
    })])
  })]),
  admission: 'If you choose cloud, we will have technical access. We\'d rather you understand that before you sign.',
  services: stryMutAct_9fa48("53526") ? [] : (stryCov_9fa48("53526"), ['CendiaSovereign™'])
}), stryMutAct_9fa48("53528") ? {} : (stryCov_9fa48("53528"), {
  id: 'ai-governance',
  title: 'AI Governance Reality Check',
  question: 'Who\'s actually responsible when AI goes wrong?',
  description: 'Who is actually responsible when AI goes wrong – and what you show your regulator or board.',
  icon: '🤖',
  color: '#EF4444',
  columns: stryMutAct_9fa48("53535") ? [] : (stryCov_9fa48("53535"), ['Traditional Vendor', 'In-House ML Team', 'Datacendia']),
  rows: stryMutAct_9fa48("53539") ? [] : (stryCov_9fa48("53539"), [stryMutAct_9fa48("53540") ? {} : (stryCov_9fa48("53540"), {
    label: 'Model makes biased decision',
    cells: stryMutAct_9fa48("53542") ? [] : (stryCov_9fa48("53542"), [stryMutAct_9fa48("53543") ? {} : (stryCov_9fa48("53543"), {
      value: '"Not our fault, your data"',
      status: 'bad'
    }), stryMutAct_9fa48("53546") ? {} : (stryCov_9fa48("53546"), {
      value: 'Blame the data scientist who left',
      status: 'bad'
    }), stryMutAct_9fa48("53549") ? {} : (stryCov_9fa48("53549"), {
      value: 'CendiaEthics™ flags bias pre-deployment',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53552") ? {} : (stryCov_9fa48("53552"), {
    label: 'Can\'t explain decision to regulator',
    cells: stryMutAct_9fa48("53554") ? [] : (stryCov_9fa48("53554"), [stryMutAct_9fa48("53555") ? {} : (stryCov_9fa48("53555"), {
      value: 'Vendor provides generic docs',
      status: 'bad'
    }), stryMutAct_9fa48("53558") ? {} : (stryCov_9fa48("53558"), {
      value: 'Hope someone documented it',
      status: 'bad'
    }), stryMutAct_9fa48("53561") ? {} : (stryCov_9fa48("53561"), {
      value: 'CendiaWitness™ + CendiaGlass™ = audit-ready',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53564") ? {} : (stryCov_9fa48("53564"), {
    label: 'Model drifts in production',
    cells: stryMutAct_9fa48("53566") ? [] : (stryCov_9fa48("53566"), [stryMutAct_9fa48("53567") ? {} : (stryCov_9fa48("53567"), {
      value: 'You notice when customers complain',
      status: 'bad'
    }), stryMutAct_9fa48("53570") ? {} : (stryCov_9fa48("53570"), {
      value: 'If you built monitoring',
      status: 'partial'
    }), stryMutAct_9fa48("53573") ? {} : (stryCov_9fa48("53573"), {
      value: 'CendiaBlackBox™ tracks drift; alerts before impact',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53576") ? {} : (stryCov_9fa48("53576"), {
    label: 'Need to roll back',
    cells: stryMutAct_9fa48("53578") ? [] : (stryCov_9fa48("53578"), [stryMutAct_9fa48("53579") ? {} : (stryCov_9fa48("53579"), {
      value: 'Submit support ticket',
      status: 'bad'
    }), stryMutAct_9fa48("53582") ? {} : (stryCov_9fa48("53582"), {
      value: 'Hope you versioned it',
      status: 'bad'
    }), stryMutAct_9fa48("53585") ? {} : (stryCov_9fa48("53585"), {
      value: 'One-click rollback with lineage intact',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53588") ? {} : (stryCov_9fa48("53588"), {
    label: 'Auditor asks "how did it decide?"',
    cells: stryMutAct_9fa48("53590") ? [] : (stryCov_9fa48("53590"), [stryMutAct_9fa48("53591") ? {} : (stryCov_9fa48("53591"), {
      value: 'Awkward silence',
      status: 'bad'
    }), stryMutAct_9fa48("53594") ? {} : (stryCov_9fa48("53594"), {
      value: '"It\'s a neural network..."',
      status: 'bad'
    }), stryMutAct_9fa48("53597") ? {} : (stryCov_9fa48("53597"), {
      value: 'Factor contribution + counterfactual analysis',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53600") ? {} : (stryCov_9fa48("53600"), {
    label: 'AI recommends something unethical',
    cells: stryMutAct_9fa48("53602") ? [] : (stryCov_9fa48("53602"), [stryMutAct_9fa48("53603") ? {} : (stryCov_9fa48("53603"), {
      value: '"Algorithm is neutral"',
      status: 'bad'
    }), stryMutAct_9fa48("53606") ? {} : (stryCov_9fa48("53606"), {
      value: 'Debate in Slack',
      status: 'bad'
    }), stryMutAct_9fa48("53609") ? {} : (stryCov_9fa48("53609"), {
      value: 'CendiaVeto™ blocks automatically',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53612") ? {} : (stryCov_9fa48("53612"), {
    label: 'Competing AI recommendations',
    cells: stryMutAct_9fa48("53614") ? [] : (stryCov_9fa48("53614"), [stryMutAct_9fa48("53615") ? {} : (stryCov_9fa48("53615"), {
      value: 'Pick one, hope it\'s right',
      status: 'bad'
    }), stryMutAct_9fa48("53618") ? {} : (stryCov_9fa48("53618"), {
      value: 'Loudest voice wins',
      status: 'bad'
    }), stryMutAct_9fa48("53621") ? {} : (stryCov_9fa48("53621"), {
      value: 'The Council: multi-agent deliberation',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53624") ? {} : (stryCov_9fa48("53624"), {
    label: 'Regulator asks: "Show me how this AI decided last October"',
    cells: stryMutAct_9fa48("53626") ? [] : (stryCov_9fa48("53626"), [stryMutAct_9fa48("53627") ? {} : (stryCov_9fa48("53627"), {
      value: 'Scramble for logs',
      status: 'bad'
    }), stryMutAct_9fa48("53630") ? {} : (stryCov_9fa48("53630"), {
      value: 'Reconstruct from notebooks',
      status: 'bad'
    }), stryMutAct_9fa48("53633") ? {} : (stryCov_9fa48("53633"), {
      value: 'Open Chronos at that date; replay Council deliberation and evidence',
      status: 'good'
    })])
  })]),
  admission: 'Most AI vendors avoid accountability. We build it in.',
  services: stryMutAct_9fa48("53637") ? [] : (stryCov_9fa48("53637"), ['CendiaEthics™', 'CendiaGlass™', 'CendiaWitness™', 'CendiaBlackBox™', 'CendiaVeto™', 'CendiaMirror™', 'The Council™'])
}), stryMutAct_9fa48("53645") ? {} : (stryCov_9fa48("53645"), {
  id: 'integration',
  title: 'Integration Honesty Matrix',
  question: 'How hard is it really to connect things?',
  description: 'Every vendor says "easy integration." Here\'s the truth.',
  icon: '🔌',
  color: '#10B981',
  columns: stryMutAct_9fa48("53652") ? [] : (stryCov_9fa48("53652"), ['Vendor Promise', 'Actual Reality', 'Datacendia Reality']),
  rows: stryMutAct_9fa48("53656") ? [] : (stryCov_9fa48("53656"), [stryMutAct_9fa48("53657") ? {} : (stryCov_9fa48("53657"), {
    label: 'Modern REST API',
    cells: stryMutAct_9fa48("53659") ? [] : (stryCov_9fa48("53659"), [stryMutAct_9fa48("53660") ? {} : (stryCov_9fa48("53660"), {
      value: '"5 minutes!"',
      status: 'neutral'
    }), stryMutAct_9fa48("53663") ? {} : (stryCov_9fa48("53663"), {
      value: '2-4 hours with auth, pagination, rate limits',
      status: 'partial'
    }), stryMutAct_9fa48("53666") ? {} : (stryCov_9fa48("53666"), {
      value: '1-2 hours; CendiaBridge™ handles auth patterns',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53669") ? {} : (stryCov_9fa48("53669"), {
    label: 'Legacy SOAP/XML',
    cells: stryMutAct_9fa48("53671") ? [] : (stryCov_9fa48("53671"), [stryMutAct_9fa48("53672") ? {} : (stryCov_9fa48("53672"), {
      value: '"We support it"',
      status: 'neutral'
    }), stryMutAct_9fa48("53675") ? {} : (stryCov_9fa48("53675"), {
      value: 'Find the one engineer who knows SOAP',
      status: 'bad'
    }), stryMutAct_9fa48("53678") ? {} : (stryCov_9fa48("53678"), {
      value: 'CendiaBridge™ transforms protocols',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53681") ? {} : (stryCov_9fa48("53681"), {
    label: 'Mainframe/AS400',
    cells: stryMutAct_9fa48("53683") ? [] : (stryCov_9fa48("53683"), [stryMutAct_9fa48("53684") ? {} : (stryCov_9fa48("53684"), {
      value: '"Enterprise ready"',
      status: 'neutral'
    }), stryMutAct_9fa48("53687") ? {} : (stryCov_9fa48("53687"), {
      value: '6-month professional services',
      status: 'bad'
    }), stryMutAct_9fa48("53690") ? {} : (stryCov_9fa48("53690"), {
      value: 'Honest: this is hard. Budget 4-6 weeks.',
      status: 'partial'
    })])
  }), stryMutAct_9fa48("53693") ? {} : (stryCov_9fa48("53693"), {
    label: 'Real-time streaming',
    cells: stryMutAct_9fa48("53695") ? [] : (stryCov_9fa48("53695"), [stryMutAct_9fa48("53696") ? {} : (stryCov_9fa48("53696"), {
      value: '"Kafka connector"',
      status: 'neutral'
    }), stryMutAct_9fa48("53699") ? {} : (stryCov_9fa48("53699"), {
      value: 'Pray the offsets align',
      status: 'bad'
    }), stryMutAct_9fa48("53702") ? {} : (stryCov_9fa48("53702"), {
      value: 'CendiaMesh™ manages consumer groups',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53705") ? {} : (stryCov_9fa48("53705"), {
    label: 'Proprietary ERP systems',
    cells: stryMutAct_9fa48("53707") ? [] : (stryCov_9fa48("53707"), [stryMutAct_9fa48("53708") ? {} : (stryCov_9fa48("53708"), {
      value: '"Certified!"',
      status: 'neutral'
    }), stryMutAct_9fa48("53711") ? {} : (stryCov_9fa48("53711"), {
      value: 'Expensive connectors + consultants',
      status: 'bad'
    }), stryMutAct_9fa48("53714") ? {} : (stryCov_9fa48("53714"), {
      value: 'We connect; licensing is between you and vendor',
      status: 'partial'
    })])
  }), stryMutAct_9fa48("53717") ? {} : (stryCov_9fa48("53717"), {
    label: 'Shadow IT spreadsheets',
    cells: stryMutAct_9fa48("53719") ? [] : (stryCov_9fa48("53719"), [stryMutAct_9fa48("53720") ? {} : (stryCov_9fa48("53720"), {
      value: 'Not mentioned',
      status: 'bad'
    }), stryMutAct_9fa48("53723") ? {} : (stryCov_9fa48("53723"), {
      value: '40% of real business logic lives here',
      status: 'bad'
    }), stryMutAct_9fa48("53726") ? {} : (stryCov_9fa48("53726"), {
      value: 'CendiaFlow™ can ingest; exposes the chaos',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53729") ? {} : (stryCov_9fa48("53729"), {
    label: 'Cloud data warehouses',
    cells: stryMutAct_9fa48("53731") ? [] : (stryCov_9fa48("53731"), [stryMutAct_9fa48("53732") ? {} : (stryCov_9fa48("53732"), {
      value: '"Native integration"',
      status: 'neutral'
    }), stryMutAct_9fa48("53735") ? {} : (stryCov_9fa48("53735"), {
      value: 'Query optimization is your problem',
      status: 'partial'
    }), stryMutAct_9fa48("53738") ? {} : (stryCov_9fa48("53738"), {
      value: 'Native connectors; CendiaLineage™ tracks transforms',
      status: 'good'
    })])
  })]),
  admission: 'Mainframes are hard. Shadow IT is real. We won\'t pretend otherwise.',
  services: stryMutAct_9fa48("53742") ? [] : (stryCov_9fa48("53742"), ['CendiaBridge™', 'CendiaMesh™', 'CendiaFlow™', 'CendiaLineage™', 'CendiaKey™'])
}), stryMutAct_9fa48("53748") ? {} : (stryCov_9fa48("53748"), {
  id: '3am',
  title: 'What Breaks at 3 AM',
  question: 'When things go wrong, what actually happens?',
  description: 'Things break. The question is how fast you understand and recover.',
  icon: '🚨',
  color: '#F59E0B',
  columns: stryMutAct_9fa48("53755") ? [] : (stryCov_9fa48("53755"), ['Typical Response', 'Datacendia Response']),
  rows: stryMutAct_9fa48("53758") ? [] : (stryCov_9fa48("53758"), [stryMutAct_9fa48("53759") ? {} : (stryCov_9fa48("53759"), {
    label: 'Data pipeline fails',
    cells: stryMutAct_9fa48("53761") ? [] : (stryCov_9fa48("53761"), [stryMutAct_9fa48("53762") ? {} : (stryCov_9fa48("53762"), {
      value: 'PagerDuty → engineer → SSH → logs → guess',
      status: 'bad'
    }), stryMutAct_9fa48("53765") ? {} : (stryCov_9fa48("53765"), {
      value: 'Alert with root cause; upstream/downstream impact shown',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53768") ? {} : (stryCov_9fa48("53768"), {
    label: 'Dashboard shows wrong number',
    cells: stryMutAct_9fa48("53770") ? [] : (stryCov_9fa48("53770"), [stryMutAct_9fa48("53771") ? {} : (stryCov_9fa48("53771"), {
      value: 'Blame the data team',
      status: 'bad'
    }), stryMutAct_9fa48("53774") ? {} : (stryCov_9fa48("53774"), {
      value: 'Trace in Chronos back to the exact change; fix at the root',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53777") ? {} : (stryCov_9fa48("53777"), {
    label: '"The AI said something crazy"',
    cells: stryMutAct_9fa48("53779") ? [] : (stryCov_9fa48("53779"), [stryMutAct_9fa48("53780") ? {} : (stryCov_9fa48("53780"), {
      value: 'Disable and apologize',
      status: 'bad'
    }), stryMutAct_9fa48("53783") ? {} : (stryCov_9fa48("53783"), {
      value: 'See exactly what inputs caused output; evidence preserved',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53786") ? {} : (stryCov_9fa48("53786"), {
    label: 'Integration stops syncing',
    cells: stryMutAct_9fa48("53788") ? [] : (stryCov_9fa48("53788"), [stryMutAct_9fa48("53789") ? {} : (stryCov_9fa48("53789"), {
      value: 'Check both sides, restart, hope',
      status: 'bad'
    }), stryMutAct_9fa48("53792") ? {} : (stryCov_9fa48("53792"), {
      value: 'Centralized integration health; automatic retry with alerting',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53795") ? {} : (stryCov_9fa48("53795"), {
    label: 'Key person quits mid-incident',
    cells: stryMutAct_9fa48("53797") ? [] : (stryCov_9fa48("53797"), [stryMutAct_9fa48("53798") ? {} : (stryCov_9fa48("53798"), {
      value: 'Panic',
      status: 'bad'
    }), stryMutAct_9fa48("53801") ? {} : (stryCov_9fa48("53801"), {
      value: 'Documented runbooks; CendiaOracle™ answers "how did we fix this?"',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53804") ? {} : (stryCov_9fa48("53804"), {
    label: 'Auditor shows up unannounced',
    cells: stryMutAct_9fa48("53806") ? [] : (stryCov_9fa48("53806"), [stryMutAct_9fa48("53807") ? {} : (stryCov_9fa48("53807"), {
      value: 'Scramble for 3 days',
      status: 'bad'
    }), stryMutAct_9fa48("53810") ? {} : (stryCov_9fa48("53810"), {
      value: 'Export audit package in minutes',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53813") ? {} : (stryCov_9fa48("53813"), {
    label: 'Security breach detected',
    cells: stryMutAct_9fa48("53815") ? [] : (stryCov_9fa48("53815"), [stryMutAct_9fa48("53816") ? {} : (stryCov_9fa48("53816"), {
      value: 'War room, finger pointing',
      status: 'bad'
    }), stryMutAct_9fa48("53819") ? {} : (stryCov_9fa48("53819"), {
      value: 'Immediate scope assessment; affected data identified',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53822") ? {} : (stryCov_9fa48("53822"), {
    label: 'Decision pattern keeps failing',
    cells: stryMutAct_9fa48("53824") ? [] : (stryCov_9fa48("53824"), [stryMutAct_9fa48("53825") ? {} : (stryCov_9fa48("53825"), {
      value: 'Repeat same mistakes',
      status: 'bad'
    }), stryMutAct_9fa48("53828") ? {} : (stryCov_9fa48("53828"), {
      value: 'Pattern identified and banned after 3 failures',
      status: 'good'
    })])
  })]),
  admission: 'Things break. The question is how fast you can understand and recover.',
  services: stryMutAct_9fa48("53832") ? [] : (stryCov_9fa48("53832"), ['CendiaPulse™', 'CendiaLineage™', 'CendiaGlass™', 'CendiaWitness™', 'CendiaMesh™', 'CendiaLegacy™', 'CendiaOracle™', 'CendiaApotheosis™'])
}), stryMutAct_9fa48("53841") ? {} : (stryCov_9fa48("53841"), {
  id: 'platform-comparison',
  title: 'Platform Category Comparison',
  question: 'How do different platform types compare?',
  description: 'You\'re not just choosing a vendor; you\'re choosing a category. This matrix shows the trade-offs each one bakes in.',
  icon: '⚖️',
  color: '#8B5CF6',
  columns: stryMutAct_9fa48("53848") ? [] : (stryCov_9fa48("53848"), ['Enterprise BI', 'Cloud Data Platform', 'CRM Platform', 'ERP Suite', 'AI API', 'Datacendia']),
  rows: stryMutAct_9fa48("53855") ? [] : (stryCov_9fa48("53855"), [stryMutAct_9fa48("53856") ? {} : (stryCov_9fa48("53856"), {
    label: 'Can run air-gapped',
    cells: stryMutAct_9fa48("53858") ? [] : (stryCov_9fa48("53858"), [stryMutAct_9fa48("53859") ? {} : (stryCov_9fa48("53859"), {
      value: 'Sometimes',
      status: 'partial'
    }), stryMutAct_9fa48("53862") ? {} : (stryCov_9fa48("53862"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("53865") ? {} : (stryCov_9fa48("53865"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("53868") ? {} : (stryCov_9fa48("53868"), {
      value: 'Sometimes',
      status: 'partial'
    }), stryMutAct_9fa48("53871") ? {} : (stryCov_9fa48("53871"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("53874") ? {} : (stryCov_9fa48("53874"), {
      value: 'Yes',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53877") ? {} : (stryCov_9fa48("53877"), {
    label: 'Can run on-prem',
    cells: stryMutAct_9fa48("53879") ? [] : (stryCov_9fa48("53879"), [stryMutAct_9fa48("53880") ? {} : (stryCov_9fa48("53880"), {
      value: 'Often',
      status: 'good'
    }), stryMutAct_9fa48("53883") ? {} : (stryCov_9fa48("53883"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("53886") ? {} : (stryCov_9fa48("53886"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("53889") ? {} : (stryCov_9fa48("53889"), {
      value: 'Often',
      status: 'good'
    }), stryMutAct_9fa48("53892") ? {} : (stryCov_9fa48("53892"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("53895") ? {} : (stryCov_9fa48("53895"), {
      value: 'Yes',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53898") ? {} : (stryCov_9fa48("53898"), {
    label: 'Data portability',
    cells: stryMutAct_9fa48("53900") ? [] : (stryCov_9fa48("53900"), [stryMutAct_9fa48("53901") ? {} : (stryCov_9fa48("53901"), {
      value: 'Varies',
      status: 'partial'
    }), stryMutAct_9fa48("53904") ? {} : (stryCov_9fa48("53904"), {
      value: 'Varies',
      status: 'partial'
    }), stryMutAct_9fa48("53907") ? {} : (stryCov_9fa48("53907"), {
      value: 'Check terms',
      status: 'partial'
    }), stryMutAct_9fa48("53910") ? {} : (stryCov_9fa48("53910"), {
      value: 'Varies',
      status: 'partial'
    }), stryMutAct_9fa48("53913") ? {} : (stryCov_9fa48("53913"), {
      value: 'Check terms',
      status: 'partial'
    }), stryMutAct_9fa48("53916") ? {} : (stryCov_9fa48("53916"), {
      value: 'Full export',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53919") ? {} : (stryCov_9fa48("53919"), {
    label: 'You own the models',
    cells: stryMutAct_9fa48("53921") ? [] : (stryCov_9fa48("53921"), [stryMutAct_9fa48("53922") ? {} : (stryCov_9fa48("53922"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("53925") ? {} : (stryCov_9fa48("53925"), {
      value: 'N/A',
      status: 'neutral'
    }), stryMutAct_9fa48("53928") ? {} : (stryCov_9fa48("53928"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("53931") ? {} : (stryCov_9fa48("53931"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("53934") ? {} : (stryCov_9fa48("53934"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("53937") ? {} : (stryCov_9fa48("53937"), {
      value: 'Yes',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53940") ? {} : (stryCov_9fa48("53940"), {
    label: 'Exit complexity',
    cells: stryMutAct_9fa48("53942") ? [] : (stryCov_9fa48("53942"), [stryMutAct_9fa48("53943") ? {} : (stryCov_9fa48("53943"), {
      value: 'High',
      status: 'bad'
    }), stryMutAct_9fa48("53946") ? {} : (stryCov_9fa48("53946"), {
      value: 'Medium',
      status: 'partial'
    }), stryMutAct_9fa48("53949") ? {} : (stryCov_9fa48("53949"), {
      value: 'High',
      status: 'bad'
    }), stryMutAct_9fa48("53952") ? {} : (stryCov_9fa48("53952"), {
      value: 'High',
      status: 'bad'
    }), stryMutAct_9fa48("53955") ? {} : (stryCov_9fa48("53955"), {
      value: 'Low',
      status: 'good'
    }), stryMutAct_9fa48("53958") ? {} : (stryCov_9fa48("53958"), {
      value: 'Low',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53961") ? {} : (stryCov_9fa48("53961"), {
    label: 'AI decision explainability',
    cells: stryMutAct_9fa48("53963") ? [] : (stryCov_9fa48("53963"), [stryMutAct_9fa48("53964") ? {} : (stryCov_9fa48("53964"), {
      value: 'Sometimes',
      status: 'partial'
    }), stryMutAct_9fa48("53967") ? {} : (stryCov_9fa48("53967"), {
      value: 'N/A',
      status: 'neutral'
    }), stryMutAct_9fa48("53970") ? {} : (stryCov_9fa48("53970"), {
      value: 'Limited',
      status: 'partial'
    }), stryMutAct_9fa48("53973") ? {} : (stryCov_9fa48("53973"), {
      value: 'Limited',
      status: 'partial'
    }), stryMutAct_9fa48("53976") ? {} : (stryCov_9fa48("53976"), {
      value: 'Limited',
      status: 'partial'
    }), stryMutAct_9fa48("53979") ? {} : (stryCov_9fa48("53979"), {
      value: 'Full',
      status: 'good'
    })])
  }), stryMutAct_9fa48("53982") ? {} : (stryCov_9fa48("53982"), {
    label: 'Immutable audit trail',
    cells: stryMutAct_9fa48("53984") ? [] : (stryCov_9fa48("53984"), [stryMutAct_9fa48("53985") ? {} : (stryCov_9fa48("53985"), {
      value: 'Sometimes',
      status: 'partial'
    }), stryMutAct_9fa48("53988") ? {} : (stryCov_9fa48("53988"), {
      value: 'Sometimes',
      status: 'partial'
    }), stryMutAct_9fa48("53991") ? {} : (stryCov_9fa48("53991"), {
      value: 'Sometimes',
      status: 'partial'
    }), stryMutAct_9fa48("53994") ? {} : (stryCov_9fa48("53994"), {
      value: 'Sometimes',
      status: 'partial'
    }), stryMutAct_9fa48("53997") ? {} : (stryCov_9fa48("53997"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54000") ? {} : (stryCov_9fa48("54000"), {
      value: 'Built-in',
      status: 'good'
    })])
  }), stryMutAct_9fa48("54003") ? {} : (stryCov_9fa48("54003"), {
    label: 'Self-improving AI',
    cells: stryMutAct_9fa48("54005") ? [] : (stryCov_9fa48("54005"), [stryMutAct_9fa48("54006") ? {} : (stryCov_9fa48("54006"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54009") ? {} : (stryCov_9fa48("54009"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54012") ? {} : (stryCov_9fa48("54012"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54015") ? {} : (stryCov_9fa48("54015"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54018") ? {} : (stryCov_9fa48("54018"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54021") ? {} : (stryCov_9fa48("54021"), {
      value: 'CendiaApotheosis™',
      status: 'good'
    })])
  }), stryMutAct_9fa48("54024") ? {} : (stryCov_9fa48("54024"), {
    label: 'Formal dissent tracking',
    cells: stryMutAct_9fa48("54026") ? [] : (stryCov_9fa48("54026"), [stryMutAct_9fa48("54027") ? {} : (stryCov_9fa48("54027"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54030") ? {} : (stryCov_9fa48("54030"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54033") ? {} : (stryCov_9fa48("54033"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54036") ? {} : (stryCov_9fa48("54036"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54039") ? {} : (stryCov_9fa48("54039"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54042") ? {} : (stryCov_9fa48("54042"), {
      value: 'CendiaDissent™',
      status: 'good'
    })])
  }), stryMutAct_9fa48("54045") ? {} : (stryCov_9fa48("54045"), {
    label: 'Multi-agent deliberation',
    cells: stryMutAct_9fa48("54047") ? [] : (stryCov_9fa48("54047"), [stryMutAct_9fa48("54048") ? {} : (stryCov_9fa48("54048"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54051") ? {} : (stryCov_9fa48("54051"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54054") ? {} : (stryCov_9fa48("54054"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54057") ? {} : (stryCov_9fa48("54057"), {
      value: 'Rarely',
      status: 'bad'
    }), stryMutAct_9fa48("54060") ? {} : (stryCov_9fa48("54060"), {
      value: 'Emerging',
      status: 'partial'
    }), stryMutAct_9fa48("54063") ? {} : (stryCov_9fa48("54063"), {
      value: 'The Council™',
      status: 'good'
    })])
  })]),
  admission: 'Different platform categories have different strengths. Know what you\'re trading off.',
  services: stryMutAct_9fa48("54067") ? [] : (stryCov_9fa48("54067"), ['CendiaGlass™', 'CendiaLedger™', 'CendiaVeto™', 'CendiaApotheosis™', 'CendiaDissent™', 'The Council™', 'CendiaChronos™'])
}), stryMutAct_9fa48("54075") ? {} : (stryCov_9fa48("54075"), {
  id: 'limitations',
  title: 'What We Can\'t Do',
  question: 'What are your actual limitations?',
  description: 'What Datacendia will never promise you.',
  icon: '🚫',
  color: '#DC2626',
  columns: stryMutAct_9fa48("54082") ? [] : (stryCov_9fa48("54082"), ['Can We Do It?', 'Honest Answer']),
  rows: stryMutAct_9fa48("54085") ? [] : (stryCov_9fa48("54085"), [stryMutAct_9fa48("54086") ? {} : (stryCov_9fa48("54086"), {
    label: 'Replace your data warehouse',
    cells: stryMutAct_9fa48("54088") ? [] : (stryCov_9fa48("54088"), [stryMutAct_9fa48("54089") ? {} : (stryCov_9fa48("54089"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("54092") ? {} : (stryCov_9fa48("54092"), {
      value: 'We sit on top of it; we don\'t replace it',
      status: 'neutral'
    })])
  }), stryMutAct_9fa48("54095") ? {} : (stryCov_9fa48("54095"), {
    label: 'Magically fix bad data',
    cells: stryMutAct_9fa48("54097") ? [] : (stryCov_9fa48("54097"), [stryMutAct_9fa48("54098") ? {} : (stryCov_9fa48("54098"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("54101") ? {} : (stryCov_9fa48("54101"), {
      value: 'We expose bad data; you have to fix it',
      status: 'neutral'
    })])
  }), stryMutAct_9fa48("54104") ? {} : (stryCov_9fa48("54104"), {
    label: 'Guarantee AI is never wrong',
    cells: stryMutAct_9fa48("54106") ? [] : (stryCov_9fa48("54106"), [stryMutAct_9fa48("54107") ? {} : (stryCov_9fa48("54107"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("54110") ? {} : (stryCov_9fa48("54110"), {
      value: 'We guarantee you\'ll know when it is, and why',
      status: 'neutral'
    })])
  }), stryMutAct_9fa48("54113") ? {} : (stryCov_9fa48("54113"), {
    label: 'Integrate in 5 minutes',
    cells: stryMutAct_9fa48("54115") ? [] : (stryCov_9fa48("54115"), [stryMutAct_9fa48("54116") ? {} : (stryCov_9fa48("54116"), {
      value: 'Rarely',
      status: 'partial'
    }), stryMutAct_9fa48("54119") ? {} : (stryCov_9fa48("54119"), {
      value: 'Simple REST APIs: hours. Legacy systems: weeks.',
      status: 'neutral'
    })])
  }), stryMutAct_9fa48("54122") ? {} : (stryCov_9fa48("54122"), {
    label: 'Work without your engineers',
    cells: stryMutAct_9fa48("54124") ? [] : (stryCov_9fa48("54124"), [stryMutAct_9fa48("54125") ? {} : (stryCov_9fa48("54125"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("54128") ? {} : (stryCov_9fa48("54128"), {
      value: 'We reduce work by 60-80%; we don\'t eliminate it',
      status: 'neutral'
    })])
  }), stryMutAct_9fa48("54131") ? {} : (stryCov_9fa48("54131"), {
    label: 'Replace human judgment',
    cells: stryMutAct_9fa48("54133") ? [] : (stryCov_9fa48("54133"), [stryMutAct_9fa48("54134") ? {} : (stryCov_9fa48("54134"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("54137") ? {} : (stryCov_9fa48("54137"), {
      value: 'We augment and track human judgment; we don\'t replace it',
      status: 'neutral'
    })])
  }), stryMutAct_9fa48("54140") ? {} : (stryCov_9fa48("54140"), {
    label: 'Prevent all security breaches',
    cells: stryMutAct_9fa48("54142") ? [] : (stryCov_9fa48("54142"), [stryMutAct_9fa48("54143") ? {} : (stryCov_9fa48("54143"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("54146") ? {} : (stryCov_9fa48("54146"), {
      value: 'We detect faster and scope immediately; prevention is layered',
      status: 'neutral'
    })])
  }), stryMutAct_9fa48("54149") ? {} : (stryCov_9fa48("54149"), {
    label: 'Work with zero training',
    cells: stryMutAct_9fa48("54151") ? [] : (stryCov_9fa48("54151"), [stryMutAct_9fa48("54152") ? {} : (stryCov_9fa48("54152"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("54155") ? {} : (stryCov_9fa48("54155"), {
      value: 'Basic usage: 2 hours. Power usage: 2 weeks.',
      status: 'neutral'
    })])
  }), stryMutAct_9fa48("54158") ? {} : (stryCov_9fa48("54158"), {
    label: 'Scale infinitely',
    cells: stryMutAct_9fa48("54160") ? [] : (stryCov_9fa48("54160"), [stryMutAct_9fa48("54161") ? {} : (stryCov_9fa48("54161"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("54164") ? {} : (stryCov_9fa48("54164"), {
      value: 'Practical limit: ~10M decisions/month per instance',
      status: 'neutral'
    })])
  }), stryMutAct_9fa48("54167") ? {} : (stryCov_9fa48("54167"), {
    label: 'Make untraceable decisions',
    cells: stryMutAct_9fa48("54169") ? [] : (stryCov_9fa48("54169"), [stryMutAct_9fa48("54170") ? {} : (stryCov_9fa48("54170"), {
      value: 'No',
      status: 'bad'
    }), stryMutAct_9fa48("54173") ? {} : (stryCov_9fa48("54173"), {
      value: 'Every major decision leaves a trail. If you want deniability, we\'re the wrong platform.',
      status: 'neutral'
    })])
  })]),
  admission: 'Every platform has limits. Knowing them prevents disappointment.',
  services: stryMutAct_9fa48("54177") ? ["Stryker was here"] : (stryCov_9fa48("54177"), [])
})]);

// =============================================================================
// COMPONENTS
// =============================================================================

const MatrixCard: React.FC<{
  matrix: Matrix;
  onClick: () => void;
}> = ({
  matrix,
  onClick
}) => {
  return <button onClick={onClick} className="group bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/50 p-6 text-left transition-all duration-300 rounded">
      <div className="flex items-start gap-4">
        <span className="text-3xl">{matrix.icon}</span>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white group-hover:text-red-100 transition-colors">
            {matrix.title}
          </h3>
          <p className="text-red-900/80 text-sm font-medium mt-1">
            {matrix.question}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            {matrix.description}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-red-900 group-hover:translate-x-1 transition-all" />
      </div>
    </button>;
};
const MatrixModal: React.FC<{
  matrix: Matrix;
  onClose: () => void;
}> = ({
  matrix,
  onClose
}) => {
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-black border border-gray-800 max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={stryMutAct_9fa48("54180") ? () => undefined : (stryCov_9fa48("54180"), e => e.stopPropagation())}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{matrix.icon}</span>
              <div>
                <h2 className="text-xl font-light tracking-wide">{matrix.title}</h2>
                <p className="text-gray-500 text-sm">{matrix.question}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors text-sm tracking-widest">
              CLOSE
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-900/50 font-medium text-gray-400 border-b border-gray-800 text-sm tracking-wider">
                  CAPABILITY
                </th>
                {matrix.columns.map(stryMutAct_9fa48("54181") ? () => undefined : (stryCov_9fa48("54181"), (col, idx) => <th key={idx} className="text-center p-3 bg-gray-900/50 font-medium text-gray-400 border-b border-gray-800 min-w-[120px] text-xs tracking-wider">
                    {stryMutAct_9fa48("54182") ? col.toLowerCase() : (stryCov_9fa48("54182"), col.toUpperCase())}
                  </th>))}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map(stryMutAct_9fa48("54183") ? () => undefined : (stryCov_9fa48("54183"), (row, rowIdx) => <tr key={rowIdx} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                  <td className="p-3 font-medium text-gray-300 text-sm">
                    {row.label}
                  </td>
                  {row.cells.map(stryMutAct_9fa48("54184") ? () => undefined : (stryCov_9fa48("54184"), (cell, cellIdx) => <td key={cellIdx} className="p-3 text-center">
                      <span className={cn('inline-block px-3 py-1 rounded text-xs font-medium', stryMutAct_9fa48("54188") ? cell.status === 'good' || 'bg-green-900/30 text-green-400 border border-green-900/50' : stryMutAct_9fa48("54187") ? false : stryMutAct_9fa48("54186") ? true : (stryCov_9fa48("54186", "54187", "54188"), (stryMutAct_9fa48("54190") ? cell.status !== 'good' : stryMutAct_9fa48("54189") ? true : (stryCov_9fa48("54189", "54190"), cell.status === 'good')) && 'bg-green-900/30 text-green-400 border border-green-900/50'), stryMutAct_9fa48("54195") ? cell.status === 'bad' || 'bg-red-900/30 text-red-400 border border-red-900/50' : stryMutAct_9fa48("54194") ? false : stryMutAct_9fa48("54193") ? true : (stryCov_9fa48("54193", "54194", "54195"), (stryMutAct_9fa48("54197") ? cell.status !== 'bad' : stryMutAct_9fa48("54196") ? true : (stryCov_9fa48("54196", "54197"), cell.status === 'bad')) && 'bg-red-900/30 text-red-400 border border-red-900/50'), stryMutAct_9fa48("54202") ? cell.status === 'partial' || 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' : stryMutAct_9fa48("54201") ? false : stryMutAct_9fa48("54200") ? true : (stryCov_9fa48("54200", "54201", "54202"), (stryMutAct_9fa48("54204") ? cell.status !== 'partial' : stryMutAct_9fa48("54203") ? true : (stryCov_9fa48("54203", "54204"), cell.status === 'partial')) && 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50'), stryMutAct_9fa48("54209") ? cell.status === 'neutral' || 'bg-gray-800 text-gray-400 border border-gray-700' : stryMutAct_9fa48("54208") ? false : stryMutAct_9fa48("54207") ? true : (stryCov_9fa48("54207", "54208", "54209"), (stryMutAct_9fa48("54211") ? cell.status !== 'neutral' : stryMutAct_9fa48("54210") ? true : (stryCov_9fa48("54210", "54211"), cell.status === 'neutral')) && 'bg-gray-800 text-gray-400 border border-gray-700'))}>
                        {cell.value}
                      </span>
                    </td>))}
                </tr>))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 p-6 border-t border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-500 text-sm italic">
                "{matrix.admission}"
              </p>
              {stryMutAct_9fa48("54216") ? matrix.services.length > 0 || <div className="flex flex-wrap gap-2 mt-3">
                  {matrix.services.map((service, idx) => <span key={idx} className="px-2 py-1 bg-red-900/20 text-red-400 text-[10px] font-medium rounded border border-red-900/30">
                      {service}
                    </span>)}
                </div> : stryMutAct_9fa48("54215") ? false : stryMutAct_9fa48("54214") ? true : (stryCov_9fa48("54214", "54215", "54216"), (stryMutAct_9fa48("54219") ? matrix.services.length <= 0 : stryMutAct_9fa48("54218") ? matrix.services.length >= 0 : stryMutAct_9fa48("54217") ? true : (stryCov_9fa48("54217", "54218", "54219"), matrix.services.length > 0)) && <div className="flex flex-wrap gap-2 mt-3">
                  {matrix.services.map(stryMutAct_9fa48("54220") ? () => undefined : (stryCov_9fa48("54220"), (service, idx) => <span key={idx} className="px-2 py-1 bg-red-900/20 text-red-400 text-[10px] font-medium rounded border border-red-900/30">
                      {service}
                    </span>))}
                </div>)}
            </div>
            <Link to="/sovereign" className="group px-6 py-3 border border-red-900 text-white text-sm tracking-wider hover:bg-red-900/10 transition-all flex items-center gap-2">
              <span>Request Access</span>
              <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>;
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export const HonestyMatricesPage: React.FC = () => {
  const [selectedMatrix, setSelectedMatrix] = useState<Matrix | null>(null);
  return <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      {/* Background Effects */}
      <ParticleField />
      <ScanLines />
      
      {/* Vignette overlay */}
      <div className="fixed inset-0 pointer-events-none z-10" style={stryMutAct_9fa48("54222") ? {} : (stryCov_9fa48("54222"), {
      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)'
    })} />

      {/* Navigation */}
      <nav className="relative z-30 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/sovereign" className="text-xl font-extralight tracking-[0.2em] text-white hover:text-red-100 transition-colors">
              DATACENDIA
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/sovereign" className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors">
                SOVEREIGN
              </Link>
              <Link to="/honesty" className="text-xs tracking-[0.15em] text-red-900">
                HONESTY MATRICES
              </Link>
              <Link to="/product" className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors">
                PRODUCT
              </Link>
            </div>
            
            <Link to="/demo" className="px-4 py-2 border border-gray-800 text-xs tracking-[0.15em] text-gray-400 hover:text-white hover:border-red-900/50 transition-all">
              REQUEST EARLY ACCESS
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">RADICAL TRANSPARENCY</p>
          <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.1em] mb-6">
            <GlitchText>THE HONESTY MATRICES</GlitchText>
          </h1>
          <p className="text-lg text-gray-400 font-light mb-4">
            Most vendors hide this. We lead with it.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Every matrix shows what we can do, what we can't do, 
            and exactly where we stand against alternatives.
          </p>
        </div>
      </section>

      {/* Primary Matrices - Featured 3 */}
      <section className="relative z-20 py-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-6 text-center">PRIMARY MATRICES</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stryMutAct_9fa48("54224") ? matrices.map(matrix => <MatrixCard key={matrix.id} matrix={matrix} onClick={() => setSelectedMatrix(matrix)} />) : (stryCov_9fa48("54224"), matrices.filter(stryMutAct_9fa48("54225") ? () => undefined : (stryCov_9fa48("54225"), m => (stryMutAct_9fa48("54226") ? [] : (stryCov_9fa48("54226"), ['sovereignty', 'ai-governance', '3am'])).includes(m.id))).map(stryMutAct_9fa48("54230") ? () => undefined : (stryCov_9fa48("54230"), matrix => <MatrixCard key={matrix.id} matrix={matrix} onClick={stryMutAct_9fa48("54231") ? () => undefined : (stryCov_9fa48("54231"), () => setSelectedMatrix(matrix))} />)))}
          </div>
          
          {/* View All Link */}
          <div className="text-center mb-12">
            <button onClick={stryMutAct_9fa48("54232") ? () => undefined : (stryCov_9fa48("54232"), () => stryMutAct_9fa48("54233") ? document.getElementById('all-matrices').scrollIntoView({
            behavior: 'smooth'
          }) : (stryCov_9fa48("54233"), document.getElementById('all-matrices')?.scrollIntoView(stryMutAct_9fa48("54235") ? {} : (stryCov_9fa48("54235"), {
            behavior: 'smooth'
          }))))} className="text-sm text-red-900 hover:text-red-700 transition-colors border-b border-red-900/50 pb-1">
              View all 6 Honesty Matrices →
            </button>
          </div>
        </div>
      </section>

      {/* All Matrices Grid */}
      <section id="all-matrices" className="relative z-20 py-12 border-t border-gray-900">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-6 text-center">ALL MATRICES</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matrices.map(stryMutAct_9fa48("54237") ? () => undefined : (stryCov_9fa48("54237"), matrix => <MatrixCard key={matrix.id} matrix={matrix} onClick={stryMutAct_9fa48("54238") ? () => undefined : (stryCov_9fa48("54238"), () => setSelectedMatrix(matrix))} />))}
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xl md:text-2xl font-light text-gray-300 mb-12">
            "If we can't be honest before you buy,<br />
            <span className="text-white">why trust us after?</span>"
          </p>
          <Link to="/sovereign" className="group inline-flex px-10 py-5 border-2 border-red-900 bg-black hover:bg-red-900/10 transition-all duration-300 items-center gap-3">
            <span className="text-sm tracking-[0.25em] text-white font-medium">Request Early Access</span>
            <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-16 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            The first enterprise platform built on honesty.
            <br />
            No fine print. No hidden limitations. No surprises.
          </p>
          <div className="flex items-center justify-center gap-8 text-[10px] text-gray-700 tracking-widest">
            <span>© {new Date().getFullYear()} DATACENDIA</span>
            <span>•</span>
            <span>RADICAL TRANSPARENCY</span>
          </div>
        </div>
      </footer>

      {/* Matrix Modal */}
      {stryMutAct_9fa48("54241") ? selectedMatrix || <MatrixModal matrix={selectedMatrix} onClose={() => setSelectedMatrix(null)} /> : stryMutAct_9fa48("54240") ? false : stryMutAct_9fa48("54239") ? true : (stryCov_9fa48("54239", "54240", "54241"), selectedMatrix && <MatrixModal matrix={selectedMatrix} onClose={stryMutAct_9fa48("54242") ? () => undefined : (stryCov_9fa48("54242"), () => setSelectedMatrix(null))} />)}
    </div>;
};
export default HonestyMatricesPage;