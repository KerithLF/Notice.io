export interface NoticeData {
  councilPhone: string;
  councilMail: string;
  councilAddress: string;
  councilName: string;
  recipientPhone: string;
  recipientMail: string;
  senderPhone: string | number | readonly string[] | undefined;
  senderMail: string | number | readonly string[] | undefined;
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
  issueMonth?: string;
  issueYear?: string;
}

export interface IPCSection {
  id: string;
  title: string;
  description: string;
  keywords: string[];
}