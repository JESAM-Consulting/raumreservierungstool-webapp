import React, { useState, useEffect } from "react";
import "./ReserviereModal.scss";
import axios from "axios";
import moment from "moment";

const ApiRoutes = "http://192.168.29.173:8093/api/v1";

export default function ReserviereModal(props) {
  const { addEvent, editAppointment, event, getScheduleDetails } = props;
  const [inputValue, setInputValue] = useState({
    name: "",
    room_id: "",
    startDate: "",
    endDate: "",

    startTime: "",
    endTime: "",

    length: "",
    description: "",
  });
  const [roomData, setRoomData] = useState([]);
  const [key, setKey] = useState(false);



  
  useEffect(() => {
    GetRoomDetails();
    console.log("event",event);
    if (event) {
      setInputValue({
        name: "",
        room_id: "",
        time: "",
        length: "",
        description: "",
        startDate: moment(event?.StartTime).format("YYYY-MM-DD"),
        endDate: moment(event?.EndTime).format("YYYY-MM-DD"),

        startTime:moment(event?.StartTime).format("HH:mm"),
        endTime: moment(event?.EndTime).format("HH:mm")
      });
    }
  }, []);

  console.log("adsdasasd", inputValue);

  const GetRoomDetails = () => {
    axios
      .get(`${ApiRoutes}/meeting/room`)
      .then((response) => {
        setRoomData(response?.data?.payload);
      })
      .catch((error) => {});
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if(name === "startTime" || name === "endTime"){
        setKey(true)
    }
    setInputValue({ ...inputValue, [name]: value });
  };
  

  const handleOnSubmitData = () => {
    const payload = {
      name: inputValue?.name,
      room_id: inputValue?.room_id,
      startDate: inputValue?.startDate,
      endDate: inputValue?.endDate,
      // startDate :event?.StartTime,
      // endDate:event?.EndTime, moment().format();
    //   startTime: moment(inputValue?.startTime).format("hh:mm"),
    //   endTime :moment(inputValue?.endTime).format("hh:mm"),

    
      startTime: `${inputValue?.startDate}T${inputValue?.startTime}:00.000Z` ,
      endTime :`${inputValue?.startDate}T${inputValue?.endTime}:00.000Z` ,
      

      length: inputValue?.length,
      description: inputValue?.description,
    };
    axios
      .post(`${ApiRoutes}/meeting`, payload)
      .then((response) => {
        alert("sucess");
        addEvent();
        getScheduleDetails();
        setKey(false)
      })
      .catch((error) => {
        alert("error");
      });
  };

  return (
    <div>
      <div className="modal-wrapper">
        <div className="reserviere-modal-box">
          <button onClick={() => addEvent()}>X</button>
          <h2>
            Reserviere hier einen Meetingraum
          </h2>
          <div className="left-right-alignment">
            <div className="grid-input">
              <div>
                <span>Name:</span>
              </div>
              <div className="first-wdith">
                <input
                  type="text"
                  name="name"
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>Raum:</span>
              </div>
              <div className="sec-wdith">
                <select name="room_id" onChange={(e) => handleOnChange(e)}>
                  {roomData &&
                    roomData?.map((item, i) => {
                      return <option value={item?._id}>{item?.name}</option>;
                    })}
                </select>

                {/* <input type="text" /> */}
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>Datum:</span>
              </div>
              <div className="sec-wdith">
                <input
                  type="date"
                  name="startDate"
                  value={inputValue?.startDate}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>Uhrzeit:</span>
              </div>
              <div className="three-wdith">
                <input
                  type="time"
                  name="startTime"
                  value={inputValue?.startTime}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>endTime:</span>
              </div>
              <div className="three-wdith">
                <input
                  type="time"
                  name="endTime"
                  value={inputValue?.endTime}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>Länge:</span>
              </div>
              <div className="three-wdith">
                <input
                  type="text"
                  name="length"
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>Beschreibung:</span>
              </div>
              <div className="four-wdith">
                <textarea
                  name="description"
                  onChange={(e) => handleOnChange(e)}
                ></textarea>
              </div>
            </div>
            <div className="grid-input">
              <div></div>
              <div className="five-wdith">
                <button onClick={() => handleOnSubmitData()}>Speichern</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
