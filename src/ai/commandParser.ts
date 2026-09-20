import { AICommandResult, MapRegion, POI } from '../types';

export function parseAICommand(input: string, activeRegion: MapRegion, savedLocations: POI[] = []): AICommandResult {
  const clean = input.trim().toLowerCase();

  // Stop / Cancel Navigation
  if (
    clean.includes('stop nav') ||
    clean.includes('stop navigation') ||
    clean.includes('cancel route') ||
    clean.includes('end route') ||
    clean.includes('end trip') ||
    clean.includes('exit nav') ||
    clean.includes('cancel navigation')
  ) {
    return {
      rawText: input,
      intent: 'STOP_NAV',
      confidence: 0.98,
      responseVoiceText: 'Navigation stopped.',
    };
  }

  // Go Home
  if (
    clean.includes('take me home') ||
    clean.includes('go home') ||
    clean.includes('navigate home') ||
    clean.includes('drive home')
  ) {
    const homePOI =
      savedLocations.find((p) => p.category === 'home' || p.name.toLowerCase().includes('home')) ||
      activeRegion.pois.find((p) => p.category === 'home' || p.name.toLowerCase().includes('home'));

    return {
      rawText: input,
      intent: 'GO_HOME',
      destinationName: homePOI ? homePOI.name : 'Home',
      matchedPOI: homePOI,
      confidence: 0.96,
      responseVoiceText: homePOI
        ? `Navigating to ${homePOI.name}. Calculating optimal offline route.`
        : 'Navigating home.',
    };
  }

  // Go to Saved Location
  if (
    clean.includes('saved location') ||
    clean.includes('saved place') ||
    clean.includes('my saved')
  ) {
    const saved = savedLocations.length > 0 ? savedLocations[0] : activeRegion.pois.find((p) => p.isSaved);
    return {
      rawText: input,
      intent: 'GO_SAVED',
      destinationName: saved ? saved.name : 'Saved Location',
      matchedPOI: saved,
      confidence: 0.94,
      responseVoiceText: saved ? `Navigating to saved location: ${saved.name}.` : 'No saved locations found.',
    };
  }

  // Reroute
  if (clean.includes('reroute') || clean.includes('recalculate') || clean.includes('alternate route')) {
    return {
      rawText: input,
      intent: 'REROUTE',
      confidence: 0.95,
      responseVoiceText: 'Recalculating alternative offline route.',
    };
  }

  // Status / ETA
  if (clean.includes('eta') || clean.includes('status') || clean.includes('how far') || clean.includes('next turn')) {
    return {
      rawText: input,
      intent: 'STATUS',
      confidence: 0.92,
      responseVoiceText: 'Retrieving live navigation telemetry.',
    };
  }

  // General Navigation: "Take me to [place]", "Navigate to [place]", "Drive to [place]", "Directions to [place]"
  const navPatterns = [
    /(?:take me to|navigate to|drive to|go to|directions to|route to|find route to|take me toward)\s+(.+)/i,
    /(?:take me|navigate|drive)\s+(.+)/i,
  ];

  for (const pattern of navPatterns) {
    const match = clean.match(pattern);
    if (match && match[1]) {
      const targetQuery = match[1].replace(/^(the|a|an)\s+/i, '').trim();
      const matchedPOI = matchDestination(targetQuery, activeRegion.pois);

      return {
        rawText: input,
        intent: 'NAVIGATE',
        destinationName: matchedPOI ? matchedPOI.name : capitalize(targetQuery),
        matchedPOI,
        confidence: matchedPOI ? 0.95 : 0.85,
        responseVoiceText: matchedPOI
          ? `Starting offline route to ${matchedPOI.name}.`
          : `Calculating route to ${capitalize(targetQuery)}.`,
      };
    }
  }

  // Direct destination name match
  const matchedDirectPOI = matchDestination(clean, activeRegion.pois);
  if (matchedDirectPOI) {
    return {
      rawText: input,
      intent: 'NAVIGATE',
      destinationName: matchedDirectPOI.name,
      matchedPOI: matchedDirectPOI,
      confidence: 0.90,
      responseVoiceText: `Starting navigation to ${matchedDirectPOI.name}.`,
    };
  }

  return {
    rawText: input,
    intent: 'UNKNOWN',
    confidence: 0.2,
    responseVoiceText: 'I can only assist with navigation commands. Try: "Take me to college" or "Start navigation".',
  };
}

function matchDestination(query: string, pois: POI[]): POI | undefined {
  const q = query.toLowerCase();

  // Exact or keyword match
  for (const poi of pois) {
    const pName = poi.name.toLowerCase();
    if (pName.includes(q) || q.includes(pName)) {
      return poi;
    }
    if (q.includes('college') && (poi.category === 'college' || pName.includes('college') || pName.includes('institute') || pName.includes('university'))) {
      return poi;
    }
    if (q.includes('hospital') && (poi.category === 'hospital' || pName.includes('hospital'))) {
      return poi;
    }
    if (q.includes('fuel') || q.includes('gas') || q.includes('petrol') || q.includes('ev') || q.includes('station')) {
      if (poi.category === 'fuel' || pName.includes('energy') || pName.includes('fuel')) {
        return poi;
      }
    }
    if (q.includes('lab') || q.includes('iqoo') || q.includes('tech') || q.includes('office') || q.includes('work')) {
      if (poi.category === 'tech_park' || pName.includes('iqoo') || pName.includes('innovation')) {
        return poi;
      }
    }
    if (q.includes('metro') || q.includes('transit') || q.includes('station')) {
      if (poi.category === 'transit' || pName.includes('transit') || pName.includes('metro')) {
        return poi;
      }
    }
  }
  return undefined;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
