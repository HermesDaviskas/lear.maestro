// src/app/api/createMission/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { loadConfigFile } from "@/app/lib/loadConfigFile";

export async function POST(req: NextRequest) {
  try {
    const { services, servers } = await loadConfigFile();

    const requiredService = "missions-srv";
    const service = services?.[requiredService];
    const server = service ? servers?.[service.server] : null;

    if (!server || !service) throw new Error("missions-srv configuration missing");

    const backendUrl = `http://${server.ip}:${service.port}/backend/missions`;

    const missions = await req.json();

    if (!Array.isArray(missions) || missions.length === 0)
      throw new Error("Invalid mission payload");

    const res = await axios.post(backendUrl, missions);

    return NextResponse.json({ success: true, backendResponse: res.data });
  } catch (err: any) {
    const error =
      err.response?.data?.error || `Mission API Error: ${err.message || "Unknown error"}`;
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
