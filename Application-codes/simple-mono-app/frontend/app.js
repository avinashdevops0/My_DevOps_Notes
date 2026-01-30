class UserManager {
    constructor() {
        this.baseUrl = '/api';
        this.isEditing = false;
        this.currentUserId = null;
        this.initializeElements();
        this.attachEventListeners();
        this.loadUsers();
    }

    initializeElements() {
        this.userForm = document.getElementById('userForm');
        this.userIdInput = document.getElementById('userId');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.submitBtn = document.getElementById('submitBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.usersList = document.getElementById('usersList');
        this.userCount = document.getElementById('userCount');
        this.notification = document.getElementById('notification');
    }

    attachEventListeners() {
        this.userForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.cancelBtn.addEventListener('click', () => this.cancelEdit());
    }

    async loadUsers() {
        try {
            const response = await fetch(`${this.baseUrl}/users`);
            const result = await response.json();
            
            if (result.success) {
                this.displayUsers(result.data);
            } else {
                this.showNotification('Error loading users', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Failed to load users', 'error');
        }
    }

    displayUsers(users) {
        this.userCount.textContent = users.length;
        
        if (users.length === 0) {
            this.usersList.innerHTML = '<div class="loading">No users found. Add your first user!</div>';
            return;
        }

        this.usersList.innerHTML = users.map(user => `
            <div class="user-card" data-id="${user.id}">
                <div class="user-header">
                    <div class="user-name">
                        <i class="fas fa-user-circle"></i> ${user.name}
                    </div>
                    <div class="user-id">#${user.id}</div>
                </div>
                <div class="user-email">
                    <i class="fas fa-envelope"></i> ${user.email}
                </div>
                <div class="user-date">
                    <i class="fas fa-calendar-alt"></i> Created: ${new Date(user.created_at).toLocaleDateString()}
                </div>
                <div class="user-actions">
                    <button class="btn btn-success" onclick="userManager.editUser(${user.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="userManager.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const userData = {
            name: this.nameInput.value.trim(),
            email: this.emailInput.value.trim()
        };

        if (!userData.name || !userData.email) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            let response;
            
            if (this.isEditing) {
                response = await fetch(`${this.baseUrl}/users/${this.currentUserId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
            } else {
                response = await fetch(`${this.baseUrl}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
            }

            const result = await response.json();
            
            if (result.success) {
                this.showNotification(
                    this.isEditing ? 'User updated successfully!' : 'User added successfully!',
                    'success'
                );
                this.resetForm();
                this.loadUsers();
            } else {
                this.showNotification(result.error || 'Operation failed', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Failed to save user', 'error');
        }
    }

    async editUser(id) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${id}`);
            const result = await response.json();
            
            if (result.success) {
                const user = result.data;
                this.userIdInput.value = user.id;
                this.nameInput.value = user.name;
                this.emailInput.value = user.email;
                this.currentUserId = user.id;
                this.isEditing = true;
                
                this.submitBtn.innerHTML = '<i class="fas fa-save"></i> Update User';
                this.cancelBtn.style.display = 'flex';
                
                this.nameInput.focus();
                this.showNotification('Editing user: ' + user.name, 'info');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Failed to load user for editing', 'error');
        }
    }

    async deleteUser(id) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseUrl}/users/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('User deleted successfully!', 'success');
                this.loadUsers();
            } else {
                this.showNotification(result.error || 'Delete failed', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Failed to delete user', 'error');
        }
    }

    cancelEdit() {
        this.resetForm();
        this.showNotification('Edit cancelled', 'info');
    }

    resetForm() {
        this.userForm.reset();
        this.userIdInput.value = '';
        this.currentUserId = null;
        this.isEditing = false;
        
        this.submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add User';
        this.cancelBtn.style.display = 'none';
    }

    showNotification(message, type = 'info') {
        this.notification.textContent = message;
        this.notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the application
const userManager = new UserManager();