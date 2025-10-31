import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { addNoteAPI, updateNoteAPI, deleteNoteAPI, getNoteByIdAPI, getNotesAPI } from "../services/notesServices";
import { Note } from "../models";

export function useNotes() {
  const user = getAuth().currentUser;

  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = getNotesAPI(
      user.uid,
      // onSuccess
      (nuevasNotas: Note[]) => {
        setNotes(nuevasNotas);
        setLoading(false);
        setError(null);
      },
      // onError
      () => {
        setError("Error al obtener notas");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  async function getNoteById(id: string): Promise<void> {
    try {
      setLoading(true);
      const nota = await getNoteByIdAPI(id);
      if (nota) {
        setNote(nota);
      }
    } catch (error) {
      console.error(error);
      setError("Error al obtener la nota");
    } finally {
      setLoading(false);
    }
  }

  async function addNote(data: Partial<Note>) {
    if (!user) {
      setError("Usuario no autenticado");
      return;
    }
    try {
      setLoading(true);
      await addNoteAPI(user.uid, data);
    } catch {
      setError("Error al crear nota");
    } finally {
      setLoading(false);
    }
  }

  async function updateNote(id: string, data: Partial<Note>): Promise<void> {
    try {
      setLoading(true);
      await updateNoteAPI(id, data);
    } catch (error) {
      console.error(error);
      setError("Error al actualizar nota");
    } finally {
      setLoading(false);
    }
  }

  async function deleteNote(id: string) {
    try {
      await deleteNoteAPI(id);
    } catch (error) {
      console.error(error);
      setError("Error al eliminar nota");
    }
  }

  return {
    notes,
    note,
    loading,
    error,
    getNoteById,
    addNote,
    updateNote,
    deleteNote,
  };
}
