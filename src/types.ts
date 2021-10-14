import {BaseEditor} from "slate";

export type CustomEditor = BaseEditor

export type CustomElement = {
  children: CustomNode[];
  [key: string]: any;
}

export type CustomText = {
  text: string;
  [key: string]: any;
}

export type CustomNode = CustomElement | CustomText;

export type CustomDescendent = {
  children: CustomNode[]
};

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
    Descendent: CustomDescendent
  }
}