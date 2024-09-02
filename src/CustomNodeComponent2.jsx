import React, { useState, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNodeComponent2 = ({ data, node, onCopy, onDelete }) => {
  const [messages, setMessages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({
    document: null,
    image: null,
    video: null,
  });
  const [isPopoverVisible, setPopoverVisible] = useState(false);

  const documentInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const chips = [
    { id: 'Add Message', label: 'Add Message' },
    { id: 'Upload Document', label: 'Upload Document' },
    { id: 'Upload Image', label: 'Upload Image' },
    { id: 'Upload Video', label: 'Upload Video' },
  ];

  const handleChipClick = (chipId) => {
    switch (chipId) {
      case 'Add Message':
        setMessages([...messages, '']);
        break;
      case 'Upload Document':
        documentInputRef.current.click();
        break;
      case 'Upload Image':
        imageInputRef.current.click();
        break;
      case 'Upload Video':
        videoInputRef.current.click();
        break;
      default:
        break;
    }
  };

  const handleMessageChange = (index, e) => {
    const newMessages = [...messages];
    newMessages[index] = e.target.value;
    setMessages(newMessages);
  };

  const clearMessage = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  const handleFileChange = (e, type) => {
    if (e.target.files.length > 0) {
      setSelectedFiles((prev) => ({
        ...prev,
        [type]: e.target.files[0],
      }));
    }
  };

  const togglePopover = () => {
    setPopoverVisible(!isPopoverVisible);
  };

  const handleCopy = () => {
    if (onCopy) onCopy(node.id); // Access the node ID from the node object
  };

  const handleDelete = () => {
    if (onDelete) onDelete(node.id); // Access the node ID from the node object
  };

  return (
    <div style={styles.boxx}>
      <Handle type="target" position={Position.Top} style={styles.handle} />
      <div style={styles.title}>
        <div>+</div>
        <div onClick={togglePopover} style={styles.popoverTrigger}>⁝</div>
      </div>

      <div style={styles.chipContainer}>
        {chips.map((chip) => (
          <div
            key={chip.id}
            style={styles.chip}
            onClick={() => handleChipClick(chip.id)}
          >
            {chip.label}
          </div>
        ))}
      </div>

      {/* Message Inputs */}
      {messages.map((message, index) => (
        <div key={index} style={styles.inputContainer}>
          <input
            type="text"
            value={message}
            onChange={(e) => handleMessageChange(index, e)}
            placeholder="Enter your message"
            style={styles.input}
          />
          <div style={styles.clearIcon} onClick={() => clearMessage(index)}>
            ❌
          </div>
        </div>
      ))}

      {/* Display Selected Files */}
      {selectedFiles.document && (
        <div style={styles.fileInfo}>
          📄 {selectedFiles.document.name}
        </div>
      )}
      {selectedFiles.image && (
        <div style={styles.fileInfo}>
          🖼️ {selectedFiles.image.name}
        </div>
      )}
      {selectedFiles.video && (
        <div style={styles.fileInfo}>
          🎥 {selectedFiles.video.name}
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        ref={documentInputRef}
        style={styles.hiddenInput}
        onChange={(e) => handleFileChange(e, 'document')}
      />
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={styles.hiddenInput}
        onChange={(e) => handleFileChange(e, 'image')}
      />
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        style={styles.hiddenInput}
        onChange={(e) => handleFileChange(e, 'video')}
      />

      <Handle type="source" position={Position.Bottom} style={styles.handle} />

      {/* Popover */}
      {isPopoverVisible && (
        <div style={styles.popover}>
          <div style={styles.popoverItem} onClick={handleCopy}>Copy</div>
          <div style={styles.popoverItem} onClick={handleDelete}>Delete</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  boxx: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    width: '220px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center',
    position: 'relative',
    height: 'auto', // Automatically adjusts height based on content
    minHeight: '100px', // Adjust as needed to ensure visibility of content
  },

  title: {
    fontWeight: 'bold',
    marginBottom: '10px',
    fontSize: '16px',
    backgroundColor: 'red',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderRadius: '10px',
  },
  popoverTrigger: {
    cursor: 'pointer',
    fontSize: '16px',
  },
  popover: {
    position: 'absolute',
    top: '40%',
    left: '84%',
    transform: 'translateX(10px) translateY(-50%)',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    padding: '5px',
    zIndex: '100',
    width: '70px',
    textAlign: 'center',
  },
  popoverItem: {
    padding: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  popoverItemHover: {
    backgroundColor: '#f0f0f0',
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  chip: {
    padding: '8px 12px',
    borderRadius: '16px',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    userSelect: 'none',
    fontSize: '12px',
    transition: 'background-color 0.3s',
  },
  handle: {
    background: '#555',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  inputContainer: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '12px',
  },
  clearIcon: {
    cursor: 'pointer',
    marginLeft: '8px',
    color: '#f00',
  },
  fileInfo: {
    fontSize: '12px',
    color: '#555',
    marginBottom: '5px',
    textAlign: 'left',
    wordBreak: 'break-all',
  },
  hiddenInput: {
    display: 'none',
  },
};

export default CustomNodeComponent2;
