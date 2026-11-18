// usePriceCalculation Hook

import { useState, useEffect } from 'react';
import type {
  Configuration,
  Product,
  PriceBreakdown,
} from '../components/ProductConfigurator/types';
import { calculatePrice } from '../services/api';

interface UsePriceCalculationResult {
  price: PriceBreakdown | null;
  formattedTotal: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Last price result together with the options it was calculated for
interface PriceResult {
  selections: Configuration['selections'];
  addOns: Configuration['addOns'];
  quantity: number;
  reloadCount: number;
  price: PriceBreakdown | null;
  formattedTotal: string;
  error: string | null;
}

/**
 * Custom hook for managing price calculation
 */
export function usePriceCalculation(
  config: Configuration | null,
  product: Product,
): UsePriceCalculationResult {
  const [result, setResult] = useState<PriceResult | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  const selections = config?.selections;
  const addOns = config?.addOns;
  const quantity = config?.quantity;

  useEffect(() => {
    if (!config) return;

    // Set to true when the options change again before response comes back
    let ignoreResponse = false;
    const request = {
      selections: config.selections,
      addOns: config.addOns,
      quantity: config.quantity,
      reloadCount,
    };

    calculatePrice(config, product)
      .then((response) => {
        if (!ignoreResponse) {
          setResult({
            ...request,
            price: response.breakdown,
            formattedTotal: response.formattedTotal,
            error: null,
          });
        }
      })
      .catch(() => {
        if (!ignoreResponse) {
          setResult((prev) => ({
            ...request,
            price: null,
            formattedTotal: prev?.formattedTotal ?? '$0.00',
            error: 'ERR_PRICE_CALC_FAILED',
          }));
        }
      });

    return () => {
      ignoreResponse = true;
    };
    // `config` is omitted on purpose, because it also changes when the user types
    // a draft name, which doesn't affect the price
  }, [selections, addOns, quantity, reloadCount, product]);

  const refetch = () => setReloadCount((count) => count + 1);

  if (!config) {
    return { price: null, formattedTotal: '$0.00', isLoading: false, error: null, refetch };
  }

  // Result is up to date when it was calculated for the current options
  const isCurrent =
    result !== null &&
    result.selections === selections &&
    result.addOns === addOns &&
    result.quantity === quantity &&
    result.reloadCount === reloadCount;

  return {
    price: result?.price ?? null,
    formattedTotal: result?.formattedTotal ?? '$0.00',
    isLoading: !isCurrent,
    error: isCurrent ? result.error : null,
    refetch,
  };
}
