import React, { useState, useEffect } from 'react';
import './Concessions.css';
import SlideLayout from '../../common/SlideLayout';

function Concessions(){
  const [concessionsData, setConcessionsData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if there's saved data in localStorage first
        const savedData = localStorage.getItem('concessions-data');
        let data;

        if (savedData) {
          // Use localStorage data (saved from admin panel)
          data = JSON.parse(savedData);
        } else {
          // Load base data if no saved data
          const response = await fetch('/data/concessions.json');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          data = await response.json();
        }

        setConcessionsData(data);

        // Calculate max rows from the data so UI updates when JSON changes
        const maxCount = Math.max(...data.map(section => section.items.length), 0);
        document.documentElement.style.setProperty('--max-rows', String(maxCount));
      } catch (error) {
        console.error('Error loading concessions data:', error);
      }
    };

    loadData();

    // Poll for updates every 5 seconds to detect localStorage changes
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!concessionsData) {
    return (
      <SlideLayout
        className="concessions-wrap"
        title="AYSO 128"
        subtitle="CONCESSIONS"
        footerCenter={<span>Prices include tax where applicable • Card or cash accepted</span>}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'white', fontSize: '1.5rem' }}>
          Loading menu...
        </div>
      </SlideLayout>
    );
  }

  return (
    <SlideLayout
      className="concessions-wrap"
      title="AYSO 128"
      subtitle="CONCESSIONS"
      footerCenter={<span>Prices include tax where applicable • Card or cash accepted</span>}
    >
      <main className="grid">
        {concessionsData.map((section) => (
          <section className="card" key={section.section}>
            <h2>{section.section}</h2>
            <div className="items">
              {section.items.map((item, idx) => (
                <div className="row" key={idx}>
                  <span className="name">
                    {item.name}{item.note ? ' ' : ''}
                    {item.note ? <span className="note">{item.note}</span> : null}
                  </span>
                  <span className="price">{item.price}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </SlideLayout>
  );
}

export default Concessions;
