"use client";
import { useState } from "react";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
};
const ModalCreate = (props: Props) => {
  const { isModalOpen, onClose, accessToken } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [menuGroup, setMenuGroup] = useState("");
  const [urut, setUrut] = useState("");
  const [group, setGroup] = useState("1");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const parentId = menuGroup.replace(/\s/g, "").toLowerCase();

        const body = new FormData();
        body.append("menu_group", menuGroup);
        body.append("urut", urut);
        body.append("group", group);
        body.append("parent_id", parentId);

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/menugroup",
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
                    Add Menu Group
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
                    <label className="mb-1 fw-semibold small">Menu Group</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setMenuGroup(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Urut</label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) => setUrut(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Group</label>
                    <select
                      className="form-select"
                      onChange={(e) => setGroup(e.target.value)}
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
