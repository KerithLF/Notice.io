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
}