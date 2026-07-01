import { DispatchNodeResponseKeyEnum } from '@fastgpt/global/core/workflow/runtime/constants';
import type { ModuleDispatchProps } from '@fastgpt/global/core/workflow/runtime/type';
import type { DispatchNodeResultType } from '@fastgpt/global/core/workflow/runtime/type';

type ApiType = 'edr' | 'ndr' | 'firewall' | 'all';

type Props = ModuleDispatchProps<{
  system_sourceIp: string;
  system_apiType: ApiType | string;
  system_timeRangeHours: number;
}>;

type Response = DispatchNodeResultType<{
  edrLogs: any[];
  ndrLogs: any[];
  firewallLogs: any[];
}>;

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pickByHash<T>(seed: number, list: T[]): T {
  return list[seed % list.length];
}

function generateEdrLogs(ip: string, seed: number, hours: number): any[] {
  const processes = ['sshd', 'nginx', 'mysql', 'powershell.exe', 'cmd.exe', 'bash'];
  const actions = ['process_create', 'file_write', 'registry_set', 'network_connect'];
  const files = ['/tmp/payload.sh', '/var/log/auth.log', '/etc/passwd', 'C:\\Windows\\Temp\\x.exe'];
  const count = 2 + (seed % 4);
  const logs: any[] = [];
  for (let i = 0; i < count; i++) {
    logs.push({
      timestamp: new Date(Date.now() - (seed % (hours * 3600000)) - i * 60000).toISOString(),
      hostIp: ip,
      process: pickByHash(seed + i, processes),
      action: pickByHash(seed + i + 1, actions),
      file: pickByHash(seed + i + 2, files),
      pid: 1000 + ((seed + i) % 5000),
      command: `failed login attempt from ${ip}`
    });
  }
  return logs;
}

function generateNdrLogs(ip: string, seed: number, hours: number): any[] {
  const destinations = ['8.8.8.8', '1.1.1.1', '185.220.101.42', '10.0.0.5'];
  const ports = [443, 53, 80, 22, 3389];
  const count = 2 + (seed % 5);
  const logs: any[] = [];
  for (let i = 0; i < count; i++) {
    logs.push({
      timestamp: new Date(Date.now() - (seed % (hours * 3600000)) - i * 120000).toISOString(),
      srcIp: ip,
      dstIp: pickByHash(seed + i, destinations),
      dstPort: pickByHash(seed + i + 1, ports),
      protocol: pickByHash(seed + i + 2, ['TCP', 'UDP', 'ICMP']),
      bytes: 100 + ((seed + i) % 9000),
      beaconing: i === 0
    });
  }
  return logs;
}

function generateFirewallLogs(ip: string, seed: number, hours: number): any[] {
  const actions = ['ALLOW', 'DROP', 'ALLOW', 'ALLOW'];
  const count = 2 + (seed % 3);
  const logs: any[] = [];
  for (let i = 0; i < count; i++) {
    logs.push({
      timestamp: new Date(Date.now() - (seed % (hours * 3600000)) - i * 180000).toISOString(),
      srcIp: ip,
      dstIp: '10.0.0.5',
      dstPort: 22 + ((seed + i) % 1000),
      action: pickByHash(seed + i, actions),
      direction: 'inbound',
      rule: 'WAN-SSH'
    });
  }
  return logs;
}

export const dispatchSecurityApiStub = (props: Props): Response => {
  const {
    params: {
      system_sourceIp = '',
      system_apiType = 'all',
      system_timeRangeHours = 24
    }
  } = props;

  const seed = simpleHash(system_sourceIp || 'unknown');
  const apiType = (system_apiType as ApiType) || 'all';
  const hours = Number(system_timeRangeHours) || 24;

  const includeEdr = apiType === 'edr' || apiType === 'all';
  const includeNdr = apiType === 'ndr' || apiType === 'all';
  const includeFirewall = apiType === 'firewall' || apiType === 'all';

  const edrLogs = includeEdr ? generateEdrLogs(system_sourceIp, seed, hours) : [];
  const ndrLogs = includeNdr ? generateNdrLogs(system_sourceIp, seed, hours) : [];
  const firewallLogs = includeFirewall ? generateFirewallLogs(system_sourceIp, seed, hours) : [];

  return {
    data: {
      edrLogs,
      ndrLogs,
      firewallLogs
    },
    [DispatchNodeResponseKeyEnum.nodeResponse]: {
      customOutputs: {
        edrLogCount: edrLogs.length,
        ndrLogCount: ndrLogs.length,
        firewallLogCount: firewallLogs.length
      }
    }
  };
};
