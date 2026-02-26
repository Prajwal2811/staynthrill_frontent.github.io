import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

// Icons
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";

import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  roles?: string[];
};

// =================== NAV ITEMS ===================

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
    roles: ["super_admin", "operations_admin", "financial_admin", "support_admin"],
  },
  {
    name: "Admin Management",
    icon: <UserCircleIcon />,
    subItems: [
      { name: "All Admins", path: "/admins" },
      { name: "Create Admin", path: "/admins/create" },
    ],
    roles: ["super_admin"],
  },
  {
    name: "Vendor Management",
    icon: <ListIcon />,
    subItems: [{ name: "Manage Vendors", path: "/vendors" }],
    roles: ["super_admin", "operations_admin"],
  },
  {
    name: "User Management",
    icon: <UserCircleIcon />,
    subItems: [
      { name: "All Users", path: "/users" },
      { name: "User Reviews", path: "/users/reviews" },
    ],
    roles: ["super_admin", "operations_admin"],
  },
  {
    name: "Hotels",
    icon: <PageIcon />,
    subItems: [
      { name: "Pending Hotels", path: "/hotels/pending" },
      { name: "Approved Hotels", path: "/hotels/approved" },
      { name: "Rejected Hotels", path: "/hotels/rejected" },
    ],
    roles: ["super_admin", "operations_admin"],
  },
  {
    name: "Adventures",
    icon: <PageIcon />,
    subItems: [
      { name: "Pending Adventures", path: "/adventures/pending" },
      { name: "Approved Adventures", path: "/adventures/approved" },
      { name: "Rejected Adventures", path: "/adventures/rejected" },
    ],
    roles: ["super_admin", "operations_admin"],
  },
  {
    name: "Bookings",
    icon: <CalenderIcon />,
    subItems: [
      { name: "All Bookings", path: "/bookings" },
      { name: "Upcoming Bookings", path: "/bookings/upcoming" },
      { name: "Completed Bookings", path: "/bookings/completed" },
      { name: "Cancelled Bookings", path: "/bookings/cancelled" },
    ],
    roles: ["super_admin", "operations_admin"],
  },
  {
    name: "Payments & Finance",
    icon: <PieChartIcon />,
    subItems: [
      { name: "All Payments", path: "/payments" },
      { name: "Commission Settings", path: "/finance/commissions" },
      { name: "Invoices", path: "/finance/invoices" },
    ],
    roles: ["super_admin", "financial_admin"],
  },
  {
    name: "Refund Management",
    icon: <BoxCubeIcon />,
    subItems: [
      { name: "Refund Requests", path: "/refunds/requests" },
      { name: "Approved Refunds", path: "/refunds/approved" },
      { name: "Rejected Refunds", path: "/refunds/rejected" },
    ],
    roles: ["super_admin", "operations_admin", "financial_admin"],
  },
  {
    name: "Support & Disputes",
    icon: <PlugInIcon />,
    subItems: [
      { name: "Support Tickets", path: "/support/tickets" },
      { name: "Disputes", path: "/support/disputes" },
    ],
    roles: ["super_admin", "support_admin"],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <TableIcon />,
    name: "Reports",
    subItems: [
      { name: "Revenue Reports", path: "/reports/revenue" },
      { name: "Booking Reports", path: "/reports/bookings" },
      { name: "Commission Reports", path: "/reports/commissions" },
      { name: "Vendor Performance", path: "/reports/vendors" },
    ],
    roles: ["super_admin", "financial_admin"],
  },
  {
    icon: <PageIcon />,
    name: "CMS Management",
    subItems: [
      { name: "Static Pages", path: "/cms/pages" },
      { name: "Homepage Banners", path: "/cms/banners" },
      { name: "Blog Management", path: "/cms/blogs" },
    ],
    roles: ["super_admin"],
  },
];

// =================== COMPONENT ===================

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();

  const location = useLocation();
  const navigate = useNavigate();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
  const role = adminUser.role || "";

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleMenuClick = () => {
    if (isMobileOpen) {
      toggleMobileSidebar();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");

    if (isMobileOpen) {
      toggleMobileSidebar();
    }

    navigate("/admin-login");
  };

  useEffect(() => {
    let submenuMatched = false;

    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;

      items.forEach((nav, index) => {
        nav.subItems?.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: menuType as "main" | "others", index });
            submenuMatched = true;
          }
        });
      });
    });

    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "main" | "others"
  ) => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  const renderMenuItems = (
    items: NavItem[],
    menuType: "main" | "others"
  ) => {
    const filteredItems = items.filter((item) =>
      item.roles?.includes(role)
    );

    return (
      <ul className="flex flex-col gap-4">
        {filteredItems.map((nav, index) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <>
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  } cursor-pointer`}
                >
                  <span className="menu-item-icon-size">{nav.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : ""
                      }`}
                    />
                  )}
                </button>

                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          onClick={handleMenuClick}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  onClick={handleMenuClick}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span className="menu-item-icon-size">
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-8 flex justify-start">
        <Link
          to="/dashboard"
          onClick={handleMenuClick}
          className="flex items-center gap-2 ml-10"
        >
          <span className="text-2xl font-bold tracking-wide text-gray-900 dark:text-white">
            Stay<span className="text-purple-500">N</span>Thrill
          </span>
        </Link>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="mb-4 text-xs uppercase text-gray-400">
                Menu
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2 className="mb-4 text-xs uppercase text-gray-400">
                Others
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>

        {/* SIGN OUT */}
        <div className="mt-auto pb-6">
          <button
            onClick={handleLogout}
            className="menu-item group menu-item-inactive w-full cursor-pointer"
          >
            <span className="menu-item-icon-size">
              <HorizontaLDots />
            </span>

            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text text-red-500">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;