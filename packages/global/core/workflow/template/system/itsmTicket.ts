import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '../../node/constant';
import { type FlowNodeTemplateType } from '../../type/node';
import { WorkflowIOValueTypeEnum, FlowNodeTemplateTypeEnum } from '../../constants';
import { Output_Template_Error_Message } from '../output';
import { i18nT } from '../../../../common/i18n/utils';

export const ItsmTicketNode: FlowNodeTemplateType = {
  id: FlowNodeTypeEnum.itsmTicket,
  templateType: FlowNodeTemplateTypeEnum.tools,
  flowNodeType: FlowNodeTypeEnum.itsmTicket,
  showSourceHandle: true,
  showTargetHandle: true,
  avatar: 'core/workflow/template/httpRequest',
  avatarLinear: 'core/workflow/template/httpRequestLinear',
  colorSchema: 'green',
  name: i18nT('workflow:itsm_ticket'),
  intro: i18nT('workflow:intro_itsm_ticket'),
  showStatus: true,
  isTool: true,
  catchError: true,
  inputs: [
    {
      key: 'system_ticketTitle',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.input],
      valueType: WorkflowIOValueTypeEnum.string,
      label: i18nT('workflow:itsm_ticket_title'),
      required: true
    },
    {
      key: 'system_ticketContent',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.textarea],
      valueType: WorkflowIOValueTypeEnum.string,
      label: i18nT('workflow:itsm_ticket_content'),
      required: true
    },
    {
      key: 'system_priority',
      renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.numberInput],
      valueType: WorkflowIOValueTypeEnum.number,
      label: i18nT('workflow:itsm_ticket_priority'),
      value: 3,
      min: 1,
      max: 5
    }
  ],
  outputs: [
    {
      id: 'ticketId',
      key: 'ticketId',
      label: i18nT('workflow:itsm_ticket_id'),
      valueType: WorkflowIOValueTypeEnum.number,
      type: FlowNodeOutputTypeEnum.static
    },
    {
      id: 'ticketUrl',
      key: 'ticketUrl',
      label: i18nT('workflow:itsm_ticket_url'),
      valueType: WorkflowIOValueTypeEnum.string,
      type: FlowNodeOutputTypeEnum.static
    },
    {
      id: 'ticketStatus',
      key: 'ticketStatus',
      label: i18nT('workflow:itsm_ticket_status'),
      valueType: WorkflowIOValueTypeEnum.string,
      type: FlowNodeOutputTypeEnum.static
    },
    Output_Template_Error_Message
  ]
};
