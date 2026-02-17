import { sha256 } from 'crypto-js';

class PredictionEngine {
  constructor() {
    this.history = null;
  }

  // Main entry point
  dailyPicks(related, latest, sources = []) {
    // --- 1) Seed candidate set
    let candidates = new Set();
    
    // Add related numbers (user's personal numbers)
    Array.from(related).slice(0, 8).forEach(n => candidates.add(n));
    
    // Generate deterministic hash-based numbers for freshness
    const seed = this.isoDate() + Array.from(related).sort().join('|');
    let idx = 0;
    while (candidates.size < 16) {
      const hash = sha256(seed + `#${idx}`).toString();
      const digits = hash.replace(/[^0-9]/g, '').split('').map(Number).filter(n => !isNaN(n));
      if (digits.length >= 4) {
        const num = `${digits[0]}${digits[1]}${digits[2]}${digits[3]}`;
        candidates.add(num);
      }
      idx++;
    }

    // --- 2) Numbers to avoid (recent draws)
    const avoid = latest ? this.drawNumbersSet(latest) : new Set();
    
    // Filter out recent winners
    const baseList = Array.from(candidates).filter(n => !avoid.has(n));

    // --- 3) Extract number windows from user sources
    const sourceWindows = sources
      .map(s => this.onlyDigits(s))
      .filter(d => d.length > 0)
      .map(d => this.windows4(d))
      .filter(w => w.length > 0);

    // --- 4) Birthday half detection (DDMMYYYY pattern)
    const birthdayHalves = [];
    sources.forEach(s => {
      const digits = this.onlyDigits(s);
      if (digits.length === 8) { // DDMMYYYY
        const front = digits.substring(0, 4);
        const back = digits.substring(4, 8);
        if (this.isAllDigits(front) && this.isAllDigits(back)) {
          birthdayHalves.push({ front, back });
        }
      }
    });

    // --- 5) Address parsing (special handling)
    const addressNumbers = this.parseAddresses(sources);
    sourceWindows.push(...addressNumbers);

    // --- 6) Check which source groups hit in latest draw
    const drawHitSet = avoid;
    const groupsHit = sourceWindows.map(group => 
      group.some(w => drawHitSet.has(w))
    );

    // --- 7) Birthday half linking
    const bdayTriggered = {};
    birthdayHalves.forEach(pair => {
      if (drawHitSet.has(pair.front)) {
        bdayTriggered[pair.back] = 'birthday year (from DDMM)';
      }
      if (drawHitSet.has(pair.back)) {
        bdayTriggered[pair.front] = 'birthday day/month (from YYYY)';
      }
    });

    // --- 8) Scoring weights
    const baseWeight = 1.0;
    const relatedBonus = 0.08;
    const sourceTriggeredBonus = 0.15;
    const birthdayHalfLinkBonus = 0.20;
    const seededBonus = 0.04;
    const addressBonus = 0.12; // New bonus for address-derived numbers

    // --- 9) Build scores
    const scored = [];
    
    baseList.forEach(number => {
      // Base probability from history (0-1)
      const prob = this.history ? this.history.probability(number) : 0.5;
      let score = prob * baseWeight;
      let seeded = false;
      let addressDerived = false;

      // Related bonus
      if (related.has(number)) score += relatedBonus;

      // Birthday half link bonus
      if (bdayTriggered[number]) score += birthdayHalfLinkBonus;

      // Source group hit bonus
      sourceWindows.forEach((group, i) => {
        if (groupsHit[i] && group.includes(number)) {
          score += sourceTriggeredBonus;
        }
      });

      // Address-derived bonus
      if (this.isAddressDerived(number, sources)) {
        score += addressBonus;
        addressDerived = true;
      }

      // Seeded bonus (from hash)
      if (!related.has(number) && 
          !sourceWindows.some(group => group.includes(number))) {
        score += seededBonus;
        seeded = true;
      }

      // Build reason
      const reason = this.buildReason(number, {
        related: related.has(number),
        bdayTrigger: bdayTriggered[number],
        sourceWindows,
        groupsHit,
        seeded,
        addressDerived,
        sources
      });

      scored.push({
        number,
        score,
        prob,
        reason
      });
    });

    // --- 10) Sort and return top picks
    return scored
      .sort((a, b) => {
        if (a.score === b.score) return a.number.localeCompare(b.number);
        return b.score - a.score;
      })
      .slice(0, 12)
      .map(({ number, prob, reason }) => ({
        number,
        probability: prob,
        reason,
        confidence: Math.round(prob * 100) // Add confidence percentage
      }));
  }

  // Special address parsing function
  parseAddresses(sources) {
    const addressWindows = [];
    
    sources.forEach(source => {
      // Look for Singapore postal code pattern (6 digits)
      const postalMatch = source.match(/\b\d{6}\b/);
      if (postalMatch) {
        addressWindows.push(this.windows4(postalMatch[0]));
      }

      // Look for HDB block numbers (e.g., "Blk 123")
      const blockMatch = source.match(/blk?\s*(\d+)/i);
      if (blockMatch) {
        const blockNum = blockMatch[1].padStart(4, '0').slice(-4);
        addressWindows.push([blockNum]);
      }

      // Look for floor and unit numbers (#04-56)
      const unitMatch = source.match(/#(\d+)-(\d+)/);
      if (unitMatch) {
        const floor = unitMatch[1].padStart(2, '0');
        const unit = unitMatch[2].padStart(2, '0');
        addressWindows.push([floor + unit]);
      }

      // Extract all numbers from address
      const allNumbers = source.match(/\d+/g) || [];
      allNumbers.forEach(num => {
        if (num.length >= 4) {
          this.windows4(num).forEach(w => addressWindows.push([w]));
        } else {
          // Pad short numbers
          const padded = num.padStart(4, '0').slice(-4);
          addressWindows.push([padded]);
        }
      });
    });

    return addressWindows;
  }

  // Check if number is derived from address
  isAddressDerived(number, sources) {
    return sources.some(source => {
      const digits = this.onlyDigits(source);
      // Check if number appears as a window in any address number
      for (let i = 0; i <= digits.length - 4; i++) {
        if (digits.substring(i, i + 4) === number) return true;
      }
      return false;
    });
  }

  // Build human-readable reason
  buildReason(number, flags) {
    const parts = [];
    
    if (flags.related) parts.push('related to you');
    if (flags.bdayTrigger) parts.push(flags.bdayTrigger);
    if (flags.addressDerived) parts.push('from your address');
    
    // Check source group hits
    flags.sourceWindows.forEach((group, i) => {
      if (flags.groupsHit[i] && group.includes(number)) {
        parts.push('same source group as a hit');
      }
    });

    // Check phone number patterns
    flags.sources.forEach(s => {
      const digits = this.onlyDigits(s);
      if (digits.length === 8 && digits.includes(number)) {
        parts.push('from your phone number');
      }
    });

    if (flags.seeded) parts.push('seeded mix');
    if (parts.length === 0) parts.push('balanced mix');

    return parts.join(' • ');
  }

  // Helper: get current date in Singapore time
  isoDate() {
    const date = new Date();
    // Singapore is UTC+8
    const sgTime = new Date(date.getTime() + (8 * 60 * 60 * 1000));
    return sgTime.toISOString().split('T')[0];
  }

  // Helper: extract all numbers from a draw
  drawNumbersSet(draw) {
    const set = new Set([draw.first_prize, draw.second_prize, draw.third_prize]);
    (draw.starter_prizes || []).forEach(n => set.add(n));
    (draw.consolation_prizes || []).forEach(n => set.add(n));
    return set;
  }

  // Helper: keep only digits
  onlyDigits(str) {
    return str.replace(/\D/g, '');
  }

  // Helper: check if string is all digits
  isAllDigits(str) {
    return /^\d+$/.test(str);
  }

  // Helper: generate sliding 4-digit windows
  windows4(digits) {
    if (digits.length < 4) return [];
    const windows = new Set();
    for (let i = 0; i <= digits.length - 4; i++) {
      windows.add(digits.substring(i, i + 4));
    }
    return Array.from(windows).sort();
  }
}

// Mock history class (replace with actual Supabase data)
class DrawHistory {
  constructor(data) {
    this.draws = data || [];
    this.frequency = this.buildFrequency();
  }

  buildFrequency() {
    const freq = {};
    this.draws.forEach(draw => {
      const allNumbers = [
        draw.first_prize,
        draw.second_prize,
        draw.third_prize,
        ...(draw.starter_prizes || []),
        ...(draw.consolation_prizes || [])
      ];
      allNumbers.forEach(num => {
        freq[num] = (freq[num] || 0) + 1;
      });
    });
    return freq;
  }

  probability(number) {
    const maxFreq = Math.max(...Object.values(this.frequency));
    const freq = this.frequency[number] || 0;
    // Normalize to 0.3-0.8 range
    return 0.3 + (freq / maxFreq) * 0.5;
  }
}

export default PredictionEngine;
