// types/warnings.ts
export interface WarningAlert {
    type: 'encashing_delay' | 'dishonor_delay' | 'early_notice' | 'duplicate_case' | 'standing_issue';
    title: string;
    message: string;
    severity: 'high' | 'medium' | 'low';
  }
  
  export interface NoticeResponse {
    notice_text: string;
    ipc_recommendations: IPCRecommendation[];
    warnings?: WarningAlert[];
  }
  
  export interface IPCRecommendation {
    section: string;
    description: string;
    applicability: string;
  }
  