// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Post-Quantum KMS Service Tests
 */

import { describe, it, expect } from 'vitest';
import { postQuantumKMSService, PQAlgorithm } from '../../services/security/PostQuantumKMSService.js';

describe('PostQuantumKMSService', () => {
  describe('getSupportedAlgorithms', () => {
    it('should return all supported algorithms', () => {
      const algorithms = postQuantumKMSService.getSupportedAlgorithms();
      
      expect(Array.isArray(algorithms)).toBe(true);
      expect(algorithms.length).toBeGreaterThan(0);
      
      const firstAlgo = algorithms[0];
      expect(firstAlgo).toBeDefined();
      expect(typeof firstAlgo).toBe('object');
    });

    it('should include Dilithium algorithms', () => {
      const algorithms = postQuantumKMSService.getSupportedAlgorithms();
      const dilithiumAlgos = algorithms.filter((a: any) => a.algorithm?.startsWith('dilithium'));
      
      expect(dilithiumAlgos.length).toBeGreaterThanOrEqual(3);
    });

    it('should include SPHINCS+ algorithms', () => {
      const algorithms = postQuantumKMSService.getSupportedAlgorithms();
      const sphincsAlgos = algorithms.filter((a: any) => a.algorithm?.startsWith('sphincs'));
      
      expect(sphincsAlgos.length).toBeGreaterThanOrEqual(2);
    });

    it('should include Falcon algorithms', () => {
      const algorithms = postQuantumKMSService.getSupportedAlgorithms();
      const falconAlgos = algorithms.filter((a: any) => a.algorithm?.startsWith('falcon'));
      
      expect(falconAlgos.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getRecommendation', () => {
    it('should recommend algorithm for general use case', () => {
      const recommendation = postQuantumKMSService.getRecommendation('general');
      
      expect(typeof recommendation).toBe('string');
      expect(recommendation).toBe('dilithium3');
    });

    it('should recommend algorithm for high-security use case', () => {
      const recommendation = postQuantumKMSService.getRecommendation('high-security');
      
      expect(typeof recommendation).toBe('string');
      expect(['dilithium5', 'sphincs-shake-256f']).toContain(recommendation);
    });

    it('should recommend algorithm for compact use case', () => {
      const recommendation = postQuantumKMSService.getRecommendation('compact');
      
      expect(typeof recommendation).toBe('string');
      expect(recommendation).toBe('dilithium2'); // Falcon not yet available in JS; Dilithium2 is smallest implemented
    });

    it('should recommend hybrid for transition period', () => {
      const recommendation = postQuantumKMSService.getRecommendation('hybrid');
      
      expect(typeof recommendation).toBe('string');
      expect(recommendation).toBe('dilithium3'); // Dilithium3 + separate RSA signing for hybrid approach
    });
  });

  describe('generateKeyPair', () => {
    it('should generate key pair with valid algorithm', async () => {
      const keyPair = await postQuantumKMSService.generateKeyPair({
        algorithm: 'dilithium2' as PQAlgorithm,
        strength: 'standard',
        expiresInDays: 365,
      });

      expect(keyPair).toHaveProperty('id');
      expect(keyPair).toHaveProperty('algorithm');
      expect(keyPair).toHaveProperty('publicKey');
      expect(keyPair).toHaveProperty('privateKey');
      expect(keyPair).toHaveProperty('createdAt');
      expect(keyPair).toHaveProperty('expiresAt');
      expect(keyPair).toHaveProperty('nistLevel');
      expect(keyPair.algorithm).toBe('dilithium2');
    });

    it('should set correct NIST levels', async () => {
      const dilithium2 = await postQuantumKMSService.generateKeyPair({
        algorithm: 'dilithium2' as PQAlgorithm,
        strength: 'standard',
        expiresInDays: 365,
      });
      expect(dilithium2.nistLevel).toBe(2);

      const dilithium5 = await postQuantumKMSService.generateKeyPair({
        algorithm: 'dilithium5' as PQAlgorithm,
        strength: 'paranoid',
        expiresInDays: 365,
      });
      expect(dilithium5.nistLevel).toBe(5);
    });
  });

  describe('sign', () => {
    it('should sign data with key pair', async () => {
      const keyPair = await postQuantumKMSService.generateKeyPair({
        algorithm: 'dilithium2' as PQAlgorithm,
        strength: 'standard',
        expiresInDays: 365,
      });

      const signature = await postQuantumKMSService.sign('Test data to sign', keyPair.id);

      expect(signature).toHaveProperty('signature');
      expect(signature).toHaveProperty('algorithm');
      expect(signature).toHaveProperty('keyId');
      expect(signature).toHaveProperty('timestamp');
      expect(signature.keyId).toBe(keyPair.id);
      expect(signature.algorithm).toBe('dilithium2');
    });
  });

  describe('verify', () => {
    it('should verify valid signature', async () => {
      const keyPair = await postQuantumKMSService.generateKeyPair({
        algorithm: 'dilithium2' as PQAlgorithm,
        strength: 'standard',
        expiresInDays: 365,
      });

      const data = 'Test data to sign';
      const signature = await postQuantumKMSService.sign(data, keyPair.id);
      const verification = await postQuantumKMSService.verify(data, signature);

      expect(verification).toHaveProperty('valid');
      expect(verification).toHaveProperty('algorithm');
      expect(verification).toHaveProperty('keyId');
      expect(verification.valid).toBe(true);
    });

    it('should reject invalid signature', async () => {
      const keyPair = await postQuantumKMSService.generateKeyPair({
        algorithm: 'dilithium2' as PQAlgorithm,
        strength: 'standard',
        expiresInDays: 365,
      });

      const data = 'Test data to sign';
      const signature = await postQuantumKMSService.sign(data, keyPair.id);
      const tamperedData = 'Tampered data';
      const verification = await postQuantumKMSService.verify(tamperedData, signature);

      expect(verification.valid).toBe(false);
    });
  });

  describe('rotateKey', () => {
    it('should rotate key pair', async () => {
      const originalKeyPair = await postQuantumKMSService.generateKeyPair({
        algorithm: 'dilithium2' as PQAlgorithm,
        strength: 'standard',
        expiresInDays: 365,
      });

      const rotatedKeyPair = await postQuantumKMSService.rotateKey(originalKeyPair.id);

      expect(rotatedKeyPair).toHaveProperty('id');
      expect(rotatedKeyPair.id).not.toBe(originalKeyPair.id);
      expect(rotatedKeyPair.algorithm).toBe(originalKeyPair.algorithm);
      expect(rotatedKeyPair.publicKey).not.toBe(originalKeyPair.publicKey);
    });
  });
});
