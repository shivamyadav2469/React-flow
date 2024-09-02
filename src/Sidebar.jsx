import React from 'react';

const Sidebar = ({ onAddNode }) => {
  const handleAddNode = (type) => {
    onAddNode(type);
  };

  return (
    <aside style={styles.sidebar}>
      <div
        style={styles.item}
        onClick={() => handleAddNode('customNode1')}
      >
        <div className="template-container">
            <h2 className="template-title">Template</h2>
            <div className="button-group">
                <button className="button yes-button">Yes</button>
                <button className="button no-button">No</button>
            </div>
        </div>
      </div>
      <div
        style={styles.item}
        onClick={() => handleAddNode('customNode2')}
      >
        <div class="container">
    <h2 class="title">⨮ Add Here</h2>
    <div class="chip-container">
        <div class="chip">Message</div>
        <div class="chip">Image</div>
        <div class="chip">Document</div>
        <div class="chip">Video</div>
    </div>
</div>

      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '200px',
    height: '100vh',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRight: '1px solid #ddd',
    position: 'fixed',
    top: 0,
    left: 0,
    overflowY: 'auto',
  },
  item: {
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Sidebar;
