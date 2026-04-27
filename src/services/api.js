function authHeaders() {
    const token = sessionStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchTransactions = async (fileType = 'STATEMENT') => {
    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${baseUrl}/v1/files/${fileType}/contents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
            body: JSON.stringify({
                "date": import.meta.env.VITE_TRANSACTION_DATE || '',
                "filters": {
                    "id": import.meta.env.VITE_USER_EMAIL || ''
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error (${response.status}):`, errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        throw error;
    }
};

export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

        const response = await fetch(`${baseUrl}/v1/files/manual`, {
            method: 'POST',
            headers: {
                ...authHeaders(),
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
    } catch (error) {
        console.error("Failed to upload file:", error);
        throw error;
    }
};
