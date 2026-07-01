import { FlowNodeInputTypeEnum, FlowNodeOutputTypeEnum, FlowNodeTypeEnum } from '../../node/constant';
import { type FlowNodeTemplateType } from '../../type/node';
import { WorkflowIOValueTypeEnum, FlowNodeTemplateTypeEnum } from '../../constants';
import { Output_Template_Error_Message } from '../output';
import { i18nT } from '../../../../common/i18n/utils';

export const AuditLoggerNode: FlowNodeTemplateType = {
  id: FlowNodeTypeEnum.auditLogger,
  templateType: FlowNodeTemplateTypeEnum.tools,
  flowNodeType: FlowNodeTypeEnum.auditLogger,
  showSourceHandle: true,
  showTargetHandle: true,
  avatar: 'core/workflow/template/textConcat',
  avatarLinear: 'core/workflow/template/textConcatLinear',
  colorSchema: 'gray',
  name: i18nT('workflow:audit_logger'),
  intro: i18nT('workflow:intro_audit_logger'),
  showStatus: false,
  isTool: true,
  catchError: false,
  inputs: [
    {
      key: 'system_auditRecord',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.JSONEditor],
      valueType: WorkflowIOValueTypeEnum.object,
      label: i18nT('workflow:audit_logger_record'),
      required: true
    }
  ],
  outputs: [
    {
      id: 'auditId',
      key: 'auditId',
      label: i18nT('workflow:audit_logger_audit_id'),
      valueType: WorkflowIOValueTypeEnum.string,
      type: FlowNodeOutputTypeEnum.static
    },
    Output_Template_Error_Message
  ]
};
