"use client";
import { roles } from "@prisma/client";
import { useState } from "react";
import Select from "react-select";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  dataRoles?: Roles[];
  dataMenuGroup?: MenuGroup[];
  dataDepartment?: Department[];
};

type Roles = {
  id: number;
  role_name: string;
};

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
};

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

const ModalCreate = (props: Props) => {
  const {
    isModalOpen,
    onClose,
    accessToken,
    dataRoles,
    dataMenuGroup,
    dataDepartment,
  } = props;

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [roles, setRoles] = useState("");
  const [aksesDepartment, setAksesDepartment] = useState<any>([
    {
      value: null,
      label: null,
    },
  ]);
  const [access, setAccess] = useState<any>([]);

  const handleChangeAccess = (
    menu: number,
    type: string,
    isChecked: boolean
  ) => {
    const existMenu = access.find((item: any) => item.menu === menu);

    if (!existMenu) {
      setAccess([...access, { menu, type: [type], isChecked }]);
    } else {
      if (isChecked) {
        existMenu.type.push(type);
        setAccess([...access]);
      } else {
        existMenu.type = existMenu.type.filter((item: any) => item !== type);
        if (existMenu.type.length === 0) {
          setAccess(access.filter((item: any) => item.menu !== menu));
        } else {
          setAccess([...access]);
        }
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (access.length === 0) {
      alert("Please select at least one access");
      return;
    }

    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("roles", roles);
        body.append("access", JSON.stringify(access));
        body.append("akses_department", JSON.stringify(aksesDepartment));

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/access",
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
            body: body,
          }
        );

        const res = await response.json();
        if (!response.ok) {
          alert(res.message);
        } else {
          alert(res.message);
          onClose();
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoading(false);
    }
  };

  return (
    isModalOpen && (
      <>
        <div
          className="modal-backdrop fade show"
          style={{ display: "block" }}
        ></div>
        <div
          className="modal modal-lg fade show"
          tabIndex={-1}
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5 fw-semibold   ">
                    Add Access
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Roles</label>
                    <select
                      className="form-select"
                      required
                      onChange={(e) => setRoles(e.target.value)}
                    >
                      <option value="">-PILIH--</option>
                      {dataRoles?.map((item: roles, index: number) => (
                        <option value={item.id} key={index}>
                          {item.role_name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">
                      Akses Department
                    </label>
                    <Select
                      options={dataDepartment?.map((item: Department) => ({
                        value: item.id,
                        label: item.nama_department.toUpperCase(),
                      }))}
                      required
                      isMulti
                      isClearable
                      onChange={(e: any) => setAksesDepartment(e)}
                    />
                  </div>

                  {dataMenuGroup?.map((item: MenuGroup, index: number) => (
                    <div key={index} className="form-group mb-3">
                      <label className="mb-1 fw-semibold small">
                        {item.menu_group.toUpperCase()}
                      </label>
                      <table className="table table-bordered" width={"100%"}>
                        <thead>
                          <tr>
                            <th>MENU</th>
                            <th style={{ width: "10%" }}>VIEW</th>
                            <th style={{ width: "10%" }}>INSERT</th>
                            <th style={{ width: "10%" }}>UPDATE</th>
                            <th style={{ width: "10%" }}>DELETE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.menu?.map((itemMenu: Menu, index: number) => (
                            <tr key={index} style={{ fontSize: "10pt" }}>
                              <td className="fw-semibold">
                                {itemMenu.menu.toUpperCase()}
                              </td>
                              {["view", "insert", "update", "delete"].map(
                                (list: string, index: number) => (
                                  <td align="center" key={index}>
                                    <input
                                      type="checkbox"
                                      onChange={(e) => {
                                        handleChangeAccess(
                                          itemMenu.id,
                                          list,
                                          e.target.checked
                                        );
                                      }}
                                    />
                                  </td>
                                )
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  {isLoading ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save changes
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    )
  );
};

export default ModalCreate;
