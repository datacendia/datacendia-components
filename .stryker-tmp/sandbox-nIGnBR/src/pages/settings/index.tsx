// @ts-nocheck
// =============================================================================
// DATACENDIA - SETTINGS PAGES
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
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useToast } from '../../../components/feedback';
import { Modal, ConfirmModal, FormModal } from '../../components/ui/Modal';
import { cn, formatRelativeTime, formatCurrency } from '../../../lib/utils';
import { settingsService, type User, type Team, type Role, type ApiKey, type BillingInfo } from '../../services/SettingsService';

// =============================================================================
// SETTINGS LAYOUT
// =============================================================================

export const SettingsLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settingsNav = stryMutAct_9fa48("56733") ? [] : (stryCov_9fa48("56733"), [stryMutAct_9fa48("56734") ? {} : (stryCov_9fa48("56734"), {
    id: 'organization',
    label: 'Organization',
    icon: '🏢'
  }), stryMutAct_9fa48("56738") ? {} : (stryCov_9fa48("56738"), {
    id: 'users',
    label: 'Users',
    icon: '👥'
  }), stryMutAct_9fa48("56742") ? {} : (stryCov_9fa48("56742"), {
    id: 'teams',
    label: 'Teams',
    icon: '👔'
  }), stryMutAct_9fa48("56746") ? {} : (stryCov_9fa48("56746"), {
    id: 'roles',
    label: 'Roles & Permissions',
    icon: '🔐'
  }), stryMutAct_9fa48("56750") ? {} : (stryCov_9fa48("56750"), {
    id: 'billing',
    label: 'Billing',
    icon: '💳'
  }), stryMutAct_9fa48("56754") ? {} : (stryCov_9fa48("56754"), {
    id: 'api-keys',
    label: 'API Keys',
    icon: '🔑'
  }), stryMutAct_9fa48("56758") ? {} : (stryCov_9fa48("56758"), {
    id: 'integrations',
    label: 'Integrations',
    icon: '🔗'
  }), stryMutAct_9fa48("56762") ? {} : (stryCov_9fa48("56762"), {
    id: 'preferences',
    label: 'Preferences',
    icon: '⚙️'
  }), stryMutAct_9fa48("56766") ? {} : (stryCov_9fa48("56766"), {
    id: 'security',
    label: 'Security',
    icon: '🛡️'
  })]);
  const currentPath = location.pathname.split('/').pop();
  return <div className="flex h-full">
      {/* Settings Sidebar */}
      <aside className="w-64 border-r border-neutral-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Settings</h2>
        <nav className="space-y-1">
          {settingsNav.map(stryMutAct_9fa48("56771") ? () => undefined : (stryCov_9fa48("56771"), item => <button key={item.id} onClick={stryMutAct_9fa48("56772") ? () => undefined : (stryCov_9fa48("56772"), () => navigate(`/cortex/settings/${item.id}`))} className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left', (stryMutAct_9fa48("56777") ? currentPath !== item.id : stryMutAct_9fa48("56776") ? false : stryMutAct_9fa48("56775") ? true : (stryCov_9fa48("56775", "56776", "56777"), currentPath === item.id)) ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900')}>
              <span>{item.icon}</span>
              {item.label}
            </button>))}
        </nav>
      </aside>

      {/* Settings Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-neutral-50">
        <Outlet />
      </main>
    </div>;
};

// =============================================================================
// ORGANIZATION SETTINGS
// =============================================================================

export const OrganizationSettingsPage: React.FC = () => {
  const {
    addToast
  } = useToast();
  const [isSaving, setIsSaving] = useState(stryMutAct_9fa48("56781") ? true : (stryCov_9fa48("56781"), false));
  const [isExporting, setIsExporting] = useState(stryMutAct_9fa48("56782") ? true : (stryCov_9fa48("56782"), false));
  const [showDeleteModal, setShowDeleteModal] = useState(stryMutAct_9fa48("56783") ? true : (stryCov_9fa48("56783"), false));
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const navigate = useNavigate();
  const [orgData, setOrgData] = useState(stryMutAct_9fa48("56785") ? {} : (stryCov_9fa48("56785"), {
    name: 'Acme Corporation',
    id: 'org_acme_2024',
    industry: 'technology',
    companySize: '201-1000',
    primaryContact: 'John Smith',
    primaryEmail: 'john@acme.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    numberFormat: 'en-US'
  }));
  return <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Organization</h1>

      {/* Organization Profile */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Organization Profile</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Organization Name</label>
              <input type="text" value={orgData.name} onChange={stryMutAct_9fa48("56796") ? () => undefined : (stryCov_9fa48("56796"), e => setOrgData(stryMutAct_9fa48("56797") ? {} : (stryCov_9fa48("56797"), {
              ...orgData,
              name: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Organization ID</label>
              <input type="text" value={orgData.id} disabled className="w-full h-10 px-3 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Industry</label>
              <select value={orgData.industry} onChange={stryMutAct_9fa48("56798") ? () => undefined : (stryCov_9fa48("56798"), e => setOrgData(stryMutAct_9fa48("56799") ? {} : (stryCov_9fa48("56799"), {
              ...orgData,
              industry: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="technology">Technology</option>
                <option value="finance">Financial Services</option>
                <option value="healthcare">Healthcare</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Company Size</label>
              <select value={orgData.companySize} onChange={stryMutAct_9fa48("56800") ? () => undefined : (stryCov_9fa48("56800"), e => setOrgData(stryMutAct_9fa48("56801") ? {} : (stryCov_9fa48("56801"), {
              ...orgData,
              companySize: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="1-50">1-50</option>
                <option value="51-200">51-200</option>
                <option value="201-1000">201-1,000</option>
                <option value="1001-5000">1,001-5,000</option>
                <option value="5000+">5,000+</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Primary Contact</label>
              <input type="text" value={orgData.primaryContact} onChange={stryMutAct_9fa48("56802") ? () => undefined : (stryCov_9fa48("56802"), e => setOrgData(stryMutAct_9fa48("56803") ? {} : (stryCov_9fa48("56803"), {
              ...orgData,
              primaryContact: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Primary Email</label>
              <input type="email" value={orgData.primaryEmail} onChange={stryMutAct_9fa48("56804") ? () => undefined : (stryCov_9fa48("56804"), e => setOrgData(stryMutAct_9fa48("56805") ? {} : (stryCov_9fa48("56805"), {
              ...orgData,
              primaryEmail: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Regional Settings</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Timezone</label>
            <select value={orgData.timezone} onChange={stryMutAct_9fa48("56806") ? () => undefined : (stryCov_9fa48("56806"), e => setOrgData(stryMutAct_9fa48("56807") ? {} : (stryCov_9fa48("56807"), {
            ...orgData,
            timezone: e.target.value
          })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Date Format</label>
            <select value={orgData.dateFormat} onChange={stryMutAct_9fa48("56808") ? () => undefined : (stryCov_9fa48("56808"), e => setOrgData(stryMutAct_9fa48("56809") ? {} : (stryCov_9fa48("56809"), {
            ...orgData,
            dateFormat: e.target.value
          })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Currency</label>
            <select value={orgData.currency} onChange={stryMutAct_9fa48("56810") ? () => undefined : (stryCov_9fa48("56810"), e => setOrgData(stryMutAct_9fa48("56811") ? {} : (stryCov_9fa48("56811"), {
            ...orgData,
            currency: e.target.value
          })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Number Format</label>
            <select value={orgData.numberFormat} onChange={stryMutAct_9fa48("56812") ? () => undefined : (stryCov_9fa48("56812"), e => setOrgData(stryMutAct_9fa48("56813") ? {} : (stryCov_9fa48("56813"), {
            ...orgData,
            numberFormat: e.target.value
          })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="en-US">1,234.56</option>
              <option value="de-DE">1.234,56</option>
              <option value="fr-FR">1 234,56</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-error-main/20 p-6">
        <h2 className="text-lg font-semibold text-error-dark mb-4">Danger Zone</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-error-light/50 rounded-lg">
            <div>
              <p className="font-medium text-neutral-900">Export All Data</p>
              <p className="text-sm text-neutral-500">Download all organization data as a ZIP file</p>
            </div>
            <button onClick={async () => {
            setIsExporting(stryMutAct_9fa48("56815") ? false : (stryCov_9fa48("56815"), true));
            await new Promise(stryMutAct_9fa48("56816") ? () => undefined : (stryCov_9fa48("56816"), r => setTimeout(r, 2000)));
            setIsExporting(stryMutAct_9fa48("56817") ? true : (stryCov_9fa48("56817"), false));
            addToast(stryMutAct_9fa48("56818") ? {} : (stryCov_9fa48("56818"), {
              status: 'success',
              title: 'Export Complete',
              description: 'Your data export is ready for download.'
            }));
          }} disabled={isExporting} className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-error-light/50 rounded-lg">
            <div>
              <p className="font-medium text-neutral-900">Delete Organization</p>
              <p className="text-sm text-neutral-500">Permanently delete this organization and all data</p>
            </div>
            <button onClick={stryMutAct_9fa48("56824") ? () => undefined : (stryCov_9fa48("56824"), () => setShowDeleteModal(stryMutAct_9fa48("56825") ? false : (stryCov_9fa48("56825"), true)))} className="px-4 py-2 bg-error-main text-white rounded-lg hover:bg-error-dark transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button onClick={async () => {
        setIsSaving(stryMutAct_9fa48("56827") ? false : (stryCov_9fa48("56827"), true));
        await new Promise(stryMutAct_9fa48("56828") ? () => undefined : (stryCov_9fa48("56828"), r => setTimeout(r, 1000)));
        setIsSaving(stryMutAct_9fa48("56829") ? true : (stryCov_9fa48("56829"), false));
        addToast(stryMutAct_9fa48("56830") ? {} : (stryCov_9fa48("56830"), {
          status: 'success',
          title: 'Settings Saved',
          description: 'Organization settings have been updated.'
        }));
      }} disabled={isSaving} className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {stryMutAct_9fa48("56838") ? showDeleteModal || <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Delete Organization</h2>
            <p className="text-neutral-600 mb-4">
              This action cannot be undone. This will permanently delete the organization 
              <strong> {orgData.name}</strong> and all associated data.
            </p>
            <p className="text-sm text-neutral-500 mb-2">Type <strong>{orgData.name}</strong> to confirm:</p>
            <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg mb-4" placeholder="Organization name" />
            <div className="flex gap-3">
              <button onClick={() => {
            setShowDeleteModal(false);
            setDeleteConfirmText('');
          }} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
                Cancel
              </button>
              <button onClick={async () => {
            setShowDeleteModal(false);
            addToast({
              status: 'success',
              title: 'Organization Deleted',
              description: 'Redirecting to home...'
            });
            await new Promise(r => setTimeout(r, 1500));
            navigate('/');
          }} disabled={deleteConfirmText !== orgData.name} className="flex-1 px-4 py-2 bg-error-main text-white rounded-lg hover:bg-error-dark disabled:opacity-50 disabled:cursor-not-allowed">
                Delete Organization
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("56837") ? false : stryMutAct_9fa48("56836") ? true : (stryCov_9fa48("56836", "56837", "56838"), showDeleteModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={stryMutAct_9fa48("56839") ? () => undefined : (stryCov_9fa48("56839"), () => setShowDeleteModal(stryMutAct_9fa48("56840") ? true : (stryCov_9fa48("56840"), false)))} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Delete Organization</h2>
            <p className="text-neutral-600 mb-4">
              This action cannot be undone. This will permanently delete the organization 
              <strong> {orgData.name}</strong> and all associated data.
            </p>
            <p className="text-sm text-neutral-500 mb-2">Type <strong>{orgData.name}</strong> to confirm:</p>
            <input type="text" value={deleteConfirmText} onChange={stryMutAct_9fa48("56841") ? () => undefined : (stryCov_9fa48("56841"), e => setDeleteConfirmText(e.target.value))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg mb-4" placeholder="Organization name" />
            <div className="flex gap-3">
              <button onClick={() => {
            setShowDeleteModal(stryMutAct_9fa48("56843") ? true : (stryCov_9fa48("56843"), false));
            setDeleteConfirmText('');
          }} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
                Cancel
              </button>
              <button onClick={async () => {
            setShowDeleteModal(stryMutAct_9fa48("56846") ? true : (stryCov_9fa48("56846"), false));
            addToast(stryMutAct_9fa48("56847") ? {} : (stryCov_9fa48("56847"), {
              status: 'success',
              title: 'Organization Deleted',
              description: 'Redirecting to home...'
            }));
            await new Promise(stryMutAct_9fa48("56851") ? () => undefined : (stryCov_9fa48("56851"), r => setTimeout(r, 1500)));
            navigate('/');
          }} disabled={stryMutAct_9fa48("56855") ? deleteConfirmText === orgData.name : stryMutAct_9fa48("56854") ? false : stryMutAct_9fa48("56853") ? true : (stryCov_9fa48("56853", "56854", "56855"), deleteConfirmText !== orgData.name)} className="flex-1 px-4 py-2 bg-error-main text-white rounded-lg hover:bg-error-dark disabled:opacity-50 disabled:cursor-not-allowed">
                Delete Organization
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};

// =============================================================================
// USERS SETTINGS
// =============================================================================

export const UsersSettingsPage: React.FC = () => {
  const {
    addToast
  } = useToast();
  const [users, setUsers] = useState<User[]>(stryMutAct_9fa48("56857") ? ["Stryker was here"] : (stryCov_9fa48("56857"), []));
  const [metrics, setMetrics] = useState<{
    totalUsers: number;
    activeUsers: number;
    pendingInvites: number;
  } | null>(null);
  const [loading, setLoading] = useState(stryMutAct_9fa48("56858") ? false : (stryCov_9fa48("56858"), true));
  const [search, setSearch] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(stryMutAct_9fa48("56860") ? true : (stryCov_9fa48("56860"), false));
  const [inviteData, setInviteData] = useState(stryMutAct_9fa48("56861") ? {} : (stryCov_9fa48("56861"), {
    email: '',
    role: 'viewer',
    name: ''
  }));
  const [isInviting, setIsInviting] = useState(stryMutAct_9fa48("56865") ? true : (stryCov_9fa48("56865"), false));
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(stryMutAct_9fa48("56869") ? false : (stryCov_9fa48("56869"), true));
        const data = await settingsService.listUsers(stryMutAct_9fa48("56870") ? {} : (stryCov_9fa48("56870"), {
          search: stryMutAct_9fa48("56873") ? search && undefined : stryMutAct_9fa48("56872") ? false : stryMutAct_9fa48("56871") ? true : (stryCov_9fa48("56871", "56872", "56873"), search || undefined)
        }));
        setUsers(data.users);
        setMetrics(data.metrics);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(stryMutAct_9fa48("56877") ? true : (stryCov_9fa48("56877"), false));
      }
    };
    loadUsers();
  }, stryMutAct_9fa48("56878") ? [] : (stryCov_9fa48("56878"), [search]));
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(stryMutAct_9fa48("56880") ? false : (stryCov_9fa48("56880"), true));
    await new Promise(stryMutAct_9fa48("56881") ? () => undefined : (stryCov_9fa48("56881"), r => setTimeout(r, 1500)));
    setIsInviting(stryMutAct_9fa48("56882") ? true : (stryCov_9fa48("56882"), false));
    setShowInviteModal(stryMutAct_9fa48("56883") ? true : (stryCov_9fa48("56883"), false));
    addToast(stryMutAct_9fa48("56884") ? {} : (stryCov_9fa48("56884"), {
      status: 'success',
      title: 'Invitation Sent',
      description: `Invite sent to ${inviteData.email}`
    }));
    setInviteData(stryMutAct_9fa48("56888") ? {} : (stryCov_9fa48("56888"), {
      email: '',
      role: 'viewer',
      name: ''
    }));
  };
  return <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
          <p className="text-neutral-500">Manage user access and permissions</p>
        </div>
        <button onClick={stryMutAct_9fa48("56892") ? () => undefined : (stryCov_9fa48("56892"), () => setShowInviteModal(stryMutAct_9fa48("56893") ? false : (stryCov_9fa48("56893"), true)))} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Invite User
        </button>
      </div>

      {/* Invite User Modal */}
      {stryMutAct_9fa48("56896") ? showInviteModal || <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowInviteModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Invite User</h2>
            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input type="text" required value={inviteData.name} onChange={e => setInviteData({
              ...inviteData,
              name: e.target.value
            })} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                <input type="email" required value={inviteData.email} onChange={e => setInviteData({
              ...inviteData,
              email: e.target.value
            })} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="user@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                <select value={inviteData.role} onChange={e => setInviteData({
              ...inviteData,
              role: e.target.value
            })} className="w-full h-10 px-3 border border-neutral-300 rounded-lg">
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
                  Cancel
                </button>
                <button type="submit" disabled={isInviting} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                  {isInviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div> : stryMutAct_9fa48("56895") ? false : stryMutAct_9fa48("56894") ? true : (stryCov_9fa48("56894", "56895", "56896"), showInviteModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={stryMutAct_9fa48("56897") ? () => undefined : (stryCov_9fa48("56897"), () => setShowInviteModal(stryMutAct_9fa48("56898") ? true : (stryCov_9fa48("56898"), false)))} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Invite User</h2>
            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input type="text" required value={inviteData.name} onChange={stryMutAct_9fa48("56899") ? () => undefined : (stryCov_9fa48("56899"), e => setInviteData(stryMutAct_9fa48("56900") ? {} : (stryCov_9fa48("56900"), {
              ...inviteData,
              name: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                <input type="email" required value={inviteData.email} onChange={stryMutAct_9fa48("56901") ? () => undefined : (stryCov_9fa48("56901"), e => setInviteData(stryMutAct_9fa48("56902") ? {} : (stryCov_9fa48("56902"), {
              ...inviteData,
              email: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="user@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                <select value={inviteData.role} onChange={stryMutAct_9fa48("56903") ? () => undefined : (stryCov_9fa48("56903"), e => setInviteData(stryMutAct_9fa48("56904") ? {} : (stryCov_9fa48("56904"), {
              ...inviteData,
              role: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg">
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={stryMutAct_9fa48("56905") ? () => undefined : (stryCov_9fa48("56905"), () => setShowInviteModal(stryMutAct_9fa48("56906") ? true : (stryCov_9fa48("56906"), false)))} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
                  Cancel
                </button>
                <button type="submit" disabled={isInviting} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                  {isInviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* License Usage */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">License Usage</h2>
          <span className="text-sm text-neutral-500">
            {stryMutAct_9fa48("56911") ? metrics?.totalUsers && 0 : stryMutAct_9fa48("56910") ? false : stryMutAct_9fa48("56909") ? true : (stryCov_9fa48("56909", "56910", "56911"), (stryMutAct_9fa48("56912") ? metrics.totalUsers : (stryCov_9fa48("56912"), metrics?.totalUsers)) || 0)} of 50 users
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all" style={stryMutAct_9fa48("56913") ? {} : (stryCov_9fa48("56913"), {
          width: `${stryMutAct_9fa48("56915") ? Math.max((metrics?.totalUsers || 0) / 50 * 100, 100) : (stryCov_9fa48("56915"), Math.min(stryMutAct_9fa48("56916") ? (metrics?.totalUsers || 0) / 50 / 100 : (stryCov_9fa48("56916"), (stryMutAct_9fa48("56917") ? (metrics?.totalUsers || 0) * 50 : (stryCov_9fa48("56917"), (stryMutAct_9fa48("56920") ? metrics?.totalUsers && 0 : stryMutAct_9fa48("56919") ? false : stryMutAct_9fa48("56918") ? true : (stryCov_9fa48("56918", "56919", "56920"), (stryMutAct_9fa48("56921") ? metrics.totalUsers : (stryCov_9fa48("56921"), metrics?.totalUsers)) || 0)) / 50)) * 100), 100))}%`
        })} />
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <input type="text" placeholder="Search users..." value={search} onChange={stryMutAct_9fa48("56922") ? () => undefined : (stryCov_9fa48("56922"), e => setSearch(e.target.value))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
        </div>
        
        {loading ? <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div> : <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Last Login</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map(stryMutAct_9fa48("56923") ? () => undefined : (stryCov_9fa48("56923"), user => <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-sm">
                          {user.name.split(' ').map(stryMutAct_9fa48("56925") ? () => undefined : (stryCov_9fa48("56925"), n => n[0])).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{user.name}</p>
                        <p className="text-sm text-neutral-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', stryMutAct_9fa48("56930") ? user.status === 'active' || 'bg-success-light text-success-dark' : stryMutAct_9fa48("56929") ? false : stryMutAct_9fa48("56928") ? true : (stryCov_9fa48("56928", "56929", "56930"), (stryMutAct_9fa48("56932") ? user.status !== 'active' : stryMutAct_9fa48("56931") ? true : (stryCov_9fa48("56931", "56932"), user.status === 'active')) && 'bg-success-light text-success-dark'), stryMutAct_9fa48("56937") ? user.status === 'pending' || 'bg-warning-light text-warning-dark' : stryMutAct_9fa48("56936") ? false : stryMutAct_9fa48("56935") ? true : (stryCov_9fa48("56935", "56936", "56937"), (stryMutAct_9fa48("56939") ? user.status !== 'pending' : stryMutAct_9fa48("56938") ? true : (stryCov_9fa48("56938", "56939"), user.status === 'pending')) && 'bg-warning-light text-warning-dark'), stryMutAct_9fa48("56944") ? user.status === 'inactive' || 'bg-neutral-100 text-neutral-600' : stryMutAct_9fa48("56943") ? false : stryMutAct_9fa48("56942") ? true : (stryCov_9fa48("56942", "56943", "56944"), (stryMutAct_9fa48("56946") ? user.status !== 'inactive' : stryMutAct_9fa48("56945") ? true : (stryCov_9fa48("56945", "56946"), user.status === 'inactive')) && 'bg-neutral-100 text-neutral-600'), stryMutAct_9fa48("56951") ? user.status === 'suspended' || 'bg-error-light text-error-dark' : stryMutAct_9fa48("56950") ? false : stryMutAct_9fa48("56949") ? true : (stryCov_9fa48("56949", "56950", "56951"), (stryMutAct_9fa48("56953") ? user.status !== 'suspended' : stryMutAct_9fa48("56952") ? true : (stryCov_9fa48("56952", "56953"), user.status === 'suspended')) && 'bg-error-light text-error-dark'))}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {user.lastLoginAt ? formatRelativeTime(new Date(user.lastLoginAt)) : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-neutral-400 hover:text-neutral-600">•••</button>
                  </td>
                </tr>))}
            </tbody>
          </table>}
      </div>
    </div>;
};

// =============================================================================
// TEAMS SETTINGS
// =============================================================================

export const TeamsSettingsPage: React.FC = () => {
  const {
    addToast
  } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(stryMutAct_9fa48("56958") ? true : (stryCov_9fa48("56958"), false));
  const [newTeam, setNewTeam] = useState(stryMutAct_9fa48("56959") ? {} : (stryCov_9fa48("56959"), {
    name: '',
    lead: ''
  }));
  const [isCreating, setIsCreating] = useState(stryMutAct_9fa48("56962") ? true : (stryCov_9fa48("56962"), false));
  const [teams, setTeams] = useState(stryMutAct_9fa48("56963") ? [] : (stryCov_9fa48("56963"), [stryMutAct_9fa48("56964") ? {} : (stryCov_9fa48("56964"), {
    id: 1,
    name: 'Engineering',
    members: 12,
    lead: 'John Smith'
  }), stryMutAct_9fa48("56967") ? {} : (stryCov_9fa48("56967"), {
    id: 2,
    name: 'Finance',
    members: 8,
    lead: 'Sarah Chen'
  }), stryMutAct_9fa48("56970") ? {} : (stryCov_9fa48("56970"), {
    id: 3,
    name: 'Marketing',
    members: 6,
    lead: 'Lisa Brown'
  }), stryMutAct_9fa48("56973") ? {} : (stryCov_9fa48("56973"), {
    id: 4,
    name: 'Sales',
    members: 15,
    lead: 'Mike Johnson'
  }), stryMutAct_9fa48("56976") ? {} : (stryCov_9fa48("56976"), {
    id: 5,
    name: 'Operations',
    members: 10,
    lead: 'Tom Wilson'
  })]));
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(stryMutAct_9fa48("56980") ? false : (stryCov_9fa48("56980"), true));
    await new Promise(stryMutAct_9fa48("56981") ? () => undefined : (stryCov_9fa48("56981"), r => setTimeout(r, 1000)));
    const newId = stryMutAct_9fa48("56982") ? Math.max(...teams.map(t => t.id)) - 1 : (stryCov_9fa48("56982"), (stryMutAct_9fa48("56983") ? Math.min(...teams.map(t => t.id)) : (stryCov_9fa48("56983"), Math.max(...teams.map(stryMutAct_9fa48("56984") ? () => undefined : (stryCov_9fa48("56984"), t => t.id))))) + 1);
    setTeams(stryMutAct_9fa48("56985") ? [] : (stryCov_9fa48("56985"), [...teams, stryMutAct_9fa48("56986") ? {} : (stryCov_9fa48("56986"), {
      id: newId,
      name: newTeam.name,
      members: 0,
      lead: newTeam.lead
    })]));
    setIsCreating(stryMutAct_9fa48("56987") ? true : (stryCov_9fa48("56987"), false));
    setShowCreateModal(stryMutAct_9fa48("56988") ? true : (stryCov_9fa48("56988"), false));
    addToast(stryMutAct_9fa48("56989") ? {} : (stryCov_9fa48("56989"), {
      status: 'success',
      title: 'Team Created',
      description: `${newTeam.name} has been created.`
    }));
    setNewTeam(stryMutAct_9fa48("56993") ? {} : (stryCov_9fa48("56993"), {
      name: '',
      lead: ''
    }));
  };
  return <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Teams</h1>
        <button onClick={stryMutAct_9fa48("56996") ? () => undefined : (stryCov_9fa48("56996"), () => setShowCreateModal(stryMutAct_9fa48("56997") ? false : (stryCov_9fa48("56997"), true)))} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Team
        </button>
      </div>

      {/* Create Team Modal */}
      {stryMutAct_9fa48("57000") ? showCreateModal || <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Team Name</label>
                <input type="text" required value={newTeam.name} onChange={e => setNewTeam({
              ...newTeam,
              name: e.target.value
            })} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="e.g., Product Team" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Team Lead</label>
                <input type="text" required value={newTeam.lead} onChange={e => setNewTeam({
              ...newTeam,
              lead: e.target.value
            })} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="Lead name" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">Cancel</button>
                <button type="submit" disabled={isCreating} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{isCreating ? 'Creating...' : 'Create Team'}</button>
              </div>
            </form>
          </div>
        </div> : stryMutAct_9fa48("56999") ? false : stryMutAct_9fa48("56998") ? true : (stryCov_9fa48("56998", "56999", "57000"), showCreateModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={stryMutAct_9fa48("57001") ? () => undefined : (stryCov_9fa48("57001"), () => setShowCreateModal(stryMutAct_9fa48("57002") ? true : (stryCov_9fa48("57002"), false)))} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Team Name</label>
                <input type="text" required value={newTeam.name} onChange={stryMutAct_9fa48("57003") ? () => undefined : (stryCov_9fa48("57003"), e => setNewTeam(stryMutAct_9fa48("57004") ? {} : (stryCov_9fa48("57004"), {
              ...newTeam,
              name: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="e.g., Product Team" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Team Lead</label>
                <input type="text" required value={newTeam.lead} onChange={stryMutAct_9fa48("57005") ? () => undefined : (stryCov_9fa48("57005"), e => setNewTeam(stryMutAct_9fa48("57006") ? {} : (stryCov_9fa48("57006"), {
              ...newTeam,
              lead: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="Lead name" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={stryMutAct_9fa48("57007") ? () => undefined : (stryCov_9fa48("57007"), () => setShowCreateModal(stryMutAct_9fa48("57008") ? true : (stryCov_9fa48("57008"), false)))} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">Cancel</button>
                <button type="submit" disabled={isCreating} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{isCreating ? 'Creating...' : 'Create Team'}</button>
              </div>
            </form>
          </div>
        </div>)}

      <div className="grid gap-4">
        {teams.map(stryMutAct_9fa48("57011") ? () => undefined : (stryCov_9fa48("57011"), team => <div key={team.id} className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-primary-300 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900">{team.name}</h3>
                <p className="text-sm text-neutral-500">{team.members} members • Lead: {team.lead}</p>
              </div>
              <button onClick={stryMutAct_9fa48("57012") ? () => undefined : (stryCov_9fa48("57012"), () => addToast(stryMutAct_9fa48("57013") ? {} : (stryCov_9fa48("57013"), {
            status: 'info',
            title: 'Team Options',
            description: 'Edit, archive, or delete team.'
          })))} className="text-neutral-400 hover:text-neutral-600">•••</button>
            </div>
          </div>))}
      </div>
    </div>;
};

// =============================================================================
// ROLES SETTINGS
// =============================================================================

export const RolesSettingsPage: React.FC = () => {
  const {
    addToast
  } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(stryMutAct_9fa48("57018") ? true : (stryCov_9fa48("57018"), false));
  const [showPermissionsModal, setShowPermissionsModal] = useState<string | null>(null);
  const [newRole, setNewRole] = useState(stryMutAct_9fa48("57019") ? {} : (stryCov_9fa48("57019"), {
    name: '',
    description: ''
  }));
  const [isCreating, setIsCreating] = useState(stryMutAct_9fa48("57022") ? true : (stryCov_9fa48("57022"), false));
  const [roles, setRoles] = useState(stryMutAct_9fa48("57023") ? [] : (stryCov_9fa48("57023"), [stryMutAct_9fa48("57024") ? {} : (stryCov_9fa48("57024"), {
    id: 1,
    name: 'Admin',
    description: 'Full access to all features',
    users: 3,
    isSystem: stryMutAct_9fa48("57027") ? false : (stryCov_9fa48("57027"), true)
  }), stryMutAct_9fa48("57028") ? {} : (stryCov_9fa48("57028"), {
    id: 2,
    name: 'Editor',
    description: 'Can edit data and run workflows',
    users: 12,
    isSystem: stryMutAct_9fa48("57031") ? false : (stryCov_9fa48("57031"), true)
  }), stryMutAct_9fa48("57032") ? {} : (stryCov_9fa48("57032"), {
    id: 3,
    name: 'Viewer',
    description: 'Read-only access',
    users: 18,
    isSystem: stryMutAct_9fa48("57035") ? false : (stryCov_9fa48("57035"), true)
  }), stryMutAct_9fa48("57036") ? {} : (stryCov_9fa48("57036"), {
    id: 4,
    name: 'Finance Team',
    description: 'Custom role for finance users',
    users: 5,
    isSystem: stryMutAct_9fa48("57039") ? true : (stryCov_9fa48("57039"), false)
  })]));
  const permissions = stryMutAct_9fa48("57040") ? [] : (stryCov_9fa48("57040"), [stryMutAct_9fa48("57041") ? {} : (stryCov_9fa48("57041"), {
    category: 'Data',
    items: stryMutAct_9fa48("57043") ? [] : (stryCov_9fa48("57043"), ['View data', 'Edit data', 'Delete data', 'Export data'])
  }), stryMutAct_9fa48("57048") ? {} : (stryCov_9fa48("57048"), {
    category: 'Users',
    items: stryMutAct_9fa48("57050") ? [] : (stryCov_9fa48("57050"), ['View users', 'Invite users', 'Manage users', 'Delete users'])
  }), stryMutAct_9fa48("57055") ? {} : (stryCov_9fa48("57055"), {
    category: 'Settings',
    items: stryMutAct_9fa48("57057") ? [] : (stryCov_9fa48("57057"), ['View settings', 'Edit organization', 'Manage billing', 'Manage integrations'])
  }), stryMutAct_9fa48("57062") ? {} : (stryCov_9fa48("57062"), {
    category: 'AI',
    items: stryMutAct_9fa48("57064") ? [] : (stryCov_9fa48("57064"), ['Use Council', 'Create agents', 'View insights', 'Run automations'])
  })]);
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(stryMutAct_9fa48("57070") ? false : (stryCov_9fa48("57070"), true));
    await new Promise(stryMutAct_9fa48("57071") ? () => undefined : (stryCov_9fa48("57071"), r => setTimeout(r, 1000)));
    const newId = stryMutAct_9fa48("57072") ? Math.max(...roles.map(r => r.id)) - 1 : (stryCov_9fa48("57072"), (stryMutAct_9fa48("57073") ? Math.min(...roles.map(r => r.id)) : (stryCov_9fa48("57073"), Math.max(...roles.map(stryMutAct_9fa48("57074") ? () => undefined : (stryCov_9fa48("57074"), r => r.id))))) + 1);
    setRoles(stryMutAct_9fa48("57075") ? [] : (stryCov_9fa48("57075"), [...roles, stryMutAct_9fa48("57076") ? {} : (stryCov_9fa48("57076"), {
      id: newId,
      name: newRole.name,
      description: newRole.description,
      users: 0,
      isSystem: stryMutAct_9fa48("57077") ? true : (stryCov_9fa48("57077"), false)
    })]));
    setIsCreating(stryMutAct_9fa48("57078") ? true : (stryCov_9fa48("57078"), false));
    setShowCreateModal(stryMutAct_9fa48("57079") ? true : (stryCov_9fa48("57079"), false));
    addToast(stryMutAct_9fa48("57080") ? {} : (stryCov_9fa48("57080"), {
      status: 'success',
      title: 'Role Created',
      description: `${newRole.name} role has been created.`
    }));
    setNewRole(stryMutAct_9fa48("57084") ? {} : (stryCov_9fa48("57084"), {
      name: '',
      description: ''
    }));
  };
  return <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Roles & Permissions</h1>
        <button onClick={stryMutAct_9fa48("57087") ? () => undefined : (stryCov_9fa48("57087"), () => setShowCreateModal(stryMutAct_9fa48("57088") ? false : (stryCov_9fa48("57088"), true)))} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Role
        </button>
      </div>

      {/* Create Role Modal */}
      {stryMutAct_9fa48("57091") ? showCreateModal || <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create Role</h2>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Role Name</label>
                <input type="text" required value={newRole.name} onChange={e => setNewRole({
              ...newRole,
              name: e.target.value
            })} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="e.g., Data Analyst" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <input type="text" required value={newRole.description} onChange={e => setNewRole({
              ...newRole,
              description: e.target.value
            })} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="What can this role do?" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">Cancel</button>
                <button type="submit" disabled={isCreating} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{isCreating ? 'Creating...' : 'Create Role'}</button>
              </div>
            </form>
          </div>
        </div> : stryMutAct_9fa48("57090") ? false : stryMutAct_9fa48("57089") ? true : (stryCov_9fa48("57089", "57090", "57091"), showCreateModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={stryMutAct_9fa48("57092") ? () => undefined : (stryCov_9fa48("57092"), () => setShowCreateModal(stryMutAct_9fa48("57093") ? true : (stryCov_9fa48("57093"), false)))} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create Role</h2>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Role Name</label>
                <input type="text" required value={newRole.name} onChange={stryMutAct_9fa48("57094") ? () => undefined : (stryCov_9fa48("57094"), e => setNewRole(stryMutAct_9fa48("57095") ? {} : (stryCov_9fa48("57095"), {
              ...newRole,
              name: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="e.g., Data Analyst" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <input type="text" required value={newRole.description} onChange={stryMutAct_9fa48("57096") ? () => undefined : (stryCov_9fa48("57096"), e => setNewRole(stryMutAct_9fa48("57097") ? {} : (stryCov_9fa48("57097"), {
              ...newRole,
              description: e.target.value
            })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="What can this role do?" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={stryMutAct_9fa48("57098") ? () => undefined : (stryCov_9fa48("57098"), () => setShowCreateModal(stryMutAct_9fa48("57099") ? true : (stryCov_9fa48("57099"), false)))} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">Cancel</button>
                <button type="submit" disabled={isCreating} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{isCreating ? 'Creating...' : 'Create Role'}</button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Permissions Modal */}
      {stryMutAct_9fa48("57104") ? showPermissionsModal || <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowPermissionsModal(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Permissions: {showPermissionsModal}</h2>
            <div className="space-y-4">
              {permissions.map(group => <div key={group.category}>
                  <h3 className="font-medium text-neutral-700 mb-2">{group.category}</h3>
                  <div className="space-y-2">
                    {group.items.map(item => <label key={item} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg">
                        <input type="checkbox" defaultChecked={showPermissionsModal === 'Admin'} className="rounded text-primary-600" />
                        <span className="text-sm text-neutral-700">{item}</span>
                      </label>)}
                  </div>
                </div>)}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPermissionsModal(null)} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">Close</button>
              <button onClick={() => {
            setShowPermissionsModal(null);
            addToast({
              status: 'success',
              title: 'Permissions Updated'
            });
          }} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save Changes</button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("57103") ? false : stryMutAct_9fa48("57102") ? true : (stryCov_9fa48("57102", "57103", "57104"), showPermissionsModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={stryMutAct_9fa48("57105") ? () => undefined : (stryCov_9fa48("57105"), () => setShowPermissionsModal(null))} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Permissions: {showPermissionsModal}</h2>
            <div className="space-y-4">
              {permissions.map(stryMutAct_9fa48("57106") ? () => undefined : (stryCov_9fa48("57106"), group => <div key={group.category}>
                  <h3 className="font-medium text-neutral-700 mb-2">{group.category}</h3>
                  <div className="space-y-2">
                    {group.items.map(stryMutAct_9fa48("57107") ? () => undefined : (stryCov_9fa48("57107"), item => <label key={item} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg">
                        <input type="checkbox" defaultChecked={stryMutAct_9fa48("57110") ? showPermissionsModal !== 'Admin' : stryMutAct_9fa48("57109") ? false : stryMutAct_9fa48("57108") ? true : (stryCov_9fa48("57108", "57109", "57110"), showPermissionsModal === 'Admin')} className="rounded text-primary-600" />
                        <span className="text-sm text-neutral-700">{item}</span>
                      </label>))}
                  </div>
                </div>))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={stryMutAct_9fa48("57112") ? () => undefined : (stryCov_9fa48("57112"), () => setShowPermissionsModal(null))} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">Close</button>
              <button onClick={() => {
            setShowPermissionsModal(null);
            addToast(stryMutAct_9fa48("57114") ? {} : (stryCov_9fa48("57114"), {
              status: 'success',
              title: 'Permissions Updated'
            }));
          }} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save Changes</button>
            </div>
          </div>
        </div>)}

      <div className="space-y-4">
        {roles.map(stryMutAct_9fa48("57117") ? () => undefined : (stryCov_9fa48("57117"), role => <div key={role.id} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-neutral-900">{role.name}</h3>
                {stryMutAct_9fa48("57120") ? role.isSystem || <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">System</span> : stryMutAct_9fa48("57119") ? false : stryMutAct_9fa48("57118") ? true : (stryCov_9fa48("57118", "57119", "57120"), role.isSystem && <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">System</span>)}
              </div>
              <span className="text-sm text-neutral-500">{role.users} users</span>
            </div>
            <p className="text-sm text-neutral-500 mb-4">{role.description}</p>
            <button onClick={stryMutAct_9fa48("57121") ? () => undefined : (stryCov_9fa48("57121"), () => setShowPermissionsModal(role.name))} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View Permissions →
            </button>
          </div>))}
      </div>
    </div>;
};

// =============================================================================
// BILLING SETTINGS
// =============================================================================

export const BillingSettingsPage: React.FC = () => {
  const {
    addToast
  } = useToast();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(stryMutAct_9fa48("57123") ? true : (stryCov_9fa48("57123"), false));
  const [showPaymentModal, setShowPaymentModal] = useState(stryMutAct_9fa48("57124") ? true : (stryCov_9fa48("57124"), false));
  return <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Billing</h1>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Current Plan</h2>
            <p className="text-3xl font-bold text-neutral-900 mt-2">Intelligence</p>
            <p className="text-neutral-500">{formatCurrency(10000)}/month</p>
          </div>
          <span className="px-3 py-1 bg-success-light text-success-dark text-sm font-medium rounded-full">Active</span>
        </div>
        <button onClick={stryMutAct_9fa48("57125") ? () => undefined : (stryCov_9fa48("57125"), () => navigate('/pricing'))} className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
          Upgrade Plan
        </button>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Usage This Month</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(stryMutAct_9fa48("57127") ? [] : (stryCov_9fa48("57127"), [stryMutAct_9fa48("57128") ? {} : (stryCov_9fa48("57128"), {
          name: 'Users',
          used: 32,
          limit: 50
        }), stryMutAct_9fa48("57130") ? {} : (stryCov_9fa48("57130"), {
          name: 'AI Agents',
          used: 3,
          limit: 3
        }), stryMutAct_9fa48("57132") ? {} : (stryCov_9fa48("57132"), {
          name: 'API Calls',
          used: 45200,
          limit: 100000
        }), stryMutAct_9fa48("57134") ? {} : (stryCov_9fa48("57134"), {
          name: 'Storage',
          used: 12,
          limit: 50,
          unit: 'GB'
        }), stryMutAct_9fa48("57137") ? {} : (stryCov_9fa48("57137"), {
          name: 'Workflows',
          used: 47,
          limit: null
        })])).map(stryMutAct_9fa48("57139") ? () => undefined : (stryCov_9fa48("57139"), item => <div key={item.name} className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">{item.name}</p>
              <p className="text-xl font-bold text-neutral-900">
                {item.used.toLocaleString()}{item.unit ? ` ${item.unit}` : ''}
                {stryMutAct_9fa48("57144") ? item.limit || <span className="text-sm font-normal text-neutral-400"> / {item.limit.toLocaleString()}</span> : stryMutAct_9fa48("57143") ? false : stryMutAct_9fa48("57142") ? true : (stryCov_9fa48("57142", "57143", "57144"), item.limit && <span className="text-sm font-normal text-neutral-400"> / {item.limit.toLocaleString()}</span>)}
              </p>
              {stryMutAct_9fa48("57147") ? item.limit || <div className="mt-2 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', item.used / item.limit > 0.9 ? 'bg-error-main' : 'bg-primary-500')} style={{
              width: `${item.used / item.limit * 100}%`
            }} />
                </div> : stryMutAct_9fa48("57146") ? false : stryMutAct_9fa48("57145") ? true : (stryCov_9fa48("57145", "57146", "57147"), item.limit && <div className="mt-2 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', (stryMutAct_9fa48("57152") ? item.used / item.limit <= 0.9 : stryMutAct_9fa48("57151") ? item.used / item.limit >= 0.9 : stryMutAct_9fa48("57150") ? false : stryMutAct_9fa48("57149") ? true : (stryCov_9fa48("57149", "57150", "57151", "57152"), (stryMutAct_9fa48("57153") ? item.used * item.limit : (stryCov_9fa48("57153"), item.used / item.limit)) > 0.9)) ? 'bg-error-main' : 'bg-primary-500')} style={stryMutAct_9fa48("57156") ? {} : (stryCov_9fa48("57156"), {
              width: `${stryMutAct_9fa48("57158") ? item.used / item.limit / 100 : (stryCov_9fa48("57158"), (stryMutAct_9fa48("57159") ? item.used * item.limit : (stryCov_9fa48("57159"), item.used / item.limit)) * 100)}%`
            })} />
                </div>)}
            </div>))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-neutral-900 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div>
              <p className="font-medium text-neutral-900">•••• •••• •••• 4242</p>
              <p className="text-sm text-neutral-500">Expires 12/2026</p>
            </div>
          </div>
          <button onClick={stryMutAct_9fa48("57160") ? () => undefined : (stryCov_9fa48("57160"), () => addToast(stryMutAct_9fa48("57161") ? {} : (stryCov_9fa48("57161"), {
          status: 'info',
          title: 'Update Payment',
          description: 'Contact billing@datacendia.com to update payment method.'
        })))} className="text-primary-600 hover:text-primary-700 text-sm font-medium">Update</button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Billing History</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-2 text-sm font-medium text-neutral-500">Date</th>
              <th className="text-left py-2 text-sm font-medium text-neutral-500">Description</th>
              <th className="text-right py-2 text-sm font-medium text-neutral-500">Amount</th>
              <th className="text-right py-2 text-sm font-medium text-neutral-500"></th>
            </tr>
          </thead>
          <tbody>
            {(stryMutAct_9fa48("57165") ? [] : (stryCov_9fa48("57165"), [stryMutAct_9fa48("57166") ? {} : (stryCov_9fa48("57166"), {
            date: 'Nov 1, 2025',
            desc: 'Intelligence Plan',
            amount: 10000
          }), stryMutAct_9fa48("57169") ? {} : (stryCov_9fa48("57169"), {
            date: 'Oct 1, 2025',
            desc: 'Intelligence Plan',
            amount: 10000
          }), stryMutAct_9fa48("57172") ? {} : (stryCov_9fa48("57172"), {
            date: 'Sep 1, 2025',
            desc: 'Intelligence Plan',
            amount: 10000
          })])).map(stryMutAct_9fa48("57175") ? () => undefined : (stryCov_9fa48("57175"), (invoice, i) => <tr key={i} className="border-b border-neutral-100">
                <td className="py-3 text-sm text-neutral-600">{invoice.date}</td>
                <td className="py-3 text-sm text-neutral-900">{invoice.desc}</td>
                <td className="py-3 text-sm text-neutral-900 text-right">{formatCurrency(invoice.amount)}</td>
                <td className="py-3 text-right">
                  <button onClick={stryMutAct_9fa48("57176") ? () => undefined : (stryCov_9fa48("57176"), () => addToast(stryMutAct_9fa48("57177") ? {} : (stryCov_9fa48("57177"), {
                status: 'success',
                title: 'Invoice Downloaded',
                description: 'Invoice PDF saved to downloads.'
              })))} className="text-primary-600 hover:text-primary-700 text-sm">Download</button>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>;
};

// =============================================================================
// API KEYS SETTINGS
// =============================================================================

export const ApiKeysSettingsPage: React.FC = () => {
  const {
    addToast
  } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(stryMutAct_9fa48("57182") ? true : (stryCov_9fa48("57182"), false));
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(stryMutAct_9fa48("57184") ? true : (stryCov_9fa48("57184"), false));
  const [revealedKeys, setRevealedKeys] = useState<Set<number>>(new Set());
  const [keys, setKeys] = useState(stryMutAct_9fa48("57185") ? [] : (stryCov_9fa48("57185"), [stryMutAct_9fa48("57186") ? {} : (stryCov_9fa48("57186"), {
    id: 1,
    name: 'Production API',
    prefix: 'dc_live_',
    key: 'dc_live_sk_1234567890abcdef',
    lastUsed: new Date(stryMutAct_9fa48("57190") ? Date.now() + 3600000 : (stryCov_9fa48("57190"), Date.now() - 3600000)),
    created: 'Oct 15, 2025'
  }), stryMutAct_9fa48("57192") ? {} : (stryCov_9fa48("57192"), {
    id: 2,
    name: 'Development',
    prefix: 'dc_test_',
    key: 'dc_test_sk_0987654321fedcba',
    lastUsed: new Date(stryMutAct_9fa48("57196") ? Date.now() + 86400000 : (stryCov_9fa48("57196"), Date.now() - 86400000)),
    created: 'Sep 1, 2025'
  }), stryMutAct_9fa48("57198") ? {} : (stryCov_9fa48("57198"), {
    id: 3,
    name: 'CI/CD Pipeline',
    prefix: 'dc_live_',
    key: 'dc_live_sk_abcdef1234567890',
    lastUsed: new Date(stryMutAct_9fa48("57202") ? Date.now() + 7200000 : (stryCov_9fa48("57202"), Date.now() - 7200000)),
    created: 'Aug 20, 2025'
  })]));
  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(stryMutAct_9fa48("57205") ? false : (stryCov_9fa48("57205"), true));
    await new Promise(stryMutAct_9fa48("57206") ? () => undefined : (stryCov_9fa48("57206"), r => setTimeout(r, 1000)));
    const newKey = `dc_live_sk_${stryMutAct_9fa48("57208") ? Math.random().toString(36) : (stryCov_9fa48("57208"), Math.random().toString(36).slice(2, 18))}`;
    const newId = stryMutAct_9fa48("57209") ? Math.max(...keys.map(k => k.id)) - 1 : (stryCov_9fa48("57209"), (stryMutAct_9fa48("57210") ? Math.min(...keys.map(k => k.id)) : (stryCov_9fa48("57210"), Math.max(...keys.map(stryMutAct_9fa48("57211") ? () => undefined : (stryCov_9fa48("57211"), k => k.id))))) + 1);
    setKeys(stryMutAct_9fa48("57212") ? [] : (stryCov_9fa48("57212"), [...keys, stryMutAct_9fa48("57213") ? {} : (stryCov_9fa48("57213"), {
      id: newId,
      name: newKeyName,
      prefix: 'dc_live_',
      key: newKey,
      lastUsed: new Date(),
      created: new Date().toLocaleDateString('en-US', stryMutAct_9fa48("57216") ? {} : (stryCov_9fa48("57216"), {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }))
    })]));
    setCreatedKey(newKey);
    setIsCreating(stryMutAct_9fa48("57220") ? true : (stryCov_9fa48("57220"), false));
  };
  const handleRevoke = (id: number, name: string) => {
    setKeys(stryMutAct_9fa48("57222") ? keys : (stryCov_9fa48("57222"), keys.filter(stryMutAct_9fa48("57223") ? () => undefined : (stryCov_9fa48("57223"), k => stryMutAct_9fa48("57226") ? k.id === id : stryMutAct_9fa48("57225") ? false : stryMutAct_9fa48("57224") ? true : (stryCov_9fa48("57224", "57225", "57226"), k.id !== id)))));
    addToast(stryMutAct_9fa48("57227") ? {} : (stryCov_9fa48("57227"), {
      status: 'warning',
      title: 'API Key Revoked',
      description: `${name} has been permanently revoked.`
    }));
  };
  return <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">API Keys</h1>
          <p className="text-neutral-500">Manage API access to Datacendia</p>
        </div>
        <button onClick={stryMutAct_9fa48("57231") ? () => undefined : (stryCov_9fa48("57231"), () => setShowCreateModal(stryMutAct_9fa48("57232") ? false : (stryCov_9fa48("57232"), true)))} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Key
        </button>
      </div>

      {/* Create Key Modal */}
      {stryMutAct_9fa48("57235") ? showCreateModal || <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => {
        setShowCreateModal(false);
        setCreatedKey(null);
        setNewKeyName('');
      }} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            {createdKey ? <>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">API Key Created</h2>
                <p className="text-neutral-600 mb-4">Copy this key now. You won't be able to see it again.</p>
                <div className="p-3 bg-neutral-100 rounded-lg font-mono text-sm break-all mb-4">{createdKey}</div>
                <button onClick={() => {
            navigator.clipboard.writeText(createdKey);
            addToast({
              status: 'success',
              title: 'Copied to clipboard'
            });
          }} className="w-full px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 mb-2">
                  Copy to Clipboard
                </button>
                <button onClick={() => {
            setShowCreateModal(false);
            setCreatedKey(null);
            setNewKeyName('');
          }} className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Done
                </button>
              </> : <>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create API Key</h2>
                <form onSubmit={handleCreateKey}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Key Name</label>
                    <input type="text" required value={newKeyName} onChange={e => setNewKeyName(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="e.g., Production API" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">Cancel</button>
                    <button type="submit" disabled={isCreating} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{isCreating ? 'Creating...' : 'Create Key'}</button>
                  </div>
                </form>
              </>}
          </div>
        </div> : stryMutAct_9fa48("57234") ? false : stryMutAct_9fa48("57233") ? true : (stryCov_9fa48("57233", "57234", "57235"), showCreateModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => {
        setShowCreateModal(stryMutAct_9fa48("57237") ? true : (stryCov_9fa48("57237"), false));
        setCreatedKey(null);
        setNewKeyName('');
      }} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            {createdKey ? <>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">API Key Created</h2>
                <p className="text-neutral-600 mb-4">Copy this key now. You won't be able to see it again.</p>
                <div className="p-3 bg-neutral-100 rounded-lg font-mono text-sm break-all mb-4">{createdKey}</div>
                <button onClick={() => {
            navigator.clipboard.writeText(createdKey);
            addToast(stryMutAct_9fa48("57240") ? {} : (stryCov_9fa48("57240"), {
              status: 'success',
              title: 'Copied to clipboard'
            }));
          }} className="w-full px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 mb-2">
                  Copy to Clipboard
                </button>
                <button onClick={() => {
            setShowCreateModal(stryMutAct_9fa48("57244") ? true : (stryCov_9fa48("57244"), false));
            setCreatedKey(null);
            setNewKeyName('');
          }} className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Done
                </button>
              </> : <>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create API Key</h2>
                <form onSubmit={handleCreateKey}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Key Name</label>
                    <input type="text" required value={newKeyName} onChange={stryMutAct_9fa48("57246") ? () => undefined : (stryCov_9fa48("57246"), e => setNewKeyName(e.target.value))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg" placeholder="e.g., Production API" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={stryMutAct_9fa48("57247") ? () => undefined : (stryCov_9fa48("57247"), () => setShowCreateModal(stryMutAct_9fa48("57248") ? true : (stryCov_9fa48("57248"), false)))} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">Cancel</button>
                    <button type="submit" disabled={isCreating} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{isCreating ? 'Creating...' : 'Create Key'}</button>
                  </div>
                </form>
              </>}
          </div>
        </div>)}

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {keys.map(stryMutAct_9fa48("57251") ? () => undefined : (stryCov_9fa48("57251"), (key, i) => <div key={key.id} className={cn('p-4', stryMutAct_9fa48("57255") ? i > 0 || 'border-t border-neutral-100' : stryMutAct_9fa48("57254") ? false : stryMutAct_9fa48("57253") ? true : (stryCov_9fa48("57253", "57254", "57255"), (stryMutAct_9fa48("57258") ? i <= 0 : stryMutAct_9fa48("57257") ? i >= 0 : stryMutAct_9fa48("57256") ? true : (stryCov_9fa48("57256", "57257", "57258"), i > 0)) && 'border-t border-neutral-100'))}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-neutral-900">{key.name}</h3>
                  <code className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded">
                    {revealedKeys.has(key.id) ? key.key : `${key.prefix}••••••••`}
                  </code>
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  Created {key.created} • Last used {formatRelativeTime(key.lastUsed)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => {
              if (stryMutAct_9fa48("57263") ? false : stryMutAct_9fa48("57262") ? true : (stryCov_9fa48("57262", "57263"), revealedKeys.has(key.id))) {
                const newSet = new Set(revealedKeys);
                newSet.delete(key.id);
                setRevealedKeys(newSet);
              } else {
                setRevealedKeys(new Set(stryMutAct_9fa48("57266") ? [] : (stryCov_9fa48("57266"), [...revealedKeys, key.id])));
              }
            }} className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                  {revealedKeys.has(key.id) ? 'Hide' : 'Reveal'}
                </button>
                <button onClick={stryMutAct_9fa48("57269") ? () => undefined : (stryCov_9fa48("57269"), () => handleRevoke(key.id, key.name))} className="px-3 py-1.5 text-sm text-error-main border border-error-main/20 rounded-lg hover:bg-error-light transition-colors">
                  Revoke
                </button>
              </div>
            </div>
          </div>))}
      </div>

      <div className="mt-6 p-4 bg-warning-light/50 rounded-lg">
        <p className="text-sm text-warning-dark">
          <strong>Security Tip:</strong> Keep your API keys secure and never expose them in client-side code. 
          Rotate keys periodically and revoke any that may have been compromised.
        </p>
      </div>
    </div>;
};

// =============================================================================
// INTEGRATIONS SETTINGS
// =============================================================================

export const IntegrationSettingsPage: React.FC = () => {
  const {
    addToast
  } = useToast();
  const [showAddModal, setShowAddModal] = useState(stryMutAct_9fa48("57271") ? true : (stryCov_9fa48("57271"), false));
  const [integrations, setIntegrations] = useState(stryMutAct_9fa48("57272") ? [] : (stryCov_9fa48("57272"), [stryMutAct_9fa48("57273") ? {} : (stryCov_9fa48("57273"), {
    id: 'salesforce',
    name: 'Salesforce',
    icon: '☁️',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("57278") ? Date.now() + 300000 : (stryCov_9fa48("57278"), Date.now() - 300000))
  }), stryMutAct_9fa48("57279") ? {} : (stryCov_9fa48("57279"), {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("57284") ? Date.now() + 60000 : (stryCov_9fa48("57284"), Date.now() - 60000))
  }), stryMutAct_9fa48("57285") ? {} : (stryCov_9fa48("57285"), {
    id: 'sap',
    name: 'SAP',
    icon: '📊',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("57290") ? Date.now() + 3600000 : (stryCov_9fa48("57290"), Date.now() - 3600000))
  }), stryMutAct_9fa48("57291") ? {} : (stryCov_9fa48("57291"), {
    id: 'snowflake',
    name: 'Snowflake',
    icon: '❄️',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("57296") ? Date.now() + 1800000 : (stryCov_9fa48("57296"), Date.now() - 1800000))
  }), stryMutAct_9fa48("57297") ? {} : (stryCov_9fa48("57297"), {
    id: 'workday',
    name: 'Workday',
    icon: '👥',
    status: 'error',
    lastSync: null
  }), stryMutAct_9fa48("57302") ? {} : (stryCov_9fa48("57302"), {
    id: 'hubspot',
    name: 'HubSpot',
    icon: '🧡',
    status: 'disconnected',
    lastSync: null
  }), stryMutAct_9fa48("57307") ? {} : (stryCov_9fa48("57307"), {
    id: 'jira',
    name: 'Jira',
    icon: '📋',
    status: 'disconnected',
    lastSync: null
  })]));
  const handleConnect = async (id: string, name: string) => {
    // Simulate connection
    await new Promise(stryMutAct_9fa48("57313") ? () => undefined : (stryCov_9fa48("57313"), r => setTimeout(r, 1500)));
    setIntegrations(stryMutAct_9fa48("57314") ? () => undefined : (stryCov_9fa48("57314"), prev => prev.map(stryMutAct_9fa48("57315") ? () => undefined : (stryCov_9fa48("57315"), i => (stryMutAct_9fa48("57318") ? i.id !== id : stryMutAct_9fa48("57317") ? false : stryMutAct_9fa48("57316") ? true : (stryCov_9fa48("57316", "57317", "57318"), i.id === id)) ? stryMutAct_9fa48("57319") ? {} : (stryCov_9fa48("57319"), {
      ...i,
      status: 'connected',
      lastSync: new Date()
    }) : i))));
    addToast(stryMutAct_9fa48("57321") ? {} : (stryCov_9fa48("57321"), {
      status: 'success',
      title: 'Connected',
      description: `${name} is now connected.`
    }));
  };
  const handleDisconnect = (id: string, name: string) => {
    setIntegrations(stryMutAct_9fa48("57326") ? () => undefined : (stryCov_9fa48("57326"), prev => prev.map(stryMutAct_9fa48("57327") ? () => undefined : (stryCov_9fa48("57327"), i => (stryMutAct_9fa48("57330") ? i.id !== id : stryMutAct_9fa48("57329") ? false : stryMutAct_9fa48("57328") ? true : (stryCov_9fa48("57328", "57329", "57330"), i.id === id)) ? stryMutAct_9fa48("57331") ? {} : (stryCov_9fa48("57331"), {
      ...i,
      status: 'disconnected',
      lastSync: null
    }) : i))));
    addToast(stryMutAct_9fa48("57333") ? {} : (stryCov_9fa48("57333"), {
      status: 'info',
      title: 'Disconnected',
      description: `${name} has been disconnected.`
    }));
  };
  return <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Integrations</h1>
        <button onClick={stryMutAct_9fa48("57337") ? () => undefined : (stryCov_9fa48("57337"), () => addToast(stryMutAct_9fa48("57338") ? {} : (stryCov_9fa48("57338"), {
        status: 'info',
        title: 'Browse Integrations',
        description: 'Contact sales@datacendia.com for custom integrations.'
      })))} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Add Integration
        </button>
      </div>

      <div className="grid gap-4">
        {integrations.map(stryMutAct_9fa48("57342") ? () => undefined : (stryCov_9fa48("57342"), integration => <div key={integration.id} className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="font-medium text-neutral-900">{integration.name}</h3>
                  <p className="text-sm text-neutral-500">
                    {stryMutAct_9fa48("57345") ? integration.status === 'connected' || `Last synced ${formatRelativeTime(integration.lastSync!)}` : stryMutAct_9fa48("57344") ? false : stryMutAct_9fa48("57343") ? true : (stryCov_9fa48("57343", "57344", "57345"), (stryMutAct_9fa48("57347") ? integration.status !== 'connected' : stryMutAct_9fa48("57346") ? true : (stryCov_9fa48("57346", "57347"), integration.status === 'connected')) && `Last synced ${formatRelativeTime(integration.lastSync!)}`)}
                    {stryMutAct_9fa48("57352") ? integration.status === 'error' || 'Connection error - click to retry' : stryMutAct_9fa48("57351") ? false : stryMutAct_9fa48("57350") ? true : (stryCov_9fa48("57350", "57351", "57352"), (stryMutAct_9fa48("57354") ? integration.status !== 'error' : stryMutAct_9fa48("57353") ? true : (stryCov_9fa48("57353", "57354"), integration.status === 'error')) && 'Connection error - click to retry')}
                    {stryMutAct_9fa48("57359") ? integration.status === 'disconnected' || 'Not connected' : stryMutAct_9fa48("57358") ? false : stryMutAct_9fa48("57357") ? true : (stryCov_9fa48("57357", "57358", "57359"), (stryMutAct_9fa48("57361") ? integration.status !== 'disconnected' : stryMutAct_9fa48("57360") ? true : (stryCov_9fa48("57360", "57361"), integration.status === 'disconnected')) && 'Not connected')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('w-2.5 h-2.5 rounded-full', stryMutAct_9fa48("57367") ? integration.status === 'connected' || 'bg-success-main' : stryMutAct_9fa48("57366") ? false : stryMutAct_9fa48("57365") ? true : (stryCov_9fa48("57365", "57366", "57367"), (stryMutAct_9fa48("57369") ? integration.status !== 'connected' : stryMutAct_9fa48("57368") ? true : (stryCov_9fa48("57368", "57369"), integration.status === 'connected')) && 'bg-success-main'), stryMutAct_9fa48("57374") ? integration.status === 'error' || 'bg-error-main' : stryMutAct_9fa48("57373") ? false : stryMutAct_9fa48("57372") ? true : (stryCov_9fa48("57372", "57373", "57374"), (stryMutAct_9fa48("57376") ? integration.status !== 'error' : stryMutAct_9fa48("57375") ? true : (stryCov_9fa48("57375", "57376"), integration.status === 'error')) && 'bg-error-main'), stryMutAct_9fa48("57381") ? integration.status === 'disconnected' || 'bg-neutral-300' : stryMutAct_9fa48("57380") ? false : stryMutAct_9fa48("57379") ? true : (stryCov_9fa48("57379", "57380", "57381"), (stryMutAct_9fa48("57383") ? integration.status !== 'disconnected' : stryMutAct_9fa48("57382") ? true : (stryCov_9fa48("57382", "57383"), integration.status === 'disconnected')) && 'bg-neutral-300'))} />
                {(stryMutAct_9fa48("57388") ? integration.status !== 'connected' : stryMutAct_9fa48("57387") ? false : stryMutAct_9fa48("57386") ? true : (stryCov_9fa48("57386", "57387", "57388"), integration.status === 'connected')) ? <button onClick={stryMutAct_9fa48("57390") ? () => undefined : (stryCov_9fa48("57390"), () => handleDisconnect(integration.id, integration.name))} className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                    Disconnect
                  </button> : <button onClick={stryMutAct_9fa48("57391") ? () => undefined : (stryCov_9fa48("57391"), () => handleConnect(integration.id, integration.name))} className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-primary-600 text-white hover:bg-primary-700">
                    Connect
                  </button>}
              </div>
            </div>
          </div>))}
      </div>
    </div>;
};

// =============================================================================
// PREFERENCES SETTINGS
// =============================================================================

export const PreferencesSettingsPage: React.FC = () => {
  const {
    addToast
  } = useToast();
  const [isSaving, setIsSaving] = useState(stryMutAct_9fa48("57393") ? true : (stryCov_9fa48("57393"), false));
  const [prefs, setPrefs] = useState(stryMutAct_9fa48("57394") ? {} : (stryCov_9fa48("57394"), {
    theme: 'light',
    language: 'en',
    notifications: stryMutAct_9fa48("57397") ? {} : (stryCov_9fa48("57397"), {
      email: stryMutAct_9fa48("57398") ? false : (stryCov_9fa48("57398"), true),
      push: stryMutAct_9fa48("57399") ? false : (stryCov_9fa48("57399"), true),
      slack: stryMutAct_9fa48("57400") ? true : (stryCov_9fa48("57400"), false)
    }),
    defaultView: 'dashboard'
  }));
  return <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Preferences</h1>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Appearance</h2>
        <div className="grid grid-cols-3 gap-4">
          {(stryMutAct_9fa48("57402") ? [] : (stryCov_9fa48("57402"), ['light', 'dark', 'system'])).map(stryMutAct_9fa48("57406") ? () => undefined : (stryCov_9fa48("57406"), theme => <button key={theme} onClick={stryMutAct_9fa48("57407") ? () => undefined : (stryCov_9fa48("57407"), () => setPrefs(stryMutAct_9fa48("57408") ? {} : (stryCov_9fa48("57408"), {
          ...prefs,
          theme
        })))} className={cn('p-4 rounded-lg border-2 text-center transition-colors capitalize', (stryMutAct_9fa48("57412") ? prefs.theme !== theme : stryMutAct_9fa48("57411") ? false : stryMutAct_9fa48("57410") ? true : (stryCov_9fa48("57410", "57411", "57412"), prefs.theme === theme)) ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300')}>
              {theme}
            </button>))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Language</h2>
        <select value={prefs.language} onChange={stryMutAct_9fa48("57415") ? () => undefined : (stryCov_9fa48("57415"), e => setPrefs(stryMutAct_9fa48("57416") ? {} : (stryCov_9fa48("57416"), {
        ...prefs,
        language: e.target.value
      })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="pt">Português</option>
          <option value="ja">日本語</option>
          <option value="zh">中文</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notifications</h2>
        <div className="space-y-4">
          {(stryMutAct_9fa48("57417") ? [] : (stryCov_9fa48("57417"), [stryMutAct_9fa48("57418") ? {} : (stryCov_9fa48("57418"), {
          key: 'email',
          label: 'Email notifications',
          desc: 'Receive alerts and updates via email'
        }), stryMutAct_9fa48("57422") ? {} : (stryCov_9fa48("57422"), {
          key: 'push',
          label: 'Push notifications',
          desc: 'Browser notifications for important events'
        }), stryMutAct_9fa48("57426") ? {} : (stryCov_9fa48("57426"), {
          key: 'slack',
          label: 'Slack notifications',
          desc: 'Send alerts to your Slack channel'
        })])).map(stryMutAct_9fa48("57430") ? () => undefined : (stryCov_9fa48("57430"), item => <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">{item.label}</p>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </div>
              <button onClick={stryMutAct_9fa48("57431") ? () => undefined : (stryCov_9fa48("57431"), () => setPrefs(stryMutAct_9fa48("57432") ? {} : (stryCov_9fa48("57432"), {
            ...prefs,
            notifications: stryMutAct_9fa48("57433") ? {} : (stryCov_9fa48("57433"), {
              ...prefs.notifications,
              [item.key]: stryMutAct_9fa48("57434") ? prefs.notifications[item.key as keyof typeof prefs.notifications] : (stryCov_9fa48("57434"), !prefs.notifications[item.key as keyof typeof prefs.notifications])
            })
          })))} className={cn('w-11 h-6 rounded-full transition-colors relative', prefs.notifications[item.key as keyof typeof prefs.notifications] ? 'bg-primary-600' : 'bg-neutral-200')}>
                <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', prefs.notifications[item.key as keyof typeof prefs.notifications] ? 'left-5' : 'left-0.5')} />
              </button>
            </div>))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={async () => {
        setIsSaving(stryMutAct_9fa48("57442") ? false : (stryCov_9fa48("57442"), true));
        await new Promise(stryMutAct_9fa48("57443") ? () => undefined : (stryCov_9fa48("57443"), r => setTimeout(r, 1000)));
        setIsSaving(stryMutAct_9fa48("57444") ? true : (stryCov_9fa48("57444"), false));
        addToast(stryMutAct_9fa48("57445") ? {} : (stryCov_9fa48("57445"), {
          status: 'success',
          title: 'Preferences Saved',
          description: 'Your preferences have been updated.'
        }));
      }} disabled={isSaving} className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>;
};

// =============================================================================
// SECURITY SETTINGS
// =============================================================================

export const SecuritySettingsPage: React.FC = () => {
  const {
    addToast
  } = useToast();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(stryMutAct_9fa48("57452") ? true : (stryCov_9fa48("57452"), false));
  const [show2FAModal, setShow2FAModal] = useState(stryMutAct_9fa48("57453") ? true : (stryCov_9fa48("57453"), false));
  const [showSSOModal, setShowSSOModal] = useState(stryMutAct_9fa48("57454") ? true : (stryCov_9fa48("57454"), false));
  const [sessions, setSessions] = useState(stryMutAct_9fa48("57455") ? [] : (stryCov_9fa48("57455"), [stryMutAct_9fa48("57456") ? {} : (stryCov_9fa48("57456"), {
    id: 1,
    device: 'MacBook Pro',
    location: 'New York, US',
    current: stryMutAct_9fa48("57459") ? false : (stryCov_9fa48("57459"), true),
    lastActive: 'Now'
  }), stryMutAct_9fa48("57461") ? {} : (stryCov_9fa48("57461"), {
    id: 2,
    device: 'iPhone 15',
    location: 'New York, US',
    current: stryMutAct_9fa48("57464") ? true : (stryCov_9fa48("57464"), false),
    lastActive: '2 hours ago'
  }), stryMutAct_9fa48("57466") ? {} : (stryCov_9fa48("57466"), {
    id: 3,
    device: 'Chrome on Windows',
    location: 'Chicago, US',
    current: stryMutAct_9fa48("57469") ? true : (stryCov_9fa48("57469"), false),
    lastActive: '1 day ago'
  })]));
  const handleRevokeSession = (id: number, device: string) => {
    setSessions(stryMutAct_9fa48("57472") ? sessions : (stryCov_9fa48("57472"), sessions.filter(stryMutAct_9fa48("57473") ? () => undefined : (stryCov_9fa48("57473"), s => stryMutAct_9fa48("57476") ? s.id === id : stryMutAct_9fa48("57475") ? false : stryMutAct_9fa48("57474") ? true : (stryCov_9fa48("57474", "57475", "57476"), s.id !== id)))));
    addToast(stryMutAct_9fa48("57477") ? {} : (stryCov_9fa48("57477"), {
      status: 'warning',
      title: 'Session Revoked',
      description: `${device} has been signed out.`
    }));
  };
  const handleRevokeAllSessions = () => {
    setSessions(stryMutAct_9fa48("57482") ? sessions : (stryCov_9fa48("57482"), sessions.filter(stryMutAct_9fa48("57483") ? () => undefined : (stryCov_9fa48("57483"), s => s.current))));
    addToast(stryMutAct_9fa48("57484") ? {} : (stryCov_9fa48("57484"), {
      status: 'warning',
      title: 'All Sessions Revoked',
      description: 'All other devices have been signed out.'
    }));
  };
  return <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Security</h1>

      {/* Password */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Password</h2>
        <p className="text-neutral-500 mb-4">Last changed 45 days ago</p>
        <button onClick={stryMutAct_9fa48("57488") ? () => undefined : (stryCov_9fa48("57488"), () => setShowPasswordModal(stryMutAct_9fa48("57489") ? false : (stryCov_9fa48("57489"), true)))} className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
          Change Password
        </button>
      </div>

      {/* Password Modal */}
      {stryMutAct_9fa48("57492") ? showPasswordModal || <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowPasswordModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Change Password</h2>
            <form onSubmit={async e => {
          e.preventDefault();
          await new Promise(r => setTimeout(r, 1000));
          setShowPasswordModal(false);
          addToast({
            status: 'success',
            title: 'Password Changed',
            description: 'Your password has been updated.'
          });
        }}>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Current Password</label>
                  <input type="password" required className="w-full h-10 px-3 border border-neutral-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
                  <input type="password" required className="w-full h-10 px-3 border border-neutral-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm New Password</label>
                  <input type="password" required className="w-full h-10 px-3 border border-neutral-300 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Update Password</button>
              </div>
            </form>
          </div>
        </div> : stryMutAct_9fa48("57491") ? false : stryMutAct_9fa48("57490") ? true : (stryCov_9fa48("57490", "57491", "57492"), showPasswordModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={stryMutAct_9fa48("57493") ? () => undefined : (stryCov_9fa48("57493"), () => setShowPasswordModal(stryMutAct_9fa48("57494") ? true : (stryCov_9fa48("57494"), false)))} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Change Password</h2>
            <form onSubmit={async e => {
          e.preventDefault();
          await new Promise(stryMutAct_9fa48("57496") ? () => undefined : (stryCov_9fa48("57496"), r => setTimeout(r, 1000)));
          setShowPasswordModal(stryMutAct_9fa48("57497") ? true : (stryCov_9fa48("57497"), false));
          addToast(stryMutAct_9fa48("57498") ? {} : (stryCov_9fa48("57498"), {
            status: 'success',
            title: 'Password Changed',
            description: 'Your password has been updated.'
          }));
        }}>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Current Password</label>
                  <input type="password" required className="w-full h-10 px-3 border border-neutral-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
                  <input type="password" required className="w-full h-10 px-3 border border-neutral-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm New Password</label>
                  <input type="password" required className="w-full h-10 px-3 border border-neutral-300 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={stryMutAct_9fa48("57502") ? () => undefined : (stryCov_9fa48("57502"), () => setShowPasswordModal(stryMutAct_9fa48("57503") ? true : (stryCov_9fa48("57503"), false)))} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Update Password</button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Two-Factor Authentication</h2>
            <p className="text-neutral-500">Add an extra layer of security to your account</p>
          </div>
          <span className="px-2 py-1 bg-success-light text-success-dark text-xs font-medium rounded-full">Enabled</span>
        </div>
        <button onClick={stryMutAct_9fa48("57504") ? () => undefined : (stryCov_9fa48("57504"), () => addToast(stryMutAct_9fa48("57505") ? {} : (stryCov_9fa48("57505"), {
        status: 'info',
        title: '2FA Settings',
        description: 'Your authenticator app is configured. Backup codes available in your profile.'
      })))} className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
          Manage 2FA
        </button>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Sessions</h2>
        <div className="space-y-4">
          {sessions.map(stryMutAct_9fa48("57509") ? () => undefined : (stryCov_9fa48("57509"), session => <div key={session.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-neutral-900">{session.device}</p>
                  {stryMutAct_9fa48("57512") ? session.current || <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">Current</span> : stryMutAct_9fa48("57511") ? false : stryMutAct_9fa48("57510") ? true : (stryCov_9fa48("57510", "57511", "57512"), session.current && <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">Current</span>)}
                </div>
                <p className="text-sm text-neutral-500">{session.location} • {session.lastActive}</p>
              </div>
              {stryMutAct_9fa48("57515") ? !session.current || <button onClick={() => handleRevokeSession(session.id, session.device)} className="text-error-main hover:text-error-dark text-sm font-medium">
                  Revoke
                </button> : stryMutAct_9fa48("57514") ? false : stryMutAct_9fa48("57513") ? true : (stryCov_9fa48("57513", "57514", "57515"), (stryMutAct_9fa48("57516") ? session.current : (stryCov_9fa48("57516"), !session.current)) && <button onClick={stryMutAct_9fa48("57517") ? () => undefined : (stryCov_9fa48("57517"), () => handleRevokeSession(session.id, session.device))} className="text-error-main hover:text-error-dark text-sm font-medium">
                  Revoke
                </button>)}
            </div>))}
        </div>
        {stryMutAct_9fa48("57520") ? sessions.filter(s => !s.current).length > 0 || <button onClick={handleRevokeAllSessions} className="mt-4 text-error-main hover:text-error-dark text-sm font-medium">
            Sign out all other sessions
          </button> : stryMutAct_9fa48("57519") ? false : stryMutAct_9fa48("57518") ? true : (stryCov_9fa48("57518", "57519", "57520"), (stryMutAct_9fa48("57523") ? sessions.filter(s => !s.current).length <= 0 : stryMutAct_9fa48("57522") ? sessions.filter(s => !s.current).length >= 0 : stryMutAct_9fa48("57521") ? true : (stryCov_9fa48("57521", "57522", "57523"), (stryMutAct_9fa48("57524") ? sessions.length : (stryCov_9fa48("57524"), sessions.filter(stryMutAct_9fa48("57525") ? () => undefined : (stryCov_9fa48("57525"), s => stryMutAct_9fa48("57526") ? s.current : (stryCov_9fa48("57526"), !s.current))).length)) > 0)) && <button onClick={handleRevokeAllSessions} className="mt-4 text-error-main hover:text-error-dark text-sm font-medium">
            Sign out all other sessions
          </button>)}
      </div>

      {/* SSO */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Single Sign-On (SSO)</h2>
        <p className="text-neutral-500 mb-4">Configure SAML-based SSO for your organization</p>
        <button onClick={stryMutAct_9fa48("57527") ? () => undefined : (stryCov_9fa48("57527"), () => addToast(stryMutAct_9fa48("57528") ? {} : (stryCov_9fa48("57528"), {
        status: 'info',
        title: 'SSO Configuration',
        description: 'Contact your administrator to configure enterprise SSO.'
      })))} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Configure SSO
        </button>
      </div>
    </div>;
};
export default SettingsLayout;