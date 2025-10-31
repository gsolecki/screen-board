import React, { useState, useEffect } from 'react';
import './Concessions.css';
import SlideLayout from '../../common/SlideLayout';

function Concessions(){
  const [concessionsData, setConcessionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/concessions.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConcessionsData(data);

        // Calculate max rows from the data so UI updates when JSON changes
        const maxCount = Math.max(...data.map(section => section.items.length), 0);
        document.documentElement.style.setProperty('--max-rows', String(maxCount));
      } catch (error) {
        console.error('Error loading concessions data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
