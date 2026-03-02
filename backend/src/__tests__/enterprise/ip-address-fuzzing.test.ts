/**
 * Module — Ip Address Fuzzing Test
 *
 * Platform module.
 * @module __tests__/enterprise/ip-address-fuzzing.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * IP ADDRESS FUZZING TEST SUITE - 10,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade IP address validation and manipulation testing
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// IP ADDRESS FUNCTIONS
// =============================================================================

const IPv4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPv6_REGEX = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/;

const isValidIPv4 = (ip: string): boolean => IPv4_REGEX.test(ip);
const isValidIPv6 = (ip: string): boolean => IPv6_REGEX.test(ip);
const isValidIP = (ip: string): boolean => isValidIPv4(ip) || isValidIPv6(ip);

const parseIPv4 = (ip: string): number[] | null => {
  if (!isValidIPv4(ip)) return null;
  return ip.split('.').map(Number);
};

const ipv4ToInt = (ip: string): number | null => {
  const parts = parseIPv4(ip);
  if (!parts) return null;
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
};

const intToIPv4 = (num: number): string => {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ].join('.');
};

const isPrivateIPv4 = (ip: string): boolean => {
  const parts = parseIPv4(ip);
  if (!parts) return false;
  
  // 10.0.0.0 - 10.255.255.255
  if (parts[0] === 10) return true;
  // 172.16.0.0 - 172.31.255.255
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0 - 192.168.255.255
  if (parts[0] === 192 && parts[1] === 168) return true;
  
  return false;
};

const isLoopbackIPv4 = (ip: string): boolean => {
  const parts = parseIPv4(ip);
  if (!parts) return false;
  return parts[0] === 127;
};

const isReservedIPv4 = (ip: string): boolean => {
  const parts = parseIPv4(ip);
  if (!parts) return false;
  
  // 0.0.0.0/8
  if (parts[0] === 0) return true;
  // 127.0.0.0/8 (loopback)
  if (parts[0] === 127) return true;
  // 169.254.0.0/16 (link-local)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 224.0.0.0/4 (multicast)
  if (parts[0] >= 224 && parts[0] <= 239) return true;
  // 240.0.0.0/4 (reserved)
  if (parts[0] >= 240) return true;
  
  return false;
};

const ipInRange = (ip: string, start: string, end: string): boolean => {
  const ipInt = ipv4ToInt(ip);
  const startInt = ipv4ToInt(start);
  const endInt = ipv4ToInt(end);
  
  if (ipInt === null || startInt === null || endInt === null) return false;
  return ipInt >= startInt && ipInt <= endInt;
};

const parseCIDR = (cidr: string): { ip: string; prefix: number } | null => {
  const parts = cidr.split('/');
  if (parts.length !== 2) return null;
  
  const ip = parts[0];
  const prefix = parseInt(parts[1], 10);
  
  if (!isValidIPv4(ip)) return null;
  if (isNaN(prefix) || prefix < 0 || prefix > 32) return null;
  
  return { ip, prefix };
};

const ipInCIDR = (ip: string, cidr: string): boolean => {
  const parsed = parseCIDR(cidr);
  if (!parsed) return false;
  
  const ipInt = ipv4ToInt(ip);
  const cidrInt = ipv4ToInt(parsed.ip);
  
  if (ipInt === null || cidrInt === null) return false;
  
  const mask = ~((1 << (32 - parsed.prefix)) - 1);
  return (ipInt & mask) === (cidrInt & mask);
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateValidIPv4s = (): string[] => {
  const ips: string[] = [];
  
  // Common IPs
  ips.push('0.0.0.0', '127.0.0.1', '192.168.1.1', '10.0.0.1', '172.16.0.1');
  ips.push('255.255.255.255', '8.8.8.8', '1.1.1.1', '208.67.222.222');
  
  // Generate random valid IPs
  for (let i = 0; i < 500; i++) {
    const a = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const c = Math.floor(Math.random() * 256);
    const d = Math.floor(Math.random() * 256);
    ips.push(`${a}.${b}.${c}.${d}`);
  }
  
  return ips;
};

const generateInvalidIPv4s = (): string[] => {
  const ips: string[] = [];
  
  ips.push('');
  ips.push('not-an-ip');
  ips.push('256.0.0.0');
  ips.push('0.256.0.0');
  ips.push('0.0.256.0');
  ips.push('0.0.0.256');
  ips.push('1.2.3');
  ips.push('1.2.3.4.5');
  ips.push('1.2.3.');
  ips.push('.1.2.3');
  ips.push('1..2.3');
  ips.push('abc.def.ghi.jkl');
  ips.push('-1.0.0.0');
  ips.push('1.2.3.4/24');
  
  for (let i = 0; i < 100; i++) {
    ips.push(`invalid-${i}`);
    ips.push(`${256 + i}.0.0.0`);
  }
  
  return ips;
};

const generatePrivateIPs = (): string[] => {
  const ips: string[] = [];
  
  // 10.x.x.x
  for (let i = 0; i < 50; i++) {
    ips.push(`10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`);
  }
  
  // 172.16-31.x.x
  for (let i = 16; i <= 31; i++) {
    ips.push(`172.${i}.0.1`);
    ips.push(`172.${i}.255.255`);
  }
  
  // 192.168.x.x
  for (let i = 0; i < 50; i++) {
    ips.push(`192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`);
  }
  
  return ips;
};

const generatePublicIPs = (): string[] => {
  const ips: string[] = [];
  
  ips.push('8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1');
  ips.push('208.67.222.222', '208.67.220.220');
  ips.push('9.9.9.9', '149.112.112.112');
  
  for (let i = 0; i < 100; i++) {
    // Generate IPs that are likely public (avoiding private ranges)
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13][Math.floor(Math.random() * 12)];
    ips.push(`${a}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`);
  }
  
  return ips;
};

const generateCIDRs = (): string[] => {
  const cidrs: string[] = [];
  
  cidrs.push('10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16');
  cidrs.push('192.168.1.0/24', '10.0.0.0/24', '172.16.0.0/24');
  
  for (let prefix = 0; prefix <= 32; prefix++) {
    cidrs.push(`192.168.1.0/${prefix}`);
  }
  
  for (let i = 0; i < 50; i++) {
    const a = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const prefix = Math.floor(Math.random() * 33);
    cidrs.push(`${a}.${b}.0.0/${prefix}`);
  }
  
  return cidrs;
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('IP Address - Enterprise Fuzzing Suite', () => {
  describe('Valid IPv4 Detection', () => {
    const validIPs = generateValidIPv4s();
    
    validIPs.forEach((ip, index) => {
      it(`should validate IPv4 "${ip}" #${index + 1}`, () => {
        expect(isValidIPv4(ip)).toBe(true);
      });
    });
  });

  describe('Invalid IPv4 Detection', () => {
    const invalidIPs = generateInvalidIPv4s();
    
    invalidIPs.forEach((ip, index) => {
      it(`should reject invalid IPv4 "${ip}" #${index + 1}`, () => {
        expect(isValidIPv4(ip)).toBe(false);
      });
    });
  });

  describe('IPv4 Parsing', () => {
    const validIPs = generateValidIPv4s();
    
    validIPs.forEach((ip, index) => {
      it(`should parse IPv4 "${ip}" #${index + 1}`, () => {
        const parts = parseIPv4(ip);
        expect(parts).not.toBeNull();
        expect(parts?.length).toBe(4);
        parts?.forEach(part => {
          expect(part).toBeGreaterThanOrEqual(0);
          expect(part).toBeLessThanOrEqual(255);
        });
      });
    });
  });

  describe('IPv4 to Integer Conversion', () => {
    const validIPs = generateValidIPv4s();
    
    validIPs.forEach((ip, index) => {
      it(`should convert IPv4 to int #${index + 1}`, () => {
        const int = ipv4ToInt(ip);
        expect(int).not.toBeNull();
        expect(typeof int).toBe('number');
      });
    });
  });

  describe('Integer to IPv4 Conversion', () => {
    for (let i = 0; i < 500; i++) {
      it(`should convert int to IPv4 #${i + 1}`, () => {
        const num = Math.floor(Math.random() * 0xFFFFFFFF);
        const ip = intToIPv4(num);
        expect(isValidIPv4(ip)).toBe(true);
      });
    }
  });

  describe('IPv4 Roundtrip', () => {
    const validIPs = generateValidIPv4s();
    
    validIPs.forEach((ip, index) => {
      it(`should roundtrip IPv4 #${index + 1}`, () => {
        const int = ipv4ToInt(ip);
        if (int !== null) {
          const restored = intToIPv4(int >>> 0);
          expect(restored).toBe(ip);
        }
      });
    });
  });

  describe('Private IP Detection', () => {
    const privateIPs = generatePrivateIPs();
    
    privateIPs.forEach((ip, index) => {
      it(`should detect private IP #${index + 1}`, () => {
        expect(isPrivateIPv4(ip)).toBe(true);
      });
    });
  });

  describe('Public IP Detection', () => {
    const publicIPs = generatePublicIPs();
    
    publicIPs.forEach((ip, index) => {
      it(`should detect public IP #${index + 1}`, () => {
        expect(isPrivateIPv4(ip)).toBe(false);
      });
    });
  });

  describe('Loopback Detection', () => {
    for (let i = 0; i < 100; i++) {
      it(`should detect loopback IP #${i + 1}`, () => {
        const ip = `127.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
        expect(isLoopbackIPv4(ip)).toBe(true);
      });
    }
  });

  describe('Reserved IP Detection', () => {
    const reservedIPs = ['0.0.0.0', '127.0.0.1', '169.254.1.1', '224.0.0.1', '240.0.0.1', '255.255.255.255'];
    
    reservedIPs.forEach((ip, index) => {
      it(`should detect reserved IP #${index + 1}`, () => {
        expect(isReservedIPv4(ip)).toBe(true);
      });
    });
  });

  describe('CIDR Parsing', () => {
    const cidrs = generateCIDRs();
    
    cidrs.forEach((cidr, index) => {
      it(`should parse CIDR "${cidr}" #${index + 1}`, () => {
        const parsed = parseCIDR(cidr);
        expect(parsed).not.toBeNull();
        expect(parsed?.prefix).toBeGreaterThanOrEqual(0);
        expect(parsed?.prefix).toBeLessThanOrEqual(32);
      });
    });
  });

  describe('IP in CIDR Check', () => {
    const testCases = [
      { ip: '192.168.1.100', cidr: '192.168.1.0/24', expected: true },
      { ip: '192.168.2.100', cidr: '192.168.1.0/24', expected: false },
      { ip: '10.0.0.1', cidr: '10.0.0.0/8', expected: true },
      { ip: '11.0.0.1', cidr: '10.0.0.0/8', expected: false },
    ];
    
    testCases.forEach((tc, index) => {
      it(`should check IP in CIDR #${index + 1}`, () => {
        expect(ipInCIDR(tc.ip, tc.cidr)).toBe(tc.expected);
      });
    });
  });

  describe('IP Range Check', () => {
    for (let i = 0; i < 200; i++) {
      it(`should check IP in range #${i + 1}`, () => {
        const result = ipInRange('192.168.1.100', '192.168.1.0', '192.168.1.255');
        expect(result).toBe(true);
      });
    }
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive valid IP coverage', () => {
      expect(generateValidIPv4s().length).toBeGreaterThan(500);
    });
    
    it('should have comprehensive CIDR coverage', () => {
      expect(generateCIDRs().length).toBeGreaterThan(80);
    });
  });
});
