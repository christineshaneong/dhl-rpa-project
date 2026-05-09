import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const IncidentForm = ({ onUploadSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(''); // New state for robot feedback
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sourceFile: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('PROCESSING...'); 

    const newEntry = {
      title: formData.title,
      description: formData.description,
      source_file: formData.sourceFile, 
      status: 'Processed',
      priority: 'Medium'
    };
    
    try {
      const { error } = await supabase
        .from('incidents') 
        .insert([newEntry]);

      if (error) throw error;
      
      setFormData({ title: '', description: '', sourceFile: '' });
      setStatusMessage('SUCCESS: SAVED TO CLOUD'); // Robot reads this text
      
      if (onUploadSuccess) onUploadSuccess();
      
    } catch (err) {
      console.error("Supabase Error:", err.message);
      setStatusMessage('ERROR: ' + err.message);
    } finally {
      setIsSubmitting(false);
      // Auto-clear message after 5 seconds so it's fresh for the next robot run
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  return (
    <div style={{ 
      padding: '25px', border: '1px solid #ddd', marginBottom: '30px', 
      borderRadius: '10px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
    }}>
      <h3 style={{ color: '#d40511', marginTop: 0, borderBottom: '2px solid #d40511', paddingBottom: '10px' }}>
        DHL RPA Cloud Console
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#444' }}>Subject:</label>
          <input 
            id="input-title"
            style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            placeholder="Summarized Title" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#444' }}>AI-Generated Summary:</label>
          <textarea 
            id="input-description"
            style={{ 
              display: 'block', width: '100%', height: '140px', padding: '12px', 
              borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit',
              boxSizing: 'border-box', resize: 'vertical'
            }}
            placeholder="AI Summary will appear here..." 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#444' }}>Source Reference:</label>
          <input 
            id="input-filename"
            style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            placeholder="e.g. incident_001.txt" 
            value={formData.sourceFile}
            onChange={(e) => setFormData({...formData, sourceFile: e.target.value})}
            required
          />
        </div>

        <button 
          id="btn-submit" 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            backgroundColor: isSubmitting ? '#ccc' : '#ffcc00', 
            color: '#000', padding: '15px', border: 'none', fontWeight: 'bold', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '4px', 
            width: '100%', fontSize: '16px', transition: 'background-color 0.3s'
          }}
        >
          {isSubmitting ? 'SAVING TO CLOUD...' : 'SUBMIT TO KNOWLEDGE BASE'}
        </button>
      </form>

      {/* NEW: Robot-readable status display instead of popup */}
      {statusMessage && (
        <div id="rpa-status" style={{ 
          marginTop: '15px', padding: '12px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold',
          backgroundColor: statusMessage.includes('ERROR') ? '#ffebee' : '#e8f5e9',
          color: statusMessage.includes('ERROR') ? '#c62828' : '#2e7d32',
          border: `1px solid ${statusMessage.includes('ERROR') ? '#ef9a9a' : '#a5d6a7'}`
        }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default IncidentForm;