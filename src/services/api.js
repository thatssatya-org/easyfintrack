export const fetchTransactions = async (fileType = 'STATEMENT') => {
    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${baseUrl}/v1/files/${fileType}/contents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "date": import.meta.env.VITE_TRANSACTION_DATE || "20251206",
                "filters": {
                    "id": import.meta.env.VITE_USER_EMAIL || "satyajitr.kv3nal@gmail.com"
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
            body: formData,
            // standard fetch handles Content-Type for FormData automatically (multipart/form-data boundary)
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
        }

        // Some backends might return empty body 204 or just text
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
    } catch (error) {
        console.error("Failed to upload file:", error);
        throw error;
    }
};
