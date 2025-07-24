const API_BASE_URL = 'http://localhost:8000';

export const generateNotice = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/generate-notice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to generate notice');
  }

  return response.json();
};

export const getLitigationFields = async (litigationType: string) => {
  const response = await fetch(`${API_BASE_URL}/litigation-fields/${litigationType}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch litigation fields');
  }

  return response.json();
};

export const getTemplates = async () => {
  const response = await fetch(`${API_BASE_URL}/templates`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }

  return response.json();
};

export const downloadPdf = async (noticeText: string) => {
  const response = await fetch(`${API_BASE_URL}/download-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notice_text: noticeText }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  return response.json();
};

export const sendEmail = async (data: {
  sender_email: string;
  sender_password: string;
  recipient_email: string;
  notice_text: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
};

export const shareWhatsapp = async (data: {
  phone_number: string;
  notice_text: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/share-whatsapp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to share on WhatsApp');
  }

  return response.json();
};