"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  dataRoles?: Roles[];
  data: User;
};

type User = {
  number: number;
  id: number;
  username: string;
  password: string;
  name: null | string;
  createdAt: Date;
  rolesId: number;
  pegawai_id: number;
  pegawai: Pegawai;
  roles: Roles;
};

type Pegawai = {
  id: number;
};

type Roles = {
  id: number;
  role_name: string;
};

const ModalEdit = (props: Props) => {
  const { isModalOpen, onClose, accessToken, data, dataRoles } = props;

  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(data.name ? data.name : "");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState(data.rolesId?.toString());

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("name", name);
        body.append("password", password);
        body.append("roles", roles);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/datauser/${data.id}?menu_url=${menu_url}`,
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
          className="modal fade show"
          tabIndex={-1}
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5 fw-semibold">EDIT USER</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">NAMA</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ textTransform: "uppercase" }}
                      disabled={data.pegawai_id ? true : false}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">PASSWORD</label>
                    <input
                      type="password"
                      className="form-control"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">ROLES</label>
                    <select
                      className="form-select"
                      onChange={(e) => setRoles(e.target.value)}
                      value={roles}
                    >
                      <option value="">--PILIH--</option>
                      {dataRoles?.map((item: Roles, index: number) => (
                        <option value={item.id} key={index}>
                          {item.role_name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    onClick={onClose}
                  >
                    CLOSE
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
                      LOADING...
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary btn-sm">
                      SAVE CHANGES
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

export default ModalEdit;
