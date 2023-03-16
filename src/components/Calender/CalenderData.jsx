import { render } from "react-dom";

import * as React from "react";
import {
  Day,
  WorkWeek,
  Month,
  ScheduleComponent,
  ResourcesDirective,
  ResourceDirective,
  ViewsDirective,
  ViewDirective,
  Inject,
  TimelineViews,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { TimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { extend, L10n } from "@syncfusion/ej2-base";
import { SampleBase } from "./sample-base";
import * as dataSource from "./datasource.json";
import axios from 'axios';

// import moment from "moment";

L10n.load({
  "en-US": {
    schedule: {
      saveButton: false,
      cancelButton: false,
      deleteButton: false,
      newEvent: "Add New Appointment",
      "MORE DETAILS": false,
      editEvent: "Edit Appointment",
    },
  },
});
/**
 * schedule resources group-editing sample
 */

export class CalenderData extends SampleBase {
  constructor() {
    super(...arguments);
    this.state = {
      row: true,
      staff: [],
      data: [],
      services: [],
      customer: [],
      mobile: 0,
      name: "",
      startTime: "",
      endTime: "",
      isValid: "",
      selectStaff: "",
      allSelectedStaff: [],
      IsStaff: false,
    };
    this.fields = {
      subject: { name: "name", validation: { required: true } },
      location: { name: "serviceName", validation: { required: true } },
      
    };
    this.data = extend([], dataSource.resourceConferenceData, null, true);
  }

  getAllAppointmentData() {
    axios.get('/user?ID=12345')
    .then((response) => {
      
    })
    .catch((error) => {
        alert("hello : getAllAppointmentData")
    })
  }

  template(props) {
    return (
      <div className="tooltip-wrap">
        <div className="flex items-center">
          <div className="staff-profile">
            {/* <img src={require("./../../../assets/img/staff-profile.svg").default} /> */}
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "lightgrey",
                height: "50px",
                width: "50px",
              }}
            >
              <span className="font-size-h5 font-weight-bold text-white font-size-20">
                {/* {props && props.Subject ? props.Subject[0].toUpperCase() : "A"} */}
              </span>
            </div>
          </div>
          <div className="pl-4">
            <p className="heading-title-text-color font-size-16 font-bold tracking-normal">
              {/* {props && props.Subject} */}
            </p>
            <p className="heading-title-text-color font-size-16 font-medium tracking-normal mb-0">
              {/* {props && props.mobile} */}
            </p>
          </div>
        </div>

        <div>
          {moment(props.StartTime).format("HH:mm")} -{" "}
          {moment(props.EndTime).format("HH:mm")}
        </div>
        <div>
          <div>
            <div>
              {props &&
                props.serviceDetails &&
                props.serviceDetails.serviceName}
            </div>
            <div>
              {props && props.serviceDetails && props.serviceDetails.amount}{" "}
            </div>
          </div>
          <div>
            <div>
              {props && props.serviceDetails && props.serviceDetails.duration}{" "}
              With{" "}
              {props &&
                props.staffDetails &&
                props.staffDetails.firstName + props.staffDetails.lastName}
            </div>
          </div>

          <div>
            <div>
              This Appointment was{" "}
              {props && props.type && props.type === "prebooking"
                ? "PreBooked"
                : "Walk-in"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    // this.scheduleObj.scrollTo("12:00");
    // this.onChange();

    this.setState({ isValid: "false" });
    // this.getAllAppointmentData();

    
  }

  onActionBegin(args) {
    let data = args.data instanceof Array ? args.data[0] : args.data;
    if (args.requestType === "eventCreate") {
      let data = args.data instanceof Array ? args.data[0] : args.data;
      let ISODate = new Date(`${data.StartTime} UTC`);
      let userInfo = JSON.parse(localStorage.getItem("userinfo"));

      let element = document.getElementById("walkin");
      let type = "";

      if (element?.checked === true) {
        type = "walkin";
      } else {
        type = "prebooking";
      }
      let finalData = {
        name: data.name,
        mobile: data.mobile,
        type: type,
        serviceId: data.serviceId,
        staffId: data.staffId,
        date: moment(ISODate).add("minute", 0),
        isPromotional: data.sms,
        companyId: userInfo.companyId,
        status: 1,
      };
      ApiPost("appointment/", finalData)
        .then((res) => {
          this.getAllAppointmentData();
          data = {};
          finalData = {};
        })
        .catch((err) => {
          console.log("Error");
        });
    } else if (args.requestType === "eventChange") {
      let data = args.data instanceof Array ? args.data[0] : args.data;

      let ISODate = new Date(`${data.StartTime} UTC`);

      let userInfo = JSON.parse(localStorage.getItem("userinfo"));

      // let element = document.getElementById("walkin")
      // let type = "";

      // if (element.checked === true) {
      //   type = "walkin"
      // } else {
      //   type = "prebooking"
      // }

      let staffId =
        data.staffId instanceof Array ? data && data.staffId[0] : data.staffId;
      ApiGet("staff/" + staffId)
        .then((res) => {
          let NewStaff = res?.data?.data[0]?.firstName;

          let finalData = {
            name: data.name,
            mobile: data.mobile,
            type: data.type,
            serviceId: data.serviceId,
            staffId: staffId,
            staff: NewStaff,
            date: ISODate,
            isPromotional: data.sms,
            companyId: userInfo.companyId,
            status: 1,
          };
          ApiPut("appointment/" + data._id, finalData)
            .then((res) => {
              this.getAllAppointmentData();
              data = {};
              finalData = {};
            })
            .catch((err) => {
              console.log("Error");
            });
        })
        .catch((err) => {
          console.log("Error");
        });
    } else if (args.requestType === "eventRemove") {
      let data = args.data instanceof Array ? args.data[0] : args.data;
      let finalData = {
        status: 0,
      };
      ApiPut("appointment/" + data._id, finalData)
        .then((res) => {
          this.getAllAppointmentData();
        })
        .catch((err) => {
          console.log("Error");
        });
    }
    // if (!this.scheduleObj.isSlotAvailable(data.StartTime, data.EndTime)) {
    //   args.cancel = true;
    // }
  }

  getEmployeeName(value) {
    return value.resourceData
      ? value.resourceData[value.resource.textField]
      : value.resourceName;
  }

  getEmployeeImage(value) {
    let resourceName = this.getEmployeeName(value);
    return resourceName.replace(" ", "-").toLowerCase();
  }

  getEmployeeDesignation(value) {
    let resourceName = this.getEmployeeName(value);
    return resourceName === "Margaret"
      ? "Sales Representative"
      : resourceName === "Robert"
      ? "Vice President, Sales"
      : "";
  }

  monthEventTemplate(props) {
    return <div className="subject">{props.Subject}</div>;
  }

  resourceHeaderTemplate(props) {
    return (
      <div className="template-wrap">
        <div className={"resource-image " + this.getEmployeeImage(props)}></div>
        <div className="resource-details">
          <div className="resource-name">{this.getEmployeeName(props)}</div>
          <div className="resource-designation">
            {this.getEmployeeDesignation(props)}
          </div>
        </div>
      </div>
    );
  }

  editAppointmentModaltoggle(e) {
    this.setState({ editAppointmentmodal: false });
  }

  handleSubmit(data) {
    if (data && data[0]._id) {
      ApiPut("appointment/" + data[0]._id, data[0])
        .then((res) => {
          this.getAllAppointmentData();
          data = {};
          this.scheduleObj.closeEditor();
        })
        .catch((err) => {
          console.log("Error");
        });
    } else {
      ApiPost("appointment/", data)
        .then((res) => {
          this.getAllAppointmentData();
          data = {};
          this.scheduleObj.closeEditor();
        })
        .catch((err) => {
          console.log("Error");
        });
    }
  }

  editorTemplate(props) {
    // this.setState({ editAppointmentmodal: true })

    const uuid = uuidv4();
    return props !== undefined ? (
      <div className="">
        <div className="">
          {/* <AddNewAppointmentModal args={props} addEvent={(values) => this.handleSubmit(values)}  /> */}
          <InputMobile
            editAppointment={props}
            IsStaff={this.state.IsStaff}
            args={props}
            startTime={this.state.startTime}
            endTime={this.state.endTime}
            addEvent={(values) => this.handleSubmit(values)}
            uuid={uuid}
          />
        </div>
      </div>
    ) : (
      <div />
    );
  }
  SelectedStaff(e) {
    if (e.target.value === "alldata") {
      const staffSelect = this.state.staff;
      this.setState({ allSelectedStaff: staffSelect });
    } else {
      const staffSelect = this.state.staff.filter(
        (rep) => rep._id === e.target.value
      );
      this.setState({ allSelectedStaff: staffSelect });
    }
  }

  onEventRendered(args) {
    this.applyCategoryColor(args, this.scheduleObj.currentView);
  }

  applyCategoryColor(args, currentView) {
    let categoryColor =
      args &&
      args.data &&
      args.data.serviceDetails &&
      args.data.serviceDetails.colour;
    if (!args.element || !categoryColor) {
      return;
    }
    if (currentView === "Agenda") {
      args.element.firstChild.style.borderLeftColor = categoryColor;
    } else {
      args.element.style.backgroundColor = categoryColor;
    }
  }

  render() {
    return (
      <div className="schedule-control-section">
        <div className="control-section">
          {/* <div className="flex items-center justify-end calender-dropdown-style">
            <select type="text" className="rounded-full btn-fixed-header form-control dropdown-style1 font-medium dropdown2" onChange={(e) => this.SelectedStaff(e)}>
              <option value="alldata" className="font-size-18 font-medium">All Staff</option>
              {this.state.staff.map((rep) => {
                return (
                  <option className="font-size-18 font-medium" value={rep._id}>{rep.firstName}</option>)
              })}
            </select>
          </div> */}
          <div className="control-wrapper">
            <ScheduleComponent
              cssClass="group-editing"
              width="100%"
              height="calc(100vh - 130px)"
              enablePersistence={true}
              timeScale={{
                enable: true,
                interval: this.state.interval,
                slotCount: this.state.interval / 15,
              }}
              startHour={this.state.startTime ? this.state.startTime : "07:00"}
              endHour={this.state.endTime ? this.state.endTime : "19:00"}
              selectedDate={new Date()}
              currentView="Day"
              ref={(schedule) => (this.scheduleObj = schedule)}
              resourceHeaderTemplate={this.resourceHeaderTemplate.bind(this)}
              editorTemplate={this.editorTemplate.bind(this)}
              eventRendered={this.onEventRendered.bind(this)}
              showQuickInfo={false}
              eventSettings={{
                dataSource: this.state.data,
                fields: this.fields,
                enableTooltip: false,
                tooltipTemplate: this.template.bind(this),
              }}
              actionBegin={this.onActionBegin.bind(this)}
              // readonly={true}
              group={{
                allowGroupEdit: true,
                resources: ["Conferences"],
                //  enableCompactView: false
              }}
            >
              {/* <ResourcesDirective>
                <ResourceDirective
                  field="OwnerId"
                  title="Owner"
                  name="Owners"
                  allowMultiple={true}
                  dataSource={ownerData}
                  textField="OwnerText"
                  idField="Id"
                  colorField="OwnerColor"
                ></ResourceDirective>
              </ResourcesDirective> */}

              {/* <ViewsDirective>
                <ViewDirective option="Day" />
                <ViewDirective option="WorkWeek" />
                <ViewDirective
                  option="Month"
                  eventTemplate={this.monthEventTemplate.bind(this)}
                />
                <ViewDirective option="TimelineWeek" />
              </ViewsDirective> */}
              <Inject
                services={[
                  Day,
                  WorkWeek,
                  Month,
                  TimelineViews,
                  Resize,
                  DragAndDrop,
                ]}
              />
            </ScheduleComponent>
          </div>
          {/* <div style={{ display: "none" }}>
            <TimePickerComponent
              width={100}
              value={"12:00"}
              format="HH:mm"
              change={this.onChange.bind(this)}
            />
          </div> */}
        </div>
      </div>
    );
  }
}

// render(<GroupEditing />, document.getElementById('sample'));
export default CalenderData;
