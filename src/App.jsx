// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchUserFiles();
  }, []); // Fetch user files on component mount

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:3000/file/upload', formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if (response.data.code) {
        console.log('File uploaded successfully with code:', response.data.code);
        setFile(null);
        fetchUserFiles(); // Refresh the file list after upload
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const fetchUserFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/file/list', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if (response.data.files) {
        setFiles(response.data.files);
      } else {
        console.error('Failed to fetch user files');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleDownload = async (code) => {
    try {
      const response = await axios.get(`http://localhost:3000/file/download/${code}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        responseType: 'blob',
      });

      // You can handle the download here, e.g., open the file or prompt the user to save it
      console.log('File downloaded successfully');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{ color: '#333' }}>File Upload App</h1>
      <input type="file" onChange={handleFileChange} style={{ margin: '10px' }} />
      <button onClick={handleUpload} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Upload File
      </button>

      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#333' }}>Your Files:</h2>
        {files.map((file) => (
          <p key={file._id} style={{ margin: '5px', fontSize: '16px' }}>
            {file.filename} -{' '}
            <button
              onClick={() => handleDownload(file.code)}
              style={{ padding: '4px 8px', cursor: 'pointer' }}
            >
              Download
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
