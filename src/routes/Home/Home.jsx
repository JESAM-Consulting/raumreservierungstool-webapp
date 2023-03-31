import React, { useState, useEffect } from "react";
import { ApiRoutes } from "../../App";
import "./Home.scss";

import Calender from "../../components/Calender/Calender";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

// const ApiRoutes = "http://192.168.29.173:8093/api/v1";
// const ApiRoutes = "https://api.fe-scheduler.rejoicehub.com/api/v1";

export default function Home() {
  const [roomData, setRoomData] = useState([]);
  const [addMeeting, isAddMeeting] = useState(false);
  const [inputValue, setInputValue] = useState({
    roomID: "all",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(() => {
    GetRoomDetails();
  }, []);

  const GetRoomDetails = () => {
    axios
      .get(`${ApiRoutes}/meeting/room`)
      .then((response) => {
        setRoomData(response?.data?.payload);
      })
      .catch((error) => {});
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div>
        <div className="home-left-right-content-alignment">
          <div className="home-header-alignment">
            <div className="left-content">
              <p>Raumreservierung </p>
              <button>Raum reservieren</button>
            </div>
            <div className="center-content">
              <div className="select-dropdown">
                <select
                  name="roomID"
                  defaultValue={inputValue?.roomID}
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value="all">Raum auswählen</option>
                  {roomData &&
                    roomData?.map((item, i) => {
                      return <option value={item?._id}>{item?.name} ({i+1}. OG)</option>;
                    })}
                </select>
              </div>
              {/* <div className="select-dropdown">
              <select>
                <option>März 2023</option>
              </select>
            </div> */}
              {/* <div className="pagination">
            <div className="left-page">
              <img src={DoubleArrow} alt="DoubleArrow" />
              <img src={SingleArrow} alt="SingleArrow" />
            </div>
            <div className="right-page">
              <img src={DoubleArrow} alt="DoubleArrow" />
              <img src={SingleArrow} alt="SingleArrow" />
            </div>
          </div> */}
            </div>

            <div className="right-content">
              <button onClick={() => isAddMeeting(true)}>
                Raum reservieren
              </button>
            </div>
          </div>
          <Calender selectedRoom={inputValue} roomData={roomData} isAddMeeting={isAddMeeting} addMeeting={addMeeting} />


        </div>

      </div>
    </>
  );
}
