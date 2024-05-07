"use client";
import { menu_group } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";

type MenuGroup = {
  id: number;
  menu_group: string;
  urut: number;
  group: number;
  parent_id: string;
  menu: Menu[];
};

type Menu = {
  id: number;
  menu: string;
  path: string;
  urut: number;
  menu_group_id: number;
};

const MenuSidebar = ({ menu }: { menu: MenuGroup[] }) => {
  const pathname = usePathname();

  return (
    <div className="nav accordion" id="accordionSidenav">
      <div className="sidenav-menu-heading"></div>
      {menu?.map((item: MenuGroup, index: number) => (
        <div key={index}>
          <a
            className={`nav-link ${
              item.menu.some((menuItem) => menuItem.path === pathname)
                ? "active"
                : "collapsed"
            }`}
            href="#"
            data-bs-toggle="collapse"
            data-bs-target={`#${item.parent_id}`}
            aria-expanded="false"
            aria-controls={`${item.id}`}
          >
            <div className="nav-link-icon">
              <i data-feather="filter" />
            </div>
            {item.menu_group.toUpperCase()}

            <div className="sidenav-collapse-arrow">
              <i className="fas fa-angle-down" />
            </div>
          </a>

          <div
            className={`collapse ${
              item.menu.some((menuItem) => menuItem.path === pathname)
                ? "show"
                : ""
            }`}
            id={`${item.parent_id}`}
            data-bs-parent="#accordionSidenav"
          >
            <nav className="sidenav-menu-nested nav accordion">
              {item.menu.map((menu: Menu) => {
                return (
                  <Link
                    className={`nav-link ${
                      pathname == menu.path ? "active" : ""
                    }`}
                    href={`${menu.path}`}
                    key={menu.id}
                  >
                    {capitalizeWords(menu.menu)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ))}
    </div>
  );
};

function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default MenuSidebar;
