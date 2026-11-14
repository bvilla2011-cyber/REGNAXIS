export const DEFAULT_RULES = Object.freeze({
  dayHours: 24,
  victoryShare: 0.5,
  victoryHoldDays: 7,
  hardcoreHoldDays: 14,
  annexBase: 0.22,
  resistanceWeight: 0.6,
  militiaThreshold: 0.6,
  militiaDamage: 0.006,
  growthBase: 0.024,
  fiscalDrag: 0.045,
  inflationDrag: 0.35,
  debtInterest: 0.04,
  annualPopulationGrowth: 0.007,
  socialMigrationFactor: 0.002,
  baseResearchRate: 0.01,
  annualEquipmentDecay: 0.04,
  underfundingDecay: 0.15,
  moraleCaptureGain: 1.5,
  moraleLoss: 2,
  trainingParallelBase: 1,
  trainingPopulationStep: 10_000_000
});

export function rulesWith(overrides = {}) {
  const rules = {...DEFAULT_RULES, ...overrides};
  for (const [key, value] of Object.entries(rules)) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`Invalid rule: ${key}`);
  }
  return rules;
}
