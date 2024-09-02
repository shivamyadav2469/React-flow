import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNodeComponent = ({ data, node, onCopy, onDelete }) => {
  const [isPopoverVisible, setPopoverVisible] = useState(false);

  const togglePopover = () => {
    setPopoverVisible(!isPopoverVisible);
  };

  const handleCopy = () => {
    if (onCopy) onCopy(node.id);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(node.id);
  };

  return (
    <div style={styles.box}>
      <Handle type="target" position={Position.Top} style={styles.handle} />
      <div style={styles.title}>
        <h3>Template</h3>
        <div onClick={togglePopover} style={styles.popoverTrigger}>⁝</div>
      </div>
      <input type="text" placeholder="Enter something..." style={styles.input} />
      <div style={styles.buttonContainer}>
        <button style={styles.button}>Yes</button>
        <button style={styles.button}>No</button>
      </div>
      <Handle type="source" position={Position.Bottom} style={styles.handle} />

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
  box: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    width: '220px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    position: 'relative',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '15px',
    fontSize: '16px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '8px',
    padding: '5px 10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  input: {
    width: '90%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  button: {
    flex: 1,
    margin: '0 5px',
    padding: '8px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
  handle: {
    background: '#555',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  popover: {
    position: 'absolute',
    top: '50%',
    left: '84%',
    transform: 'translateX(10px) translateY(-50%)',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    padding: '5px',
    zIndex: '100',
    width: '80px',
    textAlign: 'center',
    fontSize: '14px',
  },
  popoverItem: {
    padding: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  popoverItemHover: {
    backgroundColor: '#f0f0f0',
  },
  popoverTrigger: {
    cursor: 'pointer',
    fontSize: '20px',
    lineHeight: '1',
  },
};

export default CustomNodeComponent;
