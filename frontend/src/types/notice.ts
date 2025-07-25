export interface Incident {
  date: string;
  description: string;
}

export interface NoticeData {
  litigation_type: string;
  tone: string;
  subject: string;
  issue_date: string;
  sender_name: string;
  sender_address: string;
  sender_mail: string;
  sender_phone: string;
  recipient_name: string;
  recipient_address: string;
  recipient_mail: string;
  recipient_phone: string;
  council_name: string;
  council_address: string;
  council_mail: string;
  council_phone: string;
  incidents: Incident[];
  conclusion: string;
  custom_fields: Record<string, any>;
}

export interface Field {
  name: string;
  label: string;
}