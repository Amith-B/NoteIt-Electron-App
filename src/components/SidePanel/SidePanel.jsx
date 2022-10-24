import "./SidePanel.scss";
import React, { useContext, useState } from "react";
import NotesContext from "../../context/notesContext";
import edit from "../../assets/edit.svg";

function SidePanel({ open, onClose }) {
  const {
    notes,
    activeFolderId,
    addFolder,
    setActiveFolderId,
    closeFolder,
    renameFolder,
  } = useContext(NotesContext);

  const [renameId, setRenameId] = useState("");
  const [renameValue, setRenameValue] = useState("");

  const handleRename = () => {
    renameFolder(renameId, renameValue);
    setRenameId("");
    setRenameValue("");
  };

  return (
    <div
      className={"sidepanel__container " + (open ? "visible" : "")}
      onClick={onClose}
    >
      <section
        className="sidepanel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="panel-item header">
          <h3>Folders</h3>
          <button
            className="clickable folder-add flex-center"
            onClick={addFolder}
          >
            +
          </button>
        </div>
        <div className="folder-list">
          {notes &&
            Object.keys(notes).map((folderId) => {
              return (
                <div className="panel-item" key={folderId}>
                  <div
                    className={
                      "folder-container " +
                      (activeFolderId === folderId ? "active" : "clickable")
                    }
                    onClick={() => setActiveFolderId(folderId)}
                  >
                    <div
                      className="folder-name"
                      title={notes[folderId].folderName}
                    >
                      {renameId === folderId ? (
                        <input
                          className="folder-rename-input"
                          autoFocus
                          value={renameValue}
                          onChange={(event) =>
                            setRenameValue(event.target.value)
                          }
                          type={"text"}
                          min={1}
                          max={20}
                          onBlur={handleRename}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              handleRename();
                            }
                          }}
                        />
                      ) : (
                        notes[folderId].folderName
                      )}
                    </div>
                    <div className="folder-controls">
                      <div className="folder-notes-count flex-center">
                        {notes[folderId].list.length}
                      </div>
                      <div
                        className="clickable folder-rename flex-center"
                        onClick={(event) => {
                          event.stopPropagation();
                          setRenameValue(notes[folderId].folderName);
                          setRenameId(folderId);
                        }}
                      >
                        <img
                          style={{ height: "12px" }}
                          src={edit}
                          alt="rename"
                        />
                      </div>
                      <div
                        className="clickable folder-close flex-center"
                        onClick={(event) => {
                          event.stopPropagation();
                          closeFolder(folderId);
                        }}
                      >
                        +
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

export default SidePanel;
