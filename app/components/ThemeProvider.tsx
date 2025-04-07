"use client"
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { Theme } from '@/app/enums/Theme';

const ThemeProvider = () => {
  const appTheme = useSelector((state: RootState) => state.theme.appTheme);

  useEffect(() => {
    if (appTheme) {
      const themeValue = appTheme === Theme.Light ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', themeValue);
    }
  }, [appTheme]);

  return null;
};

export default ThemeProvider; 