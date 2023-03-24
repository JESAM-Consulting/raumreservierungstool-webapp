import * as ReactDOM from "react-dom";
import React, { useEffect, useState, useRef } from "react";
import { ApiRoutes } from "../../App";
import {
  Month,
  Inject,
  ScheduleComponent,
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
import { registerLicense } from "@syncfusion/ej2-base";
import * as numberingSystems from "./culture-files/numberingSystems.json";
import * as gregorian from "./culture-files/ca-gregorian.json";
import * as numbers from "./culture-files/numbers.json";
import * as timeZoneNames from "./culture-files/timeZoneNames.json";
import { Ajax, L10n, loadCldr } from "@syncfusion/ej2-base";

// const ApiRoutes = "http://192.168.29.173:8093/api/v1";
// const ApiRoutes = "https://api.fe-scheduler.rejoicehub.com/api/v1";

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);

L10n.load({
  de: {
    schedule: {
      day: "Heute",
      week: "Woche",
      workWeek: "Arbeitswoche",
      month: "Monat",
      agenda: "Agenda",
      weekAgenda: "Agenda de la semana",
      workWeekAgenda: "Agenda de la semana laboral",
      monthAgenda: "Agenda del mes",
      today: "Heute",
    },
    recurrenceeditor: {
      none: "Ninguna",
      daily: "Diario",
      weekly: "Semanal",
      monthly: "Mensual",
      month: "Mes",
      yearly: "Anual",
      never: "Nunca",
      until: "Hasta",
      count: "Contar",
      first: "primero",
      second: "Segundo",
      third: "Tercero",
      fourth: "Cuarto",
      last: "Último",
      repeat: "Repetir",
      repeatEvery: "Repite cada",
      on: "Repetir en",
      end: "Final",
      onDay: "Día",
      days: "Dias)",
      weeks: "Semanas)",
      months: "Meses)",
      years: "Años)",
      every: "cada",
      summaryTimes: "veces)",
      summaryOn: "en",
      summaryUntil: "hasta",
      summaryRepeat: "Repite",
      summaryDay: "dias)",
      summaryWeek: "semanas)",
      summaryMonth: "meses)",
      summaryYear: "años)",
      monthWeek: "Mes Semana",
      monthPosition: "Posición del mes",
      monthExpander: "Expansor de mes",
      yearExpander: "Expansor de año",
      repeatInterval: "Intervalo de repetición",
    },
    calendar: {
      today: "Heute",
    },
  },
});

registerLicense(
  "MTM4NTc4OUAzMjMwMmUzNDJlMzBmSFFvZ25qMW9IVFUrem1hQVRNVDNXV3diMGJLSXdHNUIwOTBIZEFRb3RRPQ==;Mgo DSMBaFt/QHRqVVhkVFpHaV1KQmFJfFBmRGlafFRzdUU3HVdTRHRcQl5hSH5SdUZgWHdfc30=;Mgo DSMBMAY9C3t2VVhkQlFacldJXnxLdkx0RWFab196d1ZMY11BNQtUQF1hSn5QdERjWHxdc3VdRGVV;Mgo DSMBPh8sVXJ0S0J XE9AflRBQmFBYVF2R2BJflRzd19FYUwgOX1dQl9gSX1Rd0ViWnxdcXxWTmk=;MTM4NTc5M0AzMjMwMmUzNDJlMzBMV1B0aDJiR1o2MkhjZ2xHdDdYZ29ZY2FBbXliTSszdnVGU2pJR2RTMzdNPQ==;NRAiBiAaIQQuGjN/V0Z WE9EaFtKVmBWfFtpR2NbfE5xflZFal9QVAciSV9jS31TdUdiWX5dc3dUTmdZWA==;ORg4AjUWIQA/Gnt2VVhkQlFacldJXnxLdkx0RWFab196d1ZMY11BNQtUQF1hSn5QdERjWHxdc3VdT2ZV;MTM4NTc5NkAzMjMwMmUzNDJlMzBjTCs0NHFlL21md01EKzgzdmcxSjE2ak1MV2dRQTZjbUZjZ293ZTN6N1VvPQ==;MTM4NTc5N0AzMjMwMmUzNDJlMzBPTSswMG4rbm1qOG83dUY4OGF5THZHOVVWQVlwTUxKWGQ0YmJoR3diWmxnPQ==;MTM4NTc5OEAzMjMwMmUzNDJlMzBCWDBCUWdTWkhZbTFSeFRUQ2xiVHBNdWIzejlIKytOTllIT0RybDdxczJNPQ==;MTM4NTc5OUAzMjMwMmUzNDJlMzBJQS9BVGxYV2s1MHdwcWEzeXBPNFFVd3IxUzJHVFJmVWZyUlJyUTZQV2JBPQ==;MTM4NTgwMEAzMjMwMmUzNDJlMzBmSFFvZ25qMW9IVFUrem1hQVRNVDNXV3diMGJLSXdHNUIwOTBIZEFRb3RRPQ=="
);

function Calender(props: any) {
  const { selectedRoom, isAddMeeting, roomData, addMeeting } = props;
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
        const array: any = [];
        
        if (selectedRoom?.roomID === "all") {

          res?.data?.payload?.data?.map((data: any, i: any) => {

            
            const test: any = {
              id: data?._id,
              Subject: data?.name,
              // StartTime: moment(data?.startTime).utc(),
              // EndTime: moment(data?.endTime).utc(),
              StartTime: moment(data?.startTime).subtract(60, "minute")._d,
              EndTime: moment(data?.endTime).subtract(60, "minute")._d,
              length: data?.length,
              description: data?.description,
              room_id: data?.room_id?._id,
              RoomColor: "#7499e1",
            };
            console.log("data?.startTime",data);

            array.push(test);
          });
        } else {
          const FilterData = res?.data?.payload?.data?.filter(
            (item: any) => item?.room_id?._id === selectedRoom?.roomID
          );
          FilterData?.map((data: any, i: any) => {
            const Filterobj: any = {
              id: data?._id,
              Subject: data?.name,
              StartTime: moment(data?.startTime).subtract(60, "minute")._d,
              EndTime: moment(data?.endTime).subtract(60, "minute")._d,
              // length: data?.length,
              description: data?.description,
              room_id: data?.room_id?._id,
            };
            array.push(Filterobj);
          });
        }
        setMeetingData(array);
      })
      .catch((error) => {

      });
  };

  const handleSubmit = () => {
    scheduleObj.closeEditor();
  };

  const editorTemplate = (event: any, props: any) => {
    return props !== undefined ? (
      <div>
        <div>
          <ReserviereModal
            addEvent={() => handleSubmit()}
            event={event}
            editAppointment={props}
            getScheduleDetail={() => getScheduleDetails()}
            selectedRoom={selectedRoom}
            setMeetingData={setMeetingData}
            roomData={roomData}
          />
        </div>
      </div>
    ) : (
      <div />
    );
  };

  const onEventRendered = (args: any) => {
    applyCategoryColor(args);
  };
  const applyCategoryColor = (args: any) => {
    let categoryColor = "#144337";
    args.element.style.backgroundColor = categoryColor;
  };

  return (
    <>

      <ScheduleComponent
        locale="de"
        selectedDate={new Date()}
        width="100%"
        height="700px"
        eventSettings={{
          dataSource: meetingData,
        }}
        timeScale={{ slotCount: 2 }}
        delayUpdate="true"
        timeFormat="HH:mm"
        cssClass="group-editing"
        editorTemplate={(e: any) => editorTemplate(e, isAddEvent)}
        showQuickInfo={false}
        ref={(schedule) => (scheduleObj = schedule)}
        eventRendered={(event) => onEventRendered(event)}
      >
        <ResourcesDirective>
          <ResourceDirective colorField="RoomColor" />
        </ResourcesDirective>

        <ViewsDirective>
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Week" />
          <ViewDirective option="Month" showWeekend={true} />
        </ViewsDirective>

        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>

      {addMeeting && (
        <ReserviereModal
          roomData={roomData}
          isAddMeeting={isAddMeeting}
          getScheduleDetail={getScheduleDetails}
        />
      )}
    </>
  );
}
export default Calender;
