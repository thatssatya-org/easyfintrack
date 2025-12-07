export const fetchTransactions = async (fileType = 'STATEMENT') => {
    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${baseUrl}/v1/files/${fileType}/contents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "date": import.meta.env.VITE_TRANSACTION_DATE || '',
                "filters": {
                    "id": import.meta.env.VITE_USER_EMAIL || ''
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        throw error;
    }
};
