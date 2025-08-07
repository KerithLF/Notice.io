<<<<<<< HEAD
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

// Transform frontend data to match backend expectations
const transformNoticeData = (data: NoticeData) => {
  return {
    ...data,
    // Clean incidents to only include date and description
    incidents: data.incidents.map(incident => ({
      date: incident.date,
      description: incident.description
    })),
    // Ensure sub_litigation_type is present
    sub_litigation_type: data.sub_litigation_type || null
  };
};

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
    const transformedData = transformNoticeData(data);
    console.log('Transformed data:', transformedData);
    
    const response = await fetch(`${API_BASE_URL}/generate-notice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
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

  // Get the blob from the response
  const blob = await response.blob();
  
  // Create a download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Legal-Notice.pdf';
  
  // Trigger the download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  
  return { success: true };
};

export const sendEmail = async (data: {
  sender_email: string;
  sender_password: string;
  recipient_email: string;
  subject: string;
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
    const errorData = await response.json().catch(() => ({}));
    
    // Handle authentication errors specifically
    if (response.status === 401) {
      const errorMessage = errorData.detail?.message || errorData.detail || 'Email authentication failed';
      const helpMessage = errorData.detail?.help || '';
      throw new Error(`${errorMessage}\n\n${helpMessage}`);
    }
    
    // Handle other errors
    const errorMessage = errorData.detail || 'Failed to send email';
    throw new Error(errorMessage);
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

  const result = await response.json();
  
  // Open WhatsApp URL in new tab
  if (result.url) {
    window.open(result.url, '_blank');
  }
  
  return result;
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
=======
export async function generateNotice(formData: FormData) {
  const res = await fetch("http://localhost:8000/generate-notice/", {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function getTemplates() {
  const res = await fetch("http://localhost:8000/templates/");
  return res.json();
}

export async function getLitigationFields(templateName: string) {
  const res = await fetch(`http://localhost:8000/litigation-fields/${templateName}`);
  return res.json();
}

export async function getIpcRecommendations(subject: string) {
  const res = await fetch(`http://localhost:8000/ipc-recommendations?subject=${encodeURIComponent(subject)}`);
  return res.json();
}
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
