import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ConcessionsAdmin.css';

const ConcessionsAdmin = () => {
  const [concessionsData, setConcessionsData] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  // Load data from localStorage or fallback to original JSON
  useEffect(() => {
    const loadData = async () => {
      const savedData = localStorage.getItem('concessions-data');
      if (savedData) {
        try {
          setConcessionsData(JSON.parse(savedData));
        } catch (error) {
          console.error('Error parsing saved data:', error);
          localStorage.removeItem('concessions-data');
          // Load from server
          const response = await fetch('/data/concessions.json');
          const data = await response.json();
          setConcessionsData(data);
        }
      } else {
        // Load original data from public folder
        try {
          const response = await fetch('/data/concessions.json');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setConcessionsData(data);
        } catch (error) {
          console.error('Error loading concessions data:', error);
          alert('Error loading concessions data. Please refresh the page.');
        }
      }
    };
    loadData();
  }, []);

  const saveData = (newData) => {
    localStorage.setItem('concessions-data', JSON.stringify(newData));
    setConcessionsData(newData);
    setSaveStatus('Saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const addSection = () => {
    const sectionName = prompt('Enter new section name:');
    if (sectionName && sectionName.trim()) {
      const newData = [...concessionsData, { section: sectionName.trim(), items: [] }];
      saveData(newData);
    }
  };

  const deleteSection = (sectionIndex) => {
    if (globalThis.confirm(`Are you sure you want to delete the "${concessionsData[sectionIndex].section}" section and all its items?`)) {
      const newData = concessionsData.filter((_, idx) => idx !== sectionIndex);
      saveData(newData);
    }
  };

  const updateSectionName = (sectionIndex, newName) => {
    const newData = [...concessionsData];
    newData[sectionIndex].section = newName;
    saveData(newData);
    setEditingSection(null);
  };

  const addItem = (sectionIndex) => {
    const newData = [...concessionsData];
    newData[sectionIndex].items.push({ name: 'New Item', price: '0.00', note: '' });
    saveData(newData);
  };

  const deleteItem = (sectionIndex, itemIndex) => {
    if (globalThis.confirm('Are you sure you want to delete this item?')) {
      const newData = [...concessionsData];
      newData[sectionIndex].items = newData[sectionIndex].items.filter((_, idx) => idx !== itemIndex);
      saveData(newData);
    }
  };

  const updateItem = (sectionIndex, itemIndex, field, value) => {
    const newData = [...concessionsData];
    newData[sectionIndex].items[itemIndex][field] = value;
    saveData(newData);
  };

  const moveSection = (sectionIndex, direction) => {
    const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    if (newIndex < 0 || newIndex >= concessionsData.length) return;

    const newData = [...concessionsData];
    [newData[sectionIndex], newData[newIndex]] = [newData[newIndex], newData[sectionIndex]];
    saveData(newData);
  };

  const moveItem = (sectionIndex, itemIndex, direction) => {
    const items = concessionsData[sectionIndex].items;
    const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newData = [...concessionsData];
    const sectionItems = [...newData[sectionIndex].items];
    [sectionItems[itemIndex], sectionItems[newIndex]] = [sectionItems[newIndex], sectionItems[itemIndex]];
    newData[sectionIndex].items = sectionItems;
    saveData(newData);
  };

  const resetAllData = async () => {
    if (globalThis.confirm('Are you sure you want to reset all concessions data to original values? This cannot be undone!')) {
      try {
        const response = await fetch('/data/concessions.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        saveData(data);
        alert('Concessions data has been reset to original values.');
      } catch (error) {
        console.error('Error loading original data:', error);
        alert('Error resetting data. Please check your connection and try again.');
      }
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(concessionsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `concessions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Validate data structure
        if (!Array.isArray(importedData)) {
          alert('Invalid data format: Expected an array of sections');
          return;
        }

        // Basic validation
        const isValid = importedData.every(section =>
          section.section &&
          Array.isArray(section.items) &&
          section.items.every(item => item.name && item.price)
        );

        if (!isValid) {
          alert('Invalid data format: Each section must have a "section" name and "items" array with "name" and "price" fields');
          return;
        }

        // Confirm before overwriting
        if (globalThis.confirm('This will replace all current data. Are you sure?')) {
          saveData(importedData);
          alert('Data imported successfully!');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Error importing data: Invalid JSON file');
      }
    };

    reader.readAsText(file);
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  if (!concessionsData) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="concessions-admin">
      <header className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Concessions Menu - Admin Panel</h1>
            <p>Manage categories, items, notes, and prices</p>
          </div>
          <Link to="/" className="btn-back-to-display">
            ← Back to Display
          </Link>
        </div>
      </header>

      <div className="admin-controls">
        <button onClick={addSection} className="btn-add-section">
          ➕ Add Section
        </button>
        <div className="action-buttons">
          <label htmlFor="import-file" className="btn-import">
            📥 Import Data
          </label>
          <input
            id="import-file"
            type="file"
            accept=".json,application/json"
            onChange={importData}
            style={{ display: 'none' }}
          />
          <button onClick={exportData} className="btn-export">📤 Export Data</button>
          <button onClick={resetAllData} className="btn-reset">Reset All Data</button>
        </div>
        {saveStatus && <div className="save-status">{saveStatus}</div>}
      </div>

      <div className="sections-container">
        {concessionsData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="section-card">
            <div className="section-header">
              <div className="section-title-row">
                {editingSection === sectionIndex ? (
                  <input
                    type="text"
                    className="section-name-input"
                    value={section.section}
                    onChange={(e) => {
                      const newData = [...concessionsData];
                      newData[sectionIndex].section = e.target.value;
                      setConcessionsData(newData);
                    }}
                    onBlur={() => updateSectionName(sectionIndex, section.section)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateSectionName(sectionIndex, section.section);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <h2 onClick={() => setEditingSection(sectionIndex)}>
                    {section.section}
                    <span className="edit-hint">✏️</span>
                  </h2>
                )}
                <div className="section-controls">
                  <button
                    onClick={() => moveSection(sectionIndex, 'up')}
                    disabled={sectionIndex === 0}
                    className="btn-move"
                    title="Move section up"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => moveSection(sectionIndex, 'down')}
                    disabled={sectionIndex === concessionsData.length - 1}
                    className="btn-move"
                    title="Move section down"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={() => deleteSection(sectionIndex)}
                    className="btn-delete-section"
                    title="Delete section"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <button
                onClick={() => addItem(sectionIndex)}
                className="btn-add-item"
              >
                ➕ Add Item
              </button>
            </div>

            <div className="items-list">
              {section.items.length === 0 ? (
                <div className="empty-section">No items yet. Click "Add Item" to get started.</div>
              ) : (
                section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="item-card">
                    <div className="item-controls-top">
                      <button
                        onClick={() => moveItem(sectionIndex, itemIndex, 'up')}
                        disabled={itemIndex === 0}
                        className="btn-move-small"
                        title="Move up"
                      >
                        ⬆️
                      </button>
                      <button
                        onClick={() => moveItem(sectionIndex, itemIndex, 'down')}
                        disabled={itemIndex === section.items.length - 1}
                        className="btn-move-small"
                        title="Move down"
                      >
                        ⬇️
                      </button>
                      <button
                        onClick={() => deleteItem(sectionIndex, itemIndex)}
                        className="btn-delete-item"
                        title="Delete item"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="item-field">
                      <label>Item Name:</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(sectionIndex, itemIndex, 'name', e.target.value)}
                        placeholder="Item name"
                      />
                    </div>

                    <div className="item-field">
                      <label>Price:</label>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => updateItem(sectionIndex, itemIndex, 'price', e.target.value)}
                        placeholder="0.00"
                        className="price-input"
                      />
                    </div>

                    <div className="item-field">
                      <label>Note (optional):</label>
                      <input
                        type="text"
                        value={item.note || ''}
                        onChange={(e) => updateItem(sectionIndex, itemIndex, 'note', e.target.value)}
                        placeholder="e.g., beef, caff-free, etc."
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConcessionsAdmin;

