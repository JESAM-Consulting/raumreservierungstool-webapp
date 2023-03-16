import React from "react";
import "./DeineReservierungModal.scss";
export default function DeineReservierungModal() {
  return (
    <div className="modal-wrapper">
      <div className="deine-modal-box">
        <h2>Deine Reservierung:</h2>
        <div className="left-right-alignment">
          <div className="grid-input">
            <div>
              <span>Name:</span>
            </div>
            <div className="first-wdith">
              <input type="text" />
            </div>
          </div>
          <div className="grid-input">
            <div>
              <span>Raum:</span>
            </div>
            <div className="sec-wdith">
              <input type="text" />
            </div>
          </div>
          <div className="grid-input">
            <div>
              <span>Datum:</span>
            </div>
            <div className="sec-wdith">
              <input type="text" />
            </div>
          </div>
          <div className="grid-input">
            <div>
              <span>Uhrzeit:</span>
            </div>
            <div className="three-wdith">
              <input type="text" />
            </div>
          </div>
          <div className="grid-input">
            <div>
              <span>Länge:</span>
            </div>
            <div className="three-wdith">
              <input type="text" />
            </div>
          </div>
          <div className="grid-input">
            <div>
              <span>Beschreibung:</span>
            </div>
            <div className="four-wdith">
              <textarea></textarea>
            </div>
          </div>
          <div className="grid-input">
            <div></div>
            <div className="five-wdith">
              <button>Löschen</button>
              <button>Speichern</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
