// types/warehouse.ts

// Raw API shape
export interface BufferGroup {
  [groupName: string]: {
    nameStr: string;
    contents: number[];
    usage: "load" | "unload";
  };
}

export interface Section {
  [sectionName: string]: {
    nameStr: string;
    contents: number[];
    length: number;
    positionCapacity: number;
  };
}

// Full API response structure
export interface WarehouseServiceResponse {
  buffers: BufferGroup[];
  innerSections: Section[];
  outerSections: Section[];
}

// Normalized format for frontend logic & UI
export interface BufferGroupFlattened {
  bufferGroupKey: string;
  bufferGroupName: string;
  usage: "load" | "unload";
  status: "waiting" | "inMission" | "complete";
  contents: number[];
  quantity?: number;
}

export interface SectionFlattened {
  sectionKey: string;
  sectionName: string;
  contents: number[];
  rows: number;
  rowLength: number;
  positionMaxCapacity: number;
  totalCapacity: number;
  stockedCapacity: number;
  freeCapacity: number;
  status: "Empty" | "Full" | "Partial";
}
