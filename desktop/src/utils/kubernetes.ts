
/**
 * Converts a Kubernetes resource quantity string to a scalar value
 * Based on the implementation from @kubernetes/client-node
 * 
 * @param quantity The quantity string (e.g. "100m", "1Gi")
 * @returns The scalar value as a bigint
 */
export function quantityToScalar(quantity: string): bigint {
  if (!quantity) {
    throw new Error("Invalid quantity: empty string");
  }

  if (quantity.includes('.')) {
    const [whole, decimal] = quantity.split('.');
    const decimalValue = decimal.replace(/[^0-9]/g, '');
    const suffix = decimal.replace(/[0-9]/g, '');
    
    const base = getBaseFromSuffix(suffix);
    const wholeNumber = BigInt(whole || '0');
    const decimalNumber = BigInt(decimalValue || '0');
    const decimalPlaces = BigInt(decimalValue.length);
    
    return (wholeNumber * base) + 
           (decimalNumber * base / (10n ** decimalPlaces));
  }
  
  const numMatch = quantity.match(/^([0-9]+)([a-zA-Z]*)$/);
  if (numMatch) {
    const num = BigInt(numMatch[1]);
    const suffix = numMatch[2];
    const base = getBaseFromSuffix(suffix);
    return num * base;
  }
  
  const milliMatch = quantity.match(/^([0-9]+)m$/);
  if (milliMatch) {
    return BigInt(milliMatch[1]);
  }
  
  if (/^[0-9]+$/.test(quantity)) {
    return BigInt(quantity);
  }
  
  throw new Error(`Invalid quantity format: ${quantity}`);
}

/**
 * Gets the base multiplier for a Kubernetes resource suffix
 */
function getBaseFromSuffix(suffix: string): bigint {
  switch (suffix.toLowerCase()) {
    case '':
      return 1n;
    case 'k':
      return 1000n;
    case 'm':
      return 1000000n;
    case 'g':
      return 1000000000n;
    case 't':
      return 1000000000000n;
    case 'p':
      return 1000000000000000n;
    case 'e':
      return 1000000000000000000n;
    case 'ki':
      return 1024n;
    case 'mi':
      return 1024n * 1024n;
    case 'gi':
      return 1024n * 1024n * 1024n;
    case 'ti':
      return 1024n * 1024n * 1024n * 1024n;
    case 'pi':
      return 1024n * 1024n * 1024n * 1024n * 1024n;
    case 'ei':
      return 1024n * 1024n * 1024n * 1024n * 1024n * 1024n;
    default:
      return 1n;
  }
}
