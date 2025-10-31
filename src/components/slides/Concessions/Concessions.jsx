import React, { useEffect } from 'react';
import './Concessions.css';
import SlideLayout from '../../common/SlideLayout';
import concessionsData from '../../../data/concessions.json';

function Concessions(){
  useEffect(() => {
    // Calculate max rows from the data so UI updates when JSON changes
    const maxCount = Math.max(...concessionsData.map(section => section.items.length), 0);
    document.documentElement.style.setProperty('--max-rows', String(maxCount));
  }, []);

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
