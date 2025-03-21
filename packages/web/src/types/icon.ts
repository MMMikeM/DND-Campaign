// Define types - grouped together for better organization
export type IconName = 
  // UI Icons
  | "search" | "add" | "edit" | "delete" | "close" | "menu"
  | "chevron-right" | "chevron-down" | "chevron-left" | "chevron-up"
  | "info" | "warning" | "error" | "success" | "back"
  
  // Navigation Icons
  | "home" | "dice" | "users" | "user" | "book" | "map" | "flag" | "location"
  | "file-text" | "sword" | "shield" | "scroll" | "guild" | "crown"
  
  // Misc Icons
  | "eye" | "eye-off" | "tags" | "tag" | "link" | "calendar" | "clock" | "star"
  | "heart" | "gold" | "treasure" | "potion" | "magic" | "combat"
  
  // Special Icons
  | "loading";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
export type IconAnimation = "spin" | "pulse" | "bounce" | "none";
export type IconSpacing = "none" | "xs" | "sm" | "md" | "lg";
export type IconColor = "current" | "white" | "black" | "gray" | "blue" | "green" | "red" | "yellow" | "purple" | "indigo" | "teal" | "pink";
