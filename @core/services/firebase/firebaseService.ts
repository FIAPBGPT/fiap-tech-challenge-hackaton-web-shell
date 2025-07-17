import { firestore } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Função genérica para listar documentos de uma coleção
export async function listar(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Função genérica para adicionar um documento
export async function adicionar(collectionName: string, data: any) {
  return await addDoc(collection(firestore, collectionName), data);
}

// Função genérica para atualizar um documento
export async function atualizar(collectionName: string, id: string, data: any) {
  const ref = doc(firestore, collectionName, id);
  return await updateDoc(ref, data);
}

// Função genérica para excluir um documento
export async function excluir(collectionName: string, id: string) {
  const ref = doc(firestore, collectionName, id);
  return await deleteDoc(ref);
}
