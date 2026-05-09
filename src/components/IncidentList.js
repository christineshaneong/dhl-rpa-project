import React from 'react';
import { supabase } from '../lib/supabaseClient';

const IncidentList = ({ incidents }) => {
  // Function to update status (e.g., from 'Processed' to 'Published')
  const publishIncident = async (id) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status: 'Published' })
        .eq('id', id);

      if (error) throw error;
      
      // Note: App.js will handle the refresh if we set it up, 
      // or the user can refresh the page to see the change.
      window.location.reload(); 
    } catch (err) {
      console.error("Error updating status:", err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Incident Viewer (DHL Review)</h3>
      <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>Title</th>
            <th style={{ padding: '10px' }}>Source File</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {incidents.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>
                No incidents found in cloud database.
              </td>
            </tr>
          ) : (
            incidents.map(item => (
              <tr key={item.id}>
                <td style={{ padding: '10px' }}>{item.title}</td>
                {/* CHANGED: matches Supabase column 'source_file' */}
                <td style={{ padding: '10px' }}>{item.source_file}</td> 
                <td style={{ padding: '10px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: item.status === 'Published' ? '#e8f5e9' : '#fff3e0',
                    color: item.status === 'Published' ? '#2e7d32' : '#e65100',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  {item.status === 'Processed' && (
                    <button 
                      onClick={() => publishIncident(item.id)}
                      style={{ cursor: 'pointer', padding: '5px 10px' }}
                    >
                      Verify & Publish
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentList;