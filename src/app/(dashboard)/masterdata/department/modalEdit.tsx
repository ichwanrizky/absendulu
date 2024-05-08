"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  data: Department;
};

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

const ModalEdit = (props: Props) => {
  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  const { isModalOpen, onClose, accessToken, data } = props;

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [namaDepartment, setNamaDepartment] = useState(data.nama_department);
  const [lot, setLot] = useState(data.lot ? data.lot : "");
  const [latitude, setLatitude] = useState(data.latitude);
  const [longitude, setLongitude] = useState(data.longitude);
  const [radius, setRadius] = useState(data.radius);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("nama_department", namaDepartment);
        body.append("lot", lot);
        body.append("latitude", latitude);
        body.append("longitude", longitude);
        body.append("radius", radius);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/department/${data.id}?menu_url=${menu_url}`,

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
                    EDIT DEPARTMENT
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
                      NAMA DEPARTMENT
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ textTransform: "uppercase" }}
                      onChange={(e) => setNamaDepartment(e.target.value)}
                      value={namaDepartment}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">LOT</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setLot(e.target.value)}
                      value={lot}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">LATITUDE</label>
                    <input
                      type="number"
                      step={"any"}
                      className="form-control"
                      onChange={(e) => setLatitude(e.target.value)}
                      value={latitude}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">LONGITUDE</label>
                    <input
                      type="number"
                      step={"any"}
                      className="form-control"
                      onChange={(e) => setLongitude(e.target.value)}
                      value={longitude}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">RADIUS (m)</label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) => setRadius(e.target.value)}
                      value={radius}
                    />
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
