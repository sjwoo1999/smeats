/**
 * 도로명주소 API Integration
 * Server-side only - 주소 → 법정동코드(admCd) 변환
 *
 * 확실하지 않음: Team must provide actual API key and endpoint configuration
 * This is a stub implementation with the expected interface
 */

/**
 * Lookup 10-digit administrative code (법정동코드) from address
 *
 * Uses 행정안전부 도로명주소 API
 * Reference: https://business.juso.go.kr/addrlink/openApi/apiExprn.do
 *
 * @param address - Free-text Korean address
 * @returns 10-digit admCd or null if not found
 *
 * TODO: Implement actual API integration when team provides:
 * - JUSO_API_KEY environment variable
 * - JUSO_API_URL endpoint
 * - Query parameter structure
 * - Response parsing logic
 * - Error handling strategy
 */
export async function lookupAdmCdByAddress(
  address: string
): Promise<string | null> {
  // Validate input
  if (!address || address.trim().length === 0) {
    return null;
  }

  // Check for required environment variables
  const apiKey = process.env.JUSO_API_KEY;
  const apiUrl = process.env.JUSO_API_URL;

  if (!apiKey || !apiUrl) {
    console.warn(
      "JUSO_API_KEY or JUSO_API_URL not configured. Cannot lookup admCd."
    );
    return null;
  }

  try {
    // TODO: Implement actual API call
    // Expected flow:
    // 1. Build query URL with address and API key
    // 2. Fetch from 도로명주소 API
    // 3. Parse response XML/JSON
    // 4. Extract admCd field (10-digit code)
    // 5. Validate format (must be exactly 10 digits)
    // 6. Return code or null

    /*
    const params = new URLSearchParams({
      confmKey: apiKey,
      keyword: address,
      resultType: 'json',
      countPerPage: '1',
      currentPage: '1',
    });

    const response = await fetch(`${apiUrl}?${params}`);
    const data = await response.json();

    if (data.results?.common?.errorCode === '0') {
      const result = data.results?.juso?.[0];
      const admCd = result?.admCd;

      if (admCd && /^\d{10}$/.test(admCd)) {
        return admCd;
      }
    }
    */

    console.warn(
      `lookupAdmCdByAddress not implemented. Address: ${address.slice(0, 30)}...`
    );
    return null;
  } catch (error) {
    console.error("Error looking up admCd:", error);
    return null;
  }
}

/**
 * Validate 10-digit administrative code format
 */
export function isValidAdmCd(admCd: string): boolean {
  return /^\d{10}$/.test(admCd);
}

/**
 * Format administrative code for display
 * Example: 1111010100 → 11110-10100
 */
export function formatAdmCd(admCd: string): string {
  if (!isValidAdmCd(admCd)) {
    return admCd;
  }
  return `${admCd.slice(0, 5)}-${admCd.slice(5)}`;
}

/**
 * Parse formatted code back to raw format
 */
export function parseAdmCd(formatted: string): string {
  return formatted.replace(/[^0-9]/g, "");
}
