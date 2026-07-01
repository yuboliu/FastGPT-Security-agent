import { DispatchNodeResponseKeyEnum } from '@fastgpt/global/core/workflow/runtime/constants';
import type { ModuleDispatchProps } from '@fastgpt/global/core/workflow/runtime/type';
import type { DispatchNodeResultType } from '@fastgpt/global/core/workflow/runtime/type';
import { MongoSecurityAudit } from '../../audit/schema';

type Props = ModuleDispatchProps<{
  system_auditRecord: Record<string, any>;
}>;

type Response = DispatchNodeResultType<{
  auditId: string;
}>;

export const dispatchAuditLogger = async (props: Props): Promise<Response> => {
  const {
    chatId,
    uid,
    runningAppInfo,
    params: { system_auditRecord = {} }
  } = props;

  const record = {
    workflowRunId: chatId || 'unknown',
    userId: uid || 'unknown',
    teamId: runningAppInfo?.teamId,
    timestamp: new Date(),
    metadata: system_auditRecord
  };

  const doc = await MongoSecurityAudit.create(record);

  return {
    data: {
      auditId: String(doc._id)
    },
    [DispatchNodeResponseKeyEnum.nodeResponse]: {
      customOutputs: {
        auditId: String(doc._id),
        recordedAt: record.timestamp.toISOString()
      }
    }
  };
};
