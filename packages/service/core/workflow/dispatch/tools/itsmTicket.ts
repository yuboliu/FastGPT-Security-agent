import { DispatchNodeResponseKeyEnum } from '@fastgpt/global/core/workflow/runtime/constants';
import type { ModuleDispatchProps } from '@fastgpt/global/core/workflow/runtime/type';
import type { DispatchNodeResultType } from '@fastgpt/global/core/workflow/runtime/type';
import { axios } from '../../../../common/api/axios';
import { serviceEnv } from '../../../../env';
import { getErrText } from '@fastgpt/global/common/error/utils';

type Props = ModuleDispatchProps<{
  system_ticketTitle: string;
  system_ticketContent: string;
  system_priority: number;
}>;

type Response = DispatchNodeResultType<{
  ticketId: number;
  ticketUrl: string;
  ticketStatus: string;
}>;

function getBasicAuth(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

async function initGlpiSession(baseUrl: string, appToken: string, auth: string): Promise<string> {
  const res = await axios.get(`${baseUrl}/apirest.php/initSession`, {
    headers: {
      'App-Token': appToken,
      Authorization: auth
    }
  });
  const sessionToken = res.data?.session_token;
  if (!sessionToken) {
    throw new Error(`GLPI initSession failed: ${JSON.stringify(res.data)}`);
  }
  return sessionToken;
}

export const dispatchItsmTicket = async (props: Props): Promise<Response> => {
  const {
    params: {
      system_ticketTitle = '',
      system_ticketContent = '',
      system_priority = 3
    }
  } = props;

  const baseUrl = serviceEnv.ITSM_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080';
  const username = serviceEnv.ITSM_API_USERNAME || 'glpi';
  const password = serviceEnv.ITSM_API_PASSWORD || 'glpi';
  const appToken = serviceEnv.ITSM_APP_TOKEN || '';

  if (!appToken) {
    return {
      data: { ticketId: 0, ticketUrl: '', ticketStatus: 'skipped' },
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
        error: 'ITSM_APP_TOKEN is not configured'
      }
    };
  }

  try {
    const auth = getBasicAuth(username, password);
    const sessionToken = await initGlpiSession(baseUrl, appToken, auth);

    const res = await axios.post(
      `${baseUrl}/apirest.php/Ticket`,
      {
        input: [
          {
            name: String(system_ticketTitle),
            content: String(system_ticketContent),
            urgency: Number(system_priority),
            impact: Number(system_priority),
            priority: Number(system_priority)
          }
        ]
      },
      {
        headers: {
          'App-Token': appToken,
          'Session-Token': sessionToken
        }
      }
    );

    const result = Array.isArray(res.data) ? res.data[0] : res.data;
    const ticketId = result?.id ? Number(result.id) : 0;

    return {
      data: {
        ticketId,
        ticketUrl: ticketId ? `${baseUrl}/front/ticket.form.php?id=${ticketId}` : '',
        ticketStatus: result?.message || 'created'
      },
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
        customOutputs: {
          ticketId,
          ticketUrl: ticketId ? `${baseUrl}/front/ticket.form.php?id=${ticketId}` : ''
        }
      }
    };
  } catch (error) {
    return {
      data: { ticketId: 0, ticketUrl: '', ticketStatus: 'failed' },
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
        error: getErrText(error, 'ITSM ticket creation failed')
      }
    };
  }
};
