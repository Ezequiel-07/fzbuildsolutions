import type { HourBreakdown, SoftwareModule } from "../types";

export interface CalculationInput {
  modules: SoftwareModule[];
  hoursBreakdown: HourBreakdown;
  hourlyRate: number;
  internalHourlyCost: number;
  contingencyPercent: number;
  discount?: number;
  cloudInfrastructureMonthly?: number;
  deliveryWeeks?: number;
}

export interface CalculationResult {
  totalScreens: number;
  totalModuleHours: number;
  totalDisciplinesHours: number;
  totalHours: number;
  contingencyHours: number;
  effectiveBillableHours: number;
  rawDevelopmentPrice: number;
  totalPrice: number;
  totalInternalCost: number;
  projectedProfit: number;
  projectedMarginPercent: number;
}

export function calculateEstimateMetrics(
  input: CalculationInput,
): CalculationResult {
  const totalScreens = input.modules.reduce(
    (acc, m) => acc + (Number(m.screensCount) || 0),
    0,
  );

  const totalModuleHours = input.modules.reduce(
    (acc, m) => acc + (Number(m.hoursEstimated) || 0),
    0,
  );

  const totalDisciplinesHours = Object.values(input.hoursBreakdown).reduce(
    (acc, h) => acc + (Number(h) || 0),
    0,
  );

  const totalHours = totalDisciplinesHours;
  const contingencyPercent = Math.max(0, input.contingencyPercent || 0);
  const contingencyHours = Math.round(totalHours * (contingencyPercent / 100));
  const effectiveBillableHours = totalHours + contingencyHours;

  const hourlyRate = Math.max(0, input.hourlyRate || 0);
  const discount = Math.max(0, input.discount || 0);
  const rawDevelopmentPrice = effectiveBillableHours * hourlyRate;
  const totalPrice = Math.max(0, rawDevelopmentPrice - discount);

  const internalHourlyCost = Math.max(0, input.internalHourlyCost || 0);
  const cloudMonthly = Math.max(0, input.cloudInfrastructureMonthly || 0);
  const deliveryWeeks = Math.max(0, input.deliveryWeeks || 0);

  const totalInternalCost =
    effectiveBillableHours * internalHourlyCost +
    cloudMonthly * (deliveryWeeks / 4);

  const projectedProfit = totalPrice - totalInternalCost;
  const projectedMarginPercent =
    totalPrice > 0 ? Math.round((projectedProfit / totalPrice) * 100) : 0;

  return {
    totalScreens,
    totalModuleHours,
    totalDisciplinesHours,
    totalHours,
    contingencyHours,
    effectiveBillableHours,
    rawDevelopmentPrice,
    totalPrice,
    totalInternalCost,
    projectedProfit,
    projectedMarginPercent,
  };
}
