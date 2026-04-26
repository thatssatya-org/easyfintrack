import React from 'react';
import TransactionDashboard from './components/TransactionDashboard';

function App() {
    return (
        <div className="relative min-h-screen">
            <div className="grain-overlay" />
            <TransactionDashboard />
        </div>
    );
}

export default App;