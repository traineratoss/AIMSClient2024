import { axiosInstance } from "../main";

export async function postDocuments(files, ideaId, userId) {
  const url = 'http://localhost:8080/aims/api/v1/documents/addDocument';

  const formData = new FormData();

  if (files instanceof FileList) {
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
  } else if (Array.isArray(files)) {
    files.forEach(file => {
      if (file instanceof File) {
        formData.append('files', file);
      } else {
        throw new Error('Array contains non-File objects');
      }
    });
  } else if (files instanceof File) {
    formData.append('files', files);
  } else {
    throw new Error('Invalid file input: Expected File, FileList, or Array');
  }

  formData.append('ideaId', ideaId);
  formData.append('userId', userId);

  try {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error('Server responded with an error: ' + error.response.data);
    } else if (error.request) {
      throw new Error('No response received from server: ' + error.request);
    } else {
      throw new Error('Error in setting up the request: ' + error.message);
    }
  }
}

export async function getDocumentsByIdeaId(ideaId) {
  const response = await axiosInstance.get("http://localhost:8080/aims/api/v1/documents/getByIdea", {
    params: {
      ideaId,
    }
  });
  return response.data;
}

export async function deleteDocument(id) {
  const response = await axiosInstance.delete("http://localhost:8080/aims/api/v1/documents/deleteDocument", {
    params: {
      id,
    }
  });
  return response.data;
}

export async function downloadDocument(id, fileName) {
  try {
    const response = await axiosInstance.get(`http://localhost:8080/aims/api/v1/documents/get?id=${id}`, {
      responseType: 'blob' 
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);  
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

