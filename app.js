const feedbackElement = document.getElementById('feedback');
const userListElement = document.getElementById('userList');

// Function to display feedback messages
function displayFeedback(message, isError = false) {
  feedbackElement.innerHTML = message;
  feedbackElement.style.color = isError ? 'red' : 'green';
}

// Add User
document.getElementById('addUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('addName').value;
  const email = document.getElementById('addEmail').value;

  try {
    const response = await fetch('/api/Users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    const data = await response.json();
    displayFeedback(data.message, !response.ok);
  } catch (error) {
    displayFeedback('Failed to add user', true);
  }
});

// Fetch All Users
async function fetchUsers() {
  try {
    const response = await fetch('/api/Users');
    const users = await response.json();
    userListElement.innerHTML = '<h2>User List</h2>';
    users.forEach(user => {
      userListElement.innerHTML += `<p>ID: ${user._id}<br>Name: ${user.name}<br>Email: ${user.email}</p><hr>`;
    });
  } catch (error) {
    displayFeedback('Failed to fetch users', true);
  }
}

// Update User
document.getElementById('updateUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('updateId').value;
  const name = document.getElementById('updateName').value;
  const email = document.getElementById('updateEmail').value;

  try {
    const response = await fetch(`/api/Users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    const data = await response.json();
    displayFeedback(data.message, !response.ok);
  } catch (error) {
    displayFeedback('Failed to update user', true);
  }
});

// Delete User
document.getElementById('deleteUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('deleteId').value;

  try {
    const response = await fetch(`/api/Users/${id}`, { method: 'DELETE' });
    const data = await response.json();
    displayFeedback(data.message, !response.ok);
  } catch (error) {
    displayFeedback('Failed to delete user', true);
  }
});
