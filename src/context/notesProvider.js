/*global fs*/
import NotesContext from "./notesContext";
import { useState, useEffect, useMemo } from "react";
import initialData from "./initialData";

export default function NotesProvider({ children }) {
  const [notes, setNotes] = useState(initialData.notes);
  const [activeFolderId, setActiveFolderId] = useState(
    initialData.activeFolderId
  );
  const themes = initialData.themes;
  const [activeTheme, setActiveTheme] = useState(initialData.activeTheme);
  const [isSaved, setIsSaved] = useState(0); // 0 - not saved, 1 - saved, 2 - error

  const setActiveNoteId = (folderId, activeNodeId) => {
    const data = { ...notes };
    data[folderId].activeNoteId = activeNodeId;
    setNotes(data);
  };

  const addNote = () => {
    const data = { ...notes };
    const newNoteId = "note_" + new Date().getTime().toString();
    if (activeFolderId && Reflect.has(data, activeFolderId)) {
      data[activeFolderId].list.push({
        id: newNoteId,
        title: "New Note",
        content: "",
      });
      setActiveNoteId(activeFolderId, newNoteId);
      setNotes(data);
    }
  };

  const addFolder = () => {
    const data = { ...notes };
    const newFolderId = "folder_" + new Date().getTime().toString();
    data[newFolderId] = {
      folderName: "New Folder",
      activeNoteId: "",
      list: [],
    };
    setNotes(data);
    setActiveFolderId(newFolderId);
  };

  const closeTab = (folderId, noteId) => {
    if (Reflect.has(notes, folderId)) {
      const data = { ...notes };
      data[folderId].list = data[folderId].list.filter(
        (note) => note.id !== noteId
      );
      setNotes(data);
      if (data[folderId].activeNoteId === noteId) {
        setActiveNoteId(folderId, "");
      }
    }
  };

  const closeFolder = (folderId) => {
    const data = { ...notes };
    Reflect.deleteProperty(data, folderId);
    setNotes(data);
    if (folderId === activeFolderId) {
      setActiveFolderId("");
    }
  };

  const updateNotes = (folderId, noteId, title, content) => {
    if (Reflect.has(notes, folderId)) {
      const data = { ...notes };
      data[folderId].list = data[folderId].list.map((note) => {
        if (note.id === noteId) {
          return {
            id: noteId,
            title,
            content,
          };
        }

        return note;
      });
      setNotes(data);
    }
  };

  const renameFolder = (folderId, newName) => {
    const data = { ...notes };
    const folderData = data[folderId];
    folderData.folderName = newName;
    setNotes(data);
  };

  const activeNoteId = useMemo(
    () => notes[activeFolderId]?.activeNoteId,
    [notes, activeFolderId]
  );

  useEffect(() => {
    setIsSaved(0);
    const timmer = setTimeout(() => {
      fs.writeFile("notes.txt", JSON.stringify(notes), (err) => {
        console.log("Notes Updated");
        if (err) {
          console.log("Unable to save");
          setIsSaved(2);
        }

        if (!Object.keys(notes).length) {
          setActiveFolderId("");
        }
      });

      setIsSaved(1);
    }, 1000);

    return () => clearTimeout(timmer);
  }, [notes]);

  useEffect(() => {
    const timmer = setTimeout(() => {
      fs.writeFile("activeFolderId.txt", activeFolderId, (err) => {
        if (!err) {
          console.log("Active Folder Changed");
        }
      });
    }, 100);

    return () => clearTimeout(timmer);
  }, [activeFolderId]);

  useEffect(() => {
    setIsSaved(0);
    const timmer = setTimeout(() => {
      fs.writeFile("activeTheme.txt", activeTheme, (err) => {
        if (!err) {
          console.log("Theme Changed");
        }
      });

      setIsSaved(1);
    }, 100);

    return () => clearTimeout(timmer);
  }, [activeTheme]);

  useEffect(() => {
    if (fs) {
      fs.readFile("notes.txt", "utf-8", (err, data) => {
        if (err) {
          return;
        }
        const notes = JSON.parse(data);

        if (notes) {
          setNotes(notes);
        }
      });

      fs.readFile("activeTheme.txt", "utf-8", (err, activeTheme) => {
        if (err) {
          return;
        }

        if (activeTheme) {
          setActiveTheme(activeTheme);
        }
      });

      fs.readFile("activeFolderId.txt", "utf-8", (err, activeFolderId) => {
        if (err) {
          return;
        }

        if (activeFolderId) {
          setActiveFolderId(activeFolderId);
        }
      });
    }
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        activeNoteId,
        setActiveNoteId,
        activeFolderId,
        setActiveFolderId,
        themes,
        activeTheme,
        setActiveTheme,
        isSaved,
        setIsSaved,
        addNote,
        addFolder,
        renameFolder,
        closeTab,
        closeFolder,
        updateNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
