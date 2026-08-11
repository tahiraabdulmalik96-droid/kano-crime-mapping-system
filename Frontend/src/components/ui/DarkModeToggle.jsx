import { useTheme } from '../../context/ThemeContext';

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        darkMode
          ? 'bg-yellow-400 text-gray-900'
          : 'bg-gray-800 text-white'
      }`}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}