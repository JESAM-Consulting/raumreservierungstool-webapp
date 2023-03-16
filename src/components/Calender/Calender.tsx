import * as ReactDOM from "react-dom";
import React, { useEffect, useState , useRef} from "react";
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
import axios from 'axios';
import moment from "moment";

const ApiRoutes = "http://192.168.29.173:8093/api/v1"

function Calender() {

  let scheduleObj = useRef<any>(null)
  const [meetingData, setMeetingData] = useState<any>([])
  const [isAddEvent, setIsAddEvent] = useState<any>({
    name:"",
    Raum:"",
    Datum:"",
    Uhrzeit:"",
    Länge :"",
    Beschreibung:""
  })

  useEffect(() => {
    getScheduleDetails()
  },[])

  console.log("meetingData",meetingData);
  

  const getScheduleDetails = () => {
    axios.get(`${ApiRoutes}/meeting`)
    .then((res) => { 
      console.log("Beschreibung",res?.data?.payload?.data);
      // setMeetingData(res?.data?.payload?.data)
      const array = [];

      res?.data?.payload?.data?.map((data:any,i:any) => {
       const test:any = {
         id:data?._id,
         Subject:data?.name,
         StartTime:moment(data?.startTime).subtract(330,"minute")._d  ,
         EndTime:moment(data?.endTime).subtract(330,"minute")._d
      }
      array.push(test)
      })
      setMeetingData(array)
      
    })
    .catch((error) => {
        alert("Error")
    })
  }

  const handleSubmit = () => {
      scheduleObj.closeEditor();
  }

  const data = [
    {
      Id: 1,
      Subject: "Meeting",
      StartTime: new Date(2023, 2, 15, 10, 0),
      EndTime: new Date(2023, 2, 15, 12, 30),
      Status: 'Completed',
      Priority: 'High'
    },
    {
      Id: 2,
      Subject: "Meeting 2",
      StartTime: new Date(2023, 2, 16, 10, 0),
      EndTime: new Date(2023, 2, 16, 12, 30),
      Status: 'Completed',
      Priority: 'High'
    },
  ];

  const editorTemplate =(event:any, props:any) => {
      console.log("sdasdasd",event);
      
    return props !== undefined ? (
      <div >
        <div >
          {/* <InputMobile
            editAppointment={props}
            IsStaff={this.state.IsStaff}
            args={props}
            startTime={this.state.startTime}
            endTime={this.state.endTime}
            addEvent={(values) => this.handleSubmit(values)}
          /> */}
          <ReserviereModal 
            addEvent={()=> handleSubmit()}
            event={event}
            editAppointment={props}
            getScheduleDetails={getScheduleDetails}
          />
        </div>
      </div>
    ) : (
      <div />
    );
  }


  return (
    <>
      <ScheduleComponent
        selectedDate={new Date()}
        eventSettings={{
          dataSource: meetingData,
        }}
        cssClass="group-editing"
        // resourceHeaderTemplate={(e)=>resourceHeaderTemplate(e,isAddEvent)}
        editorTemplate={(e)=>editorTemplate(e,isAddEvent)}
        // eventRendered={(e)=> onEventRendered(e)}
        showQuickInfo={false}
        ref={(schedule) =>(scheduleObj = schedule)
        }

        // width="100%"
        // height="550px"
      >
        <ViewsDirective>
          <ViewDirective option="WorkWeek" startHour="10:00" endHour="18:00" />
          <ViewDirective option="Week" startHour="07:00" endHour="15:00" />
          <ViewDirective option="Month" showWeekend={false} />
        </ViewsDirective>

        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </>
  );
}
export default Calender;
