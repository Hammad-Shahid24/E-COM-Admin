import { FC } from "react";
import { useTheme } from "../hooks/useTheme";

const ThemeSwitcher: FC = () => {
  const { theme, toggleTheme } = useTheme();

  console.log("theme", theme);
  return (
    <div>
      <button className="bg-white dark:text-teal-500 " onClick={toggleTheme}>
        Current theme {theme}, click to switch{" "}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
