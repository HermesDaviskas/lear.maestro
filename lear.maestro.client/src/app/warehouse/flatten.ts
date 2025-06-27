import { BufferGroup, BufferGroupFlattened, Section, SectionFlattened } from "../types";

export const flattenBuffers = (buffers: BufferGroup[]): BufferGroupFlattened[] =>
  buffers.map((obj) => {
    const key = Object.keys(obj)[0];
    const data = obj[key];
    return {
      bufferGroupKey: key,
      bufferGroupName: data.nameStr,
      usage: data.usage,
      contents: data.contents,
      status: "waiting",
    };
  });

export const flattenSections = (sections: Section[]): SectionFlattened[] =>
  sections.map((obj) => {
    const key = Object.keys(obj)[0];
    const s = obj[key];
    const rows = s.contents.length;
    const totalCapacity = rows * s.length * s.positionCapacity;
    const stocked = s.contents.reduce((sum, val) => sum + val, 0);
    const free = totalCapacity - stocked;
    const status = free === 0 ? "Full" : free === totalCapacity ? "Empty" : "Partial";

    return {
      sectionKey: key,
      sectionName: s.nameStr,
      contents: s.contents,
      rows,
      rowLength: s.length,
      positionMaxCapacity: s.positionCapacity,
      totalCapacity,
      stockedCapacity: stocked,
      freeCapacity: free,
      status,
    };
  });
