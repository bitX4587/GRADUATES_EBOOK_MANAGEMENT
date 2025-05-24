const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "src"); // adjust if your JSX files are elsewhere

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Regex to match localhost URLs with optional http/https and port 8000
  const localhostRegex = /(['"`])http:\/\/localhost:8000(\/[^'"` ]*)?(['"`])/g;

  if (localhostRegex.test(content)) {
    const newContent = content.replace(
      localhostRegex,
      (_, quote1, pathPart = "", quote2) => {
        return `\${process.env.REACT_APP_API_URL}${pathPart}`;
      }
    );

    // Now wrap the whole axios call string inside a template literal if needed
    // We'll replace "axios.get("http://localhost:8000/api/admins")" with
    // axios.get(`${process.env.REACT_APP_API_URL}/api/admins`)

    // To do this correctly, look for axios calls with a string argument
    // and replace just the URL string, so best to instruct you to update manually
    // or we do a simple replacement of the URL string here.

    // We'll replace the URL string with a template literal string with env variable:

    // For simplicity, let's replace the URL string with a template literal string wrapped in backticks:
    // but since we're inside quotes, we must change the quotes to backticks:

    // So final step: replace the whole quoted URL with a backtick string:
    // e.g. "http://localhost:8000/api/admins" -> `${process.env.REACT_APP_API_URL}/api/admins`

    // We'll handle this in the replace by changing quotes to backticks:
    const finalContent = newContent.replace(
      /\${process.env.REACT_APP_API_URL}/g,
      "${process.env.REACT_APP_API_URL}"
    );

    // To ensure the axios call strings are backticks, replace the quotes around the URL with backticks
    // This needs to be done carefully, so instead, let's do a second replacement:

    // Match axios calls with URL strings using single or double quotes and replace quotes with backticks

    // For better safety, just replace the whole URL with backticks:
    // For example: axios.get("http://localhost:8000/api/admins") =>
    // axios.get(`${process.env.REACT_APP_API_URL}/api/admins`)

    // We'll do this by searching for axios.get/axios.post/... calls with the URL string, then fix quotes

    // Replace patterns like axios.get("${process.env.REACT_APP_API_URL}/api/admins") or axios.get('${process.env.REACT_APP_API_URL}/api/admins') with backticks

    const axiosUrlRegex =
      /(axios\.(get|post|put|delete|patch)\()(['"`])(\$\{process.env.REACT_APP_API_URL\}[^'"`]+)(['"`])(\))/g;

    const fixedContent = finalContent.replace(
      axiosUrlRegex,
      (match, p1, p2, q1, urlPart, q2, p6) => {
        return `${p1}\`${urlPart}\`${p6}`;
      }
    );

    fs.writeFileSync(filePath, fixedContent, "utf8");
    console.log(`Updated URLs in: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      walkDir(fullPath);
    } else if (
      dirent.isFile() &&
      (fullPath.endsWith(".js") || fullPath.endsWith(".jsx"))
    ) {
      replaceInFile(fullPath);
    }
  });
}

walkDir(rootDir);
