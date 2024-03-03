"use client";
import { useState } from "react";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
};
const ModalCreate = (props: Props) => {
  const { isModalOpen, onClose, accessToken } = props;

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [namaDepartment, setNamaDepartment] = useState("");
  const [lot, setLot] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("nama_department", namaDepartment);
        body.append("lot", lot);
        body.append("latitude", latitude);
        body.append("longitude", longitude);
        body.append("radius", radius);

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/web/masterdata/department",
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
                    Add Department
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
                    <label className="mb-1 fw-semibold small">
                      Nama Department
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setNamaDepartment(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">LOT</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setLot(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Latitude</label>
                    <input
                      type="number"
                      step={"any"}
                      className="form-control"
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Longitude</label>
                    <input
                      type="number"
                      step={"any"}
                      className="form-control"
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Radius (m)</label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) => setRadius(e.target.value)}
                    />
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
