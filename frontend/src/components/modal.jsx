import React from "react";

export const Modal = (props) => {
  const { handleClose,handleSubmit, show,text, children } = props
  const showHideClassName = show ? "show-modal" : "hide-modal";
  const Style={
    backgroundColor:'red'
  }

  return (
    <div className={showHideClassName}>
      <div className="modal-container">
      <h2>Add {text}</h2>
        {children}

        <div className="form-group">
           <button onClick={e =>handleSubmit(e)} type="button">
             Save
            </button>
            <button onClick={handleClose} style={Style}>
              close
            </button>
         </div>
      </div>
    </div>
  );
};

