import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreVertical, Mail, Phone, UserCheck, UserX, Save, X, Trash2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers, updateUserRole, updateUserStatus, deleteUser, clearError } from "@/store/admin/users-slice";

function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [tempRole, setTempRole] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  
  const { users, loading, error, updatingUser } = useSelector((state) => state.adminUsers);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.includes(searchTerm);
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: "Admin", color: "bg-red-100 text-red-800" },
      customer: { label: "Customer", color: "bg-blue-100 text-blue-800" },
      agent: { label: "Agent", color: "bg-green-100 text-green-800" },
      wholesaler: { label: "Wholesaler", color: "bg-purple-100 text-purple-800" }
    };
    return <Badge className={roleConfig[role]?.color}>{roleConfig[role]?.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Active", color: "bg-green-100 text-green-800" },
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      suspended: { label: "Suspended", color: "bg-red-100 text-red-800" }
    };
    return <Badge className={statusConfig[status]?.color}>{statusConfig[status]?.label}</Badge>;
  };

  const startRoleEdit = (user) => {
    setEditingUser(user._id);
    setTempRole(user.role);
  };

  const cancelRoleEdit = () => {
    setEditingUser(null);
    setTempRole("");
  };

  const saveRoleChange = (userId) => {
    dispatch(updateUserRole({ userId, role: tempRole }))
      .unwrap()
      .then(() => {
        setEditingUser(null);
        setTempRole("");
      })
      .catch(error => {
        console.error('Failed to update role:', error);
      });
  };

  const handleStatusChange = (userId, newStatus) => {
    dispatch(updateUserStatus({ userId, status: newStatus }))
      .unwrap()
      .catch(error => {
        console.error('Failed to update status:', error);
      });
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId))
      .unwrap()
      .then(() => {
        setUserToDelete(null);
      })
      .catch(error => {
        console.error('Failed to delete user:', error);
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Loading users data...</p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600">Manage user accounts, roles, and approvals</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <Button variant="ghost" size="sm" onClick={() => dispatch(clearError())}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'customer').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="customer">Customers</option>
              <option value="agent">Agents</option>
              <option value="wholesaler">Wholesalers</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{user.userName}</p>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </span>
                      )}
                      <span>Joined: {formatDate(user.registrationDate)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>Spent: GHS {user.totalSpent || 0}</span>
                      <span>Orders: {user.totalOrders || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {user.status === 'pending' && user.role !== 'admin' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(user._id, 'active')}
                        disabled={updatingUser}
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleStatusChange(user._id, 'suspended')}
                        disabled={updatingUser}
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {/* Role Editing - Disable for current user and admin users */}
                  <div className="flex items-center gap-2">
                    {editingUser === user._id ? (
                      <div className="flex items-center gap-2">
                        <select 
                          value={tempRole}
                          onChange={(e) => setTempRole(e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                          disabled={user.role === 'admin' || user._id === currentUser?.id}
                        >
                          <option value="admin">Admin</option>
                          <option value="customer">Customer</option>
                          <option value="agent">Agent</option>
                          <option value="wholesaler">Wholesaler</option>
                        </select>
                        <Button 
                          size="sm" 
                          onClick={() => saveRoleChange(user._id)}
                          disabled={updatingUser}
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelRoleEdit}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{user.role}</span>
                        {user.role !== 'admin' && user._id !== currentUser?.id && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => startRoleEdit(user)}
                            disabled={updatingUser}
                          >
                            Edit Role
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Delete Button - Only show for non-admin, non-current users */}
                  {user.role !== 'admin' && user._id !== currentUser?.id && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setUserToDelete(user)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'No users match the current filters'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Delete User</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete user <strong>{userToDelete.userName}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteUser(userToDelete._id)}
                disabled={updatingUser}
              >
                {updatingUser ? 'Deleting...' : 'Delete User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;