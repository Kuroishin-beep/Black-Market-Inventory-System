import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import "../styles/Sidebar.css";
import logo from "../assets/logo.png";

// specific roles icons
import { PiHeadsetFill, PiHeadsetLight } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
import { FiPlusCircle } from "react-icons/fi";
import { BsBoxFill, BsBox } from "react-icons/bs";
import { IoCard, IoCardOutline } from "react-icons/io5";

// sidebar icons
import { GoHomeFill, GoHome } from "react-icons/go";
import { IoPricetag, IoPricetagOutline } from "react-icons/io5";
import { PiShoppingCartFill, PiShoppingCartLight } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  // 🔄 Sync active item with URL when location changes
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

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
          path: "/teamlead",
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
      default:
        return null;
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
    ...(roleButton ? [roleButton] : []),
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
