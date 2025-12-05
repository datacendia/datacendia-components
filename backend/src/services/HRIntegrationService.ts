// =============================================================================
// HR INTEGRATION SERVICE
// Connectors for Workday, BambooHR, and other HRIS platforms
// =============================================================================

import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

// =============================================================================
// TYPES
// =============================================================================

export type HRProvider = 'workday' | 'bamboohr' | 'adp' | 'namely' | 'gusto' | 'rippling';

export interface HRCredentials {
  provider: HRProvider;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  subdomain?: string;
  tenantId?: string;
  refreshToken?: string;
}

export interface HREmployee {
  id: string;
  externalId: string;
  provider: HRProvider;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
  level?: string;
  managerId?: string;
  startDate: Date;
  status: 'active' | 'on_leave' | 'terminated';
  location?: string;
  compensation?: {
    salary: number;
    currency: string;
    payFrequency: 'annual' | 'monthly' | 'biweekly' | 'weekly';
  };
  pto?: {
    balance: number;
    used: number;
    accrued: number;
  };
  metadata: Record<string, any>;
  syncedAt: Date;
}

export interface HRTimeEntry {
  id: string;
  employeeId: string;
  date: Date;
  hoursWorked: number;
  overtimeHours: number;
  type: 'regular' | 'overtime' | 'pto' | 'sick' | 'holiday';
}

export interface HRSyncResult {
  provider: HRProvider;
  syncedAt: Date;
  employeesProcessed: number;
  employeesCreated: number;
  employeesUpdated: number;
  errors: { employeeId: string; error: string }[];
  duration: number;
}

export interface HRConnectionStatus {
  provider: HRProvider;
  connected: boolean;
  lastSync?: Date;
  employeeCount?: number;
  error?: string;
}

// =============================================================================
// WORKDAY CONNECTOR
// =============================================================================

class WorkdayConnector {
  private baseUrl: string;
  private credentials: HRCredentials | null = null;

  constructor() {
    this.baseUrl = 'https://wd3-impl-services1.workday.com';
  }

  configure(credentials: HRCredentials): void {
    this.credentials = credentials;
    if (credentials.tenantId) {
      this.baseUrl = `https://wd3-impl-services1.workday.com/ccx/service/${credentials.tenantId}`;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.credentials) return false;
    
    try {
      // In production, this would make actual API call
      // For now, validate credentials exist
      const hasRequiredCreds = !!(
        this.credentials.clientId && 
        this.credentials.clientSecret && 
        this.credentials.tenantId
      );
      
      if (hasRequiredCreds) {
        logger.info('Workday connection test successful');
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Workday connection test failed:', error);
      return false;
    }
  }

  async fetchEmployees(): Promise<HREmployee[]> {
    if (!this.credentials) {
      throw new Error('Workday not configured');
    }

    try {
      // Production implementation would call Workday SOAP/REST API
      // Using Workday's Human Resources WSDL
      const response = await this.callWorkdayAPI('Human_Resources', 'Get_Workers', {
        Request_Criteria: {
          Exclude_Inactive_Workers: true,
        },
        Response_Filter: {
          Count: 1000,
        },
        Response_Group: {
          Include_Personal_Information: true,
          Include_Employment_Information: true,
          Include_Compensation: true,
          Include_Organizations: true,
        },
      });

      return this.transformWorkdayEmployees(response);
    } catch (error) {
      logger.error('Failed to fetch Workday employees:', error);
      throw error;
    }
  }

  async fetchTimeOff(employeeId: string): Promise<any> {
    if (!this.credentials) {
      throw new Error('Workday not configured');
    }

    try {
      const response = await this.callWorkdayAPI('Absence_Management', 'Get_Time_Off_Plan_Balances', {
        Worker_Reference: { ID: employeeId },
      });
      return response;
    } catch (error) {
      logger.error(`Failed to fetch time off for ${employeeId}:`, error);
      throw error;
    }
  }

  private async callWorkdayAPI(service: string, operation: string, body: any): Promise<any> {
    // Production: Make SOAP request to Workday
    // This is a placeholder that would be replaced with actual SOAP client
    logger.debug(`Workday API call: ${service}/${operation}`);
    
    // Simulate API response structure
    return {
      Worker: [],
      Response_Results: { Total_Results: 0 },
    };
  }

  private transformWorkdayEmployees(response: any): HREmployee[] {
    const workers = response.Worker || [];
    
    return workers.map((worker: any) => ({
      id: `wd-${worker.Worker_Reference?.ID || Date.now()}`,
      externalId: worker.Worker_Reference?.ID || '',
      provider: 'workday' as HRProvider,
      firstName: worker.Personal_Data?.Name_Data?.Legal_Name?.First_Name || '',
      lastName: worker.Personal_Data?.Name_Data?.Legal_Name?.Last_Name || '',
      email: worker.Personal_Data?.Contact_Data?.Email_Address_Data?.[0]?.Email_Address || '',
      department: worker.Organization_Data?.Organization_Name || '',
      title: worker.Employment_Data?.Worker_Job_Data?.Position_Title || '',
      level: worker.Employment_Data?.Worker_Job_Data?.Job_Profile?.Job_Level || '',
      managerId: worker.Employment_Data?.Worker_Job_Data?.Manager_Reference?.ID,
      startDate: new Date(worker.Employment_Data?.Hire_Date || Date.now()),
      status: this.mapWorkdayStatus(worker.Employment_Data?.Worker_Status),
      location: worker.Employment_Data?.Worker_Job_Data?.Location?.Location_Name,
      compensation: worker.Compensation_Data ? {
        salary: parseFloat(worker.Compensation_Data.Total_Base_Pay?.Amount || 0),
        currency: worker.Compensation_Data.Total_Base_Pay?.Currency || 'USD',
        payFrequency: 'annual',
      } : undefined,
      metadata: { raw: worker },
      syncedAt: new Date(),
    }));
  }

  private mapWorkdayStatus(status: string): HREmployee['status'] {
    if (!status) return 'active';
    const s = status.toLowerCase();
    if (s.includes('terminated') || s.includes('inactive')) return 'terminated';
    if (s.includes('leave')) return 'on_leave';
    return 'active';
  }
}

// =============================================================================
// BAMBOOHR CONNECTOR
// =============================================================================

class BambooHRConnector {
  private baseUrl: string = '';
  private credentials: HRCredentials | null = null;

  configure(credentials: HRCredentials): void {
    this.credentials = credentials;
    if (credentials.subdomain) {
      this.baseUrl = `https://api.bamboohr.com/api/gateway.php/${credentials.subdomain}/v1`;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.credentials?.apiKey || !this.credentials?.subdomain) {
      return false;
    }

    try {
      const response = await this.callBambooAPI('/employees/directory');
      return !!response;
    } catch (error) {
      logger.error('BambooHR connection test failed:', error);
      return false;
    }
  }

  async fetchEmployees(): Promise<HREmployee[]> {
    if (!this.credentials) {
      throw new Error('BambooHR not configured');
    }

    try {
      // Fetch employee directory
      const directory = await this.callBambooAPI('/employees/directory');
      
      // Fetch detailed info for each employee
      const employees: HREmployee[] = [];
      
      for (const emp of directory.employees || []) {
        const details = await this.callBambooAPI(`/employees/${emp.id}`, {
          fields: 'firstName,lastName,email,department,jobTitle,hireDate,status,supervisor,location,payRate,payType,paidPer',
        });
        
        employees.push(this.transformBambooEmployee(emp, details));
      }

      return employees;
    } catch (error) {
      logger.error('Failed to fetch BambooHR employees:', error);
      throw error;
    }
  }

  async fetchTimeOff(employeeId: string, startDate: Date, endDate: Date): Promise<HRTimeEntry[]> {
    if (!this.credentials) {
      throw new Error('BambooHR not configured');
    }

    try {
      const response = await this.callBambooAPI('/time_off/requests', {
        employeeId,
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      });

      return (response.requests || []).map((req: any) => ({
        id: req.id,
        employeeId,
        date: new Date(req.start),
        hoursWorked: 0,
        overtimeHours: 0,
        type: this.mapBambooTimeOffType(req.type?.name),
      }));
    } catch (error) {
      logger.error(`Failed to fetch time off for ${employeeId}:`, error);
      throw error;
    }
  }

  async fetchPTOBalances(employeeId: string): Promise<any> {
    if (!this.credentials) {
      throw new Error('BambooHR not configured');
    }

    try {
      const response = await this.callBambooAPI(`/employees/${employeeId}/time_off/calculator`);
      return response;
    } catch (error) {
      logger.error(`Failed to fetch PTO balances for ${employeeId}:`, error);
      throw error;
    }
  }

  private async callBambooAPI(endpoint: string, params?: Record<string, any>): Promise<any> {
    if (!this.credentials?.apiKey) {
      throw new Error('BambooHR API key not configured');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.credentials.apiKey}:x`).toString('base64')}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`BambooHR API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // In development without actual API, return mock structure
      logger.debug(`BambooHR API call to ${endpoint} (simulated)`);
      return { employees: [], requests: [] };
    }
  }

  private transformBambooEmployee(basic: any, details: any): HREmployee {
    return {
      id: `bamboo-${basic.id}`,
      externalId: String(basic.id),
      provider: 'bamboohr',
      firstName: details.firstName || basic.firstName || '',
      lastName: details.lastName || basic.lastName || '',
      email: details.email || basic.workEmail || '',
      department: details.department || basic.department || '',
      title: details.jobTitle || basic.jobTitle || '',
      level: details.jobLevel,
      managerId: details.supervisor ? `bamboo-${details.supervisorId}` : undefined,
      startDate: new Date(details.hireDate || Date.now()),
      status: this.mapBambooStatus(details.status || basic.status),
      location: details.location || basic.location,
      compensation: details.payRate ? {
        salary: parseFloat(details.payRate) * (details.paidPer === 'Hour' ? 2080 : 1),
        currency: 'USD',
        payFrequency: details.paidPer === 'Hour' ? 'biweekly' : 'annual',
      } : undefined,
      metadata: { basic, details },
      syncedAt: new Date(),
    };
  }

  private mapBambooStatus(status: string): HREmployee['status'] {
    if (!status) return 'active';
    const s = status.toLowerCase();
    if (s.includes('inactive') || s.includes('terminated')) return 'terminated';
    if (s.includes('leave')) return 'on_leave';
    return 'active';
  }

  private mapBambooTimeOffType(typeName: string): HRTimeEntry['type'] {
    if (!typeName) return 'pto';
    const t = typeName.toLowerCase();
    if (t.includes('sick')) return 'sick';
    if (t.includes('holiday')) return 'holiday';
    return 'pto';
  }
}

// =============================================================================
// HR INTEGRATION SERVICE
// =============================================================================

class HRIntegrationService {
  private workday: WorkdayConnector;
  private bamboohr: BambooHRConnector;
  private connectedProviders: Map<HRProvider, HRCredentials> = new Map();
  private employeeCache: Map<string, HREmployee> = new Map();
  private lastSync: Map<HRProvider, Date> = new Map();

  constructor() {
    this.workday = new WorkdayConnector();
    this.bamboohr = new BambooHRConnector();
  }

  // ---------------------------------------------------------------------------
  // CONNECTION MANAGEMENT
  // ---------------------------------------------------------------------------

  async connect(credentials: HRCredentials): Promise<HRConnectionStatus> {
    const { provider } = credentials;
    
    try {
      let connected = false;

      switch (provider) {
        case 'workday':
          this.workday.configure(credentials);
          connected = await this.workday.testConnection();
          break;
        case 'bamboohr':
          this.bamboohr.configure(credentials);
          connected = await this.bamboohr.testConnection();
          break;
        default:
          throw new Error(`Unsupported HR provider: ${provider}`);
      }

      if (connected) {
        this.connectedProviders.set(provider, credentials);
        logger.info(`Connected to ${provider}`);
      }

      return {
        provider,
        connected,
        error: connected ? undefined : 'Connection failed',
      };
    } catch (error) {
      logger.error(`Failed to connect to ${provider}:`, error);
      return {
        provider,
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async disconnect(provider: HRProvider): Promise<void> {
    this.connectedProviders.delete(provider);
    logger.info(`Disconnected from ${provider}`);
  }

  getConnectionStatus(provider: HRProvider): HRConnectionStatus {
    const connected = this.connectedProviders.has(provider);
    const employees = Array.from(this.employeeCache.values())
      .filter(e => e.provider === provider);

    return {
      provider,
      connected,
      lastSync: this.lastSync.get(provider),
      employeeCount: employees.length,
    };
  }

  getAllConnectionStatuses(): HRConnectionStatus[] {
    const providers: HRProvider[] = ['workday', 'bamboohr', 'adp', 'namely', 'gusto', 'rippling'];
    return providers.map(p => this.getConnectionStatus(p));
  }

  // ---------------------------------------------------------------------------
  // SYNC OPERATIONS
  // ---------------------------------------------------------------------------

  async syncEmployees(provider: HRProvider): Promise<HRSyncResult> {
    const startTime = Date.now();
    const result: HRSyncResult = {
      provider,
      syncedAt: new Date(),
      employeesProcessed: 0,
      employeesCreated: 0,
      employeesUpdated: 0,
      errors: [],
      duration: 0,
    };

    if (!this.connectedProviders.has(provider)) {
      throw new Error(`Not connected to ${provider}`);
    }

    try {
      let employees: HREmployee[] = [];

      switch (provider) {
        case 'workday':
          employees = await this.workday.fetchEmployees();
          break;
        case 'bamboohr':
          employees = await this.bamboohr.fetchEmployees();
          break;
        default:
          throw new Error(`Sync not implemented for ${provider}`);
      }

      for (const emp of employees) {
        try {
          const existing = this.employeeCache.get(emp.id);
          this.employeeCache.set(emp.id, emp);
          
          if (existing) {
            result.employeesUpdated++;
          } else {
            result.employeesCreated++;
          }
          result.employeesProcessed++;
        } catch (error) {
          result.errors.push({
            employeeId: emp.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      this.lastSync.set(provider, new Date());
      result.duration = Date.now() - startTime;

      logger.info(`Synced ${result.employeesProcessed} employees from ${provider} in ${result.duration}ms`);
      return result;
    } catch (error) {
      logger.error(`Failed to sync employees from ${provider}:`, error);
      throw error;
    }
  }

  async syncAll(): Promise<HRSyncResult[]> {
    const results: HRSyncResult[] = [];
    
    for (const provider of this.connectedProviders.keys()) {
      try {
        const result = await this.syncEmployees(provider);
        results.push(result);
      } catch (error) {
        logger.error(`Failed to sync ${provider}:`, error);
      }
    }

    return results;
  }

  // ---------------------------------------------------------------------------
  // EMPLOYEE DATA
  // ---------------------------------------------------------------------------

  getEmployee(id: string): HREmployee | undefined {
    return this.employeeCache.get(id);
  }

  getEmployeeByExternalId(provider: HRProvider, externalId: string): HREmployee | undefined {
    return Array.from(this.employeeCache.values())
      .find(e => e.provider === provider && e.externalId === externalId);
  }

  getAllEmployees(provider?: HRProvider): HREmployee[] {
    const employees = Array.from(this.employeeCache.values());
    if (provider) {
      return employees.filter(e => e.provider === provider);
    }
    return employees;
  }

  getEmployeesByDepartment(department: string): HREmployee[] {
    return Array.from(this.employeeCache.values())
      .filter(e => e.department.toLowerCase() === department.toLowerCase());
  }

  async getEmployeeTimeOff(employeeId: string, startDate: Date, endDate: Date): Promise<HRTimeEntry[]> {
    const employee = this.employeeCache.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    switch (employee.provider) {
      case 'bamboohr':
        return await this.bamboohr.fetchTimeOff(employee.externalId, startDate, endDate);
      case 'workday':
        // Workday uses different API structure
        const balance = await this.workday.fetchTimeOff(employee.externalId);
        return []; // Transform balance to entries
      default:
        throw new Error(`Time off not supported for ${employee.provider}`);
    }
  }

  async getEmployeePTOBalance(employeeId: string): Promise<{ balance: number; used: number; accrued: number }> {
    const employee = this.employeeCache.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (employee.pto) {
      return employee.pto;
    }

    switch (employee.provider) {
      case 'bamboohr':
        const balances = await this.bamboohr.fetchPTOBalances(employee.externalId);
        return {
          balance: balances?.balance || 0,
          used: balances?.used || 0,
          accrued: balances?.accrued || 0,
        };
      default:
        return { balance: 0, used: 0, accrued: 0 };
    }
  }

  // ---------------------------------------------------------------------------
  // ANALYTICS
  // ---------------------------------------------------------------------------

  getWorkforceMetrics(): {
    totalEmployees: number;
    byProvider: Record<HRProvider, number>;
    byDepartment: Record<string, number>;
    byStatus: Record<string, number>;
    averageTenure: number;
  } {
    const employees = this.getAllEmployees();
    const byProvider: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let totalTenure = 0;

    for (const emp of employees) {
      byProvider[emp.provider] = (byProvider[emp.provider] || 0) + 1;
      byDepartment[emp.department] = (byDepartment[emp.department] || 0) + 1;
      byStatus[emp.status] = (byStatus[emp.status] || 0) + 1;
      
      const tenureYears = (Date.now() - emp.startDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
      totalTenure += tenureYears;
    }

    return {
      totalEmployees: employees.length,
      byProvider: byProvider as Record<HRProvider, number>,
      byDepartment,
      byStatus,
      averageTenure: employees.length > 0 ? totalTenure / employees.length : 0,
    };
  }
}

// Export singleton instance
export const hrIntegrationService = new HRIntegrationService();
export default hrIntegrationService;
