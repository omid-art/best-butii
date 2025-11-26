import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const filePath = path.join(process.cwd(), "src/data/user.json");
  const fileData = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "[]";
  const users = JSON.parse(fileData);

  // افزودن ID منحصر به فرد
  const newUser = { id: Date.now(), ...data };
  users.push(newUser);

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");

  return NextResponse.json({ message: "User added successfully", user: newUser });
}
