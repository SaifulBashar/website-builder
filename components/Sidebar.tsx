'use client';

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  return (
    <aside className="w-64 bg-black border-r border-gray-200 h-screen fixed left-0 top-0">
      {/* Sidebar content goes here */}
    </aside>
  );
}
