import type { NextApiRequest } from 'next';
import { authApp } from '@fastgpt/service/support/permission/app/auth';
import { NextAPI } from '@/service/middleware/entry';
import { ReadPermissionVal } from '@fastgpt/global/support/permission/constant';
import { CommonErrEnum } from '@fastgpt/global/common/error/code/common';
import { rewriteAppWorkflowToDetail } from '@fastgpt/service/core/app/utils';
import { normalizeLegacyWorkflowData } from '@fastgpt/service/core/workflow/legacyCompatibility';
import { getLocale } from '@fastgpt/service/common/middle/i18n';
import { parseApiInput } from '@fastgpt/service/common/zod/requestParseError';
import {
  GetAppDetailQuerySchema,
  GetAppDetailResponseSchema,
  type GetAppDetailResponseType
} from '@fastgpt/global/openapi/core/app/common/api';

/* 获取应用详情 */
async function handler(req: NextApiRequest): Promise<GetAppDetailResponseType> {
  const { appId } = parseApiInput({
    req,
    querySchema: GetAppDetailQuerySchema
  }).query;

  if (!appId) {
    Promise.reject(CommonErrEnum.missingParams);
  }
  // 凭证校验
  const { app, teamId, isRoot } = await authApp({
    req,
    authToken: true,
    appId,
    per: ReadPermissionVal
  });

  // 历史遗留数据归一，避免严格 schema 解析失败（valueType 'array' / 残留输出哨兵行）
  normalizeLegacyWorkflowData(app.modules as unknown[]);

  await rewriteAppWorkflowToDetail({
    nodes: app.modules,
    teamId,
    ownerTmbId: app.tmbId,
    isRoot,
    lang: getLocale(req)
  });

  if (!app.permission.hasWritePer) {
    return GetAppDetailResponseSchema.parse({
      ...app,
      modules: [],
      edges: []
    });
  }

  return GetAppDetailResponseSchema.parse(app);
}

export default NextAPI(handler);
