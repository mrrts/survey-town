import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getIsDarkMode } from "../../store/ui/selectors";
import { setDarkMode } from "../../store/ui/slice";

export const useDarkMode = () => {
  const isDarkMode = useAppSelector(getIsDarkMode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');

    if (savedDarkMode) {
      dispatch(setDarkMode({ darkMode: !!+savedDarkMode }));
    } 
  }, [dispatch]);

  // update body class for sake of modals, which are mounted
  // outside React app container
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', isDarkMode ? '1' : '0');
  }, [isDarkMode]);

  return null;
}