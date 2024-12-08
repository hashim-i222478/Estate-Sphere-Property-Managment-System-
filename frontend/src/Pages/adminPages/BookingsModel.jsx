import React from 'react';

const BookingsModel = ({ children, onClose }) => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex:200000 }}>
            <div style={{ padding: 20, backgroundColor: '#fff', color:'black', borderRadius: 5, width: '80%', maxWidth: '600px' }}>
                <button onClick={onClose} style={{ float: 'right', fontSize: 24 }}>Close ×</button>
                <div style={{ padding: 20, color: 'black' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BookingsModel;
