import { describe, it, expect } from 'vitest';
import { parseAICommand } from './commandParser';
import { REGIONS } from '../data/regions';

describe('AI Command Parser', () => {
  const region = REGIONS[0];
  const savedLocations = region.pois.filter((p) => p.isSaved);

  it('parses navigation to college command', () => {
    const res = parseAICommand('Take me to college', region, savedLocations);
    expect(res.intent).toBe('NAVIGATE');
    expect(res.matchedPOI?.category).toBe('college');
  });

  it('parses stop navigation command', () => {
    const res = parseAICommand('Cancel navigation and stop route', region, savedLocations);
    expect(res.intent).toBe('STOP_NAV');
  });

  it('parses reroute command', () => {
    const res = parseAICommand('Find another route / reroute', region, savedLocations);
    expect(res.intent).toBe('REROUTE');
  });
});
