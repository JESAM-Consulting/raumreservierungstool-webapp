import React, { useState } from "react";
import "./header.scss";
import HomeIcon from "../../../assets/icons/home.svg";
import MobileMenu from "../../../assets/icons/mobile-menu.svg";
import MobileLogo from "../../../assets/logo/mobile-logo.svg";
import Icon from "../../../assets/icons/icon.svg";

export default function Header() {
  const [mobileheader, setMobileheader] = useState(false);

  var today = new Date();
  var hourNow = today.getHours();
  var greeting;

  const daynightFuction = () => {
    if (hourNow > 18) {
      return "Guten Morgen!";
    } else if (hourNow > 0) {
      return "Guten Tag!";
    } else if (hourNow > 12) {
      return "Guten Abend";
    } else {
      return "Willkommen!";
    }
  }


  return (
    <div>
      <header>
        <div className="left-content">
          <span>Zollpfad 4, 28217 Bremen</span>
          <img src={HomeIcon} alt="HomeIcon" />
        </div>
        <div className="mobile-view-logo">
          <img src={MobileLogo} alt="MobileLogo" />
        </div>
        <div className="right-content">
          <div className="profile">
            <span>{daynightFuction()}</span>
            <div className="round"></div>
          </div>
          <div
            className="mobile-menu"
            onClick={() => setMobileheader(!mobileheader)}
          >
            <img src={MobileMenu} alt="MobileMenu" />
          </div>
        </div>
      </header>
      <div className="mobile-view-sub-header-show">
        <div className="content-style">
          <span>Zollpfad 4, 28217 Bremen</span>
          <img src={HomeIcon} alt="HomeIcon" />
        </div>
      </div>
      {mobileheader && <div className="mobile-sidebar-wrapper"></div>}
      <div
        className={
          mobileheader
            ? "mobile-sidebar-design header-show"
            : "mobile-sidebar-design header-hidden"
        }
      >
        <div className="m-header">
          <img src={MobileLogo} alt="MobileLogo" />
          <i
            onClick={() => setMobileheader(false)}
            class="fa-solid fa-xmark"
          ></i>
        </div>
        <div className="m-body">
          <div className="menu">
            <div>
              <img src={Icon} alt="Icon" />
            </div>
            <div>
              <span>Raumreservierung</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
