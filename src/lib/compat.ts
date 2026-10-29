import { AnimalProfile } from '../types';

// Rule-based "compatibility science". No AI, no API. Same pair always gives the same result.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const pick = <T,>(arr: T[], seed: number, o = 0): T => arr[(seed + o * 7919) % arr.length];
const first = (n: string) => n.split(' ').filter(w => !/^(sir|lord|lady|madame|princess|captain|dr|king|queen)$/i.test(w))[0] || n;
const short = (t: string, n = 38) => (t.length > n ? t.slice(0, n).trim() + '…' : t);

export interface BreakupReport {
  score: number; reasons: string[]; verdict: string; lastsFor: string; cause: string; certNo: string; steps: number;
}

export function generateReport(a: AnimalProfile, b: AnimalProfile): BreakupReport {
  const [x, y] = [a, b].sort((p, q) => p.id.localeCompare(q.id));
  const seed = hash(x.id + '|' + y.id);
  const A = first(a.displayName), B = first(b.displayName);
  const tA = a.personalityTraits?.[0] || 'Mysterious', tB = b.personalityTraits?.[0] || 'Mysterious';
  const iA = a.interests?.[0] || 'staring at walls', iB = b.interests?.[0] || 'staring at walls';
  const fA = short(a.favouriteFood || 'snacks'), fB = short(b.favouriteFood || 'snacks');
  const sA = String(a.species).toLowerCase(), sB = String(b.species).toLowerCase();

  const pool = [
    `${A} is "${tA}". ${B} is "${tB}". Researchers have never seen this end well.`,
    `${A} lives for "${short(iA)}". ${B} lives for "${short(iB)}". These cannot share a weekend.`,
    `Dinner: ${A} wants ${fA}. ${B} wants ${fB}. A diplomatic incident is expected.`,
    `A ${sA} and a ${sB} walk into a relationship. Only one of them walks out confused.`,
    `Both pets claim the best spot on the sofa. Neither will ever concede.`,
    `${A} texts back in 3 seconds. ${B} replies after a nap. Trust issues in 2 days.`,
    `Our sniff-o-meter detected 14 red flags and one suspicious sock.`,
    `Zoomies are scheduled at conflicting times (3:00 AM vs 3:01 AM).`,
  ];
  const reasons = [0, 1, 2].map(i => pool[(seed + i * 3) % pool.length]);
  if (new Set(reasons).size < 3) reasons[2] = pool[(seed + 5) % pool.length];

  return {
    score: seed % 14, // never above 13%
    reasons: Array.from(new Set(reasons)),
    verdict: pick([
      'Match approved. Doomed on arrival.', 'Legally a couple. Emotionally a disaster.',
      'Approved by a court that does not care.', 'Cute photos now, therapy later.',
    ], seed),
    lastsFor: pick(['4 minutes', '11 minutes', '38 minutes', '2 hours', '1 nap', '3 treats', 'until dinner', '1 zoomie'], seed, 1),
    cause: pick([
      'Fight over a single squeaky toy', 'Someone looked at the other\'s food',
      'Disagreement about the thermostat of the sunbeam', 'Unexplained 3 AM screaming',
      'Left on read for 4 seconds', 'Stole a sock and blamed the other',
    ], seed, 2),
    certNo: 'PM-' + (seed % 900000 + 100000),
    steps: 7 + (seed % 5),
  };
}
