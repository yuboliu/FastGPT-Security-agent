import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '../../node/constant';
import { type FlowNodeTemplateType } from '../../type/node';
import { WorkflowIOValueTypeEnum, FlowNodeTemplateTypeEnum } from '../../constants';
import { Output_Template_Error_Message } from '../output';
import { i18nT } from '../../../../common/i18n/utils';

export const RiskScorerNode: FlowNodeTemplateType = {
  id: FlowNodeTypeEnum.riskScorer,
  templateType: FlowNodeTemplateTypeEnum.tools,
  flowNodeType: FlowNodeTypeEnum.riskScorer,
  showSourceHandle: true,
  showTargetHandle: true,
  avatar: 'core/workflow/template/ifelse',
  avatarLinear: 'core/workflow/template/ifelseLinear',
  colorSchema: 'coral',
  name: i18nT('workflow:risk_scorer'),
  intro: i18nT('workflow:intro_risk_scorer'),
  showStatus: true,
  isTool: true,
  catchError: false,
  inputs: [
    {
      key: 'system_alertSeverity',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.select],
      valueType: WorkflowIOValueTypeEnum.string,
      label: i18nT('workflow:risk_scorer_alert_severity'),
      required: true,
      value: 'medium',
      list: [
        { label: 'critical', value: 'critical' },
        { label: 'high', value: 'high' },
        { label: 'medium', value: 'medium' },
        { label: 'low', value: 'low' }
      ]
    },
    {
      key: 'system_assetCriticality',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.select],
      valueType: WorkflowIOValueTypeEnum.string,
      label: i18nT('workflow:risk_scorer_asset_criticality'),
      required: true,
      value: 'medium',
      list: [
        { label: 'critical', value: 'critical' },
        { label: 'high', value: 'high' },
        { label: 'medium', value: 'medium' },
        { label: 'low', value: 'low' }
      ]
    },
    {
      key: 'system_hasExploit',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.switch],
      valueType: WorkflowIOValueTypeEnum.boolean,
      label: i18nT('workflow:risk_scorer_has_exploit'),
      required: true,
      value: false
    },
    {
      key: 'system_isInternetFacing',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.switch],
      valueType: WorkflowIOValueTypeEnum.boolean,
      label: i18nT('workflow:risk_scorer_internet_facing'),
      required: true,
      value: false
    },
    {
      key: 'system_dataClassification',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.select],
      valueType: WorkflowIOValueTypeEnum.string,
      label: i18nT('workflow:risk_scorer_data_classification'),
      value: 'internal',
      list: [
        { label: 'public', value: 'public' },
        { label: 'internal', value: 'internal' },
        { label: 'confidential', value: 'confidential' },
        { label: 'secret', value: 'secret' }
      ]
    }
  ],
  outputs: [
    {
      id: 'riskLevel',
      key: 'riskLevel',
      label: i18nT('workflow:risk_scorer_risk_level'),
      valueType: WorkflowIOValueTypeEnum.string,
      type: FlowNodeOutputTypeEnum.static
    },
    {
      id: 'riskScore',
      key: 'riskScore',
      label: i18nT('workflow:risk_scorer_risk_score'),
      valueType: WorkflowIOValueTypeEnum.number,
      type: FlowNodeOutputTypeEnum.static
    },
    {
      id: 'riskFactors',
      key: 'riskFactors',
      label: i18nT('workflow:risk_scorer_risk_factors'),
      valueType: WorkflowIOValueTypeEnum.arrayString,
      type: FlowNodeOutputTypeEnum.static
    },
    Output_Template_Error_Message
  ]
};
