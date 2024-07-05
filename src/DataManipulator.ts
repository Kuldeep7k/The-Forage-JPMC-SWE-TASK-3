import { ServerRespond } from './DataStreamer';

// Interface to define the structure of a row in the Perspective table.
export interface Row {
  price_abc: number;                // Price of stock ABC
  price_def: number;                // Price of stock DEF
  ratio: number;                    // Ratio of price_abc to price_def
  upper_bound: number;              // Upper bound for ratio
  lower_bound: number;              // Lower bound for ratio
  trigger_alert: number | undefined; // Indicates a trigger alert if ratio crosses bounds
  timestamp: Date;                  // Timestamp of the data point
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // Calculate average prices for stocks ABC and DEF.
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;

    // Calculate the ratio of priceABC to priceDEF.
    const ratio = priceABC / priceDEF;

    // Set upper and lower bounds for the ratio based on historical averages.
    const upperBound = ratio * 1.1; // Upper bound 10% above the ratio
    const lowerBound = ratio * 0.9; // Lower bound 10% below the ratio

    // Determine the timestamp for the data point (using the latest timestamp).
    const timestamp = serverRespond[0].timestamp > serverRespond[1].timestamp ?
      serverRespond[0].timestamp : serverRespond[1].timestamp;

    // Check if the current ratio triggers an alert (crosses bounds).
    const triggerAlert = (ratio > upperBound || ratio < lowerBound) ? ratio : undefined;

    // Return the constructed row object.
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert : triggerAlert,
      timestamp:timestamp,
    };
  }
}
