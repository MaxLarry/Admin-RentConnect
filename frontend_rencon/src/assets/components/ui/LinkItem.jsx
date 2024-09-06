import React from 'react';
import { Link } from 'react-router-dom';

const LinkItem = ({ to, icon: Icon, text, isActive, onClick }) => {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center p-3 rounded-lg ${
          isActive ? 'bg-neutral-200 dark:bg-neutral-500 text-zinc-900 border-l-4 border-indigo-800' : 'text-gray-700 dark:text-gray-200'
        } hover:bg-neutral-200 dark:hover:bg-neutral-500`}
      >
        <Icon className="mr-2 text-xl" />
        <span className="flex-1 tracking-tighter">{text}</span>
      </Link>
    </li>
  );
};

export default LinkItem;
