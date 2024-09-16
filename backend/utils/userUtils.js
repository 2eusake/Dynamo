// utils/userUtils.js
const { User } = require('../models');

/**
 * Finds a user ID by username.
 * @param {string} name - The username to search for.
 * @returns {Promise<number|null>} The user ID if found, otherwise null.
 */
const findUserIdByName = async (name) => {
    const user = await User.findOne({ where: { username: name } });
    return user ? user.id : null;
};

/**
 * Finds a user by their ID.
 * @param {number} id - The user ID to search for.
 * @returns {Promise<User|null>} The user object if found, otherwise null.
 */
const findUserById = async (id) => {
    return await User.findByPk(id);
};

/**
 * Creates a new user.
 * @param {Object} userData - The data to create a new user.
 * @returns {Promise<User>} The created user.
 */
const createUser = async (userData) => {
    return await User.create(userData);
};

/**
 * Updates a user's information.
 * @param {number} id - The user ID to update.
 * @param {Object} updateData - The data to update.
 * @returns {Promise<[number, User[]]>} The result of the update operation.
 */
const updateUser = async (id, updateData) => {
    return await User.update(updateData, { where: { id }, returning: true });
};

/**
 * Deletes a user by their ID.
 * @param {number} id - The user ID to delete.
 * @returns {Promise<number>} The number of affected rows.
 */
const deleteUser = async (id) => {
    return await User.destroy({ where: { id } });
};

module.exports = { findUserIdByName, findUserById, createUser, updateUser, deleteUser };
