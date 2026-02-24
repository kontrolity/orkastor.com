import React from 'react';

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          Your account is not registered for this application. Please contact your administrator.
        </p>
      </div>
    </div>
  );
}
