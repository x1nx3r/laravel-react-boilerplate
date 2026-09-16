<?php

return [
    'account' => [
        'pending' => 'Your account is awaiting verification by HR.',
        'deactivated' => 'Your account has been deactivated.',
        'self_role_change' => 'You cannot change your own role or deactivate your own account.',
        'self_delete' => 'You cannot delete your own account.',
    ],

    'users' => [
        'created' => 'Employee created.',
        'updated' => 'Employee updated.',
        'verified' => 'Employee verified and activated.',
        'deleted' => 'Employee deleted.',
        'document_uploaded' => 'Document uploaded.',
        'document_deleted' => 'Document deleted.',
    ],

    'roles' => [
        'created' => 'Role created.',
        'updated' => 'Role updated.',
        'deleted' => 'Role deleted.',
        'in_use' => 'Roles with assigned users cannot be deleted.',
    ],

    'registration' => [
        'updated' => 'Registration setting updated.',
    ],

    'attendance' => [
        'checked_in' => 'Checked in. Have a great day!',
        'checked_out' => 'Checked out. See you tomorrow!',
        'already_checked_in' => 'You have already checked in today.',
        'already_checked_out' => 'You have already checked out today.',
        'not_checked_in' => 'You have not checked in yet today.',
        'on_leave' => 'You are on approved leave today.',
    ],

    'leaves' => [
        'submitted' => 'Leave request submitted.',
        'approved' => 'Leave request approved.',
        'rejected' => 'Leave request rejected.',
        'already_reviewed' => 'This request has already been reviewed.',
        'overlap' => 'The selected range overlaps another pending or approved leave request.',
    ],
];
