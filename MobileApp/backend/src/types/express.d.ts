import "express";

declare module "express" {
  interface ParamsDictionary {
    [key: string]: string;
  }
}
