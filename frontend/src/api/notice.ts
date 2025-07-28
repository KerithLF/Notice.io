import { NoticeData } from '../types/notice';

const API_BASE_URL = 'http://localhost:8000/api';

interface IPCRecommendation {
  section: string;
  title: string;
  description: string;
}

interface NoticeResponse {
  notice_text: string;
  ipc_recommendations: IPCRecommendation[];
}

interface APIError {
  detail: string;
}

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = data as APIError;
    throw new Error(error.detail || 'An error occurred');
  }
  return data;
};

export const generateNotice = async (data: NoticeData): Promise<NoticeResponse> => {
  try {
    console.log('Sending notice generation request:', data);
    const response = await fetch(`${API_BASE_URL}/generate-notice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await handleResponse(response);
    console.log('Notice generation successful:', result);
    return result;
  } catch (error) {
    console.error('Error generating notice:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate notice: ${error.message}`);
    }
    throw new Error('Failed to generate notice: Unknown error');
  }
};

export const getLitigationFields = async (litigationType: string) => {
  try {
    console.log('Fetching litigation fields for:', litigationType);
    const response = await fetch(`${API_BASE_URL}/litigation-fields/${litigationType}`);
    const result = await handleResponse(response);
    console.log('Litigation fields fetched:', result);
    return result;
  } catch (error) {
    console.error('Error fetching litigation fields:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch litigation fields: ${error.message}`);
    }
    throw new Error('Failed to fetch litigation fields: Unknown error');
  }
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


export const getIpcRecommendations = async (subject: string) => {
  const response = await fetch(`${API_BASE_URL}/ipc-recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject }),
  });

  if (!response.ok) {
    throw new Error('Failed to get IPC recommendations');
  }

  return response.json();
};



/* Code to input both subject and incidents for IPC recommendations

export const getIpcRecommendations = async (
  subject: string,
  incidents: string[]
) => {
  const response = await fetch(`${API_BASE_URL}/ipc-recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, incidents }),
  });

  if (!response.ok) {
    throw new Error('Failed to get IPC recommendations');
  }

  return response.json();
};

*/
