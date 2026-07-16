import { useSelector } from 'react-redux';
import { selectSettingByKey } from '../features';

export function useAuthModuleEnabled(): boolean {
  const setting = useSelector(selectSettingByKey('authentication-module'));
  return (setting as any)?.value === true;
}