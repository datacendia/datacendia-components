/**
 * Service — Time Series Forecaster
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports timeSeriesForecaster, ForecastResult, ForecastPoint, AccuracyMetrics, ModelInfo
 * @module services/forecasting/TimeSeriesForecaster
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// TIME SERIES FORECASTER
// Real ML forecasting using exponential smoothing and ARIMA-like methods
// Trained on actual FRED economic data
// =============================================================================

import { logger } from '../../utils/logger.js';
import { fredDataService, FREDDataPoint, FREDSeriesId } from './FREDDataService.js';

export interface ForecastResult {
  seriesId: string;
  seriesName: string;
  historicalData: FREDDataPoint[];
  predictions: ForecastPoint[];
  accuracy: AccuracyMetrics;
  model: ModelInfo;
  generatedAt: Date;
}

export interface ForecastPoint {
  date: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface AccuracyMetrics {
  mape: number;        // Mean Absolute Percentage Error
  rmse: number;        // Root Mean Square Error
  mae: number;         // Mean Absolute Error
  r2: number;          // R-squared
  trainSize: number;
  testSize: number;
  backtestPeriods: number;
}

export interface ModelInfo {
  type: string;
  parameters: Record<string, number>;
  trainedOn: string;
  dataSource: string;
}

class TimeSeriesForecaster {
  
  /**
   * Train and forecast using Holt-Winters Exponential Smoothing
   */
  async forecast(
    seriesId: FREDSeriesId,
    periodsAhead: number = 12,
    confidenceLevel: number = 0.95
  ): Promise<ForecastResult> {
    
    logger.info('[Forecaster] Starting forecast for', seriesId, 'periods:', periodsAhead);
    
    // Fetch real data
    const seriesData = await fredDataService.fetchSeries(seriesId);
    const values = seriesData.observations.map(o => o.value);
    const dates = seriesData.observations.map(o => o.date);
    
    if (values.length < 24) {
      throw new Error('Insufficient data for forecasting (need at least 24 observations)');
    }
    
    // Split into train/test for accuracy calculation
    const testSize = Math.min(12, Math.floor(values.length * 0.2));
    const trainValues = values.slice(0, -testSize);
    const testValues = values.slice(-testSize);
    // testDates available for debugging if needed
    
    // Fit Holt-Winters model
    const model = this.fitHoltWinters(trainValues);
    
    // Generate predictions on test set for accuracy
    const testPredictions = this.predictHoltWinters(model, trainValues, testSize);
    
    // Calculate accuracy metrics
    const accuracy = this.calculateAccuracy(testValues, testPredictions, trainValues.length, testSize);
    
    // Refit on full data for final predictions
    const fullModel = this.fitHoltWinters(values);
    
    // Generate future predictions
    const futurePredictions = this.predictHoltWinters(fullModel, values, periodsAhead);
    
    // Calculate prediction intervals
    const predictions = this.createPredictionIntervals(
      futurePredictions,
      dates,
      seriesData.frequency,
      confidenceLevel,
      accuracy.rmse
    );
    
    logger.info('[Forecaster] Completed forecast with MAPE:', accuracy.mape.toFixed(2) + '%');
    
    return {
      seriesId: seriesData.seriesId,
      seriesName: seriesData.name,
      historicalData: seriesData.observations,
      predictions,
      accuracy,
      model: {
        type: 'Holt-Winters Exponential Smoothing',
        parameters: {
          alpha: fullModel.alpha,
          beta: fullModel.beta,
          gamma: fullModel.gamma,
          seasonalPeriod: fullModel.seasonalPeriod,
        },
        trainedOn: `${values.length} observations from ${dates[0]} to ${dates[dates.length - 1]}`,
        dataSource: 'Federal Reserve Economic Data (FRED)',
      },
      generatedAt: new Date(),
    };
  }

  /**
   * Fit Holt-Winters triple exponential smoothing
   */
  private fitHoltWinters(values: number[]): HoltWintersModel {
    const seasonalPeriod = 12; // Monthly seasonality
    
    // Initialize parameters using grid search
    let bestAlpha = 0.3;
    let bestBeta = 0.1;
    let bestGamma = 0.1;
    let bestError = Infinity;
    
    // Simple grid search for optimal parameters
    for (let alpha = 0.1; alpha <= 0.9; alpha += 0.2) {
      for (let beta = 0.05; beta <= 0.3; beta += 0.1) {
        for (let gamma = 0.05; gamma <= 0.3; gamma += 0.1) {
          const error = this.calculateHWError(values, alpha, beta, gamma, seasonalPeriod);
          if (error < bestError) {
            bestError = error;
            bestAlpha = alpha;
            bestBeta = beta;
            bestGamma = gamma;
          }
        }
      }
    }
    
    // Calculate initial values
    const level = values.slice(0, seasonalPeriod).reduce((a, b) => a + b, 0) / seasonalPeriod;
    const trend = ((values[seasonalPeriod] ?? values[0] ?? 0) - (values[0] ?? 0)) / seasonalPeriod;
    
    // Initialize seasonal factors
    const seasonal: number[] = [];
    for (let i = 0; i < seasonalPeriod; i++) {
      const seasonalSum = values
        .filter((_, idx) => idx % seasonalPeriod === i)
        .slice(0, Math.floor(values.length / seasonalPeriod))
        .reduce((a, b) => a + b, 0);
      const count = Math.floor(values.length / seasonalPeriod);
      seasonal.push(count > 0 ? seasonalSum / count / level : 1);
    }
    
    return {
      alpha: bestAlpha,
      beta: bestBeta,
      gamma: bestGamma,
      level,
      trend,
      seasonal,
      seasonalPeriod,
    };
  }

  /**
   * Calculate Holt-Winters forecast error for parameter tuning
   */
  private calculateHWError(
    values: number[],
    alpha: number,
    beta: number,
    gamma: number,
    seasonalPeriod: number
  ): number {
    if (values.length < seasonalPeriod * 2) return Infinity;
    
    let level = values.slice(0, seasonalPeriod).reduce((a, b) => a + b, 0) / seasonalPeriod;
    let trend = (values[seasonalPeriod] - values[0]) / seasonalPeriod;
    const seasonal: number[] = [];
    
    for (let i = 0; i < seasonalPeriod; i++) {
      seasonal.push(values[i] / level);
    }
    
    let sumSquaredError = 0;
    let count = 0;
    
    for (let t = seasonalPeriod; t < values.length; t++) {
      const seasonIdx = t % seasonalPeriod;
      const forecast = (level + trend) * seasonal[seasonIdx];
      const error = values[t] - forecast;
      sumSquaredError += error * error;
      count++;
      
      // Update components
      const prevLevel = level;
      level = alpha * (values[t] / seasonal[seasonIdx]) + (1 - alpha) * (level + trend);
      trend = beta * (level - prevLevel) + (1 - beta) * trend;
      seasonal[seasonIdx] = gamma * (values[t] / level) + (1 - gamma) * seasonal[seasonIdx];
    }
    
    return count > 0 ? Math.sqrt(sumSquaredError / count) : Infinity;
  }

  /**
   * Generate predictions using fitted Holt-Winters model
   */
  private predictHoltWinters(model: HoltWintersModel, values: number[], periodsAhead: number): number[] {
    let { level, trend, seasonal, alpha, beta, gamma, seasonalPeriod } = model;
    
    // Update model with all historical data
    for (let t = seasonalPeriod; t < values.length; t++) {
      const seasonIdx = t % seasonalPeriod;
      const prevLevel = level;
      level = alpha * (values[t] / seasonal[seasonIdx]) + (1 - alpha) * (level + trend);
      trend = beta * (level - prevLevel) + (1 - beta) * trend;
      seasonal[seasonIdx] = gamma * (values[t] / level) + (1 - gamma) * seasonal[seasonIdx];
    }
    
    // Generate future predictions
    const predictions: number[] = [];
    for (let h = 1; h <= periodsAhead; h++) {
      const seasonIdx = (values.length + h - 1) % seasonalPeriod;
      const forecast = (level + h * trend) * seasonal[seasonIdx];
      predictions.push(forecast);
    }
    
    return predictions;
  }

  /**
   * Calculate accuracy metrics
   */
  private calculateAccuracy(
    actual: number[],
    predicted: number[],
    trainSize: number,
    testSize: number
  ): AccuracyMetrics {
    const n = Math.min(actual.length, predicted.length);
    
    let sumAbsError = 0;
    let sumSquaredError = 0;
    let sumAbsPercentError = 0;
    let sumActual = 0;
    let sumActualSquared = 0;
    
    for (let i = 0; i < n; i++) {
      const error = actual[i] - predicted[i];
      sumAbsError += Math.abs(error);
      sumSquaredError += error * error;
      sumAbsPercentError += Math.abs(error / actual[i]) * 100;
      sumActual += actual[i];
      sumActualSquared += actual[i] * actual[i];
    }
    
    const mae = sumAbsError / n;
    const rmse = Math.sqrt(sumSquaredError / n);
    const mape = sumAbsPercentError / n;
    
    // Calculate R-squared
    const meanActual = sumActual / n;
    let ssTotal = 0;
    let ssResidual = 0;
    for (let i = 0; i < n; i++) {
      ssTotal += (actual[i] - meanActual) ** 2;
      ssResidual += (actual[i] - predicted[i]) ** 2;
    }
    const r2 = ssTotal > 0 ? 1 - (ssResidual / ssTotal) : 0;
    
    return {
      mape: Math.round(mape * 100) / 100,
      rmse: Math.round(rmse * 100) / 100,
      mae: Math.round(mae * 100) / 100,
      r2: Math.round(r2 * 1000) / 1000,
      trainSize,
      testSize,
      backtestPeriods: n,
    };
  }

  /**
   * Create prediction intervals with confidence bounds
   */
  private createPredictionIntervals(
    predictions: number[],
    historicalDates: string[],
    frequency: string,
    confidenceLevel: number,
    rmse: number
  ): ForecastPoint[] {
    const zScore = this.getZScore(confidenceLevel);
    const lastDateStr = historicalDates[historicalDates.length - 1] ?? new Date().toISOString().split('T')[0];
    const lastDate = new Date(lastDateStr);
    
    return predictions.map((predicted, idx) => {
      // Prediction interval widens with horizon
      const horizonMultiplier = Math.sqrt(idx + 1);
      const interval = zScore * rmse * horizonMultiplier;
      
      // Calculate next date based on frequency
      const forecastDate = new Date(lastDate);
      if (frequency === 'monthly') {
        forecastDate.setMonth(forecastDate.getMonth() + idx + 1);
      } else if (frequency === 'quarterly') {
        forecastDate.setMonth(forecastDate.getMonth() + (idx + 1) * 3);
      } else if (frequency === 'weekly') {
        forecastDate.setDate(forecastDate.getDate() + (idx + 1) * 7);
      } else {
        forecastDate.setDate(forecastDate.getDate() + idx + 1);
      }
      
      // Confidence decreases with horizon
      const confidence = Math.max(0.5, confidenceLevel - (idx * 0.02));
      
      return {
        date: forecastDate.toISOString().split('T')[0],
        predicted: Math.round(predicted * 100) / 100,
        lowerBound: Math.round((predicted - interval) * 100) / 100,
        upperBound: Math.round((predicted + interval) * 100) / 100,
        confidence: Math.round(confidence * 100) / 100,
      };
    });
  }

  /**
   * Get z-score for confidence level
   */
  private getZScore(confidenceLevel: number): number {
    const zScores: Record<number, number> = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576,
    };
    return zScores[confidenceLevel] || 1.96;
  }

  /**
   * Batch forecast multiple series
   */
  async forecastMultiple(
    seriesIds: FREDSeriesId[],
    periodsAhead: number = 12
  ): Promise<Map<FREDSeriesId, ForecastResult>> {
    const results = new Map<FREDSeriesId, ForecastResult>();
    
    for (const id of seriesIds) {
      try {
        const result = await this.forecast(id, periodsAhead);
        results.set(id, result);
      } catch (error) {
        logger.error('[Forecaster] Failed to forecast', id, error);
      }
    }
    
    return results;
  }
}

interface HoltWintersModel {
  alpha: number;
  beta: number;
  gamma: number;
  level: number;
  trend: number;
  seasonal: number[];
  seasonalPeriod: number;
}

export const timeSeriesForecaster = new TimeSeriesForecaster();
