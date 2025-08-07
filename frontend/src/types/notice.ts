<<<<<<< HEAD
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
=======
export interface NoticeData {
  litigationType: string;
  tone: string;
  subject: string;
  issueDate: string;
  problemDate: string;
  noticePeriod: string;
  totalAmount: string;
  senderName: string;
  senderAddress: string;
  senderTitle: string;
  senderCompany: string;
  recipientName: string;
  recipientAddress: string;
  recipientTitle: string;
  recipientCompany: string;
  signature: string;
  caseDescription: string;
  customFields?: { [key: string]: any };
  selectedTemplate?: string;
}

export interface IPCSection {
  id: string;
  title: string;
  description: string;
  keywords: string[];
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
}