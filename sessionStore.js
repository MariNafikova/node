/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }
}

module.exports = {
  InMemorySessionStore,
};
