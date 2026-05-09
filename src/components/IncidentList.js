import React, { useEffect, useState } from 'react';
import { getIncidents, updateIncident } from '../api/api';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getIncidents();
    setIncidents(res.data);
  };

  const publishIncident = async (id) => {
    await updateIncident(id, { status: 'Published' });
    fetchData();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Incident Viewer (DHL Review)</h3>
      <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#eee' }}>
            <th>Title</th>
            <th>Source File</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.sourceFile}</td>
              <td><strong>{item.status}</strong></td>
              <td>
                {item.status === 'Draft' && (
                  <button onClick={() => publishIncident(item.id)}>Publish</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentList;