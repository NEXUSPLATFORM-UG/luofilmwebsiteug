import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy, limit,
  serverTimestamp, Timestamp, increment,
} from "firebase/firestore";
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

function tsToMs(ts: Timestamp | null | undefined): number {
  if (!ts) return Date.now();
  return ts.toMillis ? ts.toMillis() : Date.now();
}

function docToObj(d: any) {
  const data = d.data();
  const out: any = { id: d.id, ...data };
  if (data.createdAt instanceof Timestamp) out.createdAt = tsToMs(data.createdAt);
  if (data.updatedAt instanceof Timestamp) out.updatedAt = tsToMs(data.updatedAt);
  return out;
}

export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) onProgress((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function deleteFile(url: string) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (_) {}
}

export const fbApi = {
  stats: async () => {
    const [usersSnap, contentSnap, subsSnap, txSnap, activitiesSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "content")),
      getDocs(query(collection(db, "subscriptions"), where("status", "==", "active"))),
      getDocs(query(collection(db, "transactions"), orderBy("createdAt", "desc"), limit(10))),
      getDocs(query(collection(db, "activities"), orderBy("createdAt", "desc"), limit(10))),
    ]);

    const recentUsers = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5)));
    const totalRevenue = txSnap.docs.reduce((sum, d) => {
      const amt = d.data().amount || 0;
      return sum + (amt > 0 ? amt : 0);
    }, 0);

    return {
      stats: {
        totalUsers: usersSnap.size,
        totalContent: contentSnap.size,
        activeSubscriptions: subsSnap.size,
        totalRevenue,
        totalActivities: activitiesSnap.size,
      },
      recentTxs: txSnap.docs.map(docToObj),
      recentUsers: recentUsers.docs.map(docToObj),
      recentActivities: activitiesSnap.docs.map(docToObj),
    };
  },

  users: {
    list: async (params?: Record<string, string>) => {
      let q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      let users = snap.docs.map(docToObj);
      if (params?.search) {
        const s = params.search.toLowerCase();
        users = users.filter((u: any) =>
          u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s)
        );
      }
      return { users };
    },
    get: async (id: string) => {
      const snap = await getDoc(doc(db, "users", id));
      return snap.exists() ? { user: docToObj(snap) } : { user: null };
    },
    create: async (data: any) => {
      const ref2 = await addDoc(collection(db, "users"), {
        ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      return { id: ref2.id };
    },
    update: async (id: string, data: any) => {
      await updateDoc(doc(db, "users", id), { ...data, updatedAt: serverTimestamp() });
      return { id };
    },
    delete: async (id: string) => {
      await deleteDoc(doc(db, "users", id));
      return { id };
    },
  },

  content: {
    list: async (params?: Record<string, string>) => {
      let q = query(collection(db, "content"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      let content = snap.docs.map(docToObj);
      if (params?.search) {
        const s = params.search.toLowerCase();
        content = content.filter((c: any) => c.title?.toLowerCase().includes(s));
      }
      if (params?.type) {
        content = content.filter((c: any) => c.type === params.type);
      }
      return { content };
    },
    get: async (id: string) => {
      const snap = await getDoc(doc(db, "content", id));
      return snap.exists() ? { content: docToObj(snap) } : { content: null };
    },
    create: async (data: any) => {
      const ref2 = await addDoc(collection(db, "content"), {
        ...data, views: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      return { id: ref2.id };
    },
    update: async (id: string, data: any) => {
      await updateDoc(doc(db, "content", id), { ...data, updatedAt: serverTimestamp() });
      return { id };
    },
    delete: async (id: string) => {
      const episodesSnap = await getDocs(collection(db, "content", id, "episodes"));
      for (const ep of episodesSnap.docs) {
        await deleteDoc(ep.ref);
      }
      await deleteDoc(doc(db, "content", id));
      return { id };
    },
    incrementViews: async (id: string) => {
      await updateDoc(doc(db, "content", id), { views: increment(1) });
    },
    episodes: {
      list: async (contentId: string) => {
        const snap = await getDocs(
          query(collection(db, "content", contentId, "episodes"), orderBy("episodeNumber", "asc"))
        );
        return { episodes: snap.docs.map(docToObj) };
      },
      create: async (contentId: string, data: any) => {
        const ref2 = await addDoc(collection(db, "content", contentId, "episodes"), {
          ...data, views: 0, createdAt: serverTimestamp(),
        });
        return { id: ref2.id };
      },
      update: async (contentId: string, epId: string, data: any) => {
        await updateDoc(doc(db, "content", contentId, "episodes", epId), {
          ...data, updatedAt: serverTimestamp(),
        });
        return { id: epId };
      },
      delete: async (contentId: string, epId: string) => {
        await deleteDoc(doc(db, "content", contentId, "episodes", epId));
        return { id: epId };
      },
    },
  },

  carousel: {
    list: async () => {
      const snap = await getDocs(query(collection(db, "carousel"), orderBy("order", "asc")));
      return snap.docs.map(docToObj);
    },
    create: async (data: any) => {
      const ref2 = await addDoc(collection(db, "carousel"), { ...data, createdAt: serverTimestamp() });
      return { id: ref2.id };
    },
    update: async (id: string, data: any) => {
      await updateDoc(doc(db, "carousel", id), data);
      return { id };
    },
    delete: async (id: string) => {
      await deleteDoc(doc(db, "carousel", id));
      return { id };
    },
  },

  featured: {
    list: async () => {
      const snap = await getDocs(query(collection(db, "featured"), orderBy("order", "asc")));
      return snap.docs.map(docToObj);
    },
    create: async (data: any) => {
      const ref2 = await addDoc(collection(db, "featured"), { ...data, createdAt: serverTimestamp() });
      return { id: ref2.id };
    },
    update: async (id: string, data: any) => {
      await updateDoc(doc(db, "featured", id), data);
      return { id };
    },
    delete: async (id: string) => {
      await deleteDoc(doc(db, "featured", id));
      return { id };
    },
    contentList: async () => {
      const snap = await getDocs(collection(db, "content"));
      return snap.docs.map(docToObj);
    },
  },

  subscriptions: {
    list: async (params?: Record<string, string>) => {
      const snap = await getDocs(query(collection(db, "subscriptions"), orderBy("createdAt", "desc")));
      let subs = snap.docs.map(docToObj);
      if (params?.status) subs = subs.filter((s: any) => s.status === params.status);
      return { subscriptions: subs };
    },
    create: async (data: any) => {
      const ref2 = await addDoc(collection(db, "subscriptions"), { ...data, createdAt: serverTimestamp() });
      return { id: ref2.id };
    },
    update: async (id: string, data: any) => {
      await updateDoc(doc(db, "subscriptions", id), { ...data, updatedAt: serverTimestamp() });
      return { id };
    },
    delete: async (id: string) => {
      await deleteDoc(doc(db, "subscriptions", id));
      return { id };
    },
  },

  wallet: {
    get: async () => {
      const snap = await getDoc(doc(db, "wallet", "main"));
      return snap.exists() ? snap.data() : { balance: 0, currency: "USD" };
    },
    withdraw: async (data: any) => {
      const walletSnap = await getDoc(doc(db, "wallet", "main"));
      const current = walletSnap.exists() ? walletSnap.data().balance || 0 : 0;
      if (current < data.amount) throw new Error("Insufficient balance");
      await setDoc(doc(db, "wallet", "main"), { balance: current - data.amount, currency: "USD" });
      await addDoc(collection(db, "transactions"), {
        type: "withdrawal", amount: -data.amount, description: data.note || "Withdrawal",
        createdAt: serverTimestamp(), status: "completed",
      });
      return { success: true };
    },
    topup: async (data: any) => {
      const walletSnap = await getDoc(doc(db, "wallet", "main"));
      const current = walletSnap.exists() ? walletSnap.data().balance || 0 : 0;
      await setDoc(doc(db, "wallet", "main"), { balance: current + data.amount, currency: "USD" });
      await addDoc(collection(db, "transactions"), {
        type: "topup", amount: data.amount, description: data.note || "Top-up",
        createdAt: serverTimestamp(), status: "completed",
      });
      return { success: true };
    },
  },

  transactions: {
    list: async (params?: Record<string, string>) => {
      const snap = await getDocs(query(collection(db, "transactions"), orderBy("createdAt", "desc")));
      let txs = snap.docs.map(docToObj);
      if (params?.type) txs = txs.filter((t: any) => t.type === params.type);
      return { transactions: txs };
    },
  },

  activities: {
    list: async (params?: Record<string, string>) => {
      const snap = await getDocs(query(collection(db, "activities"), orderBy("createdAt", "desc"), limit(100)));
      let acts = snap.docs.map(docToObj);
      if (params?.actionType) acts = acts.filter((a: any) => a.actionType === params.actionType);
      return { activities: acts };
    },
    log: async (data: any) => {
      const ref2 = await addDoc(collection(db, "activities"), { ...data, createdAt: serverTimestamp() });
      return { id: ref2.id };
    },
  },

  publicContent: {
    listAll: async () => {
      const snap = await getDocs(
        query(collection(db, "content"), where("status", "==", "published"), orderBy("createdAt", "desc"))
      );
      return snap.docs.map(docToObj);
    },
    getById: async (id: string) => {
      const snap = await getDoc(doc(db, "content", id));
      return snap.exists() ? docToObj(snap) : null;
    },
    getCarousel: async () => {
      const snap = await getDocs(query(collection(db, "carousel"), orderBy("order", "asc")));
      return snap.docs.map(docToObj);
    },
  },
};
