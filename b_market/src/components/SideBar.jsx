import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import "../styles/Sidebar.css";
import logo from "../assets/logo.png";

// specific roles icons
import { PiHeadsetFill } from "react-icons/pi";
import { PiHeadsetLight } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
import { FiPlusCircle } from "react-icons/fi";
import { BsBoxFill } from "react-icons/bs";
import { BsBox } from "react-icons/bs";
import { IoCard } from "react-icons/io5";
import { IoCardOutline } from "react-icons/io5";

// sidebar icons
import { GoHomeFill } from "react-icons/go";
import { GoHome } from "react-icons/go";
import { IoPricetag } from "react-icons/io5";
import { IoPricetagOutline } from "react-icons/io5";
import { PiShoppingCartFill } from "react-icons/pi";
import { PiShoppingCartLight } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";

const Sidebar = ({ userRole = "csr" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("/dashboard");

  const getRoleSpecificButton = () => {
    switch (userRole) {
      case "csr":
        return {
          name: "CSR Panel",
          iconIdle: <PiHeadsetLight />,
          iconActive: <PiHeadsetFill />,
          path: "/csr",
        };
      case "teamlead":
        return {
          name: "Approvals",
          iconIdle: <PiHeadsetLight />,
          iconActive: <PiHeadsetFill />,
          path: "/approvals",
        };
      case "procurement":
        return {
          name: "Procurement",
          iconIdle: <FiPlusCircle />,
          iconActive: <FaCirclePlus />,
          path: "/procurement",
        };
      case "warehouse":
        return {
          name: "Warehouse",
          iconIdle: <BsBox />,
          iconActive: <BsBoxFill />,
          path: "/warehouse",
        };
      case "accounting":
        return {
          name: "Accounting",
          iconIdle: <IoCardOutline />,
          iconActive: <IoCard />,
          path: "/accounting",
        };
    }
  };

  const roleButton = getRoleSpecificButton();

  const navItems = [
    {
      name: "Dashboard",
      iconIdle: <GoHome />,
      iconActive: <GoHomeFill />,
      path: "/dashboard",
    },
    {
      name: "Items",
      iconIdle: <IoPricetagOutline />,
      iconActive: <IoPricetag />,
      path: "/products",
    },
    {
      name: "Shopping Cart",
      iconIdle: <PiShoppingCartLight />,
      iconActive: <PiShoppingCartFill />,
      path: "/cart",
    },

    roleButton,
  ];

  return (
    <aside className="sidebar">
      <img className="landing-header__app--logo" src={logo} alt="logo" />

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = active === item.path;
          return (
            <Tooltip key={item.name} title={item.name} placement="right">
              <div
                className={isActive ? "nav-item active" : "nav-item"}
                onClick={() => {
                  setActive(item.path);
                  navigate(item.path);
                }}
              >
                <span className="nav-icon">
                  {isActive ? item.iconActive : item.iconIdle}
                </span>
              </div>
            </Tooltip>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Tooltip title="Logout" placement="right">
          <div
            className="logout"
            onClick={() => {
              setActive("/");
              navigate("/");
            }}
          >
            <span className="nav-item logout">
              <IoLogOutOutline />
            </span>
          </div>
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;
