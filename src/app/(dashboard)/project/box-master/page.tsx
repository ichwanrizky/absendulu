import React from "react";
import BoxMasterView from "./_components/BoxMasterView";

export default function BoxMasterPage() {
  return (
    <main>
      <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
        <div className="container-xl px-4">
          <div className="page-header-content pt-4">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto mt-4">
                <h1 className="page-header-title">
                  <div className="page-header-icon"></div>
                  <span style={{ fontSize: "1.8rem" }}>BOX SHIMANO</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-xl px-4 mt-n10">
        <div className="card mb-4">
          <div className="card-header">DATA BOX MASTER</div>
          <BoxMasterView />
        </div>
      </div>
    </main>
  );
}
