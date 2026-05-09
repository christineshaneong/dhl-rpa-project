import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import IncidentForm from './components/IncidentForm';
import IncidentList from './components/IncidentList';

function App() {
  const [incidents, setIncidents] = useState([]);

  // Function to fetch data from Supabase
  const fetchIncidents = async () => {
    const { data, error } = await supabase
      .from('incidents') // Make sure your table is named 'incidents'
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
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>DHL Incident Management</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2>Report New Incident</h2>
        {/* We pass fetchIncidents to the form so it can refresh the list after saving */}
        <IncidentForm onUploadSuccess={fetchIncidents} />
      </div>

      <hr />

      <div>
        <h2>Current Incidents</h2>
        <IncidentList incidents={incidents} />
      </div>
    </div>
  );
}

export default App;