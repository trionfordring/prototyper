import { ComponentDescriptor } from '@prototyper/core';

export type SerializedSettings =
  | NoneSerializedSettings
  | ComponentSerializedSettings
  | AutoSerializedSettings;

type NoneSerializedSettings = {
  type: 'none';
};
type ComponentSerializedSettings = {
  type: 'component';
  descriptor: ComponentDescriptor;
};
type AutoSerializedSettings = {
  type: 'auto';
  settingsStruct: AutoSettingsStruct;
};
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
