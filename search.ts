import { execSync } from "child_process";
try {
  const result = execSync("find node_modules -type f -name '*.js' -o -name '*.ts' -o -name '*.mjs' | xargs grep -E '[\\s;]fetch\\s*=' | head -20", { encoding: "utf8" });
  console.log(result);
} catch (e) {
  console.log(e.stdout || e.message);
}
