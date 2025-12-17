// @ts-nocheck
// =============================================================================
// DATACENDIA - COMPREHENSIVE DOWNLOADS PAGE
// Enterprise Downloads for Windows, macOS, Linux, iOS, Android
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
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type Platform = 'windows' | 'macos' | 'linux' | 'ios' | 'android';
type Architecture = 'x64' | 'arm64' | 'universal';
interface DownloadItem {
  id: string;
  platform: Platform;
  architecture: Architecture;
  version: string;
  size: string;
  filename: string;
  downloadUrl: string;
  checksum: string;
  releaseDate: string;
  minOsVersion: string;
  notes?: string;
}
interface ReleaseChannel {
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const CURRENT_VERSION = '2.4.1';
const RELEASE_DATE = '2024-11-15';
const releaseChannels: Record<string, ReleaseChannel> = stryMutAct_9fa48("52752") ? {} : (stryCov_9fa48("52752"), {
  stable: stryMutAct_9fa48("52753") ? {} : (stryCov_9fa48("52753"), {
    name: 'Stable',
    description: 'Recommended for production use',
    badge: 'Recommended',
    badgeColor: 'bg-success-100 text-success-700'
  }),
  beta: stryMutAct_9fa48("52758") ? {} : (stryCov_9fa48("52758"), {
    name: 'Beta',
    description: 'Preview upcoming features',
    badge: 'Beta',
    badgeColor: 'bg-warning-100 text-warning-700'
  }),
  nightly: stryMutAct_9fa48("52763") ? {} : (stryCov_9fa48("52763"), {
    name: 'Nightly',
    description: 'Latest development builds',
    badge: 'Nightly',
    badgeColor: 'bg-neutral-100 text-neutral-700'
  })
});
const platformInfo: Record<Platform, {
  name: string;
  icon: string;
  color: string;
}> = stryMutAct_9fa48("52768") ? {} : (stryCov_9fa48("52768"), {
  windows: stryMutAct_9fa48("52769") ? {} : (stryCov_9fa48("52769"), {
    name: 'Windows',
    icon: '🪟',
    color: 'bg-blue-500'
  }),
  macos: stryMutAct_9fa48("52773") ? {} : (stryCov_9fa48("52773"), {
    name: 'macOS',
    icon: '🍎',
    color: 'bg-neutral-800'
  }),
  linux: stryMutAct_9fa48("52777") ? {} : (stryCov_9fa48("52777"), {
    name: 'Linux',
    icon: '🐧',
    color: 'bg-orange-500'
  }),
  ios: stryMutAct_9fa48("52781") ? {} : (stryCov_9fa48("52781"), {
    name: 'iOS',
    icon: '📱',
    color: 'bg-neutral-800'
  }),
  android: stryMutAct_9fa48("52785") ? {} : (stryCov_9fa48("52785"), {
    name: 'Android',
    icon: '🤖',
    color: 'bg-green-500'
  })
});
const downloads: DownloadItem[] = stryMutAct_9fa48("52789") ? [] : (stryCov_9fa48("52789"), [// Windows
stryMutAct_9fa48("52790") ? {} : (stryCov_9fa48("52790"), {
  id: 'win-x64',
  platform: 'windows',
  architecture: 'x64',
  version: CURRENT_VERSION,
  size: '145 MB',
  filename: `Datacendia-${CURRENT_VERSION}-win-x64.exe`,
  downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-win-x64.exe`,
  checksum: 'sha256:a1b2c3d4e5f6...',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'Windows 10 (1903+)'
}), stryMutAct_9fa48("52799") ? {} : (stryCov_9fa48("52799"), {
  id: 'win-arm64',
  platform: 'windows',
  architecture: 'arm64',
  version: CURRENT_VERSION,
  size: '142 MB',
  filename: `Datacendia-${CURRENT_VERSION}-win-arm64.exe`,
  downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-win-arm64.exe`,
  checksum: 'sha256:b2c3d4e5f6a1...',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'Windows 11 ARM'
}), // macOS
stryMutAct_9fa48("52808") ? {} : (stryCov_9fa48("52808"), {
  id: 'mac-universal',
  platform: 'macos',
  architecture: 'universal',
  version: CURRENT_VERSION,
  size: '168 MB',
  filename: `Datacendia-${CURRENT_VERSION}-mac-universal.dmg`,
  downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-mac-universal.dmg`,
  checksum: 'sha256:c3d4e5f6a1b2...',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'macOS 12.0+',
  notes: 'Universal binary for Intel and Apple Silicon'
}), stryMutAct_9fa48("52818") ? {} : (stryCov_9fa48("52818"), {
  id: 'mac-x64',
  platform: 'macos',
  architecture: 'x64',
  version: CURRENT_VERSION,
  size: '152 MB',
  filename: `Datacendia-${CURRENT_VERSION}-mac-x64.dmg`,
  downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-mac-x64.dmg`,
  checksum: 'sha256:d4e5f6a1b2c3...',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'macOS 12.0+',
  notes: 'Intel Macs only'
}), stryMutAct_9fa48("52828") ? {} : (stryCov_9fa48("52828"), {
  id: 'mac-arm64',
  platform: 'macos',
  architecture: 'arm64',
  version: CURRENT_VERSION,
  size: '148 MB',
  filename: `Datacendia-${CURRENT_VERSION}-mac-arm64.dmg`,
  downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-mac-arm64.dmg`,
  checksum: 'sha256:e5f6a1b2c3d4...',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'macOS 12.0+',
  notes: 'Apple Silicon (M1/M2/M3)'
}), // Linux
stryMutAct_9fa48("52838") ? {} : (stryCov_9fa48("52838"), {
  id: 'linux-x64-appimage',
  platform: 'linux',
  architecture: 'x64',
  version: CURRENT_VERSION,
  size: '152 MB',
  filename: `Datacendia-${CURRENT_VERSION}-linux-x64.AppImage`,
  downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-linux-x64.AppImage`,
  checksum: 'sha256:f6a1b2c3d4e5...',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'glibc 2.31+',
  notes: 'Universal Linux AppImage'
}), stryMutAct_9fa48("52848") ? {} : (stryCov_9fa48("52848"), {
  id: 'linux-x64-deb',
  platform: 'linux',
  architecture: 'x64',
  version: CURRENT_VERSION,
  size: '148 MB',
  filename: `datacendia_${CURRENT_VERSION}_amd64.deb`,
  downloadUrl: `/downloads/desktop/datacendia_${CURRENT_VERSION}_amd64.deb`,
  checksum: 'sha256:a1b2c3d4e5f6...',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'Ubuntu 20.04+ / Debian 11+'
}), stryMutAct_9fa48("52857") ? {} : (stryCov_9fa48("52857"), {
  id: 'linux-x64-rpm',
  platform: 'linux',
  architecture: 'x64',
  version: CURRENT_VERSION,
  size: '150 MB',
  filename: `datacendia-${CURRENT_VERSION}.x86_64.rpm`,
  downloadUrl: `/downloads/desktop/datacendia-${CURRENT_VERSION}.x86_64.rpm`,
  checksum: 'sha256:b2c3d4e5f6a1...',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'Fedora 36+ / RHEL 8+'
}), stryMutAct_9fa48("52866") ? {} : (stryCov_9fa48("52866"), {
  id: 'linux-arm64-appimage',
  platform: 'linux',
  architecture: 'arm64',
  version: CURRENT_VERSION,
  size: '145 MB',
  filename: `Datacendia-${CURRENT_VERSION}-linux-arm64.AppImage`,
  downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-linux-arm64.AppImage`,
  checksum: 'sha256:c3d4e5f6a1b2...',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'glibc 2.31+',
  notes: 'ARM64/AArch64 systems'
}), // iOS
stryMutAct_9fa48("52876") ? {} : (stryCov_9fa48("52876"), {
  id: 'ios',
  platform: 'ios',
  architecture: 'universal',
  version: CURRENT_VERSION,
  size: '85 MB',
  filename: 'Datacendia iOS App',
  downloadUrl: 'https://apps.apple.com/app/datacendia/id123456789',
  checksum: '',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'iOS 15.0+',
  notes: 'Available on App Store'
}), // Android
stryMutAct_9fa48("52886") ? {} : (stryCov_9fa48("52886"), {
  id: 'android',
  platform: 'android',
  architecture: 'universal',
  version: CURRENT_VERSION,
  size: '78 MB',
  filename: 'Datacendia Android App',
  downloadUrl: 'https://play.google.com/store/apps/details?id=com.datacendia.app',
  checksum: '',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'Android 10+',
  notes: 'Available on Google Play'
}), stryMutAct_9fa48("52896") ? {} : (stryCov_9fa48("52896"), {
  id: 'android-apk',
  platform: 'android',
  architecture: 'universal',
  version: CURRENT_VERSION,
  size: '82 MB',
  filename: `Datacendia-${CURRENT_VERSION}.apk`,
  downloadUrl: `/downloads/mobile/Datacendia-${CURRENT_VERSION}.apk`,
  checksum: 'sha256:d4e5f6a1b2c3...',
  releaseDate: RELEASE_DATE,
  minOsVersion: 'Android 10+',
  notes: 'Direct APK download'
})]);
const systemRequirements = stryMutAct_9fa48("52906") ? {} : (stryCov_9fa48("52906"), {
  windows: stryMutAct_9fa48("52907") ? {} : (stryCov_9fa48("52907"), {
    minimum: stryMutAct_9fa48("52908") ? {} : (stryCov_9fa48("52908"), {
      os: 'Windows 10 (version 1903+)',
      cpu: '2 GHz dual-core processor',
      ram: '4 GB RAM',
      storage: '500 MB available space',
      display: '1280 x 720 resolution'
    }),
    recommended: stryMutAct_9fa48("52914") ? {} : (stryCov_9fa48("52914"), {
      os: 'Windows 11',
      cpu: '2.5 GHz quad-core processor',
      ram: '8 GB RAM',
      storage: '1 GB available space',
      display: '1920 x 1080 resolution'
    })
  }),
  macos: stryMutAct_9fa48("52920") ? {} : (stryCov_9fa48("52920"), {
    minimum: stryMutAct_9fa48("52921") ? {} : (stryCov_9fa48("52921"), {
      os: 'macOS 12.0 Monterey',
      cpu: 'Intel Core i5 or Apple M1',
      ram: '4 GB RAM',
      storage: '500 MB available space',
      display: '1280 x 800 resolution'
    }),
    recommended: stryMutAct_9fa48("52927") ? {} : (stryCov_9fa48("52927"), {
      os: 'macOS 14.0 Sonoma',
      cpu: 'Apple M1 Pro or better',
      ram: '8 GB RAM',
      storage: '1 GB available space',
      display: 'Retina display'
    })
  }),
  linux: stryMutAct_9fa48("52933") ? {} : (stryCov_9fa48("52933"), {
    minimum: stryMutAct_9fa48("52934") ? {} : (stryCov_9fa48("52934"), {
      os: 'Ubuntu 20.04 / Debian 11 / Fedora 36',
      cpu: '2 GHz dual-core processor',
      ram: '4 GB RAM',
      storage: '500 MB available space',
      display: 'X11 or Wayland'
    }),
    recommended: stryMutAct_9fa48("52940") ? {} : (stryCov_9fa48("52940"), {
      os: 'Ubuntu 22.04 / Fedora 38',
      cpu: '2.5 GHz quad-core processor',
      ram: '8 GB RAM',
      storage: '1 GB available space',
      display: '1920 x 1080 resolution'
    })
  })
});

// =============================================================================
// COMPONENT
// =============================================================================

export const DownloadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedChannel, setSelectedChannel] = useState<'stable' | 'beta' | 'nightly'>('stable');
  const [detectedPlatform, setDetectedPlatform] = useState<Platform>('windows');

  // Detect user's platform
  useEffect(() => {
    const userAgent = stryMutAct_9fa48("52951") ? navigator.userAgent.toUpperCase() : (stryCov_9fa48("52951"), navigator.userAgent.toLowerCase());
    if (stryMutAct_9fa48("52953") ? false : stryMutAct_9fa48("52952") ? true : (stryCov_9fa48("52952", "52953"), userAgent.includes('win'))) {
      setDetectedPlatform('windows');
    } else if (stryMutAct_9fa48("52958") ? false : stryMutAct_9fa48("52957") ? true : (stryCov_9fa48("52957", "52958"), userAgent.includes('mac'))) {
      setDetectedPlatform('macos');
    } else if (stryMutAct_9fa48("52963") ? false : stryMutAct_9fa48("52962") ? true : (stryCov_9fa48("52962", "52963"), userAgent.includes('linux'))) {
      setDetectedPlatform('linux');
    } else if (stryMutAct_9fa48("52968") ? false : stryMutAct_9fa48("52967") ? true : (stryCov_9fa48("52967", "52968"), userAgent.includes('android'))) {
      setDetectedPlatform('android');
    } else if (stryMutAct_9fa48("52974") ? userAgent.includes('iphone') && userAgent.includes('ipad') : stryMutAct_9fa48("52973") ? false : stryMutAct_9fa48("52972") ? true : (stryCov_9fa48("52972", "52973", "52974"), userAgent.includes('iphone') || userAgent.includes('ipad'))) {
      setDetectedPlatform('ios');
    }
  }, stryMutAct_9fa48("52979") ? ["Stryker was here"] : (stryCov_9fa48("52979"), []));
  const filteredDownloads = (stryMutAct_9fa48("52982") ? selectedPlatform !== 'all' : stryMutAct_9fa48("52981") ? false : stryMutAct_9fa48("52980") ? true : (stryCov_9fa48("52980", "52981", "52982"), selectedPlatform === 'all')) ? downloads : stryMutAct_9fa48("52984") ? downloads : (stryCov_9fa48("52984"), downloads.filter(stryMutAct_9fa48("52985") ? () => undefined : (stryCov_9fa48("52985"), d => stryMutAct_9fa48("52988") ? d.platform !== selectedPlatform : stryMutAct_9fa48("52987") ? false : stryMutAct_9fa48("52986") ? true : (stryCov_9fa48("52986", "52987", "52988"), d.platform === selectedPlatform))));
  const getDownloadsByPlatform = stryMutAct_9fa48("52989") ? () => undefined : (stryCov_9fa48("52989"), (() => {
    const getDownloadsByPlatform = (platform: Platform) => stryMutAct_9fa48("52990") ? downloads : (stryCov_9fa48("52990"), downloads.filter(stryMutAct_9fa48("52991") ? () => undefined : (stryCov_9fa48("52991"), d => stryMutAct_9fa48("52994") ? d.platform !== platform : stryMutAct_9fa48("52993") ? false : stryMutAct_9fa48("52992") ? true : (stryCov_9fa48("52992", "52993", "52994"), d.platform === platform))));
    return getDownloadsByPlatform;
  })());
  const handleDownload = (item: DownloadItem) => {
    // Track download analytics
    console.log(`Download initiated: ${item.filename}`);

    // For app store links, open in new tab
    if (stryMutAct_9fa48("52999") ? item.downloadUrl.endsWith('http') : stryMutAct_9fa48("52998") ? false : stryMutAct_9fa48("52997") ? true : (stryCov_9fa48("52997", "52998", "52999"), item.downloadUrl.startsWith('http'))) {
      window.open(item.downloadUrl, '_blank');
    } else {
      // For direct downloads, trigger download
      const link = document.createElement('a');
      link.href = item.downloadUrl;
      link.download = item.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const recommendedDownload = downloads.find(stryMutAct_9fa48("53005") ? () => undefined : (stryCov_9fa48("53005"), d => stryMutAct_9fa48("53008") ? d.platform === detectedPlatform || d.architecture === 'universal' || d.architecture === 'x64' : stryMutAct_9fa48("53007") ? false : stryMutAct_9fa48("53006") ? true : (stryCov_9fa48("53006", "53007", "53008"), (stryMutAct_9fa48("53010") ? d.platform !== detectedPlatform : stryMutAct_9fa48("53009") ? true : (stryCov_9fa48("53009", "53010"), d.platform === detectedPlatform)) && (stryMutAct_9fa48("53012") ? d.architecture === 'universal' && d.architecture === 'x64' : stryMutAct_9fa48("53011") ? true : (stryCov_9fa48("53011", "53012"), (stryMutAct_9fa48("53014") ? d.architecture !== 'universal' : stryMutAct_9fa48("53013") ? false : (stryCov_9fa48("53013", "53014"), d.architecture === 'universal')) || (stryMutAct_9fa48("53017") ? d.architecture !== 'x64' : stryMutAct_9fa48("53016") ? false : (stryCov_9fa48("53016", "53017"), d.architecture === 'x64')))))));
  return <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Datacendia</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/product" className="text-neutral-600 hover:text-neutral-900">Product</Link>
            <Link to="/pricing" className="text-neutral-600 hover:text-neutral-900">Pricing</Link>
            <Link to="/login" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Download Datacendia</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Get Datacendia for your platform. Available for Windows, macOS, Linux, iOS, and Android.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <span>Current Version: {CURRENT_VERSION}</span>
            <span>•</span>
            <span>Released: {new Date(RELEASE_DATE).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      {/* Recommended Download */}
      {stryMutAct_9fa48("53021") ? recommendedDownload || <section className="py-12 bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                  Recommended for you
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-4xl">{platformInfo[detectedPlatform].icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Datacendia for {platformInfo[detectedPlatform].name}
                    </h2>
                    <p className="text-neutral-600">
                      Version {recommendedDownload.version} • {recommendedDownload.size} • {recommendedDownload.architecture}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDownload(recommendedDownload)} className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download for {platformInfo[detectedPlatform].name}
                </button>
              </div>
            </div>
          </div>
        </section> : stryMutAct_9fa48("53020") ? false : stryMutAct_9fa48("53019") ? true : (stryCov_9fa48("53019", "53020", "53021"), recommendedDownload && <section className="py-12 bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                  Recommended for you
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-4xl">{platformInfo[detectedPlatform].icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Datacendia for {platformInfo[detectedPlatform].name}
                    </h2>
                    <p className="text-neutral-600">
                      Version {recommendedDownload.version} • {recommendedDownload.size} • {recommendedDownload.architecture}
                    </p>
                  </div>
                </div>
                <button onClick={stryMutAct_9fa48("53022") ? () => undefined : (stryCov_9fa48("53022"), () => handleDownload(recommendedDownload))} className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download for {platformInfo[detectedPlatform].name}
                </button>
              </div>
            </div>
          </div>
        </section>)}

      {/* Platform Tabs */}
      <section className="py-8 bg-white sticky top-0 z-10 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button onClick={stryMutAct_9fa48("53023") ? () => undefined : (stryCov_9fa48("53023"), () => setSelectedPlatform('all'))} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${(stryMutAct_9fa48("53028") ? selectedPlatform !== 'all' : stryMutAct_9fa48("53027") ? false : stryMutAct_9fa48("53026") ? true : (stryCov_9fa48("53026", "53027", "53028"), selectedPlatform === 'all')) ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>
              All Platforms
            </button>
            {(Object.keys(platformInfo) as Platform[]).map(stryMutAct_9fa48("53032") ? () => undefined : (stryCov_9fa48("53032"), platform => <button key={platform} onClick={stryMutAct_9fa48("53033") ? () => undefined : (stryCov_9fa48("53033"), () => setSelectedPlatform(platform))} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${(stryMutAct_9fa48("53037") ? selectedPlatform !== platform : stryMutAct_9fa48("53036") ? false : stryMutAct_9fa48("53035") ? true : (stryCov_9fa48("53035", "53036", "53037"), selectedPlatform === platform)) ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>
                <span>{platformInfo[platform].icon}</span>
                {platformInfo[platform].name}
              </button>))}
          </div>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(stryMutAct_9fa48("53042") ? selectedPlatform !== 'all' : stryMutAct_9fa48("53041") ? false : stryMutAct_9fa48("53040") ? true : (stryCov_9fa48("53040", "53041", "53042"), selectedPlatform === 'all')) ?
        // Show by platform sections
        <>
              {/* Desktop */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Desktop Applications</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {(stryMutAct_9fa48("53044") ? [] : (stryCov_9fa48("53044"), ['windows', 'macos', 'linux'])).map(stryMutAct_9fa48("53048") ? () => undefined : (stryCov_9fa48("53048"), platform => <div key={platform} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                      <div className={`${platformInfo[platform as Platform].color} p-4`}>
                        <div className="flex items-center gap-3 text-white">
                          <span className="text-3xl">{platformInfo[platform as Platform].icon}</span>
                          <span className="text-xl font-semibold">{platformInfo[platform as Platform].name}</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {getDownloadsByPlatform(platform as Platform).map(stryMutAct_9fa48("53050") ? () => undefined : (stryCov_9fa48("53050"), item => <button key={item.id} onClick={stryMutAct_9fa48("53051") ? () => undefined : (stryCov_9fa48("53051"), () => handleDownload(item))} className="w-full p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-left flex items-center justify-between group">
                            <div>
                              <p className="font-medium text-neutral-900">{item.architecture}</p>
                              <p className="text-sm text-neutral-500">{item.size}</p>
                            </div>
                            <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>))}
                      </div>
                    </div>))}
                </div>
              </div>

              {/* Mobile */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Mobile Applications</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {(stryMutAct_9fa48("53052") ? [] : (stryCov_9fa48("53052"), ['ios', 'android'])).map(stryMutAct_9fa48("53055") ? () => undefined : (stryCov_9fa48("53055"), platform => <div key={platform} className="bg-white rounded-xl border border-neutral-200 p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 ${platformInfo[platform as Platform].color} rounded-xl flex items-center justify-center`}>
                          <span className="text-3xl">{platformInfo[platform as Platform].icon}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-900">{platformInfo[platform as Platform].name}</h3>
                          <p className="text-neutral-500">Version {CURRENT_VERSION}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {getDownloadsByPlatform(platform as Platform).map(stryMutAct_9fa48("53057") ? () => undefined : (stryCov_9fa48("53057"), item => <button key={item.id} onClick={stryMutAct_9fa48("53058") ? () => undefined : (stryCov_9fa48("53058"), () => handleDownload(item))} className="w-full p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-left flex items-center justify-between group">
                            <div>
                              <p className="font-medium text-neutral-900">{stryMutAct_9fa48("53061") ? item.notes && item.filename : stryMutAct_9fa48("53060") ? false : stryMutAct_9fa48("53059") ? true : (stryCov_9fa48("53059", "53060", "53061"), item.notes || item.filename)}</p>
                              <p className="text-sm text-neutral-500">{item.size} • {item.minOsVersion}</p>
                            </div>
                            <span className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium group-hover:bg-primary-700 transition-colors">
                              {(stryMutAct_9fa48("53062") ? item.downloadUrl.endsWith('http') : (stryCov_9fa48("53062"), item.downloadUrl.startsWith('http'))) ? 'Get' : 'Download'}
                            </span>
                          </button>))}
                      </div>
                    </div>))}
                </div>
              </div>
            </> :
        // Show filtered downloads
        <div className="space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                {platformInfo[selectedPlatform].icon} {platformInfo[selectedPlatform].name} Downloads
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredDownloads.map(stryMutAct_9fa48("53066") ? () => undefined : (stryCov_9fa48("53066"), item => <div key={item.id} className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-primary-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-neutral-900">{item.filename}</h3>
                        <p className="text-sm text-neutral-500">{item.architecture} • {item.size}</p>
                      </div>
                      <span className="px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded">
                        v{item.version}
                      </span>
                    </div>
                    {stryMutAct_9fa48("53069") ? item.notes || <p className="text-sm text-neutral-600 mb-4">{item.notes}</p> : stryMutAct_9fa48("53068") ? false : stryMutAct_9fa48("53067") ? true : (stryCov_9fa48("53067", "53068", "53069"), item.notes && <p className="text-sm text-neutral-600 mb-4">{item.notes}</p>)}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">Requires {item.minOsVersion}</span>
                      <button onClick={stryMutAct_9fa48("53070") ? () => undefined : (stryCov_9fa48("53070"), () => handleDownload(item))} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>))}
              </div>
            </div>}
        </div>
      </section>

      {/* CLI & Self-Hosted */}
      <section className="py-12 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* CLI */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Command Line Interface</h2>
              <div className="bg-neutral-900 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-neutral-400 text-sm mb-2">npm</p>
                  <code className="block p-3 bg-neutral-800 text-green-400 rounded-lg text-sm font-mono">
                    npm install -g @datacendia/cli
                  </code>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-2">Homebrew (macOS/Linux)</p>
                  <code className="block p-3 bg-neutral-800 text-green-400 rounded-lg text-sm font-mono">
                    brew install datacendia/tap/datacendia
                  </code>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-2">curl (Linux/macOS)</p>
                  <code className="block p-3 bg-neutral-800 text-green-400 rounded-lg text-sm font-mono break-all">
                    curl -fsSL https://get.datacendia.com | sh
                  </code>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-2">PowerShell (Windows)</p>
                  <code className="block p-3 bg-neutral-800 text-green-400 rounded-lg text-sm font-mono break-all">
                    irm https://get.datacendia.com/ps1 | iex
                  </code>
                </div>
              </div>
            </div>

            {/* Self-Hosted */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Self-Hosted Deployment</h2>
              <div className="space-y-4">
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">🐳</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Docker Compose</h3>
                      <p className="text-sm text-neutral-500">Quick start for evaluation</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View Documentation →
                  </button>
                </div>
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">☸️</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Kubernetes (Helm)</h3>
                      <p className="text-sm text-neutral-500">Production-ready deployment</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View Helm Charts →
                  </button>
                </div>
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">🔒</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Air-Gapped Bundle</h3>
                      <p className="text-sm text-neutral-500">Completely isolated deployment</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    Contact Sales →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="py-12 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">System Requirements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(systemRequirements).map(stryMutAct_9fa48("53071") ? () => undefined : (stryCov_9fa48("53071"), ([platform, reqs]) => <div key={platform} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <div className="bg-neutral-100 p-4 flex items-center gap-3">
                  <span className="text-2xl">{platformInfo[platform as Platform].icon}</span>
                  <span className="font-semibold text-neutral-900">{platformInfo[platform as Platform].name}</span>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Minimum</h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      {Object.entries(reqs.minimum).map(stryMutAct_9fa48("53072") ? () => undefined : (stryCov_9fa48("53072"), ([key, value]) => <li key={key}><span className="font-medium">{key}:</span> {value}</li>))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Recommended</h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      {Object.entries(reqs.recommended).map(stryMutAct_9fa48("53073") ? () => undefined : (stryCov_9fa48("53073"), ([key, value]) => <li key={key}><span className="font-medium">{key}:</span> {value}</li>))}
                    </ul>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="py-12 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Verify Your Download</h2>
          <p className="text-neutral-400 mb-6">
            All downloads are cryptographically signed. Verify the SHA-256 checksum to ensure file integrity.
          </p>
          <div className="bg-neutral-800 rounded-lg p-4 text-left">
            <code className="text-green-400 text-sm font-mono break-all">
              sha256sum Datacendia-{CURRENT_VERSION}-*.* | grep -f checksums.txt
            </code>
          </div>
          <p className="text-sm text-neutral-500 mt-4">
            <a href="/downloads/checksums.txt" className="text-primary-400 hover:text-primary-300">
              Download checksums.txt
            </a>
            {' • '}
            <a href="/downloads/KEYS" className="text-primary-400 hover:text-primary-300">
              GPG Public Key
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Datacendia. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/privacy" className="hover:text-neutral-900">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-neutral-900">Terms of Service</Link>
            <Link to="/security" className="hover:text-neutral-900">Security</Link>
          </div>
        </div>
      </footer>
    </div>;
};
export default DownloadsPage;