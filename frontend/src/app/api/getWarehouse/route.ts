// src/app/api/getWarehouse/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { loadConfigFile } from "@/app/lib/loadConfigFile";

export async function GET(req: NextRequest) {
  try {
    const { services, servers } = await loadConfigFile();

    const requiredService = "warehouse-srv";
    const service = services?.[requiredService];
    const server = service ? servers?.[service.server] : null;

    if (!server || !service) throw new Error("warehouse-srv configuration missing");

    const backendUrl = `http://${server.ip}:${service.port}/backend/warehouse`;

    const res = await axios.get(backendUrl);

    return NextResponse.json(res.data);
  } catch (err: any) {
    const error =
      err.response?.data?.error ||
      `Warehouse API Error: ${err.message || "Unknown error"}`;
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
