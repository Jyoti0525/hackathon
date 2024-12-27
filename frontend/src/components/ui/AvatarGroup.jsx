import React from 'react';

const Avatar = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
          {alt?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
    </div>
  );
};

const AvatarGroup = ({ 
  users = [], 
  max = 4, 
  size = 'md',
  className = '' 
}) => {
  const visibleUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={`flex -space-x-4 ${className}`}>
      {visibleUsers.map((user, index) => (
        <Avatar
          key={user.id || index}
          src={user.avatar}
          alt={user.name}
          size={size}
        />
      ))}
      {remaining > 0 && (
        <div 
          className={`
            relative flex items-center justify-center 
            bg-gray-100 text-gray-600 rounded-full border-2 border-white
            ${size === 'sm' ? 'w-8 h-8 text-xs' : ''}
            ${size === 'md' ? 'w-10 h-10 text-sm' : ''}
            ${size === 'lg' ? 'w-12 h-12 text-base' : ''}
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;