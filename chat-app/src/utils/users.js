const users = [];

// creating and adding a user
const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are required'
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.username === username && user.room === room;
  });

  // Validate username
  if (existingUser) {
    return {
      error: 'Username is already in use'
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

// get an id of user to remove
const removeUser = (id) => {
  const index = users.findIndex((users) => {
    return users.id === id;
  });

  if (index !== -1) {
    // return users.splice(index, 1)[0];
    return users.splice(index, 1);
  }
};

// get a user
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// get all users in room
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
