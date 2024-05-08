"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

const LoginPage = ({
  searchParams,
}: {
  searchParams: { callbackUrl: string };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: false,
    message: "",
    color: "",
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const callbackUrl = searchParams?.callbackUrl
    ? searchParams?.callbackUrl
    : "/redirect";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (!res?.ok) {
        setIsLoading(false);
        setAlert({
          status: true,
          message: "login failed username or password wrong",
          color: "danger",
        });
      } else {
        setAlert({
          status: true,
          message: "login success",
          color: "success",
        });

        window.location.href = callbackUrl;
      }
    } catch (error) {
      setIsLoading(false);
      setAlert({
        status: true,
        message: "something went wrong",
        color: "danger",
      });
    }
  };

  return (
    <div className="container-xl px-4">
      <div className="row justify-content-center">
        <div className="col-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              {alert.status && (
                <div
                  className={`alert alert-${alert.color} alert-solid mx-4 mt-4`}
                  role="alert"
                >
                  {alert.message}
                </div>
              )}
              <div className="card-header justify-content-center text-center">
                <h3 className="fw-semibold my-2">PANJI JAYA</h3>
                <h5 className="fw-semibold">ENTERPRISE MANAGEMENT SYSTEM</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label
                    className="mb-1 fw-semibold small"
                    htmlFor="inputUsername"
                  >
                    Username
                  </label>
                  <input
                    className="form-control"
                    id="inputUsername"
                    type="text"
                    placeholder="Enter username"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                  />
                </div>

                <div className="mb-3">
                  <label
                    className="mb-1 fw-semibold small"
                    htmlFor="inputPassword"
                  >
                    Password
                  </label>
                  <input
                    className="form-control"
                    id="inputPassword"
                    type="password"
                    placeholder="Enter password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
              </div>
              <div className="card-footer">
                {isLoading ? (
                  <button type="button" className="btn btn-primary" disabled>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    LOADING...
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary px-5">
                    LOGIN
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
