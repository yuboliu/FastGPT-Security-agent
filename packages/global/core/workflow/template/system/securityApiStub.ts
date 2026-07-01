import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '../../node/constant';
import { type FlowNodeTemplateType } from '../../type/node';
import { WorkflowIOValueTypeEnum, FlowNodeTemplateTypeEnum } from '../../constants';
import { Output_Template_Error_Message } from '../output';
import { i18nT } from '../../../../common/i18n/utils';

export const SecurityApiStubNode: FlowNodeTemplateType = {
  id: FlowNodeTypeEnum.securityApiStub,
  templateType: FlowNodeTemplateTypeEnum.tools,
  flowNodeType: FlowNodeTypeEnum.securityApiStub,
  showSourceHandle: true,
  showTargetHandle: true,
  avatar: 'core/workflow/template/httpRequest',
  avatarLinear: 'core/workflow/template/httpRequestLinear',
  colorSchema: 'purple',
  name: i18nT('workflow:security_api_stub'),
  intro: i18nT('workflow:intro_security_api_stub'),
  showStatus: true,
  isTool: true,
  catchError: false,
  inputs: [
    {
      key: 'system_sourceIp',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.input],
      valueType: WorkflowIOValueTypeEnum.string,
      label: i18nT('workflow:security_api_stub_source_ip'),
      required: true
    },
    {
      key: 'system_apiType',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.select],
      valueType: WorkflowIOValueTypeEnum.string,
      label: i18nT('workflow:security_api_stub_api_type'),
      value: 'all',
      list: [
        { label: 'edr', value: 'edr' },
        { label: 'ndr', value: 'ndr' },
        { label: 'firewall', value: 'firewall' },
        { label: 'all', value: 'all' }
      ]
    },
    {
      key: 'system_timeRangeHours',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.numberInput],
      valueType: WorkflowIOValueTypeEnum.number,
      label: i18nT('workflow:security_api_stub_time_range'),
      value: 24,
      min: 1,
      max: 168
    }
  ],
  outputs: [
    {
      id: 'edrLogs',
      key: 'edrLogs',
      label: i18nT('workflow:security_api_stub_edr_logs'),
      valueType: WorkflowIOValueTypeEnum.arrayObject,
      type: FlowNodeOutputTypeEnum.static
    },
    {
      id: 'ndrLogs',
      key: 'ndrLogs',
      label: i18nT('workflow:security_api_stub_ndr_logs'),
      valueType: WorkflowIOValueTypeEnum.arrayObject,
      type: FlowNodeOutputTypeEnum.static
    },
    {
      id: 'firewallLogs',
      key: 'firewallLogs',
      label: i18nT('workflow:security_api_stub_firewall_logs'),
      valueType: WorkflowIOValueTypeEnum.arrayObject,
      type: FlowNodeOutputTypeEnum.static
    },
    Output_Template_Error_Message
  ]
};
