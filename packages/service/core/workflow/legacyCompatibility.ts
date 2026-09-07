import {
  NodeOutputKeyEnum,
  WorkflowIOValueTypeEnum
} from '@fastgpt/global/core/workflow/constants';

/**
 * 历史遗留数据兼容（读/写入口共用）：
 *
 * 早期版本或外部工具写入的工作流节点数据可能出现两类 FastGPT 不再接受的值：
 *  1. 裸 `valueType: 'array'` —— 官方合法枚举仅为细分的
 *     arrayString / arrayNumber / arrayBoolean / arrayObject / arrayAny；
 *  2. 误持久化的“新增输出”哨兵行（key === system_addOutputParam，缺少必填 id/type）。
 *
 * 这类数据会导致严格 schema 解析（如 GET /api/core/app/detail 的
 * GetAppDetailResponseSchema）抛出 Zod invalid_value 而返回 500。
 * 在读取/保存 App 前调用本函数做就地归一，保持历史工作流可用：
 *  - valueType 'array' → arrayObject（历史字段承载的均为对象数组语义）；
 *  - 移除 outputs 中残留的哨兵行（与编辑器保存行为及运行时 dispatch 一致）。
 */
export function normalizeLegacyWorkflowData(modules?: unknown[]): unknown[] | undefined {
  if (!Array.isArray(modules)) return modules;

  modules.forEach((node) => {
    if (!node || typeof node !== 'object') return;
    const nodeObj = node as {
      inputs?: Array<{ valueType?: unknown }>;
      outputs?: Array<{ key?: unknown; valueType?: unknown }>;
    };

    (['inputs', 'outputs'] as const).forEach((kind) => {
      const list = nodeObj[kind];
      if (!Array.isArray(list)) return;
      list.forEach((item) => {
        if (item && typeof item === 'object' && item.valueType === 'array') {
          item.valueType = WorkflowIOValueTypeEnum.arrayObject;
        }
      });
    });

    if (Array.isArray(nodeObj.outputs)) {
      nodeObj.outputs = nodeObj.outputs.filter(
        (item) => item?.key !== NodeOutputKeyEnum.addOutputParam
      );
    }
  });

  return modules;
}
