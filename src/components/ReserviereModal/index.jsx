import React, { useState, useEffect } from "react";
import { ApiRoutes } from "../../App";
import "./ReserviereModal.scss";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ApiRoutes from "../../ApiRoute"

// const ApiRoutes = "http://192.168.29.173:8093/api/v1";
// const ApiRoutes = "https://api.fe-scheduler.rejoicehub.com/api/v1";



export default function ReserviereModal(props) {
  const { addEvent, getScheduleDetail, event, isAddMeeting, roomData } = props;
  const date = new Date()
  console.log("datedate",date);
  const [errors, setErrors] = useState({});
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

  useEffect(() => {
    // GetRoomDetails();
    if (event) {
      if (event?.id) {
        setInputValue({
          name: event?.Subject,
          room_id: event?.room_id,
          time: "",
          length: event?.length,
          description: event?.description,
          startDate: moment(event?.StartTime).format("YYYY-MM-DD"),
          endDate: moment(event?.EndTime).format("YYYY-MM-DD"),

          startTime: moment(event?.StartTime).format("HH:mm"),
          endTime: moment(event?.EndTime).format("HH:mm"),
        });
      } else {
        setInputValue({
          name: "",
          room_id: "",
          time: "",
          length: "",
          description: "",
          startDate: moment(event?.StartTime).format("YYYY-MM-DD"),
          endDate: moment(event?.EndTime).format("YYYY-MM-DD"),

          startTime: moment(event?.StartTime).format("HH:mm"),
          endTime: moment(event?.EndTime).format("HH:mm"),
        });
      }
    } else {
      console.log("eventevent",event);

      setInputValue({
        name: "",
        room_id: "",
        time: "",
        length: "",
        description: "",
        startDate: moment(event?.StartTime).format("YYYY-MM-DD"),
        endDate: moment(event?.EndTime).format("YYYY-MM-DD"),

        startTime: moment(event?.StartTime).format("HH:mm"),
        endTime: moment(event?.EndTime).add(30, "minute").format("HH:mm"),
      });
    }
  }, []);

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
    setInputValue({ ...inputValue, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validationData = () => {
    let isFormValid = true;
    let errors = {};

    if (inputValue && !inputValue?.name) {
      isFormValid = false;
      errors["name"] = "*Bitte geben Sie den Titel ein";
    }
    if (inputValue && !inputValue?.room_id) {
      isFormValid = false;
      errors["roomId"] = "*Bitte wählen Sie Raum";
    }
    if (inputValue && !inputValue?.startDate) {
      isFormValid = false;
      errors["startDate"] = "*Bitte wählen Sie Datum";
    }
    if (inputValue && !inputValue?.startTime) {
      isFormValid = false;
      errors["startTime"] = "*Bitte wählen Sie Startzeit";
    }
    if (inputValue && !inputValue?.endTime) {
      isFormValid = false;
      errors["endTime"] = "*Bitte wählen Sie die Zeit der Enf";
    }
    // if (inputValue && !inputValue?.length) {
    //   isFormValid = false;
    //   errors["length"] = "*eingeben Länge";
    // }
    // if (inputValue && !inputValue?.description) {
    //   isFormValid = false;
    //   errors["description"] = "*Bitte geben Sie eine Beschreibung ein";
    // }

    setErrors(errors);
    return isFormValid;
  };

  const handleOnSubmitData = async () => {

    if (validationData()) {

      const payload = {
        name: inputValue?.name,
        room_id: inputValue?.room_id,
        startDate: inputValue?.startDate,
        endDate: inputValue?.endDate,

        startTime: `${inputValue?.startDate}T${inputValue?.startTime}:00.000Z`,
        endTime: `${inputValue?.startDate}T${inputValue?.endTime}:00.000Z`,
        // startTime: moment(`${inputValue?.startDate}T${inputValue?.startTime}:00.0000Z`).

        // length: inputValue?.length,
        description: inputValue?.description, 
      };
      await axios
        .post(`${ApiRoutes}/meeting`, payload)
        .then((res) => {
          if (event === undefined) {
            isAddMeeting(false);
          } else {
            addEvent();
          }
          getScheduleDetail();
          toast.success("Meeting erfolgreich gebucht");
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message === "Meeting already exists."
              ? "Treffen existiert bereits."
              : error?.response?.data?.message === "meeting start time or end time greter than current time or metting endtime before start time" ? 
              "Besprechung der Startzeit oder der Endzeit über die aktuelle Zeit- oder Besprechungsende vor der Startzeit"
              : "Etwas ist schief gelaufen!!"
          );
        });
    }
  };


  const handleOnUpdate = () => {
    if (validationData()) {
      const payload = {
        name: inputValue?.name,
        room_id: inputValue?.room_id,
        startDate: inputValue?.startDate,
        endDate: inputValue?.endDate,

        startTime: `${inputValue?.startDate}T${inputValue?.startTime}:00.000Z`,
        endTime: `${inputValue?.startDate}T${inputValue?.endTime}:00.000Z`,

        // length: inputValue?.length,
        ...inputValue?.description && ({
          description: inputValue?.description,
        }),
       
      };
      axios
        .put(`${ApiRoutes}/meeting/${event?.id}`, payload)
        .then((response) => {
          addEvent();
          toast.success("Buchungsaktualisierung erfolgreich!");
          getScheduleDetail();
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message === "Meeting already exists."
              ? "Treffen existiert bereits."
              : error?.response?.data?.message === "meeting start time or end time greter than current time or metting endtime before start time" ? 
              "Besprechung der Startzeit oder der Endzeit über die aktuelle Zeit- oder Besprechungsende vor der Startzeit"
              : "Etwas ist schief gelaufen!!"
          );
        });
    }
  };

  const handleOnDelete = () => {
    axios
      .delete(`${ApiRoutes}/meeting/${event?.id}`)
      .then((response) => {
        addEvent();
        toast.success("Buchung erfolgreich gelöscht!");
        getScheduleDetail();
      })
      .catch((error) => {
        toast.error("Etwas ist schief gelaufen!!");
      });
  };

  console.log("inputValue?.repeatData",inputValue?.repeatData);

  return (
    <div>
      <div className="modal-wrapper">
        <div className="reserviere-modal-box">
          <div className="header-title">
            <h2>
              {event?.id
                ? "Deine Reservierung:"
                : "Reserviere hier einen Meetingraum"}{" "}
            </h2>
            <button onClick={() => (event ? addEvent() : isAddMeeting(false))}>
              X
            </button>
          </div>
          <div className="left-right-alignment">
            <div className="grid-input">
              <div>
                <span>Name:</span>
              </div>
              <div className="first-wdith">
                <input
                  type="text"
                  name="name"
                  value={inputValue?.name}
                  onChange={(e) => handleOnChange(e)}
                />
                <span style={{ color: "red", textAlign: "left" }}>
                  {errors["name"]}
                </span>
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>Raum:</span>
              </div>
              <div className="select-dropdown">
                <select
                  name="room_id"
                  id="room_id"
                  value={inputValue?.room_id}
                  onChange={(e) => handleOnChange(e)}
                >
                  <option selected>Raum auswählen</option>
                  {roomData &&
                    roomData?.map((item, i) => {
                      if (item?._id === '65cf4ce5c25a98eeae13e75b') {
                        return null; // Skip rendering this option
                      }
                      let floorNumber = (item?._id === '65cf5249c25a98eeae13e7af') ? i+1-2 : i+1;
                      return <option value={item?._id}>{item?.name} ({floorNumber}. OG)</option>;
                    })}
                </select>

                <span style={{ color: "red", textAlign: "left" }}>
                  {errors["roomId"]}
                </span>
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>Datum:</span>
              </div>
              <div className="sec-wdith">
                <input
                  type="date"
                  lang="de"
                  name="startDate"
                  value={inputValue?.startDate}
                  onChange={(e) => handleOnChange(e)}
                />
                <span style={{ color: "red", textAlign: "left" }}>
                  {errors["startDate"]}
                </span>
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>Startzeit:</span>
              </div>
              <div className="three-wdith">
                <input
                  type="time"
                  name="startTime"
                  value={inputValue?.startTime}
                  onChange={(e) => handleOnChange(e)}
                />
                <span style={{ color: "red", textAlign: "left" }}>
                  {errors["startTime"]}
                </span>
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>Endzeit:</span>
              </div>
              <div className="three-wdith">
                <input
                  type="time"
                  name="endTime"
                  value={inputValue?.endTime}
                  onChange={(e) => handleOnChange(e)}
                />
                <span style={{ color: "red", textAlign: "left" }}>
                  {errors["endTime"]}
                </span>
              </div>
            </div>
            <div className="grid-input">
              <div>
                <span>Repeat:</span>
              </div>
              <div className="select-dropdown">
                <select
                  name="repeatData"
                  id="repeatData"
                  value={inputValue?.repeatData}
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value="Doesnotrepeat">Does not repeat</option>
                  <option value="everyDay">Every day</option>
                  <option value="everyWeek">Every Week</option>
                  <option value="everyMonth">Every month</option>
                  <option value="everyYear">Every year</option>
                  <option value="Custom">Custom...</option>
                </select>

                <span style={{ color: "red", textAlign: "left" }}>
                  {errors["roomId"]}
                </span>
              </div>
            </div>
            {/* <div className="grid-input">
              <div>
                <span>Länge:</span>
              </div>
              <div className="three-wdith">
                <input
                  type="number"
                  name="length"
                  value={inputValue?.length}
                  onChange={(e) => handleOnChange(e)}
                />
                <span style={{ color: "red", textAlign: "left" }}>
                  {errors["length"]}
                </span>
              </div>
            </div> */}
            <div className="grid-input">
              <div>
                <span>Beschreibung:</span>
              </div>
              <div className="four-wdith">
                <textarea
                  name="description"
                  value={inputValue?.description}
                  onChange={(e) => handleOnChange(e)}
                ></textarea>
                <span style={{ color: "red", textAlign: "left" }}>
                  {errors["description"]}
                </span>
              </div>
            </div>
            <div className="grid-input">
              <div></div>
              <div className="five-wdith">
                {event?.id ? (
                  <>
                    <button onClick={() => handleOnDelete()}>Löschen</button>
                    <button onClick={() => handleOnUpdate()}>Speichern</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleOnSubmitData()}>
                      Speichern
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
