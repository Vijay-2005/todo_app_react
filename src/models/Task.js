/**
 * Task model that mirrors the backend Task entity
 */
class Task {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.title = data.title || '';
    this.description = data.description || data.desc || '';
    this.completed = data.completed || false;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
    this.completedAt = data.completedAt ? new Date(data.completedAt) : null;
  }

  // Convert the task object to a format suitable for API requests
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      completedAt: this.completedAt ? this.completedAt.toISOString() : null
    };
  }

  // Create a Task object from API response data
  static fromJSON(data) {
    if (!data) return null;
    return new Task({
      id: data.id,
      userId: data.userId,
      title: data.title,
      description: data.description || data.desc,
      completed: data.completed || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      completedAt: data.completedAt
    });
  }

  // Get a friendly display representation for the Task
  get displayDescription() {
    return this.description || this.desc || '';
  }

  // Get a copy of this task
  clone() {
    return new Task(this.toJSON());
  }
}

export default Task; 