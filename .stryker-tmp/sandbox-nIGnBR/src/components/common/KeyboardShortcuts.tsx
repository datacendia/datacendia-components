/**
 * Keyboard Shortcuts Component
 * 
 * Quick Win: Global keyboard shortcuts for power users
 * - Cmd/Ctrl + K: Quick search
 * - Cmd/Ctrl + Enter: Submit deliberation
 * - Cmd/Ctrl + /: Show shortcuts help
 * - Escape: Close modals
 */
// @ts-nocheck
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
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../../lib/utils';
interface Shortcut {
  keys: string[];
  description: string;
  category: string;
  action?: () => void;
}
interface KeyboardShortcutsProps {
  onQuickSearch?: () => void;
  onSubmit?: () => void;
  onNewDeliberation?: () => void;
  onToggleSidebar?: () => void;
}
const SHORTCUTS: Shortcut[] = stryMutAct_9fa48("1414") ? [] : (stryCov_9fa48("1414"), [// Navigation
stryMutAct_9fa48("1415") ? {} : (stryCov_9fa48("1415"), {
  keys: stryMutAct_9fa48("1416") ? [] : (stryCov_9fa48("1416"), ['⌘', 'K']),
  description: 'Quick search',
  category: 'Navigation'
}), stryMutAct_9fa48("1421") ? {} : (stryCov_9fa48("1421"), {
  keys: stryMutAct_9fa48("1422") ? [] : (stryCov_9fa48("1422"), ['⌘', '/']),
  description: 'Show keyboard shortcuts',
  category: 'Navigation'
}), stryMutAct_9fa48("1427") ? {} : (stryCov_9fa48("1427"), {
  keys: stryMutAct_9fa48("1428") ? [] : (stryCov_9fa48("1428"), ['G', 'C']),
  description: 'Go to Council',
  category: 'Navigation'
}), stryMutAct_9fa48("1433") ? {} : (stryCov_9fa48("1433"), {
  keys: stryMutAct_9fa48("1434") ? [] : (stryCov_9fa48("1434"), ['G', 'G']),
  description: 'Go to Graph',
  category: 'Navigation'
}), stryMutAct_9fa48("1439") ? {} : (stryCov_9fa48("1439"), {
  keys: stryMutAct_9fa48("1440") ? [] : (stryCov_9fa48("1440"), ['G', 'T']),
  description: 'Go to Chronos',
  category: 'Navigation'
}), stryMutAct_9fa48("1445") ? {} : (stryCov_9fa48("1445"), {
  keys: stryMutAct_9fa48("1446") ? [] : (stryCov_9fa48("1446"), ['G', 'P']),
  description: 'Go to Pulse',
  category: 'Navigation'
}), stryMutAct_9fa48("1451") ? {} : (stryCov_9fa48("1451"), {
  keys: stryMutAct_9fa48("1452") ? [] : (stryCov_9fa48("1452"), ['G', 'H']),
  description: 'Go to Home',
  category: 'Navigation'
}), // Actions
stryMutAct_9fa48("1457") ? {} : (stryCov_9fa48("1457"), {
  keys: stryMutAct_9fa48("1458") ? [] : (stryCov_9fa48("1458"), ['⌘', '↵']),
  description: 'Submit deliberation',
  category: 'Actions'
}), stryMutAct_9fa48("1463") ? {} : (stryCov_9fa48("1463"), {
  keys: stryMutAct_9fa48("1464") ? [] : (stryCov_9fa48("1464"), ['⌘', 'N']),
  description: 'New deliberation',
  category: 'Actions'
}), stryMutAct_9fa48("1469") ? {} : (stryCov_9fa48("1469"), {
  keys: stryMutAct_9fa48("1470") ? [] : (stryCov_9fa48("1470"), ['⌘', 'S']),
  description: 'Save draft',
  category: 'Actions'
}), stryMutAct_9fa48("1475") ? {} : (stryCov_9fa48("1475"), {
  keys: stryMutAct_9fa48("1476") ? [] : (stryCov_9fa48("1476"), ['⌘', 'E']),
  description: 'Export current view',
  category: 'Actions'
}), // View
stryMutAct_9fa48("1481") ? {} : (stryCov_9fa48("1481"), {
  keys: stryMutAct_9fa48("1482") ? [] : (stryCov_9fa48("1482"), ['⌘', 'B']),
  description: 'Toggle sidebar',
  category: 'View'
}), stryMutAct_9fa48("1487") ? {} : (stryCov_9fa48("1487"), {
  keys: stryMutAct_9fa48("1488") ? [] : (stryCov_9fa48("1488"), ['⌘', '\\']),
  description: 'Toggle full screen',
  category: 'View'
}), stryMutAct_9fa48("1493") ? {} : (stryCov_9fa48("1493"), {
  keys: stryMutAct_9fa48("1494") ? [] : (stryCov_9fa48("1494"), ['⌘', '+']),
  description: 'Zoom in',
  category: 'View'
}), stryMutAct_9fa48("1499") ? {} : (stryCov_9fa48("1499"), {
  keys: stryMutAct_9fa48("1500") ? [] : (stryCov_9fa48("1500"), ['⌘', '-']),
  description: 'Zoom out',
  category: 'View'
}), // General
stryMutAct_9fa48("1505") ? {} : (stryCov_9fa48("1505"), {
  keys: stryMutAct_9fa48("1506") ? [] : (stryCov_9fa48("1506"), ['Esc']),
  description: 'Close modal / Cancel',
  category: 'General'
}), stryMutAct_9fa48("1510") ? {} : (stryCov_9fa48("1510"), {
  keys: stryMutAct_9fa48("1511") ? [] : (stryCov_9fa48("1511"), ['?']),
  description: 'Show help',
  category: 'General'
})]);
const KeyboardShortcutsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({
  isOpen,
  onClose
}) => {
  if (stryMutAct_9fa48("1518") ? false : stryMutAct_9fa48("1517") ? true : stryMutAct_9fa48("1516") ? isOpen : (stryCov_9fa48("1516", "1517", "1518"), !isOpen)) return null;
  const categories = stryMutAct_9fa48("1519") ? [] : (stryCov_9fa48("1519"), [...new Set(SHORTCUTS.map(stryMutAct_9fa48("1520") ? () => undefined : (stryCov_9fa48("1520"), s => s.category)))]);
  const isMac = stryMutAct_9fa48("1524") ? navigator.platform.toUpperCase().indexOf('MAC') < 0 : stryMutAct_9fa48("1523") ? navigator.platform.toUpperCase().indexOf('MAC') > 0 : stryMutAct_9fa48("1522") ? false : stryMutAct_9fa48("1521") ? true : (stryCov_9fa48("1521", "1522", "1523", "1524"), (stryMutAct_9fa48("1525") ? navigator.platform.toLowerCase().indexOf('MAC') : (stryCov_9fa48("1525"), navigator.platform.toUpperCase().indexOf('MAC'))) >= 0);

  // Replace ⌘ with Ctrl on non-Mac
  const formatKeys = (keys: string[]) => {
    return keys.map(stryMutAct_9fa48("1528") ? () => undefined : (stryCov_9fa48("1528"), k => (stryMutAct_9fa48("1531") ? k !== '⌘' : stryMutAct_9fa48("1530") ? false : stryMutAct_9fa48("1529") ? true : (stryCov_9fa48("1529", "1530", "1531"), k === '⌘')) ? isMac ? '⌘' : 'Ctrl' : k));
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={stryMutAct_9fa48("1535") ? () => undefined : (stryCov_9fa48("1535"), e => e.stopPropagation())}>
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⌨️</span>
            <h2 className="text-xl font-bold text-neutral-900">Keyboard Shortcuts</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map(stryMutAct_9fa48("1536") ? () => undefined : (stryCov_9fa48("1536"), category => <div key={category}>
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {stryMutAct_9fa48("1537") ? SHORTCUTS.map((shortcut, i) => <div key={i} className="flex items-center justify-between py-1">
                      <span className="text-neutral-700">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {formatKeys(shortcut.keys).map((key, j) => <React.Fragment key={j}>
                            <kbd className="px-2 py-1 bg-neutral-100 border border-neutral-200 rounded text-xs font-mono text-neutral-700">
                              {key}
                            </kbd>
                            {j < shortcut.keys.length - 1 && <span className="text-neutral-400 text-xs">+</span>}
                          </React.Fragment>)}
                      </div>
                    </div>) : (stryCov_9fa48("1537"), SHORTCUTS.filter(stryMutAct_9fa48("1538") ? () => undefined : (stryCov_9fa48("1538"), s => stryMutAct_9fa48("1541") ? s.category !== category : stryMutAct_9fa48("1540") ? false : stryMutAct_9fa48("1539") ? true : (stryCov_9fa48("1539", "1540", "1541"), s.category === category))).map(stryMutAct_9fa48("1542") ? () => undefined : (stryCov_9fa48("1542"), (shortcut, i) => <div key={i} className="flex items-center justify-between py-1">
                      <span className="text-neutral-700">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {formatKeys(shortcut.keys).map(stryMutAct_9fa48("1543") ? () => undefined : (stryCov_9fa48("1543"), (key, j) => <React.Fragment key={j}>
                            <kbd className="px-2 py-1 bg-neutral-100 border border-neutral-200 rounded text-xs font-mono text-neutral-700">
                              {key}
                            </kbd>
                            {stryMutAct_9fa48("1546") ? j < shortcut.keys.length - 1 || <span className="text-neutral-400 text-xs">+</span> : stryMutAct_9fa48("1545") ? false : stryMutAct_9fa48("1544") ? true : (stryCov_9fa48("1544", "1545", "1546"), (stryMutAct_9fa48("1549") ? j >= shortcut.keys.length - 1 : stryMutAct_9fa48("1548") ? j <= shortcut.keys.length - 1 : stryMutAct_9fa48("1547") ? true : (stryCov_9fa48("1547", "1548", "1549"), j < (stryMutAct_9fa48("1550") ? shortcut.keys.length + 1 : (stryCov_9fa48("1550"), shortcut.keys.length - 1)))) && <span className="text-neutral-400 text-xs">+</span>)}
                          </React.Fragment>))}
                      </div>
                    </div>)))}
                </div>
              </div>))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
          <p className="text-sm text-neutral-500 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-xs font-mono">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>;
};
const KeyboardShortcutsProvider: React.FC<KeyboardShortcutsProps & {
  children: React.ReactNode;
}> = ({
  children,
  onQuickSearch,
  onSubmit,
  onNewDeliberation,
  onToggleSidebar
}) => {
  const [showHelp, setShowHelp] = useState(stryMutAct_9fa48("1552") ? true : (stryCov_9fa48("1552"), false));
  const [goPrefix, setGoPrefix] = useState(stryMutAct_9fa48("1553") ? true : (stryCov_9fa48("1553"), false));
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isMac = stryMutAct_9fa48("1558") ? navigator.platform.toUpperCase().indexOf('MAC') < 0 : stryMutAct_9fa48("1557") ? navigator.platform.toUpperCase().indexOf('MAC') > 0 : stryMutAct_9fa48("1556") ? false : stryMutAct_9fa48("1555") ? true : (stryCov_9fa48("1555", "1556", "1557", "1558"), (stryMutAct_9fa48("1559") ? navigator.platform.toLowerCase().indexOf('MAC') : (stryCov_9fa48("1559"), navigator.platform.toUpperCase().indexOf('MAC'))) >= 0);
    const cmdKey = isMac ? e.metaKey : e.ctrlKey;
    const target = e.target as HTMLElement;
    const isInput = stryMutAct_9fa48("1563") ? (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.isContentEditable : stryMutAct_9fa48("1562") ? false : stryMutAct_9fa48("1561") ? true : (stryCov_9fa48("1561", "1562", "1563"), (stryMutAct_9fa48("1565") ? target.tagName === 'INPUT' && target.tagName === 'TEXTAREA' : stryMutAct_9fa48("1564") ? false : (stryCov_9fa48("1564", "1565"), (stryMutAct_9fa48("1567") ? target.tagName !== 'INPUT' : stryMutAct_9fa48("1566") ? false : (stryCov_9fa48("1566", "1567"), target.tagName === 'INPUT')) || (stryMutAct_9fa48("1570") ? target.tagName !== 'TEXTAREA' : stryMutAct_9fa48("1569") ? false : (stryCov_9fa48("1569", "1570"), target.tagName === 'TEXTAREA')))) || target.isContentEditable);

    // Don't trigger shortcuts when typing in inputs (except specific ones)
    if (stryMutAct_9fa48("1574") ? isInput || !cmdKey : stryMutAct_9fa48("1573") ? false : stryMutAct_9fa48("1572") ? true : (stryCov_9fa48("1572", "1573", "1574"), isInput && (stryMutAct_9fa48("1575") ? cmdKey : (stryCov_9fa48("1575"), !cmdKey)))) {
      setGoPrefix(stryMutAct_9fa48("1577") ? true : (stryCov_9fa48("1577"), false));
      return;
    }

    // Escape - close help
    if (stryMutAct_9fa48("1580") ? e.key !== 'Escape' : stryMutAct_9fa48("1579") ? false : stryMutAct_9fa48("1578") ? true : (stryCov_9fa48("1578", "1579", "1580"), e.key === 'Escape')) {
      setShowHelp(stryMutAct_9fa48("1583") ? true : (stryCov_9fa48("1583"), false));
      setGoPrefix(stryMutAct_9fa48("1584") ? true : (stryCov_9fa48("1584"), false));
      return;
    }

    // ? - show help (when not in input)
    if (stryMutAct_9fa48("1587") ? e.key === '?' || !isInput : stryMutAct_9fa48("1586") ? false : stryMutAct_9fa48("1585") ? true : (stryCov_9fa48("1585", "1586", "1587"), (stryMutAct_9fa48("1589") ? e.key !== '?' : stryMutAct_9fa48("1588") ? true : (stryCov_9fa48("1588", "1589"), e.key === '?')) && (stryMutAct_9fa48("1591") ? isInput : (stryCov_9fa48("1591"), !isInput)))) {
      e.preventDefault();
      setShowHelp(stryMutAct_9fa48("1593") ? false : (stryCov_9fa48("1593"), true));
      return;
    }

    // Cmd/Ctrl + / - show help
    if (stryMutAct_9fa48("1596") ? cmdKey || e.key === '/' : stryMutAct_9fa48("1595") ? false : stryMutAct_9fa48("1594") ? true : (stryCov_9fa48("1594", "1595", "1596"), cmdKey && (stryMutAct_9fa48("1598") ? e.key !== '/' : stryMutAct_9fa48("1597") ? true : (stryCov_9fa48("1597", "1598"), e.key === '/')))) {
      e.preventDefault();
      setShowHelp(stryMutAct_9fa48("1601") ? () => undefined : (stryCov_9fa48("1601"), prev => stryMutAct_9fa48("1602") ? prev : (stryCov_9fa48("1602"), !prev)));
      return;
    }

    // Cmd/Ctrl + K - quick search
    if (stryMutAct_9fa48("1605") ? cmdKey || e.key === 'k' : stryMutAct_9fa48("1604") ? false : stryMutAct_9fa48("1603") ? true : (stryCov_9fa48("1603", "1604", "1605"), cmdKey && (stryMutAct_9fa48("1607") ? e.key !== 'k' : stryMutAct_9fa48("1606") ? true : (stryCov_9fa48("1606", "1607"), e.key === 'k')))) {
      e.preventDefault();
      stryMutAct_9fa48("1610") ? onQuickSearch() : (stryCov_9fa48("1610"), onQuickSearch?.());
      return;
    }

    // Cmd/Ctrl + Enter - submit
    if (stryMutAct_9fa48("1613") ? cmdKey || e.key === 'Enter' : stryMutAct_9fa48("1612") ? false : stryMutAct_9fa48("1611") ? true : (stryCov_9fa48("1611", "1612", "1613"), cmdKey && (stryMutAct_9fa48("1615") ? e.key !== 'Enter' : stryMutAct_9fa48("1614") ? true : (stryCov_9fa48("1614", "1615"), e.key === 'Enter')))) {
      e.preventDefault();
      stryMutAct_9fa48("1618") ? onSubmit() : (stryCov_9fa48("1618"), onSubmit?.());
      return;
    }

    // Cmd/Ctrl + N - new deliberation
    if (stryMutAct_9fa48("1621") ? cmdKey || e.key === 'n' : stryMutAct_9fa48("1620") ? false : stryMutAct_9fa48("1619") ? true : (stryCov_9fa48("1619", "1620", "1621"), cmdKey && (stryMutAct_9fa48("1623") ? e.key !== 'n' : stryMutAct_9fa48("1622") ? true : (stryCov_9fa48("1622", "1623"), e.key === 'n')))) {
      e.preventDefault();
      stryMutAct_9fa48("1626") ? onNewDeliberation() : (stryCov_9fa48("1626"), onNewDeliberation?.());
      return;
    }

    // Cmd/Ctrl + B - toggle sidebar
    if (stryMutAct_9fa48("1629") ? cmdKey || e.key === 'b' : stryMutAct_9fa48("1628") ? false : stryMutAct_9fa48("1627") ? true : (stryCov_9fa48("1627", "1628", "1629"), cmdKey && (stryMutAct_9fa48("1631") ? e.key !== 'b' : stryMutAct_9fa48("1630") ? true : (stryCov_9fa48("1630", "1631"), e.key === 'b')))) {
      e.preventDefault();
      stryMutAct_9fa48("1634") ? onToggleSidebar() : (stryCov_9fa48("1634"), onToggleSidebar?.());
      return;
    }

    // G prefix for navigation (vim-style)
    if (stryMutAct_9fa48("1637") ? false : stryMutAct_9fa48("1636") ? true : stryMutAct_9fa48("1635") ? isInput : (stryCov_9fa48("1635", "1636", "1637"), !isInput)) {
      if (stryMutAct_9fa48("1641") ? e.key.toLowerCase() === 'g' || !goPrefix : stryMutAct_9fa48("1640") ? false : stryMutAct_9fa48("1639") ? true : (stryCov_9fa48("1639", "1640", "1641"), (stryMutAct_9fa48("1643") ? e.key.toLowerCase() !== 'g' : stryMutAct_9fa48("1642") ? true : (stryCov_9fa48("1642", "1643"), (stryMutAct_9fa48("1644") ? e.key.toUpperCase() : (stryCov_9fa48("1644"), e.key.toLowerCase())) === 'g')) && (stryMutAct_9fa48("1646") ? goPrefix : (stryCov_9fa48("1646"), !goPrefix)))) {
        setGoPrefix(stryMutAct_9fa48("1648") ? false : (stryCov_9fa48("1648"), true));
        setTimeout(stryMutAct_9fa48("1649") ? () => undefined : (stryCov_9fa48("1649"), () => setGoPrefix(stryMutAct_9fa48("1650") ? true : (stryCov_9fa48("1650"), false))), 1000); // Reset after 1 second
        return;
      }
      if (stryMutAct_9fa48("1652") ? false : stryMutAct_9fa48("1651") ? true : (stryCov_9fa48("1651", "1652"), goPrefix)) {
        setGoPrefix(stryMutAct_9fa48("1654") ? true : (stryCov_9fa48("1654"), false));
        switch (stryMutAct_9fa48("1655") ? e.key.toUpperCase() : (stryCov_9fa48("1655"), e.key.toLowerCase())) {
          case 'c':
            if (stryMutAct_9fa48("1656")) {} else {
              stryCov_9fa48("1656");
              window.location.href = '/cortex/council';
              break;
            }
          case 'g':
            if (stryMutAct_9fa48("1659")) {} else {
              stryCov_9fa48("1659");
              window.location.href = '/cortex/graph';
              break;
            }
          case 't':
            if (stryMutAct_9fa48("1662")) {} else {
              stryCov_9fa48("1662");
              window.location.href = '/cortex/chronos';
              break;
            }
          case 'p':
            if (stryMutAct_9fa48("1665")) {} else {
              stryCov_9fa48("1665");
              window.location.href = '/cortex/pulse';
              break;
            }
          case 'h':
            if (stryMutAct_9fa48("1668")) {} else {
              stryCov_9fa48("1668");
              window.location.href = '/';
              break;
            }
        }
      }
    }
  }, stryMutAct_9fa48("1671") ? [] : (stryCov_9fa48("1671"), [onQuickSearch, onSubmit, onNewDeliberation, onToggleSidebar, goPrefix]));
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return stryMutAct_9fa48("1674") ? () => undefined : (stryCov_9fa48("1674"), () => window.removeEventListener('keydown', handleKeyDown));
  }, stryMutAct_9fa48("1676") ? [] : (stryCov_9fa48("1676"), [handleKeyDown]));
  return <>
      {children}
      <KeyboardShortcutsModal isOpen={showHelp} onClose={stryMutAct_9fa48("1677") ? () => undefined : (stryCov_9fa48("1677"), () => setShowHelp(stryMutAct_9fa48("1678") ? true : (stryCov_9fa48("1678"), false)))} />
      
      {/* Go prefix indicator */}
      {stryMutAct_9fa48("1681") ? goPrefix || <div className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-neutral-900 text-white rounded-lg shadow-lg">
          <span className="text-sm">Press a key: </span>
          <span className="font-mono">C</span>=Council, 
          <span className="font-mono">G</span>=Graph, 
          <span className="font-mono">T</span>=Chronos, 
          <span className="font-mono">P</span>=Pulse
        </div> : stryMutAct_9fa48("1680") ? false : stryMutAct_9fa48("1679") ? true : (stryCov_9fa48("1679", "1680", "1681"), goPrefix && <div className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-neutral-900 text-white rounded-lg shadow-lg">
          <span className="text-sm">Press a key: </span>
          <span className="font-mono">C</span>=Council, 
          <span className="font-mono">G</span>=Graph, 
          <span className="font-mono">T</span>=Chronos, 
          <span className="font-mono">P</span>=Pulse
        </div>)}
    </>;
};

// Quick search component
const QuickSearch: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({
  isOpen,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    type: string;
    title: string;
    path: string;
  }[]>(stryMutAct_9fa48("1684") ? ["Stryker was here"] : (stryCov_9fa48("1684"), []));
  useEffect(() => {
    if (stryMutAct_9fa48("1689") ? query.length <= 0 : stryMutAct_9fa48("1688") ? query.length >= 0 : stryMutAct_9fa48("1687") ? false : stryMutAct_9fa48("1686") ? true : (stryCov_9fa48("1686", "1687", "1688", "1689"), query.length > 0)) {
      // Mock search results
      const mockResults = stryMutAct_9fa48("1691") ? [{
        type: 'deliberation',
        title: 'Q1 Growth Strategy Analysis',
        path: '/cortex/council/del-001'
      }, {
        type: 'deliberation',
        title: 'Market Expansion Risk Assessment',
        path: '/cortex/council/del-002'
      }, {
        type: 'entity',
        title: 'Revenue Forecast Model',
        path: '/cortex/graph/entity-001'
      }, {
        type: 'page',
        title: 'The Council',
        path: '/cortex/council'
      }, {
        type: 'page',
        title: 'Knowledge Graph',
        path: '/cortex/graph'
      }, {
        type: 'page',
        title: 'CendiaChronos',
        path: '/cortex/chronos'
      }] : (stryCov_9fa48("1691"), (stryMutAct_9fa48("1692") ? [] : (stryCov_9fa48("1692"), [stryMutAct_9fa48("1693") ? {} : (stryCov_9fa48("1693"), {
        type: 'deliberation',
        title: 'Q1 Growth Strategy Analysis',
        path: '/cortex/council/del-001'
      }), stryMutAct_9fa48("1697") ? {} : (stryCov_9fa48("1697"), {
        type: 'deliberation',
        title: 'Market Expansion Risk Assessment',
        path: '/cortex/council/del-002'
      }), stryMutAct_9fa48("1701") ? {} : (stryCov_9fa48("1701"), {
        type: 'entity',
        title: 'Revenue Forecast Model',
        path: '/cortex/graph/entity-001'
      }), stryMutAct_9fa48("1705") ? {} : (stryCov_9fa48("1705"), {
        type: 'page',
        title: 'The Council',
        path: '/cortex/council'
      }), stryMutAct_9fa48("1709") ? {} : (stryCov_9fa48("1709"), {
        type: 'page',
        title: 'Knowledge Graph',
        path: '/cortex/graph'
      }), stryMutAct_9fa48("1713") ? {} : (stryCov_9fa48("1713"), {
        type: 'page',
        title: 'CendiaChronos',
        path: '/cortex/chronos'
      })])).filter(stryMutAct_9fa48("1717") ? () => undefined : (stryCov_9fa48("1717"), r => stryMutAct_9fa48("1718") ? r.title.toUpperCase().includes(query.toLowerCase()) : (stryCov_9fa48("1718"), r.title.toLowerCase().includes(stryMutAct_9fa48("1719") ? query.toUpperCase() : (stryCov_9fa48("1719"), query.toLowerCase()))))));
      setResults(mockResults);
    } else {
      setResults(stryMutAct_9fa48("1721") ? ["Stryker was here"] : (stryCov_9fa48("1721"), []));
    }
  }, stryMutAct_9fa48("1722") ? [] : (stryCov_9fa48("1722"), [query]));
  if (stryMutAct_9fa48("1725") ? false : stryMutAct_9fa48("1724") ? true : stryMutAct_9fa48("1723") ? isOpen : (stryCov_9fa48("1723", "1724", "1725"), !isOpen)) return null;
  const typeIcons: Record<string, string> = stryMutAct_9fa48("1726") ? {} : (stryCov_9fa48("1726"), {
    deliberation: '⚖️',
    entity: '🔗',
    page: '📄'
  });
  return <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden" onClick={stryMutAct_9fa48("1730") ? () => undefined : (stryCov_9fa48("1730"), e => e.stopPropagation())}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200">
          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={query} onChange={stryMutAct_9fa48("1731") ? () => undefined : (stryCov_9fa48("1731"), e => setQuery(e.target.value))} placeholder="Search deliberations, entities, pages..." className="flex-1 text-lg outline-none" autoFocus />
          <kbd className="px-2 py-1 bg-neutral-100 border border-neutral-200 rounded text-xs font-mono text-neutral-500">
            Esc
          </kbd>
        </div>

        {stryMutAct_9fa48("1734") ? results.length > 0 || <div className="max-h-80 overflow-y-auto">
            {results.map((result, i) => <a key={i} href={result.path} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors">
                <span className="text-xl">{typeIcons[result.type] || '📄'}</span>
                <div className="flex-1">
                  <div className="font-medium text-neutral-900">{result.title}</div>
                  <div className="text-sm text-neutral-500">{result.type}</div>
                </div>
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>)}
          </div> : stryMutAct_9fa48("1733") ? false : stryMutAct_9fa48("1732") ? true : (stryCov_9fa48("1732", "1733", "1734"), (stryMutAct_9fa48("1737") ? results.length <= 0 : stryMutAct_9fa48("1736") ? results.length >= 0 : stryMutAct_9fa48("1735") ? true : (stryCov_9fa48("1735", "1736", "1737"), results.length > 0)) && <div className="max-h-80 overflow-y-auto">
            {results.map(stryMutAct_9fa48("1738") ? () => undefined : (stryCov_9fa48("1738"), (result, i) => <a key={i} href={result.path} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors">
                <span className="text-xl">{stryMutAct_9fa48("1741") ? typeIcons[result.type] && '📄' : stryMutAct_9fa48("1740") ? false : stryMutAct_9fa48("1739") ? true : (stryCov_9fa48("1739", "1740", "1741"), typeIcons[result.type] || '📄')}</span>
                <div className="flex-1">
                  <div className="font-medium text-neutral-900">{result.title}</div>
                  <div className="text-sm text-neutral-500">{result.type}</div>
                </div>
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>))}
          </div>)}

        {stryMutAct_9fa48("1745") ? query && results.length === 0 || <div className="px-4 py-8 text-center text-neutral-500">
            No results found for "{query}"
          </div> : stryMutAct_9fa48("1744") ? false : stryMutAct_9fa48("1743") ? true : (stryCov_9fa48("1743", "1744", "1745"), (stryMutAct_9fa48("1747") ? query || results.length === 0 : stryMutAct_9fa48("1746") ? true : (stryCov_9fa48("1746", "1747"), query && (stryMutAct_9fa48("1749") ? results.length !== 0 : stryMutAct_9fa48("1748") ? true : (stryCov_9fa48("1748", "1749"), results.length === 0)))) && <div className="px-4 py-8 text-center text-neutral-500">
            No results found for "{query}"
          </div>)}

        {stryMutAct_9fa48("1752") ? !query || <div className="px-4 py-4 text-sm text-neutral-500">
            <div className="mb-2 font-medium">Quick actions:</div>
            <div className="flex flex-wrap gap-2">
              <a href="/cortex/council" className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                ⚖️ The Council
              </a>
              <a href="/cortex/graph" className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                🔗 Knowledge Graph
              </a>
              <a href="/cortex/chronos" className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                ⏱️ CendiaChronos
              </a>
              <a href="/cortex/pulse" className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                💓 The Pulse
              </a>
            </div>
          </div> : stryMutAct_9fa48("1751") ? false : stryMutAct_9fa48("1750") ? true : (stryCov_9fa48("1750", "1751", "1752"), (stryMutAct_9fa48("1753") ? query : (stryCov_9fa48("1753"), !query)) && <div className="px-4 py-4 text-sm text-neutral-500">
            <div className="mb-2 font-medium">Quick actions:</div>
            <div className="flex flex-wrap gap-2">
              <a href="/cortex/council" className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                ⚖️ The Council
              </a>
              <a href="/cortex/graph" className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                🔗 Knowledge Graph
              </a>
              <a href="/cortex/chronos" className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                ⏱️ CendiaChronos
              </a>
              <a href="/cortex/pulse" className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                💓 The Pulse
              </a>
            </div>
          </div>)}
      </div>
    </div>;
};
export { KeyboardShortcutsProvider, KeyboardShortcutsModal, QuickSearch };
export default KeyboardShortcutsProvider;