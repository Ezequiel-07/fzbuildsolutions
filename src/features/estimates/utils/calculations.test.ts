import { describe, it, expect } from "vitest";
import { calculateEstimateMetrics } from "./calculations";
import { ESTIMATE_PRESETS } from "../constants/presets";

describe("Estimates Calculation Engine", () => {
  it("calculates correct hours breakdown and totals", () => {
    const result = calculateEstimateMetrics({
      modules: [
        {
          id: "m1",
          name: "Auth",
          description: "Login",
          screensCount: 4,
          complexity: "medium",
          hoursEstimated: 20,
        },
        {
          id: "m2",
          name: "Dashboard",
          description: "Charts",
          screensCount: 3,
          complexity: "high",
          hoursEstimated: 40,
        },
      ],
      hoursBreakdown: {
        uiUxDesign: 20,
        frontend: 40,
        backend: 30,
        integrations: 10,
        qaTesting: 15,
        devopsDeploy: 5,
      },
      hourlyRate: 150,
      internalHourlyCost: 60,
      contingencyPercent: 10,
      discount: 0,
      cloudInfrastructureMonthly: 300,
      deliveryWeeks: 8,
    });

    expect(result.totalScreens).toBe(7);
    expect(result.totalHours).toBe(120); // 20+40+30+10+15+5
    expect(result.contingencyHours).toBe(12); // 10% of 120
    expect(result.effectiveBillableHours).toBe(132); // 120 + 12

    // Price: 132 * 150 = 19,800
    expect(result.rawDevelopmentPrice).toBe(19800);
    expect(result.totalPrice).toBe(19800);

    // Internal cost: 132 * 60 + 300 * (8/4) = 7,920 + 600 = 8,520
    expect(result.totalInternalCost).toBe(8520);

    // Profit: 19,800 - 8,520 = 11,280
    expect(result.projectedProfit).toBe(11280);

    // Margin: round(11280 / 19800 * 100) = 57%
    expect(result.projectedMarginPercent).toBe(57);
  });

  it("applies discounts properly without producing negative prices", () => {
    const result = calculateEstimateMetrics({
      modules: [],
      hoursBreakdown: {
        uiUxDesign: 10,
        frontend: 10,
        backend: 0,
        integrations: 0,
        qaTesting: 0,
        devopsDeploy: 0,
      },
      hourlyRate: 100,
      internalHourlyCost: 50,
      contingencyPercent: 0,
      discount: 5000, // excessive discount
    });

    expect(result.totalPrice).toBe(0);
  });

  it("validates all enterprise software presets", () => {
    expect(ESTIMATE_PRESETS.length).toBeGreaterThanOrEqual(3);

    for (const preset of ESTIMATE_PRESETS) {
      expect(preset.name).toBeTruthy();
      expect(preset.platforms.length).toBeGreaterThan(0);
      expect(preset.modules.length).toBeGreaterThan(0);
      expect(preset.deliveryWeeks).toBeGreaterThan(0);
      expect(preset.sprintsCount).toBeGreaterThan(0);
      expect(preset.warrantyDays).toBeGreaterThanOrEqual(30);

      const totalDisciplineHours = Object.values(preset.hoursBreakdown).reduce(
        (a, b) => a + b,
        0,
      );
      expect(totalDisciplineHours).toBeGreaterThan(0);
    }
  });
});
