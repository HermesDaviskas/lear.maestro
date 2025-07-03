import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

function getFilePath(fileName = "data") {
  return path.join(process.cwd(), `${fileName}.json`);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");
    const file = url.searchParams.get("file") || "data";

    const fileContent = await fs.readFile(getFilePath(file), "utf-8");
    const settings = fileContent ? JSON.parse(fileContent) : {};

    if (!key) return NextResponse.json(settings);

    const keys = key.split(".");
    let current: any = settings;
    for (const part of keys) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return NextResponse.json(
          { error: `Key path "${key}" not found` },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(current);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const file = url.searchParams.get("file") || "data";

    const fileContent = await fs.readFile(getFilePath(file), "utf-8");
    const settings = fileContent ? JSON.parse(fileContent) : {};

    const { key, value } = await req.json();
    if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
    if (value === undefined)
      return NextResponse.json({ error: "Missing value" }, { status: 400 });

    const keys = key.split(".");
    let current = settings;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== "object") {
        current[k] = {};
      }
      current = current[k];
    }
    current[keys[keys.length - 1]] = value;

    await fs.writeFile(getFilePath(file), JSON.stringify(settings, null, 2), "utf-8");
    return NextResponse.json({ success: true, updated: key });
  } catch (error: any) {
    console.error("PATCH error:", error.message);
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const file = url.searchParams.get("file") || "data";
    const key = url.searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    const fileContent = await fs.readFile(getFilePath(file), "utf-8");
    const settings = fileContent ? JSON.parse(fileContent) : {};

    const keys = key.split(".");
    let current = settings;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== "object") {
        return NextResponse.json(
          { error: `Key path "${key}" does not exist` },
          { status: 404 }
        );
      }
      current = current[k];
    }

    const finalKey = keys[keys.length - 1];
    if (!(finalKey in current)) {
      return NextResponse.json({ error: `Key "${finalKey}" not found` }, { status: 404 });
    }

    delete current[finalKey];

    await fs.writeFile(getFilePath(file), JSON.stringify(settings, null, 2), "utf-8");
    return NextResponse.json({ success: true, deleted: key });
  } catch (error: any) {
    console.error("DELETE error:", error.message);
    return NextResponse.json({ error: "Failed to delete key" }, { status: 500 });
  }
}
