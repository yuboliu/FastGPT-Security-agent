import { DispatchNodeResponseKeyEnum } from '@fastgpt/global/core/workflow/runtime/constants';
import type { ModuleDispatchProps } from '@fastgpt/global/core/workflow/runtime/type';
import type { DispatchNodeResultType } from '@fastgpt/global/core/workflow/runtime/type';

type Severity = 'critical' | 'high' | 'medium' | 'low';

type Props = ModuleDispatchProps<{
  system_alertSeverity: Severity | string;
  system_assetCriticality: Severity | string;
  system_hasExploit: boolean;
  system_isInternetFacing: boolean;
  system_dataClassification: string;
}>;

type Response = DispatchNodeResultType<{
  riskLevel: string;
  riskScore: number;
  riskFactors: string[];
}>;

const scoreMap: Record<Severity, number> = {
  critical: 10,
  high: 7,
  medium: 4,
  low: 1
};

const dataClassificationMap: Record<string, number> = {
  public: 1,
  internal: 1.1,
  confidential: 1.2,
  secret: 1.3
};

export const dispatchRiskScorer = (props: Props): Response => {
  const {
    params: {
      system_alertSeverity = 'low',
      system_assetCriticality = 'low',
      system_hasExploit = false,
      system_isInternetFacing = false,
      system_dataClassification = 'internal'
    }
  } = props;

  const severityScore = scoreMap[(system_alertSeverity as Severity) || 'low'] ?? 1;
  const assetScore = scoreMap[(system_assetCriticality as Severity) || 'low'] ?? 1;

  let score = (severityScore + assetScore) * 5;
  const factors: string[] = [];

  if (severityScore >= 7) {
    factors.push('告警严重度高');
  }
  if (assetScore >= 7) {
    factors.push('资产重要性强');
  }

  if (system_hasExploit) {
    score *= 1.5;
    factors.push('存在已知利用方式');
  }
  if (system_isInternetFacing) {
    score *= 1.3;
    factors.push('资产暴露在互联网');
  }

  const dataMultiplier = dataClassificationMap[(system_dataClassification as string) || 'internal'] ?? 1;
  if (dataMultiplier > 1) {
    factors.push(`数据分级：${system_dataClassification}`);
  }
  score *= dataMultiplier;

  score = Math.min(100, Math.max(0, Math.round(score)));

  let riskLevel: string;
  if (score >= 70) {
    riskLevel = 'high';
  } else if (score >= 40) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  return {
    data: {
      riskLevel,
      riskScore: score,
      riskFactors: factors
    },
    [DispatchNodeResponseKeyEnum.nodeResponse]: {
      customOutputs: {
        riskLevel,
        riskScore: score,
        riskFactors: factors
      }
    }
  };
};
