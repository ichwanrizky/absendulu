"use client";
import React, { useState } from "react";
import { createBoxMaster } from "../_libs/action";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BoxMasterCreate(props: Props) {
  const { isOpen, onClose } = props;

  const [alertModal, setAlertModal] = useState({
    status: false,
    color: "",
    message: "",
    subMessage: "",
  });
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const [formData, setFormData] = useState({
    box_name: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (confirm("Submit this data?")) {
      setIsLoadingSubmit(true);
      try {
        const result = await createBoxMaster(formData as any);
        if (result.status) {
          //   setAlertModal({
          //     status: true,
          //     color: "success",
          //     message: "Success",
          //     subMessage: result.message,
          //   });
          alert(result.message);
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          //   setAlertModal({
          //     status: true,
          //     color: "danger",
          //     message: "Failed",
          //     subMessage: result.message,
          //   });
          alert(result.message);
          setIsLoadingSubmit(false);
        }
      } catch (error) {
        setAlertModal({
          status: true,
          color: "danger",
          message: "Error",
          subMessage: "Something went wrong, please refresh and try again",
        });
        setIsLoadingSubmit(false);
      }
    }

    return;
  };

  return (
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
                <h1 className="modal-title fs-5 fw-semibold">ADD DATA</h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="mb-1 fw-semibold small">BOX NAME</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, box_name: e.target.value })
                    }
                    value={formData.box_name}
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
                {isLoadingSubmit ? (
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
  );
}
