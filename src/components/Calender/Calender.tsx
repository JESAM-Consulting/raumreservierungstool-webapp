import * as ReactDOM from "react-dom";
import React, { useEffect, useState, useRef } from "react";
import {
  Month,
  EventFieldsMapping,
  Inject,
  PopupOpenEventArgs,
  ActionEventArgs,
  ToolbarActionArgs,
  ScheduleComponent,
  Schedule,
  ViewsDirective,
  ViewDirective,
  ResourcesDirective,
  ResourceDirective,
  Day,
  Week,
  WorkWeek,
  Agenda,
} from "@syncfusion/ej2-react-schedule";
import ReserviereModal from "../ReserviereModal";
import axios from "axios";
import moment from "moment";

// const ApiRoutes = "http://192.168.29.173:8093/api/v1";
const ApiRoutes = "https://api.fe-scheduler.rejoicehub.com/api/v1";

function Calender(props:any) {
  const { selectedRoom ,isAddMeeting ,  roomData , addMeeting} = props;
  let scheduleObj = useRef<any>();  
  const [meetingData, setMeetingData] = useState<any>([]);
  const [isAddEvent, setIsAddEvent] = useState<any>({
    name: "",
    Raum: "",
    Datum: "",
    Uhrzeit: "",
    Länge: "",
    Beschreibung: "",
  });


  useEffect(() => {
    getScheduleDetails();
  }, [selectedRoom]);

  const getScheduleDetails = async () => {
    await axios
      .get(`${ApiRoutes}/meeting`)
      .then((res) => {
        const array:any = [];
        
        if (selectedRoom?.roomID === "all") {
          res?.data?.payload?.data?.map((data: any, i: any) => {
            const test: any = {
              id: data?._id,
              Subject: data?.name,
              StartTime: moment(data?.startTime).subtract(330, "minute")._d,
              EndTime: moment(data?.endTime).subtract(330, "minute")._d,
              length: data?.length,
              description:data?.description,
              room_id : data?.room_id?._id
            };
            array.push(test);
          });
        }else{
          const FilterData = res?.data?.payload?.data?.filter((item:any) => item?.room_id?._id === selectedRoom?.roomID)
          FilterData?.map((data: any, i: any) => {
            const Filterobj: any = {
              id: data?._id,
              Subject: data?.name,
              StartTime: moment(data?.startTime).subtract(330, "minute")._d,
              EndTime: moment(data?.endTime).subtract(330, "minute")._d,
              length: data?.length,
              description:data?.description,
              room_id : data?.room_id?._id
            };
            array.push(Filterobj);
          });
            
        }
        setMeetingData(array);
      })
      .catch((error) => {
        // alert("Error");
      });
  };

  const handleSubmit = () => {
    scheduleObj.closeEditor();
  };

  const data = [
    {
      Id: 1,
      Subject: "Meeting",
      StartTime: new Date(2023, 2, 15, 10, 0),
      EndTime: new Date(2023, 2, 15, 12, 30),
      Status: "Completed",
      Priority: "High",
    },
    {
      Id: 2,
      Subject: "Meeting 2",
      StartTime: new Date(2023, 2, 16, 10, 0),
      EndTime: new Date(2023, 2, 16, 12, 30),
      Status: "Completed",
      Priority: "High",
    },
  ];

  const editorTemplate = (event: any, props: any) => {
    if(event?.id){
      const FilterData = meetingData?.find((item:any) => item?.id === event?.id)
      console.log("FilterDaweqweta",FilterData);
    }

    
    return props !== undefined ? (
      <div>
        <div>
        
          <ReserviereModal
            addEvent={() => handleSubmit()}
            event={event}
            editAppointment={props}
            getScheduleDetail={()=>getScheduleDetails()}
            selectedRoom = {selectedRoom}
            setMeetingData={setMeetingData}
            roomData={roomData}
          />
        </div>
      </div>
    ) : (
      <div />
    );
  };

  return (
    <>
    
      <ScheduleComponent
      
        selectedDate={new Date()}
        width="100%"
        height="700px"
        eventSettings={{
          dataSource: meetingData,
        }} 
        timeScale={{slotCount:2}}
        
        // timeScale={{
        //         enable: true,
        //         interval: this.state.interval,
        //         slotCount: this.state.interval / 15,
        //       }}  
        cssClass="group-editing"
        editorTemplate={(e:any) => editorTemplate(e, isAddEvent)}
        showQuickInfo={false}
        ref={(schedule) => (scheduleObj = schedule)}
        // startHour={"01:00"}
        // endHour={"12:00"}
      
      >
        <ViewsDirective>
          <ViewDirective option="WorkWeek" startHour="00:00" endHour="24:00" />
          <ViewDirective option="Week" startHour="00:00" endHour="24:00" />
          <ViewDirective option="Month" showWeekend={false} />
        </ViewsDirective>

        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>

          {addMeeting && <ReserviereModal roomData={roomData} isAddMeeting={isAddMeeting} getScheduleDetail={getScheduleDetails}/>}

    </>
  );
}
export default Calender;
