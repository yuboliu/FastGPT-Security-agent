import { type AppSchemaType } from '@fastgpt/global/core/app/type';
import { MongoAppVersion } from './schema';
import { Types } from '../../../common/mongo';
import { normalizeLegacyWorkflowData } from '../../workflow/legacyCompatibility';

export const getAppLatestVersion = async (appId: string, app?: AppSchemaType) => {
  const version = await MongoAppVersion.findOne({
    appId,
    isPublish: true
  })
    .sort({
      time: -1
    })
    .lean();

  if (version) {
    // 历史遗留数据归一，避免严格 schema 解析失败（valueType 'array' / 残留输出哨兵行）
    normalizeLegacyWorkflowData(version.nodes as unknown[]);
    return {
      versionId: String(version._id),
      versionName: version.versionName,
      nodes: version.nodes,
      edges: version.edges,
      chatConfig: version.chatConfig || app?.chatConfig || {}
    };
  }
  // 历史遗留数据归一，避免严格 schema 解析失败
  normalizeLegacyWorkflowData(app?.modules as unknown[]);
  return {
    versionId: app?.pluginData?.nodeVersion,
    versionName: app?.name,
    nodes: app?.modules || [],
    edges: app?.edges || [],
    chatConfig: app?.chatConfig || {}
  };
};

export const getAppVersionById = async ({
  appId,
  versionId,
  app
}: {
  appId: string;
  versionId?: string;
  app?: AppSchemaType;
}) => {
  // 检查 versionId 是否符合 ObjectId 格式
  if (versionId && Types.ObjectId.isValid(versionId)) {
    const version = await MongoAppVersion.findOne({
      _id: versionId,
      appId
    }).lean();

    if (version) {
      // 历史遗留数据归一，避免严格 schema 解析失败
      normalizeLegacyWorkflowData(version.nodes as unknown[]);
      return {
        versionId: String(version._id),
        versionName: version.versionName,
        nodes: version.nodes,
        edges: version.edges,
        chatConfig: version.chatConfig || app?.chatConfig || {}
      };
    }
  }

  // If the version does not exist, the latest version is returned
  return getAppLatestVersion(appId, app);
};

export const checkIsLatestVersion = async ({
  appId,
  versionId
}: {
  appId: string;
  versionId: string;
}) => {
  if (!Types.ObjectId.isValid(versionId)) {
    return false;
  }
  const version = await MongoAppVersion.findOne(
    {
      appId,
      isPublish: true,
      _id: { $gt: versionId }
    },
    '_id'
  ).lean();

  return !version;
};
