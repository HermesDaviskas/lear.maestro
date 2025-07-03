// src/lib/loadConfigFile.ts
import { promises as fs } from "fs";
import path from "path";

type ServiceConfigMap = Record<string, { server: string; port: number }>;
type ServerConfigMap = Record<string, { ip: string }>;

export async function loadConfigFile(): Promise<{
  services: ServiceConfigMap;
  servers: ServerConfigMap;
}> {
  const filePath = path.join(process.cwd(), "src/app/settings.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw);

  return {
    services: parsed.services ?? {},
    servers: parsed.servers ?? {},
  };
}
