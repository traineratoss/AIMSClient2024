const baseUrl = "http://localhost:8080/aims/api/v1/documents";

// export async function postDocuments(files, ideaId, userId) {
//   const url = `${baseUrl}/addDocument`;
//   const formData = new FormData();

//   if (files instanceof FileList) {
//     Array.from(files).forEach(file => {
//       formData.append('files', file);
//     });
//   } else if (Array.isArray(files)) {
//     files.forEach(file => {
//       if (file instanceof File) {
//         formData.append('files', file);
//       } else {
//         throw new Error('Array contains non-File objects');
//       }
//     });
//   } else if (files instanceof File) {
//     formData.append('files', files);
//   } else {
//     throw new Error('Invalid file input: Expected File, FileList, or Array');
//   }

//   formData.append('ideaId', ideaId);
//   formData.append('userId', userId);

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error('Server responded with an error: ' + JSON.stringify(errorData));
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error posting documents:', error);
//     throw error;
//   }
// }

export async function getDocumentsByIdeaId(ideaId) {
  const url = `${baseUrl}/getByIdea?ideaId=${encodeURIComponent(ideaId)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Server responded with an error: ' + response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting documents by ideaId:', error);
    throw error;
  }
}

export async function deleteDocument(id) {
  const url = `${baseUrl}/deleteDocument?id=${encodeURIComponent(id)}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      const errorText = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
      throw new Error(`Server responded with an error: ${JSON.stringify(errorText)}`);
    }

    if (contentType.includes('application/json')) {
      return await response.json();
    } else {
      const responseText = await response.text();
      return { message: responseText };
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}



export async function downloadDocument(id, fileName) {
  const url = `${baseUrl}/get?id=${encodeURIComponent(id)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Server responded with an error: ' + response.statusText);
    }

    const blob = await response.blob();
    const contentType = response.headers.get('content-type');
    const objectUrl = window.URL.createObjectURL(new Blob([blob], { type: contentType }));

    const link = document.createElement('a');
    link.href = objectUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

export async function fetchDocument(id) {
  const url = `${baseUrl}/get?id=${encodeURIComponent(id)}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Server responded with an error: ' + response.statusText);
    }

    const blob = await response.blob();
    const contentType = response.headers.get('content-type');
    const arrayBuffer = await blob.arrayBuffer();
    return { arrayBuffer, contentType };
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
};
