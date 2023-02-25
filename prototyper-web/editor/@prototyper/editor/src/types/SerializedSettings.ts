import { ComponentDescriptor } from '@prototyper/core';

export interface SerializedSettings {
  type: 'none' | 'auto' | 'component' | 'native';

  descriptor?: ComponentDescriptor;
  settingsStruct?: AutoSettingsStruct;
}

export type AutoSettingsStruct = AutoSettingsData[];

export type SettingType =
  | 'text'
  | 'auto-complete'
  | 'bool'
  | 'segmented'
  | 'slider';

export interface AutoSettingsData {
  settingType: SettingType;
  label: string;
  propName: string;

  [key: string]: any;
}
