import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get("ip");

  if (!ip) return NextResponse.json({ error: "IP address is required" }, { status: 400 });

  const platform = process.platform;
  const command =
    platform === "win32" ? `ping -n 1 -w 1000 ${ip}` : `ping -c 1 -W 1 ${ip}`;

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Ping to ${ip} failed:`, stderr);
        resolve(
          NextResponse.json({
            ip,
            isUp: false,
            flightTimeMs: null,
          })
        );
        return;
      }

      // Parse flight time from stdout
      let flightTimeMs: number | null = null;

      try {
        if (platform === "win32") {
          // Example line: "Approximate round trip times in milli-seconds:\n    Minimum = 1ms, Maximum = 1ms, Average = 1ms"
          const match = stdout.match(/Average = (\d+)ms/);
          if (match) {
            flightTimeMs = parseInt(match[1], 10);
          }
        } else {
          // Unix-like: Example: "time=23.4 ms"
          const match = stdout.match(/time=([\d.]+) ms/);
          if (match) {
            flightTimeMs = parseFloat(match[1]);
          }
        }
      } catch {
        flightTimeMs = null;
      }

      resolve(
        NextResponse.json({
          ip,
          isUp: true,
          flightTimeMs,
        })
      );
    });
  });
}
