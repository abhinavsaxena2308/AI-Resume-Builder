
class MockFirestore {
  constructor() {
    this.data = {};
  }

  collection(name) {
    if (!this.data[name]) {
      this.data[name] = {};
    }
    return new MockCollection(this, name);
  }

  batch() {
    return new MockBatch(this);
  }

  async runTransaction(updateFunction) {
    const transaction = new MockTransaction(this);
    return await updateFunction(transaction);
  }
}

class MockCollection {
  constructor(db, name) {
    this.db = db;
    this.name = name;
  }

  doc(id) {
    if (!id) id = "mock-id-" + Math.random().toString(36).substr(2, 9);
    return new MockDoc(this.db, this.name, id);
  }

  where(field, op, value) {
    return this;
  }

  orderBy(field, direction) {
    return this;
  }

  limit(count) {
    return this;
  }

  async get() {
    const docs = Object.values(this.db.data[this.name]).map(docData => ({
      id: docData.id,
      data: () => docData,
      exists: true
    }));
    return { docs, empty: docs.length === 0, size: docs.length };
  }
  
  async count() {
    const count = Object.keys(this.db.data[this.name]).length;
    return {
      get: async () => ({ data: () => ({ count }) })
    };
  }
}

class MockDoc {
  constructor(db, collectionName, id) {
    this.db = db;
    this.collectionName = collectionName;
    this.id = id;
  }

  collection(subCollectionName) {
    // Correctly nest subcollections under the document ID
    // In Firestore mock, we can flatten this as "collectionName/docId/subCollectionName"
    return this.db.collection(`${this.collectionName}/${this.id}/${subCollectionName}`);
  }

  async get() {
    const docData = this.db.data[this.collectionName][this.id];
    return {
      exists: !!docData,
      data: () => docData,
      id: this.id
    };
  }

  async set(data) {
    this.db.data[this.collectionName][this.id] = { ...data, id: this.id };
  }

  async update(data) {
    const existing = this.db.data[this.collectionName][this.id] || {};
    this.db.data[this.collectionName][this.id] = { ...existing, ...data };
  }

  async delete() {
    delete this.db.data[this.collectionName][this.id];
  }
}

class MockTransaction {
  constructor(db) {
    this.db = db;
  }

  async get(ref) {
    return await ref.get();
  }

  set(ref, data) {
    ref.set(data);
  }

  update(ref, data) {
    ref.update(data);
  }

  delete(ref) {
    ref.delete();
  }
}

class MockBatch {
  constructor(db) {
    this.db = db;
    this.ops = [];
  }

  set(ref, data) {
    this.ops.push(() => ref.set(data));
  }

  update(ref, data) {
    this.ops.push(() => ref.update(data));
  }

  delete(ref) {
    this.ops.push(() => ref.delete());
  }

  async commit() {
    for (const op of this.ops) {
      await op();
    }
  }
}

export default MockFirestore;
