const db = require('../db');

class Todo {
  // Get all todos (only incomplete, limited to 5 most recent)
  static async findAll() {
    return db('task')
      .where('completed', false)
      .orderBy('created_at', 'desc')
      .limit(5);
  }

  // Get todo by id
  static async findById(id) {
    return db('task').where('id', id).first();
  }

  // Create new todo
  static async create(todoData) {
    const [newTodo] = await db('task')
      .insert(todoData)
      .returning('*');
    return newTodo;
  }

  // Update todo by id
  static async update(id, todoData) {
    const [updatedTodo] = await db('task')
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
    const deletedCount = await db('task')
      .where('id', id)
      .del();
    return deletedCount > 0;
  }

  // Get completed todos
  static async findCompleted() {
    return db('task')
      .where('completed', true)
      .orderBy('updated_at', 'desc');
  }

  // Get pending todos (limited to 5 most recent)
  static async findPending() {
    return db('task')
      .where('completed', false)
      .orderBy('created_at', 'desc')
      .limit(5);
  }
}

module.exports = Todo;