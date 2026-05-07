import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseApp, firebaseConfigured } from "./config";
import type { HistoryEntry } from "@/types";

export const db = firebaseConfigured && firebaseApp ? getFirestore(firebaseApp) : null;

function historyCol(uid: string) {
  if (!db) throw new Error("Firebase not configured");
  return collection(db, "users", uid, "history");
}

export async function addHistoryEntry(uid: string, cardSlug: string): Promise<void> {
  if (!db) return;
  await addDoc(historyCol(uid), { cardSlug, drawnAt: serverTimestamp() });
}

export async function getHistoryEntries(uid: string): Promise<HistoryEntry[]> {
  if (!db) return [];
  const q = query(historyCol(uid), orderBy("drawnAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<HistoryEntry, "id">) }));
}

export async function deleteHistoryEntry(uid: string, entryId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "users", uid, "history", entryId));
}
