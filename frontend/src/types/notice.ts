export interface Incident {
  date: string;
  description: string;
  month?: string;
  year?: string;
  fullDate?: string;
}

export interface Recipient {
  recipient_name: string;
  recipientFather_name: string;
  recipient_address: string;
  recipient_mail: string;
  recipient_phone: string;
}

export interface NoticeData {
  litigation_type: string;
  sub_litigation_type?: string;
  tone: string;
  subject: string;
  issue_date: string;
  sender_name: string;
  senderFather_name: string;
  sender_address: string;
  sender_mail: string;
  sender_phone: string;
  council_name: string;
  council_address: string;
  council_mail: string;
  council_phone: string;
  contributor_name: string;
  contributor_address: string;
  contributor_mail: string;
  contributor_phone: string;
  recipients: Recipient[];
  incidents: Incident[];
  conclusion: string;
  custom_fields: Record<string, any>;
  selected_type?: string;
}

export interface Field {
  name: string;
  label: string;
}