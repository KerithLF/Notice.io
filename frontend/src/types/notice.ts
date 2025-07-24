export interface NoticeData {
  litigation_type: string;
  tone: string;
  subject: string;
  case_description: string;
  issue_date: string;
  issue_month?: string;
  issue_year?: string;
  problem_date: string;
  notice_period: string;
  total_amount: string;
  sender_name: string;
  sender_address: string;
  sender_title: string;
  sender_company: string;
  sender_mail: string;
  sender_phone: string;
  recipient_name: string;
  recipient_address: string;
  recipient_title: string;
  recipient_company: string;
  recipient_mail: string;
  recipient_phone: string;
  signature: string;
  custom_fields: { [key: string]: any };
  selected_template: string;
}

export interface Field {
  name: string;
  label: string;
}