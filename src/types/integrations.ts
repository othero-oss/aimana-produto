export type IntegrationType = 'mcp' | 'webhook' | 'oauth';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'configuring';
export type TrustAgentAction = 'block' | 'warn' | 'log';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ScanStatus = 'pending' | 'survey_sent' | 'scanning' | 'completed';
export type ToolStatus = 'detected' | 'homologated' | 'blocked' | 'evaluating';

export interface Integration {
  id: string;
  companyId: string;
  integrationType: IntegrationType;
  provider: string;
  status: IntegrationStatus;
  config: Record<string, unknown>;
  permissions: string[];
  lastSyncAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface APIKey {
  id: string;
  companyId: string;
  keyHash: string;
  keyPrefix: string;
  name: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export interface APIRequest {
  id: string;
  companyId: string;
  apiKeyId: string | null;
  userId: string | null;
  modelProvider: string | null;
  modelName: string | null;
  inputTokens: number;
  outputTokens: number;
  costUsd: number | null;
  latencyMs: number | null;
  trustAgentFlags: string[];
  status: string;
  createdAt: string;
}

export interface TrustAgentRule {
  id: string;
  companyId: string;
  ruleType: string;
  pattern: string | null;
  action: TrustAgentAction;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface TrustAgentIncident {
  id: string;
  companyId: string;
  requestId: string | null;
  ruleId: string | null;
  incidentType: string | null;
  contentSnippet: string | null;
  severity: RiskLevel;
  resolved: boolean;
  resolvedAt: string | null;
  resolvedBy: string | null;
  createdAt: string;
}

export interface ShadowAIScan {
  id: string;
  companyId: string;
  status: ScanStatus;
  surveySentCount: number;
  surveyCompletedCount: number;
  technicalScanEnabled: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface ShadowAITool {
  id: string;
  scanId: string;
  companyId: string;
  toolName: string;
  toolCategory: string | null;
  detectedSource: 'survey' | 'technical' | 'both';
  usersCount: number;
  usersPercentage: number | null;
  status: ToolStatus;
  riskLevel: RiskLevel;
  riskDescription: string | null;
  createdAt: string;
}

export interface ConnectorInfo {
  id: string;
  name: string;
  icon: string;
  category: 'communication' | 'productivity' | 'crm' | 'erp' | 'other';
  status: IntegrationStatus;
  description: string;
}
