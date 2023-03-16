import React , {useState, useEffect} from "react";
import "./Home.scss";
import DoubleArrow from "../../assets/icons/double-arrwo.svg";
import SingleArrow from "../../assets/icons/single-arrow.svg";
import ReserviereModal from "../../components/ReserviereModal";
import DeineReservierungModal from "../../components/DeineReservierungModal";
import Calender from "../../components/Calender/Calender";
import CalenderData from "../../components/Calender/CalenderData";
import axios from "axios";

const ApiRoutes = "http://192.168.29.173:8093/api/v1";

export default function Home() {

  const [roomData, setRoomData] = useState([]);


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
    <div>
      <div className="home-left-right-content-alignment">
        <div className="home-header-alignment">
          <div className="left-content">
            <p>Raumreservierung </p>
            <button>Raum reservieren</button>
          </div>
          <div className="center-content">
            <div className="select-dropdown">
              <select>
                {roomData &&
                    roomData?.map((item, i) => {
                      return <option value={item?._id}>{item?.name}</option>;
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
          <button>Raum reservieren</button>
        </div>
      </div>
      <Calender/>
      </div>
      {/* <ReserviereModal/> */}
      {/* <DeineReservierungModal/> */}
     
        {/* <CalenderData/> */}


    </div>
  );
}
