import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '../../node/constant';
import { type FlowNodeTemplateType } from '../../type/node';
import { WorkflowIOValueTypeEnum, FlowNodeTemplateTypeEnum } from '../../constants';
import { Output_Template_Error_Message } from '../output';
import { i18nT } from '../../../../common/i18n/utils';

export const CmdbLookupNode: FlowNodeTemplateType = {
  id: FlowNodeTypeEnum.cmdbLookup,
  templateType: FlowNodeTemplateTypeEnum.tools,
  flowNodeType: FlowNodeTypeEnum.cmdbLookup,
  showSourceHandle: true,
  showTargetHandle: true,
  avatar: 'core/workflow/template/datasetSearch',
  avatarLinear: 'core/workflow/template/datasetSearchLinear',
  colorSchema: 'blue',
  name: i18nT('workflow:cmdb_lookup'),
  intro: i18nT('workflow:intro_cmdb_lookup'),
  showStatus: true,
  isTool: true,
  catchError: true,
  inputs: [
    {
      key: 'system_privateIp',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.input],
      valueType: WorkflowIOValueTypeEnum.string,
      label: i18nT('workflow:cmdb_lookup_private_ip'),
      required: true
    },
    {
      key: 'system_ciType',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.input],
      valueType: WorkflowIOValueTypeEnum.string,
      label: i18nT('workflow:cmdb_lookup_ci_type'),
      value: 'server'
    }
  ],
  outputs: [
    {
      id: 'assetFound',
      key: 'assetFound',
      label: i18nT('workflow:cmdb_lookup_asset_found'),
      valueType: WorkflowIOValueTypeEnum.boolean,
      type: FlowNodeOutputTypeEnum.static
    },
    {
      id: 'assetInfo',
      key: 'assetInfo',
      label: i18nT('workflow:cmdb_lookup_asset_info'),
      valueType: WorkflowIOValueTypeEnum.object,
      type: FlowNodeOutputTypeEnum.static
    },
    {
      id: 'assetName',
      key: 'assetName',
      label: i18nT('workflow:cmdb_lookup_asset_name'),
      valueType: WorkflowIOValueTypeEnum.string,
      type: FlowNodeOutputTypeEnum.static
    },
    Output_Template_Error_Message
  ]
};
