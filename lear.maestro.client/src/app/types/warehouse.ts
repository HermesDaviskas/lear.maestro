// === Buffer Related Types ===
type BufferFriendlyName = string;
type BufferContents = number[];
type BufferUsage = "load" | "unload";
type BufferActivity = null | string;

type RawBuffer = {
  nameStr: BufferFriendlyName;
  contents: BufferContents;
  usage: BufferUsage;
};

type BufferRef = {
  bufferGroupKey: string;
  bufferGroupName: string;
};

// === Section Related Types ===
type SectionFriendlyName = string;
type SectionContents = number[];
type SectionLength = number;
type SectionPositionCapacity = number;
type SectionActivity = null | string;

type RawSection = {
  nameStr: SectionFriendlyName;
  contents: SectionContents;
  length: SectionLength;
  sectionLength: SectionLength;
  positionCapacity: SectionPositionCapacity;
};

// === API Response Type ===
type WarehouseResponse = {
  buffers: Record<string, RawBuffer>[];
  innerSections: Record<string, RawSection>[];
  outerSections: Record<string, RawSection>[];
};
