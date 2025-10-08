/**
 * Geographic and administrative district utilities
 * Handles delivery zone matching for SMEats
 */

import type { DistrictZoneValue } from "./types";

/**
 * Check if customer's administrative code is allowed in district zone
 * Uses exact match on 10-digit 법정동코드
 *
 * @param admCd - Customer's 10-digit administrative code
 * @param zone - District zone configuration with codes array
 * @returns true if customer's code is in allowed list
 */
export function isDistrictAllowed(
  admCd: string,
  zone: { zone_type: "district"; zone_value: DistrictZoneValue }
): boolean {
  if (!admCd || admCd.length !== 10) {
    return false;
  }

  // Exact match only - no fuzzy matching
  return zone.zone_value?.codes?.includes(admCd) === true;
}

/**
 * Build PostGIS query for radius-based delivery zone filtering
 * Returns SQL WHERE clause fragment
 *
 * Note: Actual execution happens in database using ST_DWithin
 *
 * @param customerLat - Customer latitude
 * @param customerLng - Customer longitude
 * @returns SQL fragment for radius filter
 */
export function buildRadiusFilterSQL(
  customerLat: number,
  customerLng: number
): string {
  // PostGIS geography point uses (longitude, latitude) order
  // ST_DWithin uses meters for distance
  return `ST_DWithin(
    location::geography,
    ST_SetSRID(ST_MakePoint(${customerLng}, ${customerLat}), 4326)::geography,
    (zone_value->>'km')::numeric * 1000
  )`;
}

/**
 * Validate coordinates
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Calculate distance between two points (Haversine formula)
 * Returns distance in kilometers
 *
 * @param lat1 - First point latitude
 * @param lng1 - First point longitude
 * @param lat2 - Second point latitude
 * @param lng2 - Second point longitude
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Parse zone_value JSON to typed objects
 */
export function parseZoneValue(
  zoneType: "radius" | "district",
  zoneValue: unknown
): { km?: number; lat?: number; lng?: number; codes?: string[] } {
  if (typeof zoneValue !== "object" || zoneValue === null) {
    return {};
  }

  const value = zoneValue as Record<string, unknown>;

  if (zoneType === "radius") {
    return {
      km: typeof value.km === "number" ? value.km : undefined,
      lat: typeof value.lat === "number" ? value.lat : undefined,
      lng: typeof value.lng === "number" ? value.lng : undefined,
    };
  }

  if (zoneType === "district") {
    return {
      codes: Array.isArray(value.codes)
        ? value.codes.filter((c): c is string => typeof c === "string")
        : undefined,
    };
  }

  return {};
}
