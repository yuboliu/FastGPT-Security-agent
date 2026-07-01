import { DispatchNodeResponseKeyEnum } from '@fastgpt/global/core/workflow/runtime/constants';
import type { ModuleDispatchProps } from '@fastgpt/global/core/workflow/runtime/type';
import type { DispatchNodeResultType } from '@fastgpt/global/core/workflow/runtime/type';
import { axios } from '../../../../common/api/axios';
import { serviceEnv } from '../../../../env';
import { getErrText } from '@fastgpt/global/common/error/utils';

type Props = ModuleDispatchProps<{
  system_privateIp: string;
  system_ciType: string;
}>;

type Response = DispatchNodeResultType<{
  assetFound: boolean;
  assetInfo: Record<string, any>;
  assetName: string;
}>;

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getCmdbToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const baseUrl = serviceEnv.CMDB_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000';
  const username = serviceEnv.CMDB_API_USERNAME || 'admin';
  const password = serviceEnv.CMDB_API_PASSWORD || '123456';

  const res = await axios.post(`${baseUrl}/api/login`, { username, password });
  const token = res.data?.token;
  if (!token) {
    throw new Error('CMDB login failed: no token returned');
  }
  // VeOps JWT default expires in 7 days; keep a safe buffer.
  cachedToken = { token, expiresAt: Date.now() + 6 * 24 * 60 * 60 * 1000 };
  return token;
}

export const dispatchCmdbLookup = async (props: Props): Promise<Response> => {
  const {
    params: { system_privateIp = '', system_ciType = 'server' }
  } = props;

  const baseUrl = serviceEnv.CMDB_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000';
  const ip = String(system_privateIp).trim();
  const ciType = String(system_ciType || 'server').trim();

  if (!ip) {
    return {
      data: { assetFound: false, assetInfo: {}, assetName: '' },
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
        error: 'privateIp is required'
      }
    };
  }

  try {
    const token = await getCmdbToken();
    const query = `_type:${ciType},private_ip:${ip}`;
    const res = await axios.get(`${baseUrl}/api/v0.1/ci/s`, {
      headers: { 'Access-Token': token },
      params: { q: query }
    });

    const results = res.data?.result || [];
    const asset = results[0] || null;

    return {
      data: {
        assetFound: !!asset,
        assetInfo: asset || {},
        assetName: asset?.server_name || asset?.name || asset?.private_ip || ''
      },
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
        customOutputs: {
          assetFound: !!asset,
          assetCount: results.length
        }
      }
    };
  } catch (error) {
    return {
      data: { assetFound: false, assetInfo: {}, assetName: '' },
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
        error: getErrText(error, 'CMDB lookup failed')
      }
    };
  }
};
