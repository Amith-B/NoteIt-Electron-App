import "./TabContent.scss";
import React, { useState, useEffect, useContext, useMemo } from "react";
import NotesContext from "../../context/notesContext";

function TabContent() {
  const { notes, activeFolderId, updateNotes } = useContext(NotesContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const activeNoteData = useMemo(() => {
    if (activeFolderId && Reflect.has(notes, activeFolderId)) {
      return notes[activeFolderId].list.find(
        (note) => note.id === notes[activeFolderId].activeNoteId
      );
    }

    return undefined;
  }, [notes, activeFolderId]);

  useEffect(() => {
    if (activeNoteData) {
      setTitle(activeNoteData.title);
      setContent(activeNoteData.content);
    }
  }, [activeNoteData]);

  useEffect(() => {
    const timmer = setTimeout(() => {
      handleNotesDataChange(title, content);
    }, 200);

    return () => clearTimeout(timmer);
    // eslint-disable-next-line
  }, [title, content]);

  const handleNotesDataChange = (title, content) => {
    if (activeNoteData) {
      if (
        activeNoteData.title === title &&
        activeNoteData.content === content
      ) {
        return;
      } else {
        updateNotes(
          activeFolderId,
          notes[activeFolderId].activeNoteId,
          title,
          content
        );
      }
    }
  };

  return (
    <div className="tab-content__container">
      {activeFolderId && notes[activeFolderId]?.activeNoteId ? (
        <div style={{ height: "100%" }}>
          <div className="tab-content__title-container">
            <input
              id="title"
              className={"tab-content__title-input " + (!title ? "empty" : "")}
              type="text"
              maxLength="40"
              minLength="1"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <label htmlFor="title">Title</label>
          </div>
          <div className="tab-content">
            <textarea
              id="content"
              autoFocus
              className={"tab-content-input " + (!content ? "empty" : "")}
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
              }}
            />
            <label htmlFor="content">Add notes...</label>
          </div>
        </div>
      ) : activeFolderId ? (
        <div className="tab-content__no-tab flex-center">No Note Selected</div>
      ) : (
        <div className="tab-content__no-tab flex-center">
          No Folder Selected
        </div>
      )}
    </div>
  );
}

export default TabContent;
