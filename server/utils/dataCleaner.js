import axios from 'axios';
import StockData from '../models/StockData.js';
import { fetchStockData } from '../services/stockDataService.js';

export class DataCleaningService {
  // Remove NaN, Infinity, null values
  static removeMissingValues(data) {
    return data.filter((record) => {
      const { open, high, low, close, volume } = record;
      return (
        close && !isNaN(close) && isFinite(close) &&
        (!volume || (volume && !isNaN(volume) && isFinite(volume)))
      );
    });
  }

  // Detect and handle outliers using IQR method
  static detectOutliers(data, field = 'close') {
    if (data.length < 4) return { clean: data, outliers: [] };

    const values = data.map((d) => d[field]).sort((a, b) => a - b);
    const q1 = values[Math.floor(values.length * 0.25)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const iqr = q3 - q1;

    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const clean = [];
    const outliers = [];

    data.forEach((record) => {
      if (record[field] >= lowerBound && record[field] <= upperBound) {
        clean.push(record);
      } else {
        outliers.push(record);
      }
    });

    return { clean, outliers };
  }

  // Forward fill for small gaps, linear interpolation for larger gaps
  static interpolateMissingData(data) {
    if (data.length < 2) return data;

    const filled = [...data];

    for (let i = 0; i < filled.length - 1; i++) {
      if (!filled[i].close || isNaN(filled[i].close)) {
        // Forward fill from previous value
        if (i > 0 && filled[i - 1].close) {
          filled[i].close = filled[i - 1].close;
          filled[i].open = filled[i - 1].close;
          filled[i].high = filled[i - 1].close;
          filled[i].low = filled[i - 1].close;
        }
      }
    }

    return filled;
  }

  // Normalize prices to 0-1 range
  static normalizeData(data, field = 'close') {
    const values = data.map((d) => d[field]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return data.map((record) => ({
      ...record,
      [field + 'Normalized']: (record[field] - min) / range,
    }));
  }

  // Calculate log returns for time-series analysis
  static calculateLogReturns(data) {
    return data.map((record, index) => {
      if (index === 0) {
        return { ...record, logReturn: 0 };
      }

      const prevClose = data[index - 1].close;
      const currentClose = record.close;

      const logReturn = currentClose > 0 && prevClose > 0
        ? Math.log(currentClose / prevClose)
        : 0;

      return { ...record, logReturn };
    });
  }

  // Complete pipeline
  static async cleanAndProcessData(rawData, symbol) {
    let data = [...rawData];

    // Step 1: Remove missing values
    data = this.removeMissingValues(data);

    // Step 2: Detect and handle outliers
    const { clean: cleanData } = this.detectOutliers(data);
    data = cleanData.length > 0 ? cleanData : data;

    // Step 3: Interpolate remaining gaps
    data = this.interpolateMissingData(data);

    // Step 4: Normalize prices
    data = this.normalizeData(data, 'close');

    // Step 5: Calculate log returns
    data = this.calculateLogReturns(data);

    console.log(`✓ Cleaned ${data.length} records for ${symbol}`);
    return data;
  }
}

export default DataCleaningService;
