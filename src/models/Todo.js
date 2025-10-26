const db = require('../db');

class Todo {
  // Get all todos
  static async findAll() {
    return db('todos').orderBy('created_at', 'desc');
  }

  // Get todo by id
  static async findById(id) {
    return db('todos').where('id', id).first();
  }

  // Create new todo
  static async create(todoData) {
    const [newTodo] = await db('todos')
      .insert(todoData)
      .returning('*');
    return newTodo;
  }

  // Update todo by id
  static async update(id, todoData) {
    const [updatedTodo] = await db('todos')
      .where('id', id)
      .update({
        ...todoData,
        updated_at: new Date()
      })
      .returning('*');
    return updatedTodo;
  }

  // Delete todo by id
  static async delete(id) {
    const deletedCount = await db('todos')
      .where('id', id)
      .del();
    return deletedCount > 0;
  }

  // Get completed todos
  static async findCompleted() {
    return db('todos')
      .where('completed', true)
      .orderBy('updated_at', 'desc');
  }

  // Get pending todos
  static async findPending() {
    return db('todos')
      .where('completed', false)
      .orderBy('created_at', 'desc');
  }
}

module.exports = Todo;