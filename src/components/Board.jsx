import React from 'react';
import './Board.css';

function Board(){
  return (
    <div className="board-wrap">
      <header className="board-header">
            <h1 className="title">AYSO 128 Concessions</h1>
      </header>

      <main className="grid">
        <section className="card">
          <h2>Snacks</h2>
          <div className="items">
            <div className="row"><span className="name">Mini Donuts</span><span className="price">0.75</span></div>
            <div className="row"><span className="name">Hot Dogs <span className="note">beef</span></span><span className="price">1.50</span></div>
            <div className="row"><span className="name">Yogurt Pouch</span><span className="price">1.00</span></div>
            <div className="row"><span className="name">Juice Box</span><span className="price">1.00</span></div>
            <div className="row"><span className="name">Goldfish</span><span className="price">0.75</span></div>
            <div className="row"><span className="name">Nachos</span><span className="price">3.00</span></div>
            <div className="row"><span className="name">Popcorn</span><span className="price">1.50</span></div>
          </div>
        </section>

        <section className="card">
          <h2>Beverages</h2>
          <div className="items">
            <div className="row"><span className="name">Cans <span className="note">Coke, Diet Coke, Sprite, Dr P, Diet Dr P</span></span><span className="price">1.00</span></div>
            <div className="row"><span className="name">Water</span><span className="price">1.00</span></div>
            <div className="row"><span className="name">Gatorade <span className="note">Blue, Red, Yellow, White Frost, Orange Zero</span></span><span className="price">2.50</span></div>
            <div className="row"><span className="name">Root Beer / Sprite Zero <span className="note">caff-free</span></span><span className="price">1.00</span></div>
            <div className="row"><span className="name">Coffee or Cocoa</span><span className="price">1.00</span></div>
          </div>
        </section>

        <section className="card">
          <h2>Treats</h2>
          <div className="items">
            <div className="row"><span className="name">BOBO PB + J</span><span className="price">2.00</span></div>
            <div className="row"><span className="name">BelVita</span><span className="price">0.75</span></div>
            <div className="row"><span className="name">Slim Jim</span><span className="price">0.50</span></div>
            <div className="row"><span className="name">Fruit <span className="note">oranges 2 for $1</span></span><span className="price">1.00</span></div>
            <div className="row"><span className="name">Oreo Cookies</span><span className="price">1.00</span></div>
            <div className="row"><span className="name">AirHeads</span><span className="price">0.50</span></div>
            <div className="row"><span className="name">Honey Buns</span><span className="price">1.00</span></div>
            <div className="row"><span className="name">Muffins</span><span className="price">1.50</span></div>
            <div className="row"><span className="name">Trail Mix</span><span className="price">1.00</span></div>
            <div className="row"><span className="name">Chips</span><span className="price">1.00</span></div>
            <div className="row"><span className="name">Fruit Snacks</span><span className="price">0.50</span></div>
            <div className="row"><span className="name">Chocolate Bars / Skittles / Bottle Pops</span><span className="price">2.00</span></div>
          </div>
        </section>
      </main>

      <footer className="board-footer">
        <span className="dot" aria-hidden="true"></span>
        <span className="hint">Prices include tax where applicable • Card or cash accepted</span>
      </footer>
    </div>
  );
}

export default Board;
