export interface NoticeData {
  litigationType: string;
  tone: string;
  subject: string;
  issueDate: string;
  caseDescription: string;
  customFields: { [key: string]: string };
  selectedTemplate: string;
}

export interface IPCSection {
  id: string;
  title: string;
  description: string;
  keywords: string[];
}