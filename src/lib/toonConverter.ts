/**
 * TOON (Token-Oriented Object Notation) Converter Utility
 */

export interface ToonResult {
  toon: string;
  warning?: string;
}

export function jsonToToon(jsonStr: string): ToonResult {
  try {
    const data = JSON.parse(jsonStr);
    
    if (Array.isArray(data)) {
      if (data.length === 0) return { toon: "[]" };
      
      // Check if it's an array of objects
      const firstItem = data[0];
      if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
        const keys = Object.keys(firstItem);
        const tableName = "collection"; // Could try to infer from context if we had a single key wrapper
        const lines = [`${tableName}[${data.length}]{${keys.join(',')}}:`];
        
        let hasNesting = false;

        data.forEach(item => {
          const row = keys.map(key => {
            const val = item[key];
            if (typeof val === 'object' && val !== null) {
              hasNesting = true;
              return JSON.stringify(val); // Fallback for nested objects
            }
            return String(val);
          }).join(',');
          lines.push(row);
        });

        return { 
          toon: lines.join('\n'),
          warning: hasNesting ? "Note: Deeply nested objects were found and serialized as JSON within the TOON structure." : undefined
        };
      } else {
        // Simple array
        return { toon: data.join(',') };
      }
    } else if (typeof data === 'object' && data !== null) {
      // Single object
      const keys = Object.keys(data);
      const lines = [`object{${keys.join(',')}}:`];
      const row = keys.map(key => {
        const val = data[key];
        if (typeof val === 'object' && val !== null) {
          return JSON.stringify(val);
        }
        return String(val);
      }).join(',');
      lines.push(row);
      return { toon: lines.join('\n') };
    }

    return { toon: String(data) };
  } catch (e) {
    return { toon: "Error: Invalid JSON input" };
  }
}

/**
 * Heuristic Token Counter
 * Based on the observation that 1 token is roughly 4 characters in English text.
 * For structured data, tokenization is often even more overhead-heavy in JSON 
 * due to repeated quotes and braces.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // A slightly more sophisticated heuristic: 
  // - Whitespace is usually 1 token
  // - Braces, quotes, commas are often individual tokens
  // - Words/numbers are 1-2 tokens
  // For this demo, we'll use a conservative 3.5 chars per token for structured data Comparison.
  return Math.ceil(text.length / 3.5);
}

export function calculateStats(json: string, toon: string) {
  const jsonTokens = estimateTokens(json);
  const toonTokens = estimateTokens(toon);
  const reduction = jsonTokens > 0 ? ((jsonTokens - toonTokens) / jsonTokens) * 100 : 0;
  
  return {
    jsonTokens,
    toonTokens,
    reduction: Math.max(0, reduction).toFixed(1),
    savedTokens: Math.max(0, jsonTokens - toonTokens)
  };
}
