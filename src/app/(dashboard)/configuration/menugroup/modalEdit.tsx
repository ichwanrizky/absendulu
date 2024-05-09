"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  data: MenuGroup;
};

type MenuGroup = {
  id: number;
  menu_group: string;
  urut: number;
  group: number;
  parent_id: string;
};

const ModalEdit = (props: Props) => {
  const { isModalOpen, onClose, accessToken, data } = props;

  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [menuGroup, setMenuGroup] = useState(data.menu_group);
  const [urut, setUrut] = useState(data.urut.toString());
  const [group, setGroup] = useState(data.group.toString());

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const parentId = menuGroup.replace(/\s/g, "").toLowerCase();

        const body = new FormData();
        body.append("menu_group", menuGroup);
        body.append("urut", urut);
        body.append("group", group);
        body.append("parent_id", parentId);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/menugroup/${data.id}?menu_url=${menu_url}`,
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
                  <h1 className="modal-title fs-5 fw-semibold   ">
                    EDIT MENU GROUP
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
                    <label className="mb-1 fw-semibold small">MENU GROUP</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ textTransform: "uppercase" }}
                      onChange={(e) => setMenuGroup(e.target.value)}
                      value={menuGroup}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">URUT</label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) => setUrut(e.target.value)}
                      value={urut}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">GROUP</label>
                    <select
                      className="form-select"
                      onChange={(e) => setGroup(e.target.value)}
                      value={group}
                    >
                      <option value="1">TRUE</option>
                      <option value="0">FALSE</option>
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
