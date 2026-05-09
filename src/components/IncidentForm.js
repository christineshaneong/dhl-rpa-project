import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Swapped from local api to Supabase

const IncidentForm = ({ onUploadSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sourceFile: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare the data for Supabase
    // Note: Ensure your Supabase table columns match these keys (title, description, sourceFile, etc.)
    const newEntry = {
      title: formData.title,
      description: formData.description,
      source_file: formData.sourceFile, // Map sourceFile to source_file if using snake_case in SQL
      status: 'Processed',
      priority: 'Medium'
      // createdAt: Supabase adds this automatically if you have a created_at column
    };
    
    try {
      const { error } = await supabase
        .from('incidents') // Your table name in Supabase
        .insert([newEntry]);

      if (error) throw error;
      
      // Clear form
      setFormData({ title: '', description: '', sourceFile: '' });
      
      // Instead of a full window.location.reload(), we call the refresh function from App.js
      if (onUploadSuccess) onUploadSuccess();
      
      alert("Success! Saved to Cloud Database.");
    } catch (err) {
      console.error("Supabase Database Error:", err.message);
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      padding: '25px', 
      border: '1px solid #ddd', 
      marginBottom: '30px', 
      borderRadius: '10px', 
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
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
              display: 'block', 
              width: '100%', 
              height: '140px', 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #ccc', 
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              resize: 'vertical'
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
            color: '#000', 
            padding: '15px', 
            border: 'none', 
            fontWeight: 'bold', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            borderRadius: '4px', 
            width: '100%',
            fontSize: '16px',
            transition: 'background-color 0.3s'
          }}
        >
          {isSubmitting ? 'SAVING TO CLOUD...' : 'SUBMIT TO KNOWLEDGE BASE'}
        </button>
      </form>
    </div>
  );
};

export default IncidentForm;