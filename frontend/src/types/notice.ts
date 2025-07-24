export interface NoticeData {
  selected_type: string;
  tone: string;
  case_description: string;
  issue_date: string;
  problem_date: string;
  notice_period: string;
  total_amount: string;
  sender_name: string;
  sender_address: string;
  sender_title: string;
  sender_company: string;
  recipient_name: string;
  recipient_address: string;
  recipient_title: string;
  recipient_company: string;
  signature: string;
  [key: string]: string; // For dynamic fields
}

export interface Field {
  name: string;
  label: string;
}