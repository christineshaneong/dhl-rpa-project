import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import IncidentForm from './components/IncidentForm';
import IncidentList from './components/IncidentList';
// IMPORT LOGO HERE INSTEAD
import dhlLogo from './assets/dhl-logo.png'; 

function App() {
  const [incidents, setIncidents] = useState([]);

  const fetchIncidents = async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching:', error);
    } else {
      setIncidents(data);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER SECTION: Title on left, Logo on right */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        borderBottom: '3px solid #ffcc00', // DHL Yellow Accent
        paddingBottom: '15px'
      }}>
        <h1 style={{ margin: 0, color: '#d40511', fontSize: '32px' }}>DHL Incident Management</h1>
        <img 
          src={dhlLogo} 
          alt="DHL Logo" 
          style={{ height: '45px', objectFit: 'contain' }} 
        />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#444' }}>Report New Incident</h2>
        <IncidentForm onUploadSuccess={fetchIncidents} />
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '40px 0' }} />

      <div>
        <h2 style={{ color: '#444' }}>Current Incidents</h2>
        <IncidentList incidents={incidents} />
      </div>
    </div>
  );
}

export default App;